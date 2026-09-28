-- ============================================================
-- MIGRACIÓN: categorías, galería y blog
-- Se ejecuta UNA SOLA VEZ sobre una base de datos que ya tiene
-- las tablas de database/schema.sql (servicios, usuarios, sesiones).
--   mysql -u root < database/migraciones/2026-09-28-categorias-galeria-blog.sql
-- ============================================================

USE laksmir;

-- ------------------------------------------------------------
-- 1. CATEGORÍAS
-- Antes la categoría se deducía del número de "orden" (100 = Peluquería...).
-- Ahora cada servicio apunta a su categoría con una clave foránea.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug   VARCHAR(60)  NOT NULL,          -- nombre para la dirección web: /servicios/peluqueria
  nombre VARCHAR(80)  NOT NULL,
  orden  INT          NOT NULL DEFAULT 0, -- orden en la web
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_slug (slug)
);

INSERT IGNORE INTO categorias (slug, nombre, orden) VALUES
  ('peluqueria',              'Peluquería',              1),
  ('tratamientos-faciales',   'Tratamientos faciales',   2),
  ('tratamientos-corporales', 'Tratamientos corporales', 3),
  ('manicura',                'Manicura',                4),
  ('pedicura',                'Pedicura',                5),
  ('depilacion',              'Depilación',              6),
  ('maquillaje',              'Maquillaje',              7),
  ('masajes',                 'Masajes',                 8),
  ('diseno-de-mirada',        'Diseño de mirada',        9);

-- Nueva columna en servicios que apunta a categorias.id
ALTER TABLE servicios
  ADD COLUMN categoria_id INT UNSIGNED NULL AFTER id,
  ADD CONSTRAINT fk_servicios_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (id) ON DELETE SET NULL;

-- Rellenarla a partir del "orden" antiguo (100 = peluquería, 200 = faciales...)
UPDATE servicios s
  JOIN categorias c ON c.slug = CASE FLOOR(s.orden / 100)
    WHEN 1 THEN 'peluqueria'
    WHEN 2 THEN 'tratamientos-faciales'
    WHEN 3 THEN 'tratamientos-corporales'
    WHEN 4 THEN 'manicura'
    WHEN 5 THEN 'maquillaje'
    WHEN 6 THEN 'masajes'
    WHEN 7 THEN 'diseno-de-mirada'
    WHEN 8 THEN 'pedicura'
    WHEN 9 THEN 'depilacion'
  END
SET s.categoria_id = c.id
WHERE s.categoria_id IS NULL;

-- ------------------------------------------------------------
-- 2. GALERÍA
-- Las fotos se guardan dentro de la base de datos (MEDIUMBLOB = hasta 16 MB).
-- El panel las reduce antes de subirlas, así que ocupan unos 300 KB.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fotos (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo       VARCHAR(120) NOT NULL,
  categoria_id INT UNSIGNED NULL,
  tipo         ENUM('foto', 'antes_despues') NOT NULL DEFAULT 'foto',
  forma        ENUM('cuadrada', 'vertical', 'horizontal') NOT NULL DEFAULT 'cuadrada',
  imagen       MEDIUMBLOB   NOT NULL,     -- la foto (o el "después")
  imagen_antes MEDIUMBLOB   NULL,         -- solo en antes/después
  visible      BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_fotos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 3. BLOG
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS articulos (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(160) NOT NULL,   -- dirección web: /blog/como-cuidar-el-color
  titulo         VARCHAR(200) NOT NULL,
  resumen        VARCHAR(300) NOT NULL,
  contenido      MEDIUMTEXT   NOT NULL,
  tema           ENUM('cabello', 'piel', 'unas', 'novias') NOT NULL,
  autora         VARCHAR(60)  NOT NULL,
  fecha          DATE         NOT NULL,
  publicado      BOOLEAN      NOT NULL DEFAULT FALSE, -- FALSE = borrador, no se ve en la web
  creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articulos_slug (slug)
);
