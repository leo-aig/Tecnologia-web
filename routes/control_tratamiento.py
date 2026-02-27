from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from datetime import date

from config.conexionDB import get_conexion

router = APIRouter()


class ControlTratamiento(BaseModel):
    fecha_control: date
    estado: str = "pendiente"
    observaciones: str | None = None
    tratamiento_id: int


@router.get("/")
async def listar_controles(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha_control, estado, observaciones, tratamiento_id
        FROM control_tratamiento
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado control: {e}")
        raise HTTPException(status_code=400, detail="Error al listar controles")


@router.get("/{id_control}")
async def obtener_control(id_control: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, fecha_control, estado, observaciones, tratamiento_id
        FROM control_tratamiento
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_control,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Control no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener control: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener control")


@router.post("/")
async def insertar_control(control: ControlTratamiento, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO control_tratamiento
        (fecha_control, estado, observaciones, tratamiento_id)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """
    parametros = (
        control.fecha_control,
        control.estado,
        control.observaciones,
        control.tratamiento_id,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, parametros)
            nuevo = await cursor.fetchone()
            await conn.commit()
            return {"mensaje": "Control registrado", "id": nuevo["id"]}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar control: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar control")


@router.put("/{id_control}")
async def actualizar_control(id_control: int, control: ControlTratamiento, conn=Depends(get_conexion)):
    consulta = """
        UPDATE control_tratamiento
        SET fecha_control = %s, estado = %s, observaciones = %s, tratamiento_id = %s
        WHERE id = %s
    """
    parametros = (
        control.fecha_control,
        control.estado,
        control.observaciones,
        control.tratamiento_id,
        id_control,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM control_tratamiento WHERE id = %s", (id_control,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Control no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Control actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar control: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar control")


@router.delete("/{id_control}")
async def eliminar_control(id_control: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM control_tratamiento WHERE id = %s", (id_control,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Control no encontrado")
            await cursor.execute("DELETE FROM control_tratamiento WHERE id = %s", (id_control,))
            await conn.commit()
            return {"mensaje": "Control eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar control: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar control")