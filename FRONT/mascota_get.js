const url = "http://localhost:8000/mascotas/";
const contenedor = document.getElementById("data");

fetch(url, {
  method: "GET",
  headers: { "content-type": "application/json" },
})
  .then((response) => response.json())
  .then((data) => {
    CargaData(data);
    console.log(data);
  })
  .catch((error) => {
    console.log(error.message);
  });

const CargaData = (datos) => {
  let resultado = "";
  for (let i = 0; i < datos.length; i++) {
    resultado += `
      <li>
        <p>id ${datos[i].id}</p>
        <p>nombre ${datos[i].nombre}</p>
        <p>especie ${datos[i].especie}</p>
        <p>edad ${datos[i].edad}</p>
        <p>sexo ${datos[i].sexo}</p>
        <p>peso ${datos[i].peso}</p>
        <p>talla ${datos[i].talla}</p>
        <p>grupo sanguineo ${datos[i].grupo_sanguineo}</p>
        <p>alergias ${datos[i].alergias}</p>
        <p>antecedentes ${datos[i].antecedentes}</p>
        <p>activo ${datos[i].activo}</p>
        <p>dueno_id ${datos[i].dueno_id}</p>
      </li>`;
  }
  contenedor.innerHTML = resultado;
};

