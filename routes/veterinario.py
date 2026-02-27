from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


class Veterinario(BaseModel):
    licencia: str
    especialidad: str | None = None
    activo: bool = True
    persona_id: int


@router.get("/")
async def listar_veterinarios(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, licencia, especialidad, activo, persona_id
        FROM veterinario
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado veterinario: {e}")
        raise HTTPException(status_code=400, detail="Error al listar veterinarios")


@router.get("/{id_veterinario}")
async def obtener_veterinario(id_veterinario: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, licencia, especialidad, activo, persona_id
        FROM veterinario
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_veterinario,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Veterinario no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener veterinario: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener veterinario")


@router.post("/")
async def insertar_veterinario(veterinario: Veterinario, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO veterinario (id, licencia, especialidad, activo, persona_id)
        VALUES (%s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1005)")
            await cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM veterinario")
            fila = await cursor.fetchone()
            nuevo_id = fila["nuevo_id"] if isinstance(fila, dict) else fila[0]
            parametros = (
                nuevo_id,
                veterinario.licencia,
                veterinario.especialidad,
                veterinario.activo,
                veterinario.persona_id,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Veterinario registrado exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar veterinario: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar veterinario")


@router.put("/{id_veterinario}")
async def actualizar_veterinario(id_veterinario: int, veterinario: Veterinario, conn=Depends(get_conexion)):
    consulta = """
        UPDATE veterinario
        SET licencia = %s, especialidad = %s, activo = %s, persona_id = %s
        WHERE id = %s
    """
    parametros = (
        veterinario.licencia,
        veterinario.especialidad,
        veterinario.activo,
        veterinario.persona_id,
        id_veterinario,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM veterinario WHERE id = %s", (id_veterinario,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Veterinario no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Veterinario actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar veterinario: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar veterinario")


@router.delete("/{id_veterinario}")
async def eliminar_veterinario(id_veterinario: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM veterinario WHERE id = %s", (id_veterinario,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Veterinario no encontrado")
            await cursor.execute("DELETE FROM veterinario WHERE id = %s", (id_veterinario,))
            await conn.commit()
            return {"mensaje": "Veterinario eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar veterinario: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar veterinario")
