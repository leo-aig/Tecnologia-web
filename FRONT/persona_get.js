const url = "http://localhost:8000/personas/";
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
        <p>nombres ${datos[i].nombres}</p>
        <p>apellidos ${datos[i].apellidos}</p>
        <p>ci ${datos[i].ci}</p>
        <p>telefono ${datos[i].telefono}</p>
        <p>email ${datos[i].email}</p>
        <p>direccion ${datos[i].direccion}</p>
        <p>activo ${datos[i].activo}</p>
      </li>`;
  }
  contenedor.innerHTML = resultado;
};

