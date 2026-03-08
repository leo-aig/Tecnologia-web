const url = "http://localhost:8000/citas/";
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
        <p>fecha_hora ${datos[i].fecha_hora}</p>
        <p>motivo ${datos[i].motivo}</p>
        <p>prioridad ${datos[i].prioridad}</p>
        <p>estado ${datos[i].estado}</p>
        <p>observaciones ${datos[i].observaciones}</p>
        <p>mascota_id ${datos[i].mascota_id}</p>
        <p>veterinario_id ${datos[i].veterinario_id}</p>
      </li>`;
  }
  contenedor.innerHTML = resultado;
};

