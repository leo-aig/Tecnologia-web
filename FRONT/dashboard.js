if (localStorage.getItem("sesion_veterinaria") !== "ok") {
  window.location.href = "./login.html";
}

const usuario = localStorage.getItem("usuario_veterinaria") || "-";
document.getElementById("usuario").textContent = "Usuario: " + usuario;

document.getElementById("btnSalir").addEventListener("click", function () {
  localStorage.removeItem("sesion_veterinaria");
  localStorage.removeItem("usuario_veterinaria");
  window.location.href = "./login.html";
});

const urlPersonas = "http://localhost:8000/personas/";
const urlDuenos = "http://localhost:8000/duenos/";
const urlMascotas = "http://localhost:8000/mascotas/";
const urlVeterinarios = "http://localhost:8000/veterinarios/";
const urlCitas = "http://localhost:8000/citas/";
const urlUsuarios = "http://localhost:8000/usuarios/";

let idPersonaEditando = null;
let idDuenoEditando = null;
let idMascotaEditando = null;
let idCitaEditando = null;
let personasCache = [];
let duenosCache = [];

const viewDashboard = document.getElementById("viewDashboard");
const viewPersonas = document.getElementById("viewPersonas");
const viewDuenos = document.getElementById("viewDuenos");
const viewMascotas = document.getElementById("viewMascotas");
const viewVeterinarios = document.getElementById("viewVeterinarios");
const viewCitas = document.getElementById("viewCitas");
const viewHistorial = document.getElementById("viewHistorial");
const viewTratamientos = document.getElementById("viewTratamientos");
const viewUsuarios = document.getElementById("viewUsuarios");
const viewControl = document.getElementById("viewControl");
const viewReportes = document.getElementById("viewReportes");

const formPersona = document.getElementById("formPersona");
const nombresPersona = document.getElementById("nombresPersona");
const apellidosPersona = document.getElementById("apellidosPersona");
const ciPersona = document.getElementById("ciPersona");
const telefonoPersona = document.getElementById("telefonoPersona");
const emailPersona = document.getElementById("emailPersona");
const direccionPersona = document.getElementById("direccionPersona");
const activoPersona = document.getElementById("activoPersona");
const tablaPersonas = document.getElementById("tablaPersonas");
const msgPersona = document.getElementById("msgPersona");
const formTitlePersona = document.getElementById("formTitlePersona");
const btnCancelarPersona = document.getElementById("btnCancelarPersona");

const formDueno = document.getElementById("formDueno");
const personaId = document.getElementById("personaId");
const direccion = document.getElementById("direccion");
const activo = document.getElementById("activo");
const tablaDuenos = document.getElementById("tablaDuenos");
const msgDueno = document.getElementById("msgDueno");
const formTitleDueno = document.getElementById("formTitle");
const btnCancelarEdicionDueno = document.getElementById("btnCancelarEdicion");

const formMascota = document.getElementById("formMascota");
const nombreMascota = document.getElementById("nombreMascota");
const especieMascota = document.getElementById("especieMascota");
const edadMascota = document.getElementById("edadMascota");
const sexoMascota = document.getElementById("sexoMascota");
const pesoMascota = document.getElementById("pesoMascota");
const tallaMascota = document.getElementById("tallaMascota");
const grupoMascota = document.getElementById("grupoMascota");
const alergiasMascota = document.getElementById("alergiasMascota");
const antecedentesMascota = document.getElementById("antecedentesMascota");
const duenoMascota = document.getElementById("duenoMascota");
const activoMascota = document.getElementById("activoMascota");
const tablaMascotas = document.getElementById("tablaMascotas");
const msgMascota = document.getElementById("msgMascota");
const formTitleMascota = document.getElementById("formTitleMascota");
const btnCancelarMascota = document.getElementById("btnCancelarMascota");

const formVeterinario = document.getElementById("formVeterinario");
const personaVeterinario = document.getElementById("personaVeterinario");
const licenciaVeterinario = document.getElementById("licenciaVeterinario");
const especialidadVeterinario = document.getElementById("especialidadVeterinario");
const activoVeterinario = document.getElementById("activoVeterinario");
const tablaVeterinarios = document.getElementById("tablaVeterinarios");
const msgVeterinario = document.getElementById("msgVeterinario");
const formTitleVeterinario = document.getElementById("formTitleVeterinario");
const btnCancelarVeterinario = document.getElementById("btnCancelarVeterinario");
let idVeterinarioEditando = null;

const formCita = document.getElementById("formCita");
const fechaHoraCita = document.getElementById("fechaHoraCita");
const motivoCita = document.getElementById("motivoCita");
const prioridadCita = document.getElementById("prioridadCita");
const estadoCita = document.getElementById("estadoCita");
const observacionesCita = document.getElementById("observacionesCita");
const mascotaCita = document.getElementById("mascotaCita");
const veterinarioCita = document.getElementById("veterinarioCita");
const tablaCitas = document.getElementById("tablaCitas");
const msgCita = document.getElementById("msgCita");
const formTitleCita = document.getElementById("formTitleCita");
const btnCancelarCita = document.getElementById("btnCancelarCita");

const formHistorial = document.getElementById("formHistorial");
const fechaHistorial = document.getElementById("fechaHistorial");
const mascotaHistorial = document.getElementById("mascotaHistorial");
const veterinarioHistorial = document.getElementById("veterinarioHistorial");
const citaHistorial = document.getElementById("citaHistorial");
const sintomasHistorial = document.getElementById("sintomasHistorial");
const diagnosticoHistorial = document.getElementById("diagnosticoHistorial");
const observacionesHistorial = document.getElementById("observacionesHistorial");
const tablaHistorial = document.getElementById("tablaHistorial");
const msgHistorial = document.getElementById("msgHistorial");
const formTitleHistorial = document.getElementById("formTitleHistorial");
const btnCancelarHistorial = document.getElementById("btnCancelarHistorial");
let idHistorialEditando = null;

const formTratamiento = document.getElementById("formTratamiento");
const nombreTratamiento = document.getElementById("nombreTratamiento");
const estadoTratamiento = document.getElementById("estadoTratamiento");
const fechaInicioTratamiento = document.getElementById("fechaInicioTratamiento");
const fechaFinTratamiento = document.getElementById("fechaFinTratamiento");
const objetivoTratamiento = document.getElementById("objetivoTratamiento");
const historialTratamiento = document.getElementById("historialTratamiento");
const tablaTratamientos = document.getElementById("tablaTratamientos");
const msgTratamiento = document.getElementById("msgTratamiento");
const formTitleTratamiento = document.getElementById("formTitleTratamiento");
const btnCancelarTratamiento = document.getElementById("btnCancelarTratamiento");
let idTratamientoEditando = null;

const formUsuario = document.getElementById("formUsuario");
const usernameUsuario = document.getElementById("usernameUsuario");
const passwordUsuario = document.getElementById("passwordUsuario");
const veterinarioUsuario = document.getElementById("veterinarioUsuario");
const activoUsuario = document.getElementById("activoUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const msgUsuario = document.getElementById("msgUsuario");
const formTitleUsuario = document.getElementById("formTitleUsuario");
const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");
let idUsuarioEditando = null;

const formControl = document.getElementById("formControl");
const fechaControl = document.getElementById("fechaControl");
const estadoControl = document.getElementById("estadoControl");
const tratamientoControl = document.getElementById("tratamientoControl");
const observacionesControl = document.getElementById("observacionesControl");
const tablaControl = document.getElementById("tablaControl");
const msgControl = document.getElementById("msgControl");
const formTitleControl = document.getElementById("formTitleControl");
const btnCancelarControl = document.getElementById("btnCancelarControl");
let idControlEditando = null;

const mascotaReporte = document.getElementById("mascotaReporte");
const btnReporteIndividual = document.getElementById("btnReporteIndividual");
const btnReporteGeneral = document.getElementById("btnReporteGeneral");
const salidaReporteIndividual = document.getElementById("salidaReporteIndividual");
const salidaReporteGeneral = document.getElementById("salidaReporteGeneral");

function esPersonaAsignable(persona) {
  const nom = String(persona.nombres || "").toUpperCase().trim();
  const ape = String(persona.apellidos || "").toUpperCase().trim();
  const completo = (nom + " " + ape).replace(/\s+/g, " ").trim();

  if (nom === "SIN ASIGNAR" || ape === "SIN ASIGNAR") return false;
  if (completo === "SIN ASIGNAR") return false;
  if (completo.indexOf("SIN ASIGNAR") >= 0) return false;
  return true;
}

function cargarContador(url, targetId) {
  fetch(url, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (Array.isArray(data)) {
        document.getElementById(targetId).textContent = data.length;
      } else {
        document.getElementById(targetId).textContent = "0";
      }
    })
    .catch(function () {
      document.getElementById(targetId).textContent = "0";
    });
}

