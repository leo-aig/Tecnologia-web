const API_BASE = "http://localhost:8000";

if (localStorage.getItem("sesion_veterinaria") !== "ok") {
  window.location.href = "./login.html";
}

document.getElementById("usuarioActivo").textContent = `Usuario: ${localStorage.getItem("usuario_veterinaria") || "-"}`;
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("sesion_veterinaria");
  localStorage.removeItem("usuario_veterinaria");
  window.location.href = "./login.html";
});

const modules = window.VET_MODULES || [];

const state = {};
modules.forEach((m) => {
  state[m.key] = { editId: null, items: [] };
});

const api = (endpoint, method = "GET", payload = null) =>
  fetch(`${API_BASE}${endpoint}`, {
    method: method,
    headers: { "content-type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  }).then((response) => {
    if (!response.ok) {
      return response
        .json()
        .then((errorData) => {
          throw new Error(errorData.detail || "Error en API");
        })
        .catch(() => {
          throw new Error("Error en API");
        });
    }
    return response.json().catch(() => ({}));
  });

function normalizeForInput(field, value) {
  if (value == null) return "";
  if (field.type === "datetime-local") return String(value).slice(0, 16);
  if (field.type === "date") return String(value).slice(0, 10);
  return value;
}

function parseFieldValue(field, raw) {
  if (field.type === "checkbox") return !!raw;
  if (raw === "" || raw == null) return null;
  if (field.type === "number") return Number(raw);
  return raw;
}

function buildPayload(mod) {
  const payload = {};
  mod.fields.forEach((f) => {
    const el = document.getElementById(`${mod.key}_${f.name}`);
    let value = f.type === "checkbox" ? el.checked : el.value;
    if (value === "" && f.default !== undefined) value = f.default;
    value = parseFieldValue(f, value);
    if (value !== null || f.required) payload[f.name] = value;
  });
  return payload;
}

function renderModuleCard(mod) {
  const fieldsHtml = mod.fields
    .map((f) => {
      if (f.type === "checkbox") {
        return `<label class="status"><input id="${mod.key}_${f.name}" type="checkbox" ${f.default ? "checked" : ""}> ${f.name}</label>`;
      }
      const step = f.step ? ` step="${f.step}"` : "";
      return `<input id="${mod.key}_${f.name}" type="${f.type}" placeholder="${f.name}" ${f.required ? "required" : ""}${step}>`;
    })
    .join("");

  return `
    <article class="card crud-card" data-module="${mod.key}">
      <h4>${mod.title}</h4>
      <form id="form_${mod.key}" class="mini-form">
        ${fieldsHtml}
        <button class="btn" type="submit">Guardar</button>
      </form>
      <ul id="list_${mod.key}" class="mini-list"></ul>
    </article>`;
}

function renderList(mod, items) {
  const ul = document.getElementById(`list_${mod.key}`);
  ul.innerHTML = items
    .map((item) => {
      const summary = mod.fields
        .slice(0, 3)
        .map((f) => `${f.name}: ${item[f.name] ?? ""}`)
        .join(" | ");
      return `<li>
        <strong>#${item.id ?? "-"}</strong> ${summary}
        <div class="actions">
          <button class="btn-edit" type="button" data-action="edit" data-module="${mod.key}" data-id="${item.id}">Editar</button>
          <button class="btn-del" type="button" data-action="delete" data-module="${mod.key}" data-id="${item.id}">Eliminar</button>
        </div>
      </li>`;
    })
    .join("");
}

function getModule(modKey) {
  return modules.find((m) => m.key === modKey);
}

function loadModule(mod) {
  return api(mod.endpoint)
    .then((data) => {
      const items = Array.isArray(data) ? data : [];
      state[mod.key].items = items;
      renderList(mod, items);
    })
    .catch(() => {
      state[mod.key].items = [];
      document.getElementById(`list_${mod.key}`).innerHTML = "<li>Sin datos</li>";
    });
}

function refreshCounters() {
  const map = {
    personas: "cntPersonas",
    duenos: "cntDuenos",
    mascotas: "cntMascotas",
    veterinarios: "cntVeterinarios",
    citas: "cntCitas",
    usuarios: "cntUsuarios",
  };

  Object.entries(map).forEach(([modKey, target]) => {
    const mod = getModule(modKey);
    if (!mod) return;
    api(mod.endpoint)
      .then((data) => {
        document.getElementById(target).textContent = Array.isArray(data) ? data.length : 0;
      })
      .catch(() => {
        document.getElementById(target).textContent = "0";
      });
  });
}

function editItem(modKey, id) {
  const mod = getModule(modKey);
  const item = state[modKey].items.find((it) => Number(it.id) === Number(id));
  if (!mod || !item) return;

  state[modKey].editId = item.id;
  mod.fields.forEach((f) => {
    const el = document.getElementById(`${mod.key}_${f.name}`);
    if (!el) return;
    if (f.type === "checkbox") {
      el.checked = !!item[f.name];
    } else {
      el.value = normalizeForInput(f, item[f.name]);
    }
  });
}

function deleteItem(modKey, id) {
  const mod = getModule(modKey);
  if (!mod || !id) return;

  api(`${mod.endpoint}${id}`, "DELETE")
    .then(() => Promise.all([loadModule(mod), refreshCounters()]))
    .catch((err) => alert(err.message));
}

function bindForm(mod) {
  const form = document.getElementById(`form_${mod.key}`);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = buildPayload(mod);
    const editId = state[mod.key].editId;
    const req = editId ? api(`${mod.endpoint}${editId}`, "PUT", payload) : api(mod.endpoint, "POST", payload);

    req
      .then(() => {
        state[mod.key].editId = null;
        form.reset();
        mod.fields
          .filter((f) => f.type === "checkbox" && f.default)
          .forEach((f) => {
            document.getElementById(`${mod.key}_${f.name}`).checked = true;
          });
        return Promise.all([loadModule(mod), refreshCounters()]);
      })
      .catch((err) => alert(err.message));
  });
}

function setActiveMenu(view) {
  document.querySelectorAll(".menu-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function setView(view) {
  const cards = document.getElementById("dashboardCards");
  const crud = document.getElementById("crudModules");
  const moduleCards = document.querySelectorAll(".crud-card");

  if (view === "dashboard") {
    cards.classList.remove("hidden");
    crud.classList.add("hidden");
    moduleCards.forEach((card) => card.classList.remove("hidden"));
    setActiveMenu(view);
    return;
  }

  cards.classList.add("hidden");
  crud.classList.remove("hidden");
  moduleCards.forEach((card) => {
    card.classList.toggle("hidden", card.dataset.module !== view);
  });
  setActiveMenu(view);
}

document.getElementById("crudModules").innerHTML = modules.map(renderModuleCard).join("");

modules.forEach((m) => {
  bindForm(m);
  loadModule(m);
});

refreshCounters();
setView("dashboard");

document.querySelectorAll(".menu-link").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    setView(view);
  });
});

document.getElementById("crudModules").addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const modKey = target.dataset.module;
  const id = target.dataset.id;

  if (!action || !modKey || !id) return;

  if (action === "edit") {
    editItem(modKey, id);
  }

  if (action === "delete") {
    deleteItem(modKey, id);
  }
});
