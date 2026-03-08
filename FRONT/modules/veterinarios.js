window.VET_MODULES.push({
  key: "veterinarios",
  title: "Veterinarios",
  endpoint: "/veterinarios/",
  fields: [
    { name: "licencia", type: "text", required: true },
    { name: "especialidad", type: "text", required: true },
    { name: "activo", type: "checkbox", required: false, default: true },
    { name: "persona_id", type: "number", required: true },
  ],
});