function mostrarVista(nombreVista) {
  viewDashboard.classList.add("hidden");
  viewPersonas.classList.add("hidden");
  viewDuenos.classList.add("hidden");
  viewMascotas.classList.add("hidden");
  viewVeterinarios.classList.add("hidden");
  viewCitas.classList.add("hidden");
  viewHistorial.classList.add("hidden");
  viewTratamientos.classList.add("hidden");
  viewUsuarios.classList.add("hidden");
  viewControl.classList.add("hidden");
  viewReportes.classList.add("hidden");

  if (nombreVista === "dashboard") {
    viewDashboard.classList.remove("hidden");
  }
  if (nombreVista === "personas") {
    viewPersonas.classList.remove("hidden");
    listarPersonas();
  }
  if (nombreVista === "duenos") {
    viewDuenos.classList.remove("hidden");
    listarDuenos();
  }
  if (nombreVista === "mascotas") {
    viewMascotas.classList.remove("hidden");
    listarMascotas();
    cargarDuenosSelect();
  }
  if (nombreVista === "veterinarios") {
    viewVeterinarios.classList.remove("hidden");
    listarVeterinarios();
    cargarPersonasVeterinarioSelect();
  }
  if (nombreVista === "citas") {
    viewCitas.classList.remove("hidden");
    listarCitas();
    cargarMascotasCitaSelect();
    cargarVeterinariosCitaSelect();
  }
  if (nombreVista === "historial") {
    viewHistorial.classList.remove("hidden");
    listarHistorial();
    cargarMascotasHistorialSelect();
    cargarVeterinariosHistorialSelect();
    cargarCitasHistorialSelect();
  }
  if (nombreVista === "tratamientos") {
    viewTratamientos.classList.remove("hidden");
    listarTratamientos();
    cargarHistorialTratamientoSelect();
  }
  if (nombreVista === "usuarios") {
    viewUsuarios.classList.remove("hidden");
    listarUsuarios();
    cargarVeterinariosUsuarioSelect();
  }
  if (nombreVista === "control") {
    viewControl.classList.remove("hidden");
    listarControles();
    cargarTratamientosControlSelect();
  }
  if (nombreVista === "reportes") {
    viewReportes.classList.remove("hidden");
    cargarMascotasReporte();
  }
}

const menuBtns = document.querySelectorAll(".menu-btn[data-view]");
for (let i = 0; i < menuBtns.length; i++) {
  menuBtns[i].addEventListener("click", function () {
    for (let j = 0; j < menuBtns.length; j++) {
      menuBtns[j].classList.remove("active");
    }
    this.classList.add("active");
    mostrarVista(this.dataset.view);
  });
}

function limpiarFormularioPersona() {
  formPersona.reset();
  activoPersona.checked = true;
  idPersonaEditando = null;
  formTitlePersona.textContent = "Registrar Persona";
  btnCancelarPersona.classList.add("hidden");
}

function cargarPersonasSelect(selectedId) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      personasCache = Array.isArray(data) ? data : [];

      let opciones = '<option value="">Selecciona persona</option>';
      for (let i = 0; i < personasCache.length; i++) {
        if (!esPersonaAsignable(personasCache[i])) continue;
        opciones +=
          '<option value="' +
          personasCache[i].id +
          '">' +
          personasCache[i].nombres +
          " " +
          personasCache[i].apellidos +
          "</option>";
      }

      personaId.innerHTML = opciones;
      if (selectedId) {
        personaId.value = String(selectedId);
      }
    })
    .catch(function () {
      personaId.innerHTML = '<option value="">Error al cargar personas</option>';
    });
}

function cargarDatosDuenos(callback) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];
      fetch(urlDuenos, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (duenos) {
          duenosCache = Array.isArray(duenos) ? duenos : [];
          if (callback) callback();
        })
        .catch(function () {
          duenosCache = [];
          if (callback) callback();
        });
    })
    .catch(function () {
      personasCache = [];
      duenosCache = [];
      if (callback) callback();
    });
}

function cargarDuenosSelect(selectedId) {
  cargarDatosDuenos(function () {
    let personaMap = {};
    for (let i = 0; i < personasCache.length; i++) {
      personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
    }

    let opciones = '<option value="">Selecciona dueño</option>';
    for (let i = 0; i < duenosCache.length; i++) {
      const nombreDueno = String(personaMap[duenosCache[i].persona_id] || "");
      if (nombreDueno.toUpperCase().indexOf("SIN ASIGNAR") >= 0) continue;
      opciones += '<option value="' + duenosCache[i].id + '">' + nombreDueno + "</option>";
    }

    duenoMascota.innerHTML = opciones;
    if (selectedId) {
      duenoMascota.value = String(selectedId);
    }
  });
}

function cargarPersonasVeterinarioSelect(selectedId) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      personasCache = Array.isArray(data) ? data : [];
      let opciones = '<option value="">Selecciona persona</option>';
      for (let i = 0; i < personasCache.length; i++) {
        if (!esPersonaAsignable(personasCache[i])) continue;
        opciones +=
          '<option value="' +
          personasCache[i].id +
          '">' +
          personasCache[i].nombres +
          " " +
          personasCache[i].apellidos +
          "</option>";
      }
      personaVeterinario.innerHTML = opciones;
      if (selectedId) {
        personaVeterinario.value = String(selectedId);
      }
    })
    .catch(function () {
      personaVeterinario.innerHTML = '<option value="">Error al cargar personas</option>';
    });
}

function cargarMascotasCitaSelect(selectedId) {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let opciones = '<option value="">Selecciona mascota</option>';
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          opciones += '<option value="' + data[i].id + '">' + data[i].nombre + " (" + data[i].especie + ")</option>";
        }
      }
      mascotaCita.innerHTML = opciones;
      if (selectedId) {
        mascotaCita.value = String(selectedId);
      }
    })
    .catch(function () {
      mascotaCita.innerHTML = '<option value="">Error al cargar mascotas</option>';
    });
}

function cargarVeterinariosCitaSelect(selectedId) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];
      fetch(urlVeterinarios, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (veterinarios) {
          let personaMap = {};
          for (let i = 0; i < personasCache.length; i++) {
            personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
          }

          let opciones = '<option value="">Selecciona veterinario</option>';
          if (Array.isArray(veterinarios)) {
            for (let i = 0; i < veterinarios.length; i++) {
              opciones +=
                '<option value="' +
                veterinarios[i].id +
                '">' +
                (personaMap[veterinarios[i].persona_id] || "Sin nombre") +
                "</option>";
            }
          }
          veterinarioCita.innerHTML = opciones;
          if (selectedId) {
            veterinarioCita.value = String(selectedId);
          }
        })
        .catch(function () {
          veterinarioCita.innerHTML = '<option value="">Error al cargar veterinarios</option>';
        });
    })
    .catch(function () {
      veterinarioCita.innerHTML = '<option value="">Error al cargar veterinarios</option>';
    });
}

function cargarMascotasHistorialSelect(selectedId) {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let opciones = '<option value="">Selecciona mascota</option>';
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          opciones += '<option value="' + data[i].id + '">' + data[i].nombre + " (" + data[i].especie + ")</option>";
        }
      }
      mascotaHistorial.innerHTML = opciones;
      if (selectedId) {
        mascotaHistorial.value = String(selectedId);
      }
    })
    .catch(function () {
      mascotaHistorial.innerHTML = '<option value="">Error al cargar mascotas</option>';
    });
}

function cargarVeterinariosHistorialSelect(selectedId) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];
      fetch(urlVeterinarios, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (veterinarios) {
          let personaMap = {};
          for (let i = 0; i < personasCache.length; i++) {
            personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
          }

          let opciones = '<option value="">Selecciona veterinario</option>';
          if (Array.isArray(veterinarios)) {
            for (let i = 0; i < veterinarios.length; i++) {
              opciones +=
                '<option value="' +
                veterinarios[i].id +
                '">' +
                (personaMap[veterinarios[i].persona_id] || "Sin nombre") +
                "</option>";
            }
          }
          veterinarioHistorial.innerHTML = opciones;
          if (selectedId) {
            veterinarioHistorial.value = String(selectedId);
          }
        })
        .catch(function () {
          veterinarioHistorial.innerHTML = '<option value="">Error al cargar veterinarios</option>';
        });
    })
    .catch(function () {
      veterinarioHistorial.innerHTML = '<option value="">Error al cargar veterinarios</option>';
    });
}

function cargarCitasHistorialSelect(selectedId) {
  fetch(urlCitas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let opciones = '<option value="">Sin cita</option>';
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          opciones +=
            '<option value="' +
            data[i].id +
            '">' +
            formatearFechaInput(data[i].fecha_hora).replace("T", " ") +
            " - " +
            (data[i].motivo || "Sin motivo") +
            "</option>";
        }
      }
      citaHistorial.innerHTML = opciones;
      if (selectedId) {
        citaHistorial.value = String(selectedId);
      }
    })
    .catch(function () {
      citaHistorial.innerHTML = '<option value="">Error al cargar citas</option>';
    });
}

function cargarHistorialTratamientoSelect(selectedId) {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (mascotas) {
      fetch("http://localhost:8000/historial/", {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (historiales) {
          let mascotaMap = {};
          if (Array.isArray(mascotas)) {
            for (let i = 0; i < mascotas.length; i++) {
              mascotaMap[mascotas[i].id] = mascotas[i].nombre;
            }
          }

          let opciones = '<option value="">Selecciona historial</option>';
          if (Array.isArray(historiales)) {
            for (let i = 0; i < historiales.length; i++) {
              opciones +=
                '<option value="' +
                historiales[i].id +
                '">' +
                (mascotaMap[historiales[i].mascota_id] || "Sin mascota") +
                " - " +
                historiales[i].fecha +
                "</option>";
            }
          }
          historialTratamiento.innerHTML = opciones;
          if (selectedId) {
            historialTratamiento.value = String(selectedId);
          }
        })
        .catch(function () {
          historialTratamiento.innerHTML = '<option value="">Error al cargar historial</option>';
        });
    })
    .catch(function () {
      historialTratamiento.innerHTML = '<option value="">Error al cargar historial</option>';
    });
}

