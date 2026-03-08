from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


class Dueno(BaseModel):
    persona_id: int
    direccion: str | None = None
    nit: str | None = None
    activo: bool = True


@router.get("/")
async def listar_duenos(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, persona_id, direccion, nit, activo
        FROM dueno
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado dueño: {e}")
        raise HTTPException(status_code=400, detail="Error al listar dueños")


@router.get("/{id_dueno}")
async def obtener_dueno(id_dueno: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, persona_id, direccion, nit, activo
        FROM dueno
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_dueno,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Dueño no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener dueño: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener dueño")


@router.post("/")
async def insertar_dueno(dueno: Dueno, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO dueno (id, persona_id, direccion, nit, activo)
        VALUES (%s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1009)")
            await cursor.execute("SELECT id FROM dueno ORDER BY id DESC LIMIT 1")
            fila = await cursor.fetchone()
            ultimo_id = (fila["id"] if isinstance(fila, dict) else fila[0]) if fila else 0
            nuevo_id = ultimo_id + 1
            parametros = (
                nuevo_id,
                dueno.persona_id,
                dueno.direccion,
                dueno.nit,
                dueno.activo,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Dueño registrado exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar dueño: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar dueño")


@router.put("/{id_dueno}")
async def actualizar_dueno(id_dueno: int, dueno: Dueno, conn=Depends(get_conexion)):
    consulta = """
        UPDATE dueno
        SET persona_id = %s, direccion = %s, nit = %s, activo = %s
        WHERE id = %s
    """
    parametros = (
        dueno.persona_id,
        dueno.direccion,
        dueno.nit,
        dueno.activo,
        id_dueno,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM dueno WHERE id = %s", (id_dueno,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Dueño no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Dueño actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar dueño: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar dueño")


@router.delete("/{id_dueno}")
async def eliminar_dueno(id_dueno: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM dueno WHERE id = %s", (id_dueno,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Dueño no encontrado")
            await cursor.execute("DELETE FROM dueno WHERE id = %s", (id_dueno,))
            await conn.commit()
            return {"mensaje": "Dueño eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar dueño: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar dueño")
