-- =========================================================
-- BASE DE DATOS: veterinaria (PostgreSQL)
-- Modelo final (sin ventas, sin vacunas)
-- =========================================================

DROP DATABASE IF EXISTS veterinaria;
CREATE DATABASE veterinaria;

\c veterinaria;

-- =========================================================
-- TABLAS
-- =========================================================

CREATE TABLE persona (
    id BIGSERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    ci VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    email VARCHAR(120),
    direccion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'veterinario',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    persona_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_usuario_persona
        FOREIGN KEY (persona_id) REFERENCES persona(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE veterinario (
    id BIGSERIAL PRIMARY KEY,
    licencia VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    persona_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_veterinario_persona
        FOREIGN KEY (persona_id) REFERENCES persona(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE mascota (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(80),
    edad INT,
    sexo VARCHAR(20),
    peso NUMERIC(6,2),
    talla NUMERIC(5,2),
    grupo_sanguineo VARCHAR(10),
    alergias TEXT,
    antecedentes TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    dueno_persona_id BIGINT NOT NULL,
    CONSTRAINT fk_mascota_dueno
        FOREIGN KEY (dueno_persona_id) REFERENCES persona(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE cita (
    id BIGSERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP NOT NULL,
    motivo VARCHAR(200) NOT NULL,
    prioridad VARCHAR(20) NOT NULL DEFAULT 'normal',
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    mascota_id BIGINT NOT NULL,
    veterinario_id BIGINT NOT NULL,
    CONSTRAINT fk_cita_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascota(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_cita_veterinario
        FOREIGN KEY (veterinario_id) REFERENCES veterinario(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_cita_prioridad
        CHECK (prioridad IN ('normal','urgente')),
    CONSTRAINT chk_cita_estado
        CHECK (estado IN ('pendiente','confirmada','en_atencion','completada','cancelada','no_asistio'))
);

CREATE TABLE historial_clinico (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    sintomas TEXT,
    diagnostico TEXT,
    observaciones TEXT,
    mascota_id BIGINT NOT NULL,
    veterinario_id BIGINT NOT NULL,
    cita_id BIGINT UNIQUE,
    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascota(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (veterinario_id) REFERENCES veterinario(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_historial_cita
        FOREIGN KEY (cita_id) REFERENCES cita(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE tratamiento (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    objetivo VARCHAR(255),
    historial_id BIGINT NOT NULL,
    CONSTRAINT fk_tratamiento_historial
        FOREIGN KEY (historial_id) REFERENCES historial_clinico(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_tratamiento_estado
        CHECK (estado IN ('activo','finalizado','suspendido')),
    CONSTRAINT chk_tratamiento_fechas
        CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE control_tratamiento (
    id BIGSERIAL PRIMARY KEY,
    fecha_control DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    tratamiento_id BIGINT NOT NULL,
    CONSTRAINT fk_control_tratamiento
        FOREIGN KEY (tratamiento_id) REFERENCES tratamiento(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_control_estado
        CHECK (estado IN ('pendiente','realizado','cancelado'))
);

-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_mascota_dueno ON mascota(dueno_persona_id);
CREATE INDEX idx_cita_fecha ON cita(fecha_hora);
CREATE INDEX idx_cita_estado ON cita(estado);
CREATE INDEX idx_historial_fecha ON historial_clinico(fecha);
CREATE INDEX idx_tratamiento_estado ON tratamiento(estado);

-- =========================================================
-- DATOS DE EJEMPLO (2 por tabla)
-- =========================================================

INSERT INTO persona (nombres, apellidos, ci, telefono, email, direccion, activo) VALUES
('Ana', 'Quispe', '7894561', '70011122', 'ana@correo.com', 'Zona Norte', TRUE),
('Luis', 'Rojas', '6541237', '70033344', 'luis@correo.com', 'Zona Sur', TRUE);

INSERT INTO usuario (username, password_hash, rol, activo, persona_id) VALUES
('ana.vet', '$2b$12$hashAnaDemo', 'veterinario', TRUE, 1),
('luis.vet', '$2b$12$hashLuisDemo', 'veterinario', TRUE, 2);

INSERT INTO veterinario (licencia, especialidad, activo, persona_id) VALUES
('VET-001', 'Medicina General', TRUE, 1),
('VET-002', 'Dermatologia', TRUE, 2);

INSERT INTO mascota (nombre, especie, raza, edad, sexo, peso, talla, grupo_sanguineo, alergias, antecedentes, activo, dueno_persona_id) VALUES
('Max', 'Perro', 'Labrador', 5, 'M', 28.50, 0.62, 'DEA1', 'Ninguna', 'Otitis leve en 2024', TRUE, 1),
('Mishi', 'Gato', 'Siames', 3, 'H', 4.20, 0.30, 'A', 'Polen', 'Vacunacion incompleta', TRUE, 2);

INSERT INTO cita (fecha_hora, motivo, prioridad, estado, observaciones, mascota_id, veterinario_id) VALUES
('2026-02-20 10:30:00', 'Control general', 'normal', 'completada', 'Paciente estable', 1, 1),
('2026-02-22 16:00:00', 'Problema de piel', 'urgente', 'en_atencion', 'Presenta prurito', 2, 2);

INSERT INTO historial_clinico (fecha, sintomas, diagnostico, observaciones, mascota_id, veterinario_id, cita_id) VALUES
('2026-02-20', 'Sin sintomas relevantes', 'Paciente sano', 'Recomendacion de desparasitacion', 1, 1, 1),
('2026-02-22', 'Picazon y enrojecimiento', 'Dermatitis alergica', 'Evitar contacto con polvo', 2, 2, 2);

INSERT INTO tratamiento (nombre, estado, fecha_inicio, fecha_fin, objetivo, historial_id) VALUES
('Desparasitacion interna', 'activo', '2026-02-20', '2026-03-20', 'Prevencion parasitaria', 1),
('Tratamiento dermatologico', 'activo', '2026-02-22', '2026-03-08', 'Controlar dermatitis', 2);

INSERT INTO control_tratamiento (fecha_control, estado, observaciones, tratamiento_id) VALUES
('2026-02-27', 'pendiente', 'Primer control post medicacion', 1),
('2026-03-01', 'pendiente', 'Evaluar respuesta cutanea', 2);