function cargarVeterinariosUsuarioSelect(selectedId) {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];
      fetch(urlVeterinarios, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (veterinarios) {
          let personaMap = {};
          for (let i = 0; i < personasCache.length; i++) {
            personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
          }

          let opciones = '<option value="">Selecciona veterinario</option>';
          if (Array.isArray(veterinarios)) {
            for (let i = 0; i < veterinarios.length; i++) {
              opciones +=
                '<option value="' +
                veterinarios[i].id +
                '">' +
                (personaMap[veterinarios[i].persona_id] || "Sin nombre") +
                "</option>";
            }
          }
          veterinarioUsuario.innerHTML = opciones;
          if (selectedId) {
            veterinarioUsuario.value = String(selectedId);
          }
        })
        .catch(function () {
          veterinarioUsuario.innerHTML = '<option value="">Error al cargar veterinarios</option>';
        });
    })
    .catch(function () {
      veterinarioUsuario.innerHTML = '<option value="">Error al cargar veterinarios</option>';
    });
}

function cargarTratamientosControlSelect(selectedId) {
  fetch("http://localhost:8000/tratamientos/", {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (tratamientos) {
      let opciones = '<option value="">Selecciona tratamiento</option>';
      if (Array.isArray(tratamientos)) {
        for (let i = 0; i < tratamientos.length; i++) {
          opciones +=
            '<option value="' +
            tratamientos[i].id +
            '">' +
            (tratamientos[i].nombre || "Sin nombre") +
            " - " +
            (tratamientos[i].estado || "") +
            "</option>";
        }
      }
      tratamientoControl.innerHTML = opciones;
      if (selectedId) {
        tratamientoControl.value = String(selectedId);
      }
    })
    .catch(function () {
      tratamientoControl.innerHTML = '<option value="">Error al cargar tratamientos</option>';
    });
}

function cargarMascotasReporte() {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (mascotas) {
      let opciones = '<option value="">Selecciona mascota</option>';
      if (Array.isArray(mascotas)) {
        for (let i = 0; i < mascotas.length; i++) {
          opciones += '<option value="' + mascotas[i].id + '">' + mascotas[i].nombre + " (" + mascotas[i].especie + ")</option>";
        }
      }
      mascotaReporte.innerHTML = opciones;
    })
    .catch(function () {
      mascotaReporte.innerHTML = '<option value="">Error al cargar mascotas</option>';
    });
}

function verReporteIndividual() {
  if (!mascotaReporte.value) {
    salidaReporteIndividual.textContent = "Selecciona una mascota.";
    return;
  }

  fetch("http://localhost:8000/reportes/individual/" + mascotaReporte.value, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        salidaReporteIndividual.textContent = data.detail;
        return;
      }

      let html = "";
      html += "<h4>Perfil del Paciente</h4>";
      html += "<ul>";
      html += "<li>Nombre: " + ((data.perfil_paciente && data.perfil_paciente.nombre) || "-") + "</li>";
      html += "<li>Especie: " + ((data.perfil_paciente && data.perfil_paciente.especie) || "-") + "</li>";
      html += "<li>Edad: " + ((data.perfil_paciente && data.perfil_paciente.edad) || "-") + "</li>";
      html += "</ul>";

      html += "<h4>Propietario</h4>";
      html += "<ul>";
      html += "<li>Nombre: " + ((data.informacion_propietario && data.informacion_propietario.nombre_completo) || "-") + "</li>";
      html += "<li>Teléfono: " + ((data.informacion_propietario && data.informacion_propietario.telefono) || "-") + "</li>";
      html += "<li>Email: " + ((data.informacion_propietario && data.informacion_propietario.email) || "-") + "</li>";
      html += "</ul>";

      html += "<h4>Historial de Citas</h4>";
      html += "<ul>";
      if (Array.isArray(data.historial_citas) && data.historial_citas.length > 0) {
        for (let i = 0; i < data.historial_citas.length; i++) {
          html +=
            "<li>" +
            formatearFechaInput(data.historial_citas[i].fecha_hora).replace("T", " ") +
            " - " +
            (data.historial_citas[i].motivo || "Sin motivo") +
            " (" +
            (data.historial_citas[i].estado || "sin estado") +
            ")</li>";
        }
      } else {
        html += "<li>Sin citas</li>";
      }
      html += "</ul>";

      html += "<h4>Resumen Clínico</h4>";
      html += "<ul>";
      if (Array.isArray(data.resumen_clinico) && data.resumen_clinico.length > 0) {
        for (let i = 0; i < data.resumen_clinico.length; i++) {
          html +=
            "<li>" +
            (data.resumen_clinico[i].fecha || "") +
            " - Diagnóstico: " +
            (data.resumen_clinico[i].diagnostico || "Sin diagnóstico") +
            "</li>";
        }
      } else {
        html += "<li>Sin historial clínico</li>";
      }
      html += "</ul>";

      html += "<h4>Control de Tratamientos</h4>";
      html += "<ul>";
      if (Array.isArray(data.control_tratamientos) && data.control_tratamientos.length > 0) {
        for (let i = 0; i < data.control_tratamientos.length; i++) {
          html +=
            "<li>" +
            (data.control_tratamientos[i].medicamento || "Tratamiento") +
            " - Estado: " +
            (data.control_tratamientos[i].estado_tratamiento || "-") +
            "</li>";
        }
      } else {
        html += "<li>Sin tratamientos</li>";
      }
      html += "</ul>";

      salidaReporteIndividual.innerHTML = html;
    })
    .catch(function (error) {
      salidaReporteIndividual.textContent = error.message;
    });
}

function verReporteGeneral() {
  fetch("http://localhost:8000/reportes/general", {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        salidaReporteGeneral.textContent = data.detail;
        return;
      }

      let html = "";
      html += "<h4>Estadísticas de Citas</h4>";
      html += "<ul>";
      html += "<li>Total: " + ((data.estadisticas_citas && data.estadisticas_citas.total_citas) || 0) + "</li>";
      html += "<li>Completadas: " + ((data.estadisticas_citas && data.estadisticas_citas.citas_completadas) || 0) + "</li>";
      html += "<li>Canceladas: " + ((data.estadisticas_citas && data.estadisticas_citas.citas_canceladas) || 0) + "</li>";
      html += "</ul>";

      html += "<h4>Productividad del Personal</h4>";
      html += "<ul>";
      if (Array.isArray(data.productividad_personal) && data.productividad_personal.length > 0) {
        for (let i = 0; i < data.productividad_personal.length; i++) {
          html +=
            "<li>" +
            (data.productividad_personal[i].nombres || "") +
            " " +
            (data.productividad_personal[i].apellidos || "") +
            ": " +
            (data.productividad_personal[i].total_consultas || 0) +
            " consultas</li>";
        }
      } else {
        html += "<li>Sin datos</li>";
      }
      html += "</ul>";

      html += "<h4>Análisis de Pacientes</h4>";
      html += "<ul>";
      html +=
        "<li>Nuevas mascotas del mes: " +
        ((data.analisis_pacientes && data.analisis_pacientes.nuevas_mascotas_mes) || 0) +
        "</li>";
      if (
        data.analisis_pacientes &&
        Array.isArray(data.analisis_pacientes.especies_mas_atendidas) &&
        data.analisis_pacientes.especies_mas_atendidas.length > 0
      ) {
        for (let i = 0; i < data.analisis_pacientes.especies_mas_atendidas.length; i++) {
          html +=
            "<li>" +
            data.analisis_pacientes.especies_mas_atendidas[i].especie +
            ": " +
            data.analisis_pacientes.especies_mas_atendidas[i].total +
            " (" +
            data.analisis_pacientes.especies_mas_atendidas[i].porcentaje +
            "%)</li>";
        }
      }
      html += "</ul>";

      html += "<h4>Seguimiento de Tratamientos</h4>";
      html += "<ul>";
      html +=
        "<li>En curso: " +
        ((data.seguimiento_tratamientos && data.seguimiento_tratamientos.tratamientos_en_curso) || 0) +
        "</li>";
      html += "</ul>";

      salidaReporteGeneral.innerHTML = html;
    })
    .catch(function (error) {
      salidaReporteGeneral.textContent = error.message;
    });
}

function listarPersonas() {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) {
        tablaPersonas.innerHTML = "<tr><td colspan='8'>Error al cargar personas</td></tr>";
        return;
      }

      personasCache = data;
      let filas = "";
      let total = 0;

      for (let i = 0; i < data.length; i++) {
        if (!esPersonaAsignable(data[i])) continue;
        total = total + 1;

        filas +=
          "<tr>" +
          "<td>" + (data[i].nombres || "") + "</td>" +
          "<td>" + (data[i].apellidos || "") + "</td>" +
          "<td>" + (data[i].ci || "") + "</td>" +
          "<td>" + (data[i].telefono || "") + "</td>" +
          "<td>" + (data[i].email || "") + "</td>" +
          "<td>" + (data[i].direccion || "") + "</td>" +
          "<td>" + (data[i].activo ? "Si" : "No") + "</td>" +
          "<td>" +
          '<button class="mini-btn" type="button" onclick="editarPersona(' + data[i].id + ')">Editar</button> ' +
          '<button class="mini-btn delete" type="button" onclick="eliminarPersona(' + data[i].id + ')">Eliminar</button>' +
          "</td>" +
          "</tr>";
      }

      if (filas === "") {
        tablaPersonas.innerHTML = "<tr><td colspan='8'>No hay personas registradas</td></tr>";
      } else {
        tablaPersonas.innerHTML = filas;
      }

      document.getElementById("cntPersonas").textContent = String(total);
      cargarPersonasSelect();
    })
    .catch(function () {
      tablaPersonas.innerHTML = "<tr><td colspan='8'>Error al cargar personas</td></tr>";
    });
}

