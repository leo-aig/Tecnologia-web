from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from datetime import date

from config.conexionDB import get_conexion

router = APIRouter()


class HistorialClinico(BaseModel):
    fecha: date
    sintomas: str | None = None
    diagnostico: str | None = None
    observaciones: str | None = None
    mascota_id: int
    veterinario_id: int
    cita_id: int | None = None


@router.get("/")
async def listar_historial(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha, sintomas, diagnostico, observaciones,
               mascota_id, veterinario_id, cita_id
        FROM historial_clinico
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado historial: {e}")
        raise HTTPException(status_code=400, detail="Error al listar historial clínico")


@router.get("/{id_historial}")
async def obtener_historial(id_historial: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha, sintomas, diagnostico, observaciones,
               mascota_id, veterinario_id, cita_id
        FROM historial_clinico
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_historial,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Historial no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener historial: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener historial clínico")


@router.post("/")
async def insertar_historial(historial: HistorialClinico, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO historial_clinico
        (fecha, sintomas, diagnostico, observaciones, mascota_id, veterinario_id, cita_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    parametros = (
        historial.fecha,
        historial.sintomas,
        historial.diagnostico,
        historial.observaciones,
        historial.mascota_id,
        historial.veterinario_id,
        historial.cita_id,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, parametros)
            nuevo = await cursor.fetchone()
            await conn.commit()
            return {"mensaje": "Historial clínico registrado", "id": nuevo["id"]}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar historial: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar historial clínico")


@router.put("/{id_historial}")
async def actualizar_historial(id_historial: int, historial: HistorialClinico, conn=Depends(get_conexion)):
    consulta = """
        UPDATE historial_clinico
        SET fecha = %s, sintomas = %s, diagnostico = %s, observaciones = %s,
            mascota_id = %s, veterinario_id = %s, cita_id = %s
        WHERE id = %s
    """
    parametros = (
        historial.fecha,
        historial.sintomas,
        historial.diagnostico,
        historial.observaciones,
        historial.mascota_id,
        historial.veterinario_id,
        historial.cita_id,
        id_historial,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM historial_clinico WHERE id = %s", (id_historial,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Historial no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Historial actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar historial: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar historial clínico")


@router.delete("/{id_historial}")
async def eliminar_historial(id_historial: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM historial_clinico WHERE id = %s", (id_historial,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Historial no encontrado")
            await cursor.execute("DELETE FROM historial_clinico WHERE id = %s", (id_historial,))
            await conn.commit()
            return {"mensaje": "Historial eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar historial: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar historial clínico")