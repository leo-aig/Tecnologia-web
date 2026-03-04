from fastapi import APIRouter, Depends, HTTPException

from config.conexionDB import get_conexion

router = APIRouter()


@router.get("/general")
async def reporte_general(conn=Depends(get_conexion)):
    consulta = """
        SELECT
            v.id AS veterinario_id,
            p.nombres || ' ' || p.apellidos AS veterinario,
            COUNT(c.id) AS total_citas,
            COUNT(*) FILTER (WHERE c.estado = 'pendiente') AS citas_pendientes,
            COUNT(*) FILTER (WHERE c.estado = 'completada') AS citas_completadas,
            COUNT(*) FILTER (WHERE c.estado = 'cancelada') AS citas_canceladas,
            MIN(c.fecha_hora) AS primera_cita,
            MAX(c.fecha_hora) AS ultima_cita
        FROM veterinario v
        JOIN persona p ON p.id = v.persona_id
        LEFT JOIN cita c ON c.veterinario_id = v.id
        GROUP BY v.id, p.nombres, p.apellidos
        ORDER BY veterinario
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(consulta)
            return await cursor.fetchall()
    except Exception as e:
        print(f"Error reporte general: {e}")
        raise HTTPException(status_code=400, detail="Error al generar reporte general")


@router.get("/veterinario/{id_veterinario}")
async def reporte_individual(id_veterinario: int, conn=Depends(get_conexion)):
    consulta = """
        SELECT
            c.id AS cita_id,
            c.fecha_hora,
            c.estado,
            c.prioridad,
            c.motivo,
            m.id AS mascota_id,
            m.nombre AS mascota
        FROM cita c
        JOIN mascota m ON m.id = c.mascota_id
        WHERE c.veterinario_id = %s
        ORDER BY c.fecha_hora DESC
    """
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id FROM veterinario WHERE id = %s", (id_veterinario,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Veterinario no encontrado")
            await cursor.execute(consulta, (id_veterinario,))
            return await cursor.fetchall()
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error reporte individual: {e}")
        raise HTTPException(status_code=400, detail="Error al generar reporte individual")