window.editarPersona = function (id) {
  fetch(urlPersonas + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgPersona.textContent = data.detail;
        msgPersona.className = "mensaje error";
        return;
      }

      idPersonaEditando = id;
      nombresPersona.value = data.nombres || "";
      apellidosPersona.value = data.apellidos || "";
      ciPersona.value = data.ci || "";
      telefonoPersona.value = data.telefono || "";
      emailPersona.value = data.email || "";
      direccionPersona.value = data.direccion || "";
      activoPersona.checked = !!data.activo;

      formTitlePersona.textContent = "Editar Persona";
      btnCancelarPersona.classList.remove("hidden");
      msgPersona.textContent = "";
      msgPersona.className = "mensaje";
    })
    .catch(function (error) {
      msgPersona.textContent = error.message;
      msgPersona.className = "mensaje error";
    });
};

window.eliminarPersona = function (id) {
  fetch(urlPersonas + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgPersona.textContent = data.detail;
        msgPersona.className = "mensaje error";
        return;
      }

      msgPersona.textContent = data.mensaje || "Persona eliminada";
      msgPersona.className = "mensaje ok";
      listarPersonas();
    })
    .catch(function (error) {
      msgPersona.textContent = error.message;
      msgPersona.className = "mensaje error";
    });
};

formPersona.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nombres: nombresPersona.value,
    apellidos: apellidosPersona.value,
    ci: ciPersona.value,
    telefono: telefonoPersona.value,
    email: emailPersona.value,
    direccion: direccionPersona.value,
    activo: activoPersona.checked,
  };

  const metodo = idPersonaEditando ? "PUT" : "POST";
  const url = idPersonaEditando ? urlPersonas + idPersonaEditando : urlPersonas;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgPersona.textContent = resp.detail;
        msgPersona.className = "mensaje error";
        return;
      }

      msgPersona.textContent = resp.mensaje || "Guardado correcto";
      msgPersona.className = "mensaje ok";
      limpiarFormularioPersona();
      listarPersonas();
    })
    .catch(function (error) {
      msgPersona.textContent = error.message;
      msgPersona.className = "mensaje error";
    });
});

btnCancelarPersona.addEventListener("click", function () {
  limpiarFormularioPersona();
  msgPersona.textContent = "";
  msgPersona.className = "mensaje";
});

function limpiarFormularioDueno() {
  formDueno.reset();
  activo.checked = true;
  idDuenoEditando = null;
  formTitleDueno.textContent = "Registrar Dueño";
  btnCancelarEdicionDueno.classList.add("hidden");
  cargarPersonasSelect();
}

function listarDuenos() {
  fetch(urlDuenos, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) {
        tablaDuenos.innerHTML = "<tr><td colspan='4'>Error al cargar dueños</td></tr>";
        return;
      }

      let personaMap = {};
      let personaValida = {};

      for (let i = 0; i < personasCache.length; i++) {
        personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
        personaValida[personasCache[i].id] = esPersonaAsignable(personasCache[i]);
      }

      let filas = "";
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        if (!personaValida[data[i].persona_id]) continue;
        total = total + 1;

        filas +=
          "<tr>" +
          "<td>" + (personaMap[data[i].persona_id] || "Sin nombre") + "</td>" +
          "<td>" + (data[i].direccion || "") + "</td>" +
          "<td>" + (data[i].activo ? "Si" : "No") + "</td>" +
          "<td>" +
          '<button class="mini-btn" type="button" onclick="editarDueno(' + data[i].id + ')">Editar</button> ' +
          '<button class="mini-btn delete" type="button" onclick="eliminarDueno(' + data[i].id + ')">Eliminar</button>' +
          "</td>" +
          "</tr>";
      }

      if (filas === "") {
        tablaDuenos.innerHTML = "<tr><td colspan='4'>No hay dueños registrados</td></tr>";
      } else {
        tablaDuenos.innerHTML = filas;
      }

      document.getElementById("cntDuenos").textContent = String(total);
    })
    .catch(function () {
      tablaDuenos.innerHTML = "<tr><td colspan='4'>Error al cargar dueños</td></tr>";
    });
}

function limpiarFormularioMascota() {
  formMascota.reset();
  activoMascota.checked = true;
  idMascotaEditando = null;
  formTitleMascota.textContent = "Registrar Mascota";
  btnCancelarMascota.classList.add("hidden");
  cargarDuenosSelect();
}

function listarMascotas() {
  cargarDatosDuenos(function () {
    fetch(urlMascotas, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          tablaMascotas.innerHTML = "<tr><td colspan='10'>Error al cargar mascotas</td></tr>";
          return;
        }

        let personaMap = {};
        for (let i = 0; i < personasCache.length; i++) {
          personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
        }

        let duenoMap = {};
        for (let i = 0; i < duenosCache.length; i++) {
          duenoMap[duenosCache[i].id] = personaMap[duenosCache[i].persona_id] || "Sin dueño";
        }

        let filas = "";
        for (let i = 0; i < data.length; i++) {
          filas +=
            "<tr>" +
            "<td>" + (data[i].nombre || "") + "</td>" +
            "<td>" + (data[i].especie || "") + "</td>" +
            "<td>" + (data[i].edad || 0) + "</td>" +
            "<td>" + (data[i].sexo || "") + "</td>" +
            "<td>" + (data[i].peso || "") + "</td>" +
            "<td>" + (data[i].talla || "") + "</td>" +
            "<td>" + (data[i].grupo_sanguineo || "") + "</td>" +
            "<td>" + (duenoMap[data[i].dueno_id] || "Sin dueño") + "</td>" +
            "<td>" + (data[i].activo ? "Si" : "No") + "</td>" +
            "<td>" +
            '<button class="mini-btn" type="button" onclick="editarMascota(' + data[i].id + ')">Editar</button> ' +
            '<button class="mini-btn delete" type="button" onclick="eliminarMascota(' + data[i].id + ')">Eliminar</button>' +
            "</td>" +
            "</tr>";
        }

        if (filas === "") {
          tablaMascotas.innerHTML = "<tr><td colspan='10'>No hay mascotas registradas</td></tr>";
        } else {
          tablaMascotas.innerHTML = filas;
        }

        document.getElementById("cntMascotas").textContent = String(data.length);
      })
      .catch(function () {
        tablaMascotas.innerHTML = "<tr><td colspan='10'>Error al cargar mascotas</td></tr>";
      });
  });
}

window.editarMascota = function (id) {
  fetch(urlMascotas + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgMascota.textContent = data.detail;
        msgMascota.className = "mensaje error";
        return;
      }

      idMascotaEditando = id;
      nombreMascota.value = data.nombre || "";
      especieMascota.value = data.especie || "";
      edadMascota.value = data.edad || 0;
      sexoMascota.value = data.sexo || "";
      pesoMascota.value = data.peso || 0;
      tallaMascota.value = data.talla || 0;
      grupoMascota.value = data.grupo_sanguineo || "";
      alergiasMascota.value = data.alergias || "";
      antecedentesMascota.value = data.antecedentes || "";
      activoMascota.checked = !!data.activo;
      formTitleMascota.textContent = "Editar Mascota";
      btnCancelarMascota.classList.remove("hidden");
      cargarDuenosSelect(data.dueno_id);
      msgMascota.textContent = "";
      msgMascota.className = "mensaje";
    })
    .catch(function (error) {
      msgMascota.textContent = error.message;
      msgMascota.className = "mensaje error";
    });
};

window.eliminarMascota = function (id) {
  fetch(urlMascotas + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgMascota.textContent = data.detail;
        msgMascota.className = "mensaje error";
        return;
      }

      msgMascota.textContent = data.mensaje || "Mascota eliminada";
      msgMascota.className = "mensaje ok";
      listarMascotas();
    })
    .catch(function (error) {
      msgMascota.textContent = error.message;
      msgMascota.className = "mensaje error";
    });
};

function limpiarFormularioVeterinario() {
  formVeterinario.reset();
  activoVeterinario.checked = true;
  idVeterinarioEditando = null;
  formTitleVeterinario.textContent = "Registrar Veterinario";
  btnCancelarVeterinario.classList.add("hidden");
  cargarPersonasVeterinarioSelect();
}

