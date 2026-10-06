-- ============================================================
-- MIGRACIÓN: cursos de Laksmir Academy (se gestionan en el panel)
--   mysql -u root < database/migraciones/2026-10-06-cursos.sql
-- ============================================================

USE laksmir;

-- Las fotos de los cursos también se guardan en "fotos" (no salen en la galería)
ALTER TABLE fotos
  MODIFY COLUMN origen ENUM('galeria', 'servicio', 'producto', 'tarjeta', 'curso') NOT NULL DEFAULT 'galeria';

CREATE TABLE IF NOT EXISTS cursos (
  id             INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(120)      NOT NULL,
  publico        ENUM('clientas', 'profesionales') NOT NULL,
  formato        ENUM('presencial', 'online') NOT NULL,
  descripcion    TEXT              NOT NULL,
  incluye        TEXT              NOT NULL,  -- una cosa por línea
  duracion       VARCHAR(80)       NOT NULL,  -- texto libre: «3 horas», «1 hora de vídeo»
  fecha          DATETIME          NULL,      -- solo los presenciales
  plazas         SMALLINT UNSIGNED NULL,      -- solo los presenciales
  plazas_libres  SMALLINT UNSIGNED NULL,      -- 0 = completo
  precio         DECIMAL(7,2)      NOT NULL,  -- IVA incluido
  foto_id        INT UNSIGNED      NULL,
  activo         BOOLEAN           NOT NULL DEFAULT TRUE,  -- FALSE = oculto en la web
  orden          INT               NOT NULL DEFAULT 0,
  creado_en      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cursos_foto FOREIGN KEY (foto_id) REFERENCES fotos (id) ON DELETE SET NULL
);
