from fastapi import FastAPI
from config.conexionDB import app
from config.conexionDB import lifespan
from routes import cita, mascota, persona, usuario


app.include_router(persona.router, prefix="/personas")
app.include_router(usuario.router, prefix="/usuarios")
app.include_router(mascota.router, prefix="/mascotas")
app.include_router(cita.router, prefix="/citas")


@app.get("/")
async def root():
    return {"mensaje": "API Veterinaria en funcionamiento"}
