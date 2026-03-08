window.VET_MODULES.push({
  key: "citas",
  title: "Citas",
  endpoint: "/citas/",
  fields: [
    { name: "fecha_hora", type: "datetime-local", required: true },
    { name: "motivo", type: "text", required: true },
    { name: "prioridad", type: "text", required: true },
    { name: "estado", type: "text", required: true },
    { name: "observaciones", type: "text", required: true },
    { name: "mascota_id", type: "number", required: true },
    { name: "veterinario_id", type: "number", required: true },
  ],
});

