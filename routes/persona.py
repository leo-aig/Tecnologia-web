from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


class Persona(BaseModel):
    nombres: str
    apellidos: str
    ci: str
    telefono: str
    email: str
    direccion: str 
    activo: bool


@router.get("/")
async def listar_personas(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombres, apellidos, ci, telefono, email, direccion, activo
        FROM persona
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado persona: {e}")
        raise HTTPException(status_code=400, detail="Error al listar personas")


@router.get("/{id_persona}")
async def obtener_persona(id_persona: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombres, apellidos, ci, telefono, email, direccion, activo
        FROM persona
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_persona,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Persona no encontrada")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener persona: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener persona")


@router.post("/")
async def insertar_persona(persona: Persona, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO persona (id, nombres, apellidos, ci, telefono, email, direccion, activo)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1001)")
            await cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM persona")
            fila = await cursor.fetchone()
            nuevo_id = fila["nuevo_id"] if isinstance(fila, dict) else fila[0]
            parametros = (
                nuevo_id,
                persona.nombres,
                persona.apellidos,
                persona.ci,
                persona.telefono,
                persona.email,
                persona.direccion,
                persona.activo,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Persona registrada exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar persona: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar persona")


@router.put("/{id_persona}")
async def actualizar_persona(id_persona: int, persona: Persona, conn=Depends(get_conexion)):
    consulta = """
        UPDATE persona
        SET nombres = %s, apellidos = %s, ci = %s, telefono = %s, email = %s, direccion = %s, activo = %s
        WHERE id = %s
    """
    parametros = (
        persona.nombres,
        persona.apellidos,
        persona.ci,
        persona.telefono,
        persona.email,
        persona.direccion,
        persona.activo,
        id_persona,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM persona WHERE id = %s", (id_persona,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Persona no encontrada")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Persona actualizada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar persona: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar persona")


@router.delete("/{id_persona}")
async def eliminar_persona(id_persona: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM persona WHERE id = %s", (id_persona,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Persona no encontrada")
            await cursor.execute("DELETE FROM persona WHERE id = %s", (id_persona,))
            await conn.commit()
            return {"mensaje": "Persona eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar persona: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar persona")
