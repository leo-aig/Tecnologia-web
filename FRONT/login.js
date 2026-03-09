const url = "http://localhost:8000/usuarios/login";
const formulario = document.getElementById("formLogin");
const username = document.getElementById("username");
const password = document.getElementById("password");
const mensaje = document.getElementById("mensaje");
const boton = formulario.querySelector("button");

if (localStorage.getItem("sesion_veterinaria") === "ok") {
  window.location.href = "./dashboard.html";
}

const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.classList.remove("ok", "error");
  mensaje.classList.add(tipo);
};

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  username.classList.remove("input-error");
  password.classList.remove("input-error");

  const data = {
    username: username.value.trim(),
    password: password.value.trim(),
  };

  if (!data.username || !data.password) {
    if (!data.username) username.classList.add("input-error");
    if (!data.password) password.classList.add("input-error");
    mostrarMensaje("Completa usuario y contrasena.", "error");
    return;
  }

  boton.disabled = true;
  boton.textContent = "Validando...";

  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json().then((body) => ({ ok: response.ok, body })))
    .then((resultado) => {
      if (!resultado.ok) {
        username.classList.add("input-error");
        password.classList.add("input-error");
        mostrarMensaje(resultado.body.detail || "Login incorrecto.", "error");
        boton.disabled = false;
        boton.textContent = "Ingresar";
        return;
      }

      localStorage.setItem("sesion_veterinaria", "ok");
      localStorage.setItem("usuario_veterinaria", resultado.body.usuario.username);
      mostrarMensaje("Login correcto. Redirigiendo...", "ok");

      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 700);
    })
    .catch((error) => {
      mostrarMensaje(error.message, "error");
      boton.disabled = false;
      boton.textContent = "Ingresar";
    });
});
