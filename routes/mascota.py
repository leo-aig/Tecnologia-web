from decimal import Decimal

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


class Mascota(BaseModel):
    nombre: str
    especie: str
    raza: str | None = None
    edad: int | None = None
    sexo: str | None = None
    peso: Decimal | None = None
    talla: Decimal | None = None
    grupo_sanguineo: str | None = None
    alergias: str | None = None
    antecedentes: str | None = None
    activo: bool = True
    dueno_persona_id: int


@router.get("/")
async def listar_mascotas(conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombre, especie, raza, edad, sexo, peso, talla, grupo_sanguineo,
               alergias, antecedentes, activo, dueno_persona_id
        FROM mascota
        ORDER BY id
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error listado mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al listar mascotas")


@router.get("/{id_mascota}")
async def obtener_mascota(id_mascota: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT id, nombre, especie, raza, edad, sexo, peso, talla, grupo_sanguineo,
               alergias, antecedentes, activo, dueno_persona_id
        FROM mascota
        WHERE id = %s
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta, (id_mascota,))
            fila = await cursor.fetchone()
            if not fila:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")
            return fila
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obtener mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al obtener mascota")


@router.post("/")
async def insertar_mascota(mascota: Mascota, conn=Depends(get_conexion)):
    consulta = """
        INSERT INTO mascota (
            id, nombre, especie, raza, edad, sexo, peso, talla, grupo_sanguineo,
            alergias, antecedentes, activo, dueno_persona_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT pg_advisory_xact_lock(1003)")
            await cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM mascota")
            fila = await cursor.fetchone()
            nuevo_id = fila["nuevo_id"] if isinstance(fila, dict) else fila[0]
            parametros = (
                nuevo_id,
                mascota.nombre,
                mascota.especie,
                mascota.raza,
                mascota.edad,
                mascota.sexo,
                mascota.peso,
                mascota.talla,
                mascota.grupo_sanguineo,
                mascota.alergias,
                mascota.antecedentes,
                mascota.activo,
                mascota.dueno_persona_id,
            )
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Mascota registrada exitosamente"}
    except Exception as e:
        await conn.rollback()
        print(f"Error insertar mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al insertar mascota")


@router.put("/{id_mascota}")
async def actualizar_mascota(id_mascota: int, mascota: Mascota, conn=Depends(get_conexion)):
    consulta = """
        UPDATE mascota
        SET nombre = %s, especie = %s, raza = %s, edad = %s, sexo = %s, peso = %s, talla = %s,
            grupo_sanguineo = %s, alergias = %s, antecedentes = %s, activo = %s, dueno_persona_id = %s
        WHERE id = %s
    """
    parametros = (
        mascota.nombre,
        mascota.especie,
        mascota.raza,
        mascota.edad,
        mascota.sexo,
        mascota.peso,
        mascota.talla,
        mascota.grupo_sanguineo,
        mascota.alergias,
        mascota.antecedentes,
        mascota.activo,
        mascota.dueno_persona_id,
        id_mascota,
    )
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM mascota WHERE id = %s", (id_mascota,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")
            await cursor.execute(consulta, parametros)
            await conn.commit()
            return {"mensaje": "Mascota actualizada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error actualizar mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al actualizar mascota")


@router.delete("/{id_mascota}")
async def eliminar_mascota(id_mascota: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM mascota WHERE id = %s", (id_mascota,))
            existe = await cursor.fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")
            await cursor.execute("DELETE FROM mascota WHERE id = %s", (id_mascota,))
            await conn.commit()
            return {"mensaje": "Mascota eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        await conn.rollback()
        print(f"Error eliminar mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al eliminar mascota")
