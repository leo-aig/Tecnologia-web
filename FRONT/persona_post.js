const url = "http://localhost:8000/personas/";
const formularioData = document.getElementById("formularioData");
const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const ci = document.getElementById("ci");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const direccion = document.getElementById("direccion");
const activo = document.getElementById("activo");

formularioData.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nombres: nombres.value,
    apellidos: apellidos.value,
    ci: ci.value,
    telefono: telefono.value,
    email: email.value,
    direccion: direccion.value,
    activo: activo ? activo.checked : true,
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

