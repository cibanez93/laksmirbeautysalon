-- ============================================================
-- MIGRACIÓN: tienda (productos, foto y regalo en los servicios)
--   mysql -u root < database/migraciones/2026-09-30-tienda.sql
-- ============================================================

USE laksmir;

-- Todas las imágenes se guardan en la tabla "fotos". Esta columna dice para qué es cada una:
-- las de la galería, las de un servicio o las de un producto (estas dos no salen en la galería).
ALTER TABLE fotos
  ADD COLUMN origen ENUM('galeria', 'servicio', 'producto') NOT NULL DEFAULT 'galeria' AFTER tipo;

-- Servicios: foto propia (también se usa en su bono regalo) y si se puede regalar
ALTER TABLE servicios
  ADD COLUMN foto_id INT UNSIGNED NULL AFTER categoria_id,
  ADD COLUMN regalable BOOLEAN NOT NULL DEFAULT FALSE AFTER activo,
  ADD CONSTRAINT fk_servicios_foto FOREIGN KEY (foto_id) REFERENCES fotos (id) ON DELETE SET NULL;

-- Al principio se pueden regalar los servicios de 15 € o más (Carla lo cambia desde el panel)
UPDATE servicios SET regalable = TRUE WHERE precio >= 15;

-- Productos de la tienda
CREATE TABLE IF NOT EXISTS productos (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(120)  NOT NULL,
  marca          VARCHAR(80)   NOT NULL DEFAULT '',
  descripcion    TEXT          NOT NULL,
  precio         DECIMAL(7,2)  NOT NULL,
  stock          INT UNSIGNED  NOT NULL DEFAULT 0,  -- 0 = agotado
  foto_id        INT UNSIGNED  NULL,
  activo         BOOLEAN       NOT NULL DEFAULT TRUE, -- FALSE = oculto en la tienda
  orden          INT           NOT NULL DEFAULT 0,
  creado_en      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_productos_foto FOREIGN KEY (foto_id) REFERENCES fotos (id) ON DELETE SET NULL
);
