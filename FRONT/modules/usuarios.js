window.VET_MODULES.push({
  key: "usuarios",
  title: "Usuarios",
  endpoint: "/usuarios/",
  fields: [
    { name: "username", type: "text", required: true },
    { name: "password_hash", type: "text", required: true },
    { name: "activo", type: "checkbox", required: false, default: true },
    { name: "veterinario_id", type: "number", required: true },
  ],
});

