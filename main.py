from fastapi import FastAPI
from config.conexionDB import app
from routes import cita, control_tratamiento, historial_clinico, mascota, persona, tratamiento, usuario, veterinario


app.include_router(persona.router, prefix="/personas")
app.include_router(usuario.router, prefix="/usuarios")
app.include_router(mascota.router, prefix="/mascotas")
app.include_router(cita.router, prefix="/citas")
app.include_router(veterinario.router, prefix="/veterinarios")
app.include_router(historial_clinico.router, prefix="/historial")
app.include_router(control_tratamiento.router, prefix="/control")
app.include_router(tratamiento.router, prefix="/tratamientos")


@app.get("/")
async def root():
    return {"mensaje": "API Veterinaria en funcionamiento"}
