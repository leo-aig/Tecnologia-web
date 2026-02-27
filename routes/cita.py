from datetime import datetime

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()
print("Router de citas creado")

class Cita(BaseModel):
    fecha_hora: datetime
    motivo: str
    prioridad: str 
    estado: str 
    observaciones: str 
    mascota_id: int
    veterinario_id: int


@router.get("/")
async def listar_citas(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha_hora, motivo, prioridad, estado, observaciones, mascota_id, veterinario_id
        FROM cita
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado cita: {e}")
        raise HTTPException(status_code=400, detail="Error al listar citas")


@router.get("/{id_cita}")
async def obtener_cita(id_cita: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha_hora, motivo, prioridad, estado, observaciones, mascota_id, veterinario_id
        FROM cita
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_cita,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Cita no encontrada")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener cita: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener cita")


@router.post("/")
async def insertar_cita(cita: Cita, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO cita (id, fecha_hora, motivo, prioridad, estado, observaciones, mascota_id, veterinario_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1002)")
            await cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM cita")
            fila = await cursor.fetchone()
            nuevo_id = fila["nuevo_id"] if isinstance(fila, dict) else fila[0]
            parametros = (
                nuevo_id,
                cita.fecha_hora,
                cita.motivo,
                cita.prioridad,
                cita.estado,
                cita.observaciones,
                cita.mascota_id,
                cita.veterinario_id,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Cita registrada exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar cita: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar cita")


@router.put("/{id_cita}")
async def actualizar_cita(id_cita: int, cita: Cita, conn=Depends(get_conexion)):
    consulta = """
        UPDATE cita
        SET fecha_hora = %s, motivo = %s, prioridad = %s, estado = %s, observaciones = %s,
            mascota_id = %s, veterinario_id = %s
        WHERE id = %s
    """
    parametros = (
        cita.fecha_hora,
        cita.motivo,
        cita.prioridad,
        cita.estado,
        cita.observaciones,
        cita.mascota_id,
        cita.veterinario_id,
        id_cita,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM cita WHERE id = %s", (id_cita,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Cita no encontrada")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Cita actualizada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar cita: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar cita")


@router.delete("/{id_cita}")
async def eliminar_cita(id_cita: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM cita WHERE id = %s", (id_cita,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Cita no encontrada")
            await cursor.execute("DELETE FROM cita WHERE id = %s", (id_cita,))
            await conn.commit()
            return {"mensaje": "Cita eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar cita: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar cita")
