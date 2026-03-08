window.VET_MODULES.push({
  key: "mascotas",
  title: "Mascotas",
  endpoint: "/mascotas/",
  fields: [
    { name: "nombre", type: "text", required: true },
    { name: "especie", type: "text", required: true },
    { name: "edad", type: "number", required: true },
    { name: "sexo", type: "text", required: true },
    { name: "peso", type: "number", required: true, step: "0.01" },
    { name: "talla", type: "number", required: true, step: "0.01" },
    { name: "grupo_sanguineo", type: "text", required: true },
    { name: "alergias", type: "text", required: true },
    { name: "antecedentes", type: "text", required: true },
    { name: "activo", type: "checkbox", required: false, default: true },
    { name: "dueno_id", type: "number", required: true },
  ],
});