function listarVeterinarios() {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];

      fetch(urlVeterinarios, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (!Array.isArray(data)) {
            tablaVeterinarios.innerHTML = "<tr><td colspan='5'>Error al cargar veterinarios</td></tr>";
            return;
          }

          let personaMap = {};
          for (let i = 0; i < personasCache.length; i++) {
            personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
          }

          let filas = "";
          for (let i = 0; i < data.length; i++) {
            filas +=
              "<tr>" +
              "<td>" + (personaMap[data[i].persona_id] || "Sin nombre") + "</td>" +
              "<td>" + (data[i].licencia || "") + "</td>" +
              "<td>" + (data[i].especialidad || "") + "</td>" +
              "<td>" + (data[i].activo ? "Si" : "No") + "</td>" +
              "<td>" +
              '<button class="mini-btn" type="button" onclick="editarVeterinario(' + data[i].id + ')">Editar</button> ' +
              '<button class="mini-btn delete" type="button" onclick="eliminarVeterinario(' + data[i].id + ')">Eliminar</button>' +
              "</td>" +
              "</tr>";
          }

          if (filas === "") {
            tablaVeterinarios.innerHTML = "<tr><td colspan='5'>No hay veterinarios registrados</td></tr>";
          } else {
            tablaVeterinarios.innerHTML = filas;
          }
        })
        .catch(function () {
          tablaVeterinarios.innerHTML = "<tr><td colspan='5'>Error al cargar veterinarios</td></tr>";
        });
    })
    .catch(function () {
      tablaVeterinarios.innerHTML = "<tr><td colspan='5'>Error al cargar veterinarios</td></tr>";
    });
}

window.editarVeterinario = function (id) {
  fetch(urlVeterinarios + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgVeterinario.textContent = data.detail;
        msgVeterinario.className = "mensaje error";
        return;
      }

      idVeterinarioEditando = id;
      licenciaVeterinario.value = data.licencia || "";
      especialidadVeterinario.value = data.especialidad || "";
      activoVeterinario.checked = !!data.activo;
      cargarPersonasVeterinarioSelect(data.persona_id);
      formTitleVeterinario.textContent = "Editar Veterinario";
      btnCancelarVeterinario.classList.remove("hidden");
      msgVeterinario.textContent = "";
      msgVeterinario.className = "mensaje";
    })
    .catch(function (error) {
      msgVeterinario.textContent = error.message;
      msgVeterinario.className = "mensaje error";
    });
};

window.eliminarVeterinario = function (id) {
  fetch(urlVeterinarios + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgVeterinario.textContent = data.detail;
        msgVeterinario.className = "mensaje error";
        return;
      }

      msgVeterinario.textContent = data.mensaje || "Veterinario eliminado";
      msgVeterinario.className = "mensaje ok";
      listarVeterinarios();
      cargarContador(urlVeterinarios, "cntVeterinarios");
    })
    .catch(function (error) {
      msgVeterinario.textContent = error.message;
      msgVeterinario.className = "mensaje error";
    });
};

function limpiarFormularioCita() {
  formCita.reset();
  idCitaEditando = null;
  prioridadCita.value = "normal";
  estadoCita.value = "pendiente";
  formTitleCita.textContent = "Registrar Cita";
  btnCancelarCita.classList.add("hidden");
  cargarMascotasCitaSelect();
  cargarVeterinariosCitaSelect();
}

function formatearFechaInput(valor) {
  if (!valor) return "";
  const texto = String(valor);
  if (texto.indexOf("T") >= 0) return texto.substring(0, 16);
  if (texto.indexOf(" ") >= 0) return texto.replace(" ", "T").substring(0, 16);
  return texto.substring(0, 16);
}

function listarCitas() {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (mascotas) {
      fetch(urlPersonas, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (personas) {
          fetch(urlVeterinarios, {
            method: "GET",
            headers: { "content-type": "application/json" },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (veterinarios) {
              fetch(urlCitas, {
                method: "GET",
                headers: { "content-type": "application/json" },
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (citas) {
                  if (!Array.isArray(citas)) {
                    tablaCitas.innerHTML = "<tr><td colspan='8'>Error al cargar citas</td></tr>";
                    return;
                  }

                  let mascotaMap = {};
                  if (Array.isArray(mascotas)) {
                    for (let i = 0; i < mascotas.length; i++) {
                      mascotaMap[mascotas[i].id] = mascotas[i].nombre;
                    }
                  }

                  let personaMap = {};
                  if (Array.isArray(personas)) {
                    for (let i = 0; i < personas.length; i++) {
                      personaMap[personas[i].id] = personas[i].nombres + " " + personas[i].apellidos;
                    }
                  }

                  let veterinarioMap = {};
                  if (Array.isArray(veterinarios)) {
                    for (let i = 0; i < veterinarios.length; i++) {
                      veterinarioMap[veterinarios[i].id] = personaMap[veterinarios[i].persona_id] || "Sin nombre";
                    }
                  }

                  let filas = "";
                  for (let i = 0; i < citas.length; i++) {
                    filas +=
                      "<tr>" +
                      "<td>" + formatearFechaInput(citas[i].fecha_hora).replace("T", " ") + "</td>" +
                      "<td>" + (mascotaMap[citas[i].mascota_id] || "Sin mascota") + "</td>" +
                      "<td>" + (veterinarioMap[citas[i].veterinario_id] || "Sin veterinario") + "</td>" +
                      "<td>" + (citas[i].motivo || "") + "</td>" +
                      "<td>" + (citas[i].prioridad || "") + "</td>" +
                      "<td>" + (citas[i].estado || "") + "</td>" +
                      "<td>" + (citas[i].observaciones || "") + "</td>" +
                      "<td>" +
                      '<button class="mini-btn" type="button" onclick="editarCita(' + citas[i].id + ')">Editar</button> ' +
                      '<button class="mini-btn delete" type="button" onclick="eliminarCita(' + citas[i].id + ')">Eliminar</button>' +
                      "</td>" +
                      "</tr>";
                  }

                  if (filas === "") {
                    tablaCitas.innerHTML = "<tr><td colspan='8'>No hay citas registradas</td></tr>";
                  } else {
                    tablaCitas.innerHTML = filas;
                  }

                  document.getElementById("cntCitas").textContent = String(citas.length);
                })
                .catch(function () {
                  tablaCitas.innerHTML = "<tr><td colspan='8'>Error al cargar citas</td></tr>";
                });
            })
            .catch(function () {
              tablaCitas.innerHTML = "<tr><td colspan='8'>Error al cargar citas</td></tr>";
            });
        })
        .catch(function () {
          tablaCitas.innerHTML = "<tr><td colspan='8'>Error al cargar citas</td></tr>";
        });
    })
    .catch(function () {
      tablaCitas.innerHTML = "<tr><td colspan='8'>Error al cargar citas</td></tr>";
    });
}

window.editarCita = function (id) {
  fetch(urlCitas + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgCita.textContent = data.detail;
        msgCita.className = "mensaje error";
        return;
      }

      idCitaEditando = id;
      fechaHoraCita.value = formatearFechaInput(data.fecha_hora);
      motivoCita.value = data.motivo || "";
      prioridadCita.value = data.prioridad || "normal";
      estadoCita.value = data.estado || "pendiente";
      observacionesCita.value = data.observaciones || "";
      cargarMascotasCitaSelect(data.mascota_id);
      cargarVeterinariosCitaSelect(data.veterinario_id);
      formTitleCita.textContent = "Editar Cita";
      btnCancelarCita.classList.remove("hidden");
      msgCita.textContent = "";
      msgCita.className = "mensaje";
    })
    .catch(function (error) {
      msgCita.textContent = error.message;
      msgCita.className = "mensaje error";
    });
};

window.eliminarCita = function (id) {
  fetch(urlCitas + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgCita.textContent = data.detail;
        msgCita.className = "mensaje error";
        return;
      }

      msgCita.textContent = data.mensaje || "Cita eliminada";
      msgCita.className = "mensaje ok";
      listarCitas();
      cargarContador(urlCitas, "cntCitas");
    })
    .catch(function (error) {
      msgCita.textContent = error.message;
      msgCita.className = "mensaje error";
    });
};

function limpiarFormularioHistorial() {
  formHistorial.reset();
  idHistorialEditando = null;
  formTitleHistorial.textContent = "Registrar Historial";
  btnCancelarHistorial.classList.add("hidden");
  cargarMascotasHistorialSelect();
  cargarVeterinariosHistorialSelect();
  cargarCitasHistorialSelect();
}

