from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from config.conexionDB import get_conexion

router = APIRouter()


async def _obtener_columna_fecha_mascota(cursor) -> str | None:
    await cursor.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'mascota'
          AND column_name IN ('fecha_registro', 'fecha_creacion', 'created_at')
        ORDER BY CASE column_name
            WHEN 'fecha_registro' THEN 1
            WHEN 'fecha_creacion' THEN 2
            WHEN 'created_at' THEN 3
            ELSE 99
        END
        LIMIT 1
        """
    )
    fila = await cursor.fetchone()
    return fila["column_name"] if fila else None


@router.get("/individual/{id_mascota}")
async def reporte_individual(id_mascota: int, conn=Depends(get_conexion)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                SELECT
                    m.id AS mascota_id,
                    m.nombre AS mascota_nombre,
                    m.especie,
                    m.edad,
                    NULL::text AS raza,
                    d.id AS dueno_id,
                    d.persona_id AS dueno_persona_id,
                    p.nombres AS dueno_nombres,
                    p.apellidos AS dueno_apellidos,
                    p.telefono AS dueno_telefono,
                    p.email AS dueno_email
                FROM mascota m
                LEFT JOIN dueno d ON d.id = m.dueno_id
                LEFT JOIN persona p ON p.id = d.persona_id
                WHERE m.id = %s
                """,
                (id_mascota,),
            )
            perfil = await cursor.fetchone()
            if not perfil:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")

            await cursor.execute(
                """
                SELECT
                    c.id AS cita_id,
                    c.fecha_hora,
                    c.motivo,
                    c.estado,
                    c.prioridad,
                    c.observaciones,
                    c.veterinario_id
                FROM cita c
                WHERE c.mascota_id = %s
                ORDER BY c.fecha_hora DESC
                """,
                (id_mascota,),
            )
            historial_citas = await cursor.fetchall()

            await cursor.execute(
                """
                SELECT
                    h.id AS historial_id,
                    h.fecha,
                    h.sintomas,
                    h.diagnostico,
                    h.observaciones,
                    h.veterinario_id,
                    h.cita_id
                FROM historial_clinico h
                WHERE h.mascota_id = %s
                ORDER BY h.fecha DESC, h.id DESC
                """,
                (id_mascota,),
            )
            resumen_clinico = await cursor.fetchall()

            await cursor.execute(
                """
                SELECT
                    t.id AS tratamiento_id,
                    t.nombre AS medicamento,
                    t.objetivo AS dosis,
                    t.estado AS estado_tratamiento,
                    t.fecha_inicio,
                    t.fecha_fin,
                    ct.id AS control_id,
                    ct.fecha_control,
                    ct.estado AS estado_control,
                    ct.observaciones AS observaciones_control
                FROM historial_clinico h
                JOIN tratamiento t ON t.historial_id = h.id
                LEFT JOIN control_tratamiento ct ON ct.tratamiento_id = t.id
                WHERE h.mascota_id = %s
                ORDER BY t.id, ct.fecha_control NULLS LAST, ct.id NULLS LAST
                """,
                (id_mascota,),
            )
            control_tratamientos = await cursor.fetchall()

            return {
                "perfil_paciente": {
                    "mascota_id": perfil["mascota_id"],
                    "nombre": perfil["mascota_nombre"],
                    "especie": perfil["especie"],
                    "raza": perfil["raza"],
                    "edad": perfil["edad"],
                },
                "informacion_propietario": {
                    "dueno_id": perfil["dueno_id"],
                    "persona_id": perfil["dueno_persona_id"],
                    "nombre_completo": f'{(perfil["dueno_nombres"] or "").strip()} {(perfil["dueno_apellidos"] or "").strip()}'.strip(),
                    "telefono": perfil["dueno_telefono"],
                    "email": perfil["dueno_email"],
                },
                "historial_citas": historial_citas,
                "resumen_clinico": resumen_clinico,
                "control_tratamientos": control_tratamientos,
                "observacion": "El campo raza no existe en el modelo actual de mascota, por eso se devuelve null.",
            }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error reporte individual mascota: {e}")
        raise HTTPException(status_code=400, detail="Error al generar reporte individual")


