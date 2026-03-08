window.VET_MODULES.push({
  key: "tratamientos",
  title: "Tratamientos",
  endpoint: "/tratamientos/",
  fields: [
    { name: "nombre", type: "text", required: true },
    { name: "estado", type: "text", required: true, default: "activo" },
    { name: "fecha_inicio", type: "date", required: true },
    { name: "fecha_fin", type: "date", required: false },
    { name: "objetivo", type: "text", required: false },
    { name: "historial_id", type: "number", required: true },
  ],
});