function listarHistorial() {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (mascotas) {
      fetch(urlPersonas, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (personas) {
          fetch(urlVeterinarios, {
            method: "GET",
            headers: { "content-type": "application/json" },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (veterinarios) {
              fetch(urlCitas, {
                method: "GET",
                headers: { "content-type": "application/json" },
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (citas) {
                  fetch("http://localhost:8000/historial/", {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then(function (historiales) {
                      if (!Array.isArray(historiales)) {
                        tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
                        return;
                      }

                      let mascotaMap = {};
                      if (Array.isArray(mascotas)) {
                        for (let i = 0; i < mascotas.length; i++) {
                          mascotaMap[mascotas[i].id] = mascotas[i].nombre;
                        }
                      }

                      let personaMap = {};
                      if (Array.isArray(personas)) {
                        for (let i = 0; i < personas.length; i++) {
                          personaMap[personas[i].id] = personas[i].nombres + " " + personas[i].apellidos;
                        }
                      }

                      let veterinarioMap = {};
                      if (Array.isArray(veterinarios)) {
                        for (let i = 0; i < veterinarios.length; i++) {
                          veterinarioMap[veterinarios[i].id] = personaMap[veterinarios[i].persona_id] || "Sin nombre";
                        }
                      }

                      let citaMap = {};
                      if (Array.isArray(citas)) {
                        for (let i = 0; i < citas.length; i++) {
                          citaMap[citas[i].id] = formatearFechaInput(citas[i].fecha_hora).replace("T", " ");
                        }
                      }

                      let filas = "";
                      for (let i = 0; i < historiales.length; i++) {
                        filas +=
                          "<tr>" +
                          "<td>" + (historiales[i].fecha || "") + "</td>" +
                          "<td>" + (mascotaMap[historiales[i].mascota_id] || "Sin mascota") + "</td>" +
                          "<td>" + (veterinarioMap[historiales[i].veterinario_id] || "Sin veterinario") + "</td>" +
                          "<td>" + (citaMap[historiales[i].cita_id] || "Sin cita") + "</td>" +
                          "<td>" + (historiales[i].sintomas || "") + "</td>" +
                          "<td>" + (historiales[i].diagnostico || "") + "</td>" +
                          "<td>" + (historiales[i].observaciones || "") + "</td>" +
                          "<td>" +
                          '<button class="mini-btn" type="button" onclick="editarHistorial(' + historiales[i].id + ')">Editar</button> ' +
                          '<button class="mini-btn delete" type="button" onclick="eliminarHistorial(' + historiales[i].id + ')">Eliminar</button>' +
                          "</td>" +
                          "</tr>";
                      }

                      if (filas === "") {
                        tablaHistorial.innerHTML = "<tr><td colspan='8'>No hay historiales registrados</td></tr>";
                      } else {
                        tablaHistorial.innerHTML = filas;
                      }
                    })
                    .catch(function () {
                      tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
                    });
                })
                .catch(function () {
                  tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
                });
            })
            .catch(function () {
              tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
            });
        })
        .catch(function () {
          tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
        });
    })
    .catch(function () {
      tablaHistorial.innerHTML = "<tr><td colspan='8'>Error al cargar historial</td></tr>";
    });
}

window.editarHistorial = function (id) {
  fetch("http://localhost:8000/historial/" + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgHistorial.textContent = data.detail;
        msgHistorial.className = "mensaje error";
        return;
      }

      idHistorialEditando = id;
      fechaHistorial.value = data.fecha || "";
      sintomasHistorial.value = data.sintomas || "";
      diagnosticoHistorial.value = data.diagnostico || "";
      observacionesHistorial.value = data.observaciones || "";
      cargarMascotasHistorialSelect(data.mascota_id);
      cargarVeterinariosHistorialSelect(data.veterinario_id);
      cargarCitasHistorialSelect(data.cita_id);
      formTitleHistorial.textContent = "Editar Historial";
      btnCancelarHistorial.classList.remove("hidden");
      msgHistorial.textContent = "";
      msgHistorial.className = "mensaje";
    })
    .catch(function (error) {
      msgHistorial.textContent = error.message;
      msgHistorial.className = "mensaje error";
    });
};

window.eliminarHistorial = function (id) {
  fetch("http://localhost:8000/historial/" + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgHistorial.textContent = data.detail;
        msgHistorial.className = "mensaje error";
        return;
      }

      msgHistorial.textContent = data.mensaje || "Historial eliminado";
      msgHistorial.className = "mensaje ok";
      listarHistorial();
    })
    .catch(function (error) {
      msgHistorial.textContent = error.message;
      msgHistorial.className = "mensaje error";
    });
};

function limpiarFormularioTratamiento() {
  formTratamiento.reset();
  idTratamientoEditando = null;
  estadoTratamiento.value = "activo";
  formTitleTratamiento.textContent = "Registrar Tratamiento";
  btnCancelarTratamiento.classList.add("hidden");
  cargarHistorialTratamientoSelect();
}

function listarTratamientos() {
  fetch(urlMascotas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (mascotas) {
      fetch("http://localhost:8000/historial/", {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (historiales) {
          fetch("http://localhost:8000/tratamientos/", {
            method: "GET",
            headers: { "content-type": "application/json" },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (tratamientos) {
              if (!Array.isArray(tratamientos)) {
                tablaTratamientos.innerHTML = "<tr><td colspan='7'>Error al cargar tratamientos</td></tr>";
                return;
              }

              let mascotaMap = {};
              if (Array.isArray(mascotas)) {
                for (let i = 0; i < mascotas.length; i++) {
                  mascotaMap[mascotas[i].id] = mascotas[i].nombre;
                }
              }

              let historialMascotaMap = {};
              if (Array.isArray(historiales)) {
                for (let i = 0; i < historiales.length; i++) {
                  historialMascotaMap[historiales[i].id] = mascotaMap[historiales[i].mascota_id] || "Sin mascota";
                }
              }

              let filas = "";
              for (let i = 0; i < tratamientos.length; i++) {
                filas +=
                  "<tr>" +
                  "<td>" + (tratamientos[i].nombre || "") + "</td>" +
                  "<td>" + (tratamientos[i].estado || "") + "</td>" +
                  "<td>" + (tratamientos[i].fecha_inicio || "") + "</td>" +
                  "<td>" + (tratamientos[i].fecha_fin || "") + "</td>" +
                  "<td>" + (tratamientos[i].objetivo || "") + "</td>" +
                  "<td>" + (historialMascotaMap[tratamientos[i].historial_id] || "Sin paciente") + "</td>" +
                  "<td>" +
                  '<button class="mini-btn" type="button" onclick="editarTratamiento(' + tratamientos[i].id + ')">Editar</button> ' +
                  '<button class="mini-btn delete" type="button" onclick="eliminarTratamiento(' + tratamientos[i].id + ')">Eliminar</button>' +
                  "</td>" +
                  "</tr>";
              }

              if (filas === "") {
                tablaTratamientos.innerHTML = "<tr><td colspan='7'>No hay tratamientos registrados</td></tr>";
              } else {
                tablaTratamientos.innerHTML = filas;
              }
            })
            .catch(function () {
              tablaTratamientos.innerHTML = "<tr><td colspan='7'>Error al cargar tratamientos</td></tr>";
            });
        })
        .catch(function () {
          tablaTratamientos.innerHTML = "<tr><td colspan='7'>Error al cargar tratamientos</td></tr>";
        });
    })
    .catch(function () {
      tablaTratamientos.innerHTML = "<tr><td colspan='7'>Error al cargar tratamientos</td></tr>";
    });
}

window.editarTratamiento = function (id) {
  fetch("http://localhost:8000/tratamientos/" + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgTratamiento.textContent = data.detail;
        msgTratamiento.className = "mensaje error";
        return;
      }

      idTratamientoEditando = id;
      nombreTratamiento.value = data.nombre || "";
      estadoTratamiento.value = data.estado || "activo";
      fechaInicioTratamiento.value = data.fecha_inicio || "";
      fechaFinTratamiento.value = data.fecha_fin || "";
      objetivoTratamiento.value = data.objetivo || "";
      cargarHistorialTratamientoSelect(data.historial_id);
      formTitleTratamiento.textContent = "Editar Tratamiento";
      btnCancelarTratamiento.classList.remove("hidden");
      msgTratamiento.textContent = "";
      msgTratamiento.className = "mensaje";
    })
    .catch(function (error) {
      msgTratamiento.textContent = error.message;
      msgTratamiento.className = "mensaje error";
    });
};

window.eliminarTratamiento = function (id) {
  fetch("http://localhost:8000/tratamientos/" + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgTratamiento.textContent = data.detail;
        msgTratamiento.className = "mensaje error";
        return;
      }

      msgTratamiento.textContent = data.mensaje || "Tratamiento eliminado";
      msgTratamiento.className = "mensaje ok";
      listarTratamientos();
    })
    .catch(function (error) {
      msgTratamiento.textContent = error.message;
      msgTratamiento.className = "mensaje error";
    });
};

function limpiarFormularioUsuario() {
  formUsuario.reset();
  activoUsuario.checked = true;
  idUsuarioEditando = null;
  formTitleUsuario.textContent = "Registrar Usuario";
  btnCancelarUsuario.classList.add("hidden");
  cargarVeterinariosUsuarioSelect();
}

