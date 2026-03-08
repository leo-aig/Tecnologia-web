window.VET_MODULES.push({
  key: "control",
  title: "Control Tratamiento",
  endpoint: "/control/",
  fields: [
    { name: "fecha_control", type: "date", required: true },
    { name: "estado", type: "text", required: true, default: "pendiente" },
    { name: "observaciones", type: "text", required: false },
    { name: "tratamiento_id", type: "number", required: true },
  ],
});

