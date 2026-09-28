-- ============================================================
-- MIGRACIÓN: fotos destacadas
-- Qué foto de la galería se muestra en cada sitio de la web
-- (portada, servicios destacados, equipo, categorías, novias).
--   mysql -u root < database/migraciones/2026-09-29-destacados.sql
-- ============================================================

USE laksmir;

CREATE TABLE IF NOT EXISTS destacados (
  ubicacion      VARCHAR(60)  NOT NULL,  -- sitio de la web: "portada", "destacado-1", "equipo-carla"...
  foto_id        INT UNSIGNED NULL,      -- foto de la galería (NULL = se ve la foto de ejemplo)
  servicio_id    INT UNSIGNED NULL,      -- solo en los servicios destacados de la portada
  actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ubicacion),
  -- Si se borra la foto o el servicio, el sitio vuelve a mostrar el ejemplo
  CONSTRAINT fk_destacados_foto FOREIGN KEY (foto_id) REFERENCES fotos (id) ON DELETE SET NULL,
  CONSTRAINT fk_destacados_servicio FOREIGN KEY (servicio_id) REFERENCES servicios (id) ON DELETE SET NULL
);

-- Fecha del último cambio de cada foto: sirve para que el navegador
-- no siga mostrando la foto antigua cuando se cambia desde el panel
ALTER TABLE fotos
  ADD COLUMN actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER creado_en;
