const url = "http://localhost:8000/citas/";
const formularioData = document.getElementById("formularioData");
const fechaHora = document.getElementById("fecha_hora");
const motivo = document.getElementById("motivo");
const prioridad = document.getElementById("prioridad");
const estado = document.getElementById("estado");
const observaciones = document.getElementById("observaciones");
const mascotaId = document.getElementById("mascota_id");
const veterinarioId = document.getElementById("veterinario_id");

formularioData.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    fecha_hora: fechaHora.value,
    motivo: motivo.value,
    prioridad: prioridad.value,
    estado: estado.value,
    observaciones: observaciones.value,
    mascota_id: Number(mascotaId.value),
    veterinario_id: Number(veterinarioId.value),
  };

  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((respuesta) => {
      console.log(respuesta);
      formularioData.reset();
    })
    .catch((error) => {
      console.log(error.message);
    });
});

