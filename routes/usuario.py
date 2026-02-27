from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


class Usuario(BaseModel):
    username: str
    password_hash: str
    rol: str = "veterinario"
    activo: bool = True
    persona_id: int


@router.get("/")
async def listar_usuarios(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, username, password_hash, rol, activo, persona_id
        FROM usuario
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado usuario: {e}")
        raise HTTPException(status_code=400, detail="Error al listar usuarios")


@router.get("/{id_usuario}")
async def obtener_usuario(id_usuario: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, username, password_hash, rol, activo, persona_id
        FROM usuario
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_usuario,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener usuario: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener usuario")


@router.post("/")
async def insertar_usuario(usuario: Usuario, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO usuario (id, username, password_hash, rol, activo, persona_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1004)")
            await cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM usuario")
            fila = await cursor.fetchone()
            nuevo_id = fila["nuevo_id"] if isinstance(fila, dict) else fila[0]
            parametros = (
                nuevo_id,
                usuario.username,
                usuario.password_hash,
                usuario.rol,
                usuario.activo,
                usuario.persona_id,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Usuario registrado exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar usuario: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar usuario")


@router.put("/{id_usuario}")
async def actualizar_usuario(id_usuario: int, usuario: Usuario, conn=Depends(get_conexion)):
    consulta = """
        UPDATE usuario
        SET username = %s, password_hash = %s, rol = %s, activo = %s, persona_id = %s
        WHERE id = %s
    """
    parametros = (
        usuario.username,
        usuario.password_hash,
        usuario.rol,
        usuario.activo,
        usuario.persona_id,
        id_usuario,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM usuario WHERE id = %s", (id_usuario,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Usuario actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar usuario: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar usuario")


@router.delete("/{id_usuario}")
async def eliminar_usuario(id_usuario: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM usuario WHERE id = %s", (id_usuario,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            await cursor.execute("DELETE FROM usuario WHERE id = %s", (id_usuario,))
            await conn.commit()
            return {"mensaje": "Usuario eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar usuario: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar usuario")
