from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config.conexionDB import app
from routes import cita, mascota, persona, usuario, veterinario, control_tratamiento, tratamiento, historial_clinico, reportes, dueno

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/front", StaticFiles(directory="FRONT"), name="front")


app.include_router(persona.router, prefix="/personas")
app.include_router(usuario.router, prefix="/usuarios")
app.include_router(mascota.router, prefix="/mascotas")
app.include_router(cita.router, prefix="/citas")
app.include_router(veterinario.router, prefix="/veterinarios")
app.include_router(historial_clinico.router, prefix="/historial")
app.include_router(control_tratamiento.router, prefix="/control")
app.include_router(tratamiento.router, prefix="/tratamientos")
app.include_router(reportes.router, prefix="/reportes")
app.include_router(dueno.router, prefix="/duenos")


@app.get("/")
async def root():
    return {"mensaje": "API Veterinaria en funcionamiento", "front": "http://localhost:8000/front/login.html"}
