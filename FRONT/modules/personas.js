window.VET_MODULES.push({
  key: "personas",
  title: "Personas",
  endpoint: "/personas/",
  fields: [
    { name: "nombres", type: "text", required: true },
    { name: "apellidos", type: "text", required: true },
    { name: "ci", type: "text", required: true },
    { name: "telefono", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "direccion", type: "text", required: true },
    { name: "activo", type: "checkbox", required: false, default: true },
  ],
});

