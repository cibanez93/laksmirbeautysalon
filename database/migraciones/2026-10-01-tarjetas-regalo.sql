-- ============================================================
-- MIGRACIÓN: tarjetas regalo gestionadas desde el panel
--   mysql -u root < database/migraciones/2026-10-01-tarjetas-regalo.sql
-- ============================================================

USE laksmir;

-- Las fotos de las tarjetas también se guardan en "fotos" (no salen en la galería)
ALTER TABLE fotos
  MODIFY COLUMN origen ENUM('galeria', 'servicio', 'producto', 'tarjeta') NOT NULL DEFAULT 'galeria';

CREATE TABLE IF NOT EXISTS tarjetas_regalo (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(80)  NOT NULL,             -- p. ej. "Tarjeta regalo" o "Tarjeta Navidad"
  importe        DECIMAL(7,2) NOT NULL,             -- en euros
  foto_id        INT UNSIGNED NULL,                 -- diseño propio (NULL = diseño negro y dorado)
  activo         BOOLEAN      NOT NULL DEFAULT TRUE, -- FALSE = oculta en la tienda
  orden          INT          NOT NULL DEFAULT 0,
  creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tarjetas_foto FOREIGN KEY (foto_id) REFERENCES fotos (id) ON DELETE SET NULL
);

-- Las tarjetas que había hasta ahora en la tienda
INSERT INTO tarjetas_regalo (nombre, importe, orden)
SELECT * FROM (
  SELECT 'Tarjeta regalo' AS nombre, 30 AS importe, 10 AS orden UNION ALL
  SELECT 'Tarjeta regalo', 50, 20 UNION ALL
  SELECT 'Tarjeta regalo', 75, 30 UNION ALL
  SELECT 'Tarjeta regalo', 100, 40 UNION ALL
  SELECT 'Tarjeta regalo', 150, 50
) AS iniciales
WHERE NOT EXISTS (SELECT 1 FROM tarjetas_regalo);
