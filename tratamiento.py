from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from datetime import date

from config.conexionDB import get_conexion

router = APIRouter()


class Tratamiento(BaseModel):
    nombre: str
    estado: str = "activo"
    fecha_inicio: date
    fecha_fin: date | None = None
    objetivo: str | None = None
    historial_id: int


@router.get("/")
async def listar_tratamientos(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombre, estado, fecha_inicio, fecha_fin, objetivo, historial_id
        FROM tratamiento
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado tratamiento: {e}")
        raise HTTPException(status_code=400, detail="Error al listar tratamientos")


@router.get("/{id_tratamiento}")
async def obtener_tratamiento(id_tratamiento: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombre, estado, fecha_inicio, fecha_fin, objetivo, historial_id
        FROM tratamiento
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_tratamiento,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener tratamiento: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener tratamiento")


@router.post("/")
async def insertar_tratamiento(tratamiento: Tratamiento, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO tratamiento
        (nombre, estado, fecha_inicio, fecha_fin, objetivo, historial_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    parametros = (
        tratamiento.nombre,
        tratamiento.estado,
        tratamiento.fecha_inicio,
        tratamiento.fecha_fin,
        tratamiento.objetivo,
        tratamiento.historial_id,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, parametros)
            nuevo = await cursor.fetchone()
            await conn.commit()
            return {"mensaje": "Tratamiento registrado", "id": nuevo["id"]}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar tratamiento: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar tratamiento")


@router.put("/{id_tratamiento}")
async def actualizar_tratamiento(id_tratamiento: int, tratamiento: Tratamiento, conn=Depends(get_conexion)):
    consulta = """
        UPDATE tratamiento
        SET nombre = %s, estado = %s, fecha_inicio = %s, fecha_fin = %s,
            objetivo = %s, historial_id = %s
        WHERE id = %s
    """
    parametros = (
        tratamiento.nombre,
        tratamiento.estado,
        tratamiento.fecha_inicio,
        tratamiento.fecha_fin,
        tratamiento.objetivo,
        tratamiento.historial_id,
        id_tratamiento,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM tratamiento WHERE id = %s", (id_tratamiento,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Tratamiento actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar tratamiento: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar tratamiento")


@router.delete("/{id_tratamiento}")
async def eliminar_tratamiento(id_tratamiento: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM tratamiento WHERE id = %s", (id_tratamiento,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
            await cursor.execute("DELETE FROM tratamiento WHERE id = %s", (id_tratamiento,))
            await conn.commit()
            return {"mensaje": "Tratamiento eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar tratamiento: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar tratamiento")