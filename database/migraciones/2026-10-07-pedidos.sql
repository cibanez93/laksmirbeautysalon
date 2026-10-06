-- ============================================================
-- MIGRACIÓN: pedidos de la tienda, bonos regalo vendidos y plazas de cursos
--   mysql -u root < database/migraciones/2026-10-07-pedidos.sql
-- ============================================================

USE laksmir;

-- Un pedido = una compra. Los datos de la clienta los pide Stripe en su página de pago
-- y se guardan aquí cuando Stripe confirma el pago.
CREATE TABLE IF NOT EXISTS pedidos (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  estado         ENUM('pendiente', 'pagado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  entrega        ENUM('recogida', 'envio', 'digital') NOT NULL,
  nombre         VARCHAR(120)  NULL,
  email          VARCHAR(200)  NULL,
  telefono       VARCHAR(30)   NULL,
  direccion      TEXT          NULL,  -- solo si es envío a casa
  regalo_para    VARCHAR(80)   NULL,
  regalo_de      VARCHAR(80)   NULL,
  regalo_mensaje VARCHAR(300)  NULL,
  subtotal       DECIMAL(8,2)  NOT NULL,
  gastos_envio   DECIMAL(6,2)  NOT NULL DEFAULT 0,
  total          DECIMAL(8,2)  NOT NULL,
  stripe_sesion  VARCHAR(255)  NULL,  -- el número de la página de pago de Stripe
  entregado      BOOLEAN       NOT NULL DEFAULT FALSE,  -- lo marca Carla al entregar o enviar
  creado_en      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pagado_en      TIMESTAMP     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pedidos_stripe (stripe_sesion)
);

-- Lo que hay dentro de cada pedido. El nombre y el precio se COPIAN aquí:
-- si mañana cambia el precio de un producto, el pedido antiguo sigue diciendo lo que se pagó.
CREATE TABLE IF NOT EXISTS pedido_lineas (
  id         INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  pedido_id  INT UNSIGNED      NOT NULL,
  tipo       ENUM('bono', 'tarjeta', 'producto', 'curso') NOT NULL,
  ref_id     INT UNSIGNED      NOT NULL,  -- id del servicio, la tarjeta, el producto o el curso
  nombre     VARCHAR(200)      NOT NULL,
  precio     DECIMAL(7,2)      NOT NULL,
  cantidad   SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_lineas_ref (tipo, ref_id),
  CONSTRAINT fk_lineas_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
);

-- Cada bono o tarjeta regalo vendido, con su código único para canjearlo en el salón
CREATE TABLE IF NOT EXISTS bonos (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  codigo      CHAR(10)      NOT NULL,
  pedido_id   INT UNSIGNED  NOT NULL,
  tipo        ENUM('bono', 'tarjeta') NOT NULL,
  descripcion VARCHAR(200)  NOT NULL,  -- «Bono regalo: Limpieza facial» o «Tarjeta regalo de 50 €»
  importe     DECIMAL(7,2)  NOT NULL,
  caduca_en   DATE          NOT NULL,
  usado_en    TIMESTAMP     NULL,      -- NULL = todavía no se ha usado
  creado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bonos_codigo (codigo),
  CONSTRAINT fk_bonos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
);
