-- ============================================================
-- Base de datos de Laksmir Beauty Salon
-- Ejecutar con:  mysql -u root < database/schema.sql
-- ============================================================

-- Crea la base de datos si no existe. utf8mb4 permite tildes, ñ y emojis.
CREATE DATABASE IF NOT EXISTS laksmir
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laksmir;

-- ------------------------------------------------------------
-- Servicios que ofrece el salón (lo que se ve en la web)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS servicios (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(100)  NOT NULL,
  descripcion  TEXT          NOT NULL,
  precio       DECIMAL(6,2)  NULL,              -- NULL = no se muestra precio
  duracion_min SMALLINT UNSIGNED NULL,          -- duración en minutos (opcional)
  orden        INT           NOT NULL DEFAULT 0, -- para ordenar en la web
  activo       BOOLEAN       NOT NULL DEFAULT TRUE, -- FALSE = oculto en la web
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- Usuarios que pueden entrar al panel de administración
-- La contraseña NUNCA se guarda tal cual: solo su "hash".
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
);

-- ------------------------------------------------------------
-- Sesiones abiertas (quién ha iniciado sesión y hasta cuándo)
-- Guardamos el hash del token, no el token, por si alguien
-- llegara a leer la base de datos.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones (
  token_hash  CHAR(64)     NOT NULL,
  usuario_id  INT UNSIGNED NOT NULL,
  expira_en   DATETIME     NOT NULL,
  PRIMARY KEY (token_hash),
  -- Si se borra un usuario, se borran también sus sesiones
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
);
