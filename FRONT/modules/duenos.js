window.VET_MODULES.push({
  key: "duenos",
  title: "Duenos",
  endpoint: "/duenos/",
  fields: [
    { name: "persona_id", type: "number", required: true },
    { name: "direccion", type: "text", required: false },
    { name: "nit", type: "text", required: false },
    { name: "activo", type: "checkbox", required: false, default: true },
  ],
});