function listarUsuarios() {
  fetch(urlPersonas, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (personas) {
      personasCache = Array.isArray(personas) ? personas : [];
      fetch(urlVeterinarios, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (veterinarios) {
          fetch(urlUsuarios, {
            method: "GET",
            headers: { "content-type": "application/json" },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (usuarios) {
              if (!Array.isArray(usuarios)) {
                tablaUsuarios.innerHTML = "<tr><td colspan='4'>Error al cargar usuarios</td></tr>";
                return;
              }

              let personaMap = {};
              for (let i = 0; i < personasCache.length; i++) {
                personaMap[personasCache[i].id] = personasCache[i].nombres + " " + personasCache[i].apellidos;
              }

              let veterinarioMap = {};
              if (Array.isArray(veterinarios)) {
                for (let i = 0; i < veterinarios.length; i++) {
                  veterinarioMap[veterinarios[i].id] = personaMap[veterinarios[i].persona_id] || "Sin nombre";
                }
              }

              let filas = "";
              for (let i = 0; i < usuarios.length; i++) {
                filas +=
                  "<tr>" +
                  "<td>" + (usuarios[i].username || "") + "</td>" +
                  "<td>" + (veterinarioMap[usuarios[i].veterinario_id] || "Sin veterinario") + "</td>" +
                  "<td>" + (usuarios[i].activo ? "Si" : "No") + "</td>" +
                  "<td>" +
                  '<button class="mini-btn" type="button" onclick="editarUsuario(' + usuarios[i].id + ')">Editar</button> ' +
                  '<button class="mini-btn delete" type="button" onclick="eliminarUsuario(' + usuarios[i].id + ')">Eliminar</button>' +
                  "</td>" +
                  "</tr>";
              }

              if (filas === "") {
                tablaUsuarios.innerHTML = "<tr><td colspan='4'>No hay usuarios registrados</td></tr>";
              } else {
                tablaUsuarios.innerHTML = filas;
              }

              document.getElementById("cntUsuarios").textContent = String(usuarios.length);
            })
            .catch(function () {
              tablaUsuarios.innerHTML = "<tr><td colspan='4'>Error al cargar usuarios</td></tr>";
            });
        })
        .catch(function () {
          tablaUsuarios.innerHTML = "<tr><td colspan='4'>Error al cargar usuarios</td></tr>";
        });
    })
    .catch(function () {
      tablaUsuarios.innerHTML = "<tr><td colspan='4'>Error al cargar usuarios</td></tr>";
    });
}

window.editarUsuario = function (id) {
  fetch(urlUsuarios + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgUsuario.textContent = data.detail;
        msgUsuario.className = "mensaje error";
        return;
      }

      idUsuarioEditando = id;
      usernameUsuario.value = data.username || "";
      passwordUsuario.value = data.password_hash || "";
      activoUsuario.checked = !!data.activo;
      cargarVeterinariosUsuarioSelect(data.veterinario_id);
      formTitleUsuario.textContent = "Editar Usuario";
      btnCancelarUsuario.classList.remove("hidden");
      msgUsuario.textContent = "";
      msgUsuario.className = "mensaje";
    })
    .catch(function (error) {
      msgUsuario.textContent = error.message;
      msgUsuario.className = "mensaje error";
    });
};

window.eliminarUsuario = function (id) {
  fetch(urlUsuarios + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgUsuario.textContent = data.detail;
        msgUsuario.className = "mensaje error";
        return;
      }

      msgUsuario.textContent = data.mensaje || "Usuario eliminado";
      msgUsuario.className = "mensaje ok";
      listarUsuarios();
      cargarContador(urlUsuarios, "cntUsuarios");
    })
    .catch(function (error) {
      msgUsuario.textContent = error.message;
      msgUsuario.className = "mensaje error";
    });
};

function limpiarFormularioControl() {
  formControl.reset();
  idControlEditando = null;
  estadoControl.value = "pendiente";
  formTitleControl.textContent = "Registrar Control";
  btnCancelarControl.classList.add("hidden");
  cargarTratamientosControlSelect();
}

function listarControles() {
  fetch("http://localhost:8000/tratamientos/", {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (tratamientos) {
      fetch("http://localhost:8000/historial/", {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (historiales) {
          fetch(urlMascotas, {
            method: "GET",
            headers: { "content-type": "application/json" },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (mascotas) {
              fetch(urlDuenos, {
                method: "GET",
                headers: { "content-type": "application/json" },
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (duenos) {
                  fetch(urlPersonas, {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then(function (personas) {
                      fetch("http://localhost:8000/control/", {
                        method: "GET",
                        headers: { "content-type": "application/json" },
                      })
                        .then(function (response) {
                          return response.json();
                        })
                        .then(function (controles) {
                          if (!Array.isArray(controles)) {
                            tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
                            return;
                          }

                          let tratamientoMap = {};
                          if (Array.isArray(tratamientos)) {
                            for (let i = 0; i < tratamientos.length; i++) {
                              tratamientoMap[tratamientos[i].id] = tratamientos[i];
                            }
                          }

                          let historialMap = {};
                          if (Array.isArray(historiales)) {
                            for (let i = 0; i < historiales.length; i++) {
                              historialMap[historiales[i].id] = historiales[i];
                            }
                          }

                          let mascotaMap = {};
                          if (Array.isArray(mascotas)) {
                            for (let i = 0; i < mascotas.length; i++) {
                              mascotaMap[mascotas[i].id] = mascotas[i];
                            }
                          }

                          let duenoMap = {};
                          if (Array.isArray(duenos)) {
                            for (let i = 0; i < duenos.length; i++) {
                              duenoMap[duenos[i].id] = duenos[i];
                            }
                          }

                          let personaMap = {};
                          if (Array.isArray(personas)) {
                            for (let i = 0; i < personas.length; i++) {
                              personaMap[personas[i].id] = personas[i].nombres + " " + personas[i].apellidos;
                            }
                          }

                          let filas = "";
                          for (let i = 0; i < controles.length; i++) {
                            const tratamiento = tratamientoMap[controles[i].tratamiento_id];
                            const historial = tratamiento ? historialMap[tratamiento.historial_id] : null;
                            const mascota = historial ? mascotaMap[historial.mascota_id] : null;
                            const dueno = mascota ? duenoMap[mascota.dueno_id] : null;
                            const nombreDueno = dueno ? personaMap[dueno.persona_id] || "Sin dueño" : "Sin dueño";

                            filas +=
                              "<tr>" +
                              "<td>" + (controles[i].fecha_control || "") + "</td>" +
                              "<td>" + (controles[i].estado || "") + "</td>" +
                              "<td>" + (tratamiento ? tratamiento.nombre : "Sin tratamiento") + "</td>" +
                              "<td>" + (mascota ? mascota.nombre : "Sin paciente") + "</td>" +
                              "<td>" + nombreDueno + "</td>" +
                              "<td>" + (controles[i].observaciones || "") + "</td>" +
                              "<td>" +
                              '<button class="mini-btn" type="button" onclick="editarControl(' + controles[i].id + ')">Editar</button> ' +
                              '<button class="mini-btn delete" type="button" onclick="eliminarControl(' + controles[i].id + ')">Eliminar</button>' +
                              "</td>" +
                              "</tr>";
                          }

                          if (filas === "") {
                            tablaControl.innerHTML = "<tr><td colspan='7'>No hay controles registrados</td></tr>";
                          } else {
                            tablaControl.innerHTML = filas;
                          }
                        })
                        .catch(function () {
                          tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
                        });
                    })
                    .catch(function () {
                      tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
                    });
                })
                .catch(function () {
                  tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
                });
            })
            .catch(function () {
              tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
            });
        })
        .catch(function () {
          tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
        });
    })
    .catch(function () {
      tablaControl.innerHTML = "<tr><td colspan='7'>Error al cargar controles</td></tr>";
    });
}

window.editarControl = function (id) {
  fetch("http://localhost:8000/control/" + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgControl.textContent = data.detail;
        msgControl.className = "mensaje error";
        return;
      }

      idControlEditando = id;
      fechaControl.value = data.fecha_control || "";
      estadoControl.value = data.estado || "pendiente";
      observacionesControl.value = data.observaciones || "";
      cargarTratamientosControlSelect(data.tratamiento_id);
      formTitleControl.textContent = "Editar Control";
      btnCancelarControl.classList.remove("hidden");
      msgControl.textContent = "";
      msgControl.className = "mensaje";
    })
    .catch(function (error) {
      msgControl.textContent = error.message;
      msgControl.className = "mensaje error";
    });
};

window.eliminarControl = function (id) {
  fetch("http://localhost:8000/control/" + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgControl.textContent = data.detail;
        msgControl.className = "mensaje error";
        return;
      }

      msgControl.textContent = data.mensaje || "Control eliminado";
      msgControl.className = "mensaje ok";
      listarControles();
    })
    .catch(function (error) {
      msgControl.textContent = error.message;
      msgControl.className = "mensaje error";
    });
};

window.editarDueno = function (id) {
  fetch(urlDuenos + id, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgDueno.textContent = data.detail;
        msgDueno.className = "mensaje error";
        return;
      }

      idDuenoEditando = id;
      cargarPersonasSelect(data.persona_id);
      direccion.value = data.direccion || "";
      activo.checked = !!data.activo;
      formTitleDueno.textContent = "Editar Dueño";
      btnCancelarEdicionDueno.classList.remove("hidden");
    })
    .catch(function (error) {
      msgDueno.textContent = error.message;
      msgDueno.className = "mensaje error";
    });
};

window.eliminarDueno = function (id) {
  fetch(urlDuenos + id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.detail) {
        msgDueno.textContent = data.detail;
        msgDueno.className = "mensaje error";
        return;
      }

      msgDueno.textContent = data.mensaje || "Dueño eliminado";
      msgDueno.className = "mensaje ok";
      listarDuenos();
    })
    .catch(function (error) {
      msgDueno.textContent = error.message;
      msgDueno.className = "mensaje error";
    });
};

formDueno.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    persona_id: Number(personaId.value),
    direccion: direccion.value,
    activo: activo.checked,
  };

  const metodo = idDuenoEditando ? "PUT" : "POST";
  const url = idDuenoEditando ? urlDuenos + idDuenoEditando : urlDuenos;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgDueno.textContent = resp.detail;
        msgDueno.className = "mensaje error";
        return;
      }

      msgDueno.textContent = resp.mensaje || "Guardado correcto";
      msgDueno.className = "mensaje ok";
      limpiarFormularioDueno();
      listarDuenos();
    })
    .catch(function (error) {
      msgDueno.textContent = error.message;
      msgDueno.className = "mensaje error";
    });
});