@router.get("/general")
async def reporte_general(
    fecha_inicio: date | None = Query(default=None),
    fecha_fin: date | None = Query(default=None),
    conn=Depends(get_conexion),
):
    filtro_rango = ""
    parametros: list = []
    if fecha_inicio is not None and fecha_fin is not None:
        filtro_rango = "WHERE c.fecha_hora::date BETWEEN %s AND %s"
        parametros = [fecha_inicio, fecha_fin]
    elif fecha_inicio is not None:
        filtro_rango = "WHERE c.fecha_hora::date >= %s"
        parametros = [fecha_inicio]
    elif fecha_fin is not None:
        filtro_rango = "WHERE c.fecha_hora::date <= %s"
        parametros = [fecha_fin]

    try:
        async with conn.cursor() as cursor:
            await cursor.execute(
                f"""
                SELECT
                    COUNT(*) AS total_citas,
                    COUNT(*) FILTER (WHERE LOWER(c.estado) IN ('completada', 'completado', 'atendida', 'finalizada')) AS citas_completadas,
                    COUNT(*) FILTER (WHERE LOWER(c.estado) = 'cancelada') AS citas_canceladas
                FROM cita c
                {filtro_rango}
                """,
                tuple(parametros),
            )
            estadisticas_citas = await cursor.fetchone()

            condicion_join_citas = ""
            if filtro_rango:
                condicion_join_citas = f" AND {filtro_rango.replace('WHERE ', '')}"
            await cursor.execute(
                f"""
                SELECT
                    v.id AS veterinario_id,
                    p.nombres,
                    p.apellidos,
                    COUNT(c.id) AS total_consultas
                FROM veterinario v
                LEFT JOIN persona p ON p.id = v.persona_id
                LEFT JOIN cita c ON c.veterinario_id = v.id {condicion_join_citas}
                GROUP BY v.id, p.nombres, p.apellidos
                ORDER BY total_consultas DESC, v.id
                """,
                tuple(parametros),
            )
            productividad_personal = await cursor.fetchall()

            columna_fecha_mascota = await _obtener_columna_fecha_mascota(cursor)
            nuevas_mascotas_mes = None
            observacion_mascotas = None
            if columna_fecha_mascota:
                await cursor.execute(
                    f"""
                    SELECT COUNT(*) AS total
                    FROM mascota
                    WHERE DATE_TRUNC('month', {columna_fecha_mascota}::timestamp) = DATE_TRUNC('month', CURRENT_DATE)
                    """
                )
                fila_mes = await cursor.fetchone()
                nuevas_mascotas_mes = fila_mes["total"] if fila_mes else 0
            else:
                observacion_mascotas = (
                    "No existe columna de fecha de registro en mascota "
                    "(fecha_registro/fecha_creacion/created_at)."
                )

            await cursor.execute(
                f"""
                SELECT
                    m.especie,
                    COUNT(*) AS total,
                    ROUND(100.0 * COUNT(*) / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS porcentaje
                FROM cita c
                JOIN mascota m ON m.id = c.mascota_id
                {filtro_rango}
                GROUP BY m.especie
                ORDER BY total DESC
                """
                if filtro_rango
                else """
                SELECT
                    m.especie,
                    COUNT(*) AS total,
                    ROUND(100.0 * COUNT(*) / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS porcentaje
                FROM cita c
                JOIN mascota m ON m.id = c.mascota_id
                GROUP BY m.especie
                ORDER BY total DESC
                """,
                tuple(parametros),
            )
            especies_mas_atendidas = await cursor.fetchall()

            await cursor.execute(
                """
                SELECT COUNT(*) AS tratamientos_en_curso
                FROM tratamiento t
                WHERE LOWER(t.estado) IN ('activo', 'en curso', 'en_curso', 'pendiente')
                   OR (t.fecha_fin IS NULL AND LOWER(t.estado) <> 'finalizado')
                """
            )
            seguimiento_tratamientos = await cursor.fetchone()

            return {
                "rango_fechas": {"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin},
                "estadisticas_citas": {
                    "total_citas": estadisticas_citas["total_citas"] if estadisticas_citas else 0,
                    "citas_completadas": estadisticas_citas["citas_completadas"] if estadisticas_citas else 0,
                    "citas_canceladas": estadisticas_citas["citas_canceladas"] if estadisticas_citas else 0,
                },
                "productividad_personal": productividad_personal,
                "analisis_pacientes": {
                    "nuevas_mascotas_mes": nuevas_mascotas_mes,
                    "especies_mas_atendidas": especies_mas_atendidas,
                    "observacion": observacion_mascotas,
                },
                "seguimiento_tratamientos": {
                    "tratamientos_en_curso": (
                        seguimiento_tratamientos["tratamientos_en_curso"]
                        if seguimiento_tratamientos
                        else 0
                    )
                },
            }
    except Exception as e:
        print(f"Error reporte general: {e}")
        raise HTTPException(status_code=400, detail="Error al generar reporte general")
