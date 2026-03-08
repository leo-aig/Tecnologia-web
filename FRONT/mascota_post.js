const url = "http://localhost:8000/mascotas/";
const formularioData = document.getElementById("formularioData");
const nombre = document.getElementById("nombre");
const especie = document.getElementById("especie");
const edad = document.getElementById("edad");
const sexo = document.getElementById("sexo");
const peso = document.getElementById("peso");
const talla = document.getElementById("talla");
const grupoSanguineo = document.getElementById("grupo_sanguineo");
const alergias = document.getElementById("alergias");
const antecedentes = document.getElementById("antecedentes");
const duenoId = document.getElementById("dueno_id");
const activo = document.getElementById("activo");

formularioData.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    especie: especie.value,
    edad: Number(edad.value),
    sexo: sexo.value,
    peso: Number(peso.value),
    talla: Number(talla.value),
    grupo_sanguineo: grupoSanguineo.value,
    alergias: alergias.value,
    antecedentes: antecedentes.value,
    activo: activo ? activo.checked : true,
    dueno_id: Number(duenoId.value),
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

