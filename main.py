from fastapi import FastAPI
from config.conexionDB import app
from routes import cita, mascota, persona, usuario, veterinario, control_tratamiento, tratamiento, historial_clinico


app.include_router(persona.router, prefix="/personas")
app.include_router(usuario.router, prefix="/usuarios")
app.include_router(mascota.router, prefix="/mascotas")
app.include_router(cita.router, prefix="/citas")
app.include_router(veterinario.router, prefix="/veterinario")
app.include_router(historial_clinico.router, prefix="/historial")
app.include_router(tratamiento.router, prefix="/tratamiento")
app.include_router(control_tratamiento.router, prefix="/control")


@app.get("/")
async def root():
    return {"mensaje": "API Veterinaria en funcionamiento"}