formMascota.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nombre: nombreMascota.value,
    especie: especieMascota.value,
    edad: Number(edadMascota.value),
    sexo: sexoMascota.value,
    peso: Number(pesoMascota.value),
    talla: Number(tallaMascota.value),
    grupo_sanguineo: grupoMascota.value,
    alergias: alergiasMascota.value,
    antecedentes: antecedentesMascota.value,
    activo: activoMascota.checked,
    dueno_id: Number(duenoMascota.value),
  };

  const metodo = idMascotaEditando ? "PUT" : "POST";
  const url = idMascotaEditando ? urlMascotas + idMascotaEditando : urlMascotas;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgMascota.textContent = resp.detail;
        msgMascota.className = "mensaje error";
        return;
      }

      msgMascota.textContent = resp.mensaje || "Guardado correcto";
      msgMascota.className = "mensaje ok";
      limpiarFormularioMascota();
      listarMascotas();
    })
    .catch(function (error) {
      msgMascota.textContent = error.message;
      msgMascota.className = "mensaje error";
    });
});

formVeterinario.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    licencia: licenciaVeterinario.value,
    especialidad: especialidadVeterinario.value,
    activo: activoVeterinario.checked,
    persona_id: Number(personaVeterinario.value),
  };

  const metodo = idVeterinarioEditando ? "PUT" : "POST";
  const url = idVeterinarioEditando ? urlVeterinarios + idVeterinarioEditando : urlVeterinarios;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgVeterinario.textContent = resp.detail;
        msgVeterinario.className = "mensaje error";
        return;
      }

      msgVeterinario.textContent = resp.mensaje || "Guardado correcto";
      msgVeterinario.className = "mensaje ok";
      limpiarFormularioVeterinario();
      listarVeterinarios();
      cargarContador(urlVeterinarios, "cntVeterinarios");
    })
    .catch(function (error) {
      msgVeterinario.textContent = error.message;
      msgVeterinario.className = "mensaje error";
    });
});

formCita.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    fecha_hora: fechaHoraCita.value,
    motivo: motivoCita.value,
    prioridad: prioridadCita.value,
    estado: estadoCita.value,
    observaciones: observacionesCita.value,
    mascota_id: Number(mascotaCita.value),
    veterinario_id: Number(veterinarioCita.value),
  };

  const metodo = idCitaEditando ? "PUT" : "POST";
  const url = idCitaEditando ? urlCitas + idCitaEditando : urlCitas;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgCita.textContent = resp.detail;
        msgCita.className = "mensaje error";
        return;
      }

      msgCita.textContent = resp.mensaje || "Guardado correcto";
      msgCita.className = "mensaje ok";
      limpiarFormularioCita();
      listarCitas();
      cargarContador(urlCitas, "cntCitas");
    })
    .catch(function (error) {
      msgCita.textContent = error.message;
      msgCita.className = "mensaje error";
    });
});

formHistorial.addEventListener("submit", function (e) {
  e.preventDefault();

  const citaSeleccionada = citaHistorial.value === "" ? null : Number(citaHistorial.value);
  const data = {
    fecha: fechaHistorial.value,
    sintomas: sintomasHistorial.value,
    diagnostico: diagnosticoHistorial.value,
    observaciones: observacionesHistorial.value,
    mascota_id: Number(mascotaHistorial.value),
    veterinario_id: Number(veterinarioHistorial.value),
    cita_id: citaSeleccionada,
  };

  const metodo = idHistorialEditando ? "PUT" : "POST";
  const url = idHistorialEditando
    ? "http://localhost:8000/historial/" + idHistorialEditando
    : "http://localhost:8000/historial/";

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgHistorial.textContent = resp.detail;
        msgHistorial.className = "mensaje error";
        return;
      }

      msgHistorial.textContent = resp.mensaje || "Guardado correcto";
      msgHistorial.className = "mensaje ok";
      limpiarFormularioHistorial();
      listarHistorial();
    })
    .catch(function (error) {
      msgHistorial.textContent = error.message;
      msgHistorial.className = "mensaje error";
    });
});

formTratamiento.addEventListener("submit", function (e) {
  e.preventDefault();

  const fechaFin = fechaFinTratamiento.value === "" ? null : fechaFinTratamiento.value;
  const objetivo = objetivoTratamiento.value === "" ? null : objetivoTratamiento.value;
  const data = {
    nombre: nombreTratamiento.value,
    estado: estadoTratamiento.value,
    fecha_inicio: fechaInicioTratamiento.value,
    fecha_fin: fechaFin,
    objetivo: objetivo,
    historial_id: Number(historialTratamiento.value),
  };

  const metodo = idTratamientoEditando ? "PUT" : "POST";
  const url = idTratamientoEditando
    ? "http://localhost:8000/tratamientos/" + idTratamientoEditando
    : "http://localhost:8000/tratamientos/";

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgTratamiento.textContent = resp.detail;
        msgTratamiento.className = "mensaje error";
        return;
      }

      msgTratamiento.textContent = resp.mensaje || "Guardado correcto";
      msgTratamiento.className = "mensaje ok";
      limpiarFormularioTratamiento();
      listarTratamientos();
    })
    .catch(function (error) {
      msgTratamiento.textContent = error.message;
      msgTratamiento.className = "mensaje error";
    });
});

formUsuario.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    username: usernameUsuario.value,
    password_hash: passwordUsuario.value,
    activo: activoUsuario.checked,
    veterinario_id: Number(veterinarioUsuario.value),
  };

  const metodo = idUsuarioEditando ? "PUT" : "POST";
  const url = idUsuarioEditando ? urlUsuarios + idUsuarioEditando : urlUsuarios;

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgUsuario.textContent = resp.detail;
        msgUsuario.className = "mensaje error";
        return;
      }

      msgUsuario.textContent = resp.mensaje || "Guardado correcto";
      msgUsuario.className = "mensaje ok";
      limpiarFormularioUsuario();
      listarUsuarios();
      cargarContador(urlUsuarios, "cntUsuarios");
    })
    .catch(function (error) {
      msgUsuario.textContent = error.message;
      msgUsuario.className = "mensaje error";
    });
});

formControl.addEventListener("submit", function (e) {
  e.preventDefault();

  const observ = observacionesControl.value === "" ? null : observacionesControl.value;
  const data = {
    fecha_control: fechaControl.value,
    estado: estadoControl.value,
    observaciones: observ,
    tratamiento_id: Number(tratamientoControl.value),
  };

  const metodo = idControlEditando ? "PUT" : "POST";
  const url = idControlEditando
    ? "http://localhost:8000/control/" + idControlEditando
    : "http://localhost:8000/control/";

  fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      if (resp.detail) {
        msgControl.textContent = resp.detail;
        msgControl.className = "mensaje error";
        return;
      }

      msgControl.textContent = resp.mensaje || "Guardado correcto";
      msgControl.className = "mensaje ok";
      limpiarFormularioControl();
      listarControles();
    })
    .catch(function (error) {
      msgControl.textContent = error.message;
      msgControl.className = "mensaje error";
    });
});

btnCancelarEdicionDueno.addEventListener("click", function () {
  limpiarFormularioDueno();
  msgDueno.textContent = "";
  msgDueno.className = "mensaje";
});

btnCancelarMascota.addEventListener("click", function () {
  limpiarFormularioMascota();
  msgMascota.textContent = "";
  msgMascota.className = "mensaje";
});

btnCancelarVeterinario.addEventListener("click", function () {
  limpiarFormularioVeterinario();
  msgVeterinario.textContent = "";
  msgVeterinario.className = "mensaje";
});

btnCancelarCita.addEventListener("click", function () {
  limpiarFormularioCita();
  msgCita.textContent = "";
  msgCita.className = "mensaje";
});

btnCancelarHistorial.addEventListener("click", function () {
  limpiarFormularioHistorial();
  msgHistorial.textContent = "";
  msgHistorial.className = "mensaje";
});

btnCancelarTratamiento.addEventListener("click", function () {
  limpiarFormularioTratamiento();
  msgTratamiento.textContent = "";
  msgTratamiento.className = "mensaje";
});

btnCancelarUsuario.addEventListener("click", function () {
  limpiarFormularioUsuario();
  msgUsuario.textContent = "";
  msgUsuario.className = "mensaje";
});

btnCancelarControl.addEventListener("click", function () {
  limpiarFormularioControl();
  msgControl.textContent = "";
  msgControl.className = "mensaje";
});

btnReporteIndividual.addEventListener("click", function () {
  verReporteIndividual();
});

btnReporteGeneral.addEventListener("click", function () {
  verReporteGeneral();
});

cargarContador(urlPersonas, "cntPersonas");
cargarContador(urlMascotas, "cntMascotas");
cargarContador(urlVeterinarios, "cntVeterinarios");
cargarContador(urlCitas, "cntCitas");
cargarContador(urlUsuarios, "cntUsuarios");

cargarPersonasSelect();
cargarDuenosSelect();
cargarPersonasVeterinarioSelect();
cargarMascotasCitaSelect();
cargarVeterinariosCitaSelect();
cargarMascotasHistorialSelect();
cargarVeterinariosHistorialSelect();
cargarCitasHistorialSelect();
cargarHistorialTratamientoSelect();
cargarVeterinariosUsuarioSelect();
cargarTratamientosControlSelect();
cargarMascotasReporte();
listarPersonas();
listarDuenos();
listarMascotas();
listarVeterinarios();
listarCitas();
listarHistorial();
listarTratamientos();
listarUsuarios();
listarControles();
