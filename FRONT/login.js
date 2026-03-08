const btn = document.getElementById("btnLogin");
const msg = document.getElementById("msg");
const API_BASE = "http://localhost:8000";

btn.addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!usuario || !password) {
    msg.textContent = "Completa usuario y contrasena.";
    return;
  }

  fetch(`${API_BASE}/usuarios/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: usuario, password }),
  })
    .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
    .then((resultado) => {
      if (!resultado.ok) throw new Error(resultado.data.detail || "Login fallido");
      localStorage.setItem("sesion_veterinaria", "ok");
      localStorage.setItem("usuario_veterinaria", resultado.data.usuario.username);
      window.location.href = "./dashboard.html";
    })
    .catch((error) => {
      msg.textContent = error.message;
    });
});
