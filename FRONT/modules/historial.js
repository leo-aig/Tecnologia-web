window.VET_MODULES.push({
  key: "historial",
  title: "Historial Clinico",
  endpoint: "/historial/",
  fields: [
    { name: "fecha", type: "date", required: true },
    { name: "sintomas", type: "text", required: false },
    { name: "diagnostico", type: "text", required: false },
    { name: "observaciones", type: "text", required: false },
    { name: "mascota_id", type: "number", required: true },
    { name: "veterinario_id", type: "number", required: true },
    { name: "cita_id", type: "number", required: false },
  ],
});

