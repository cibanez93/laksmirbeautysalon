// Conexión con Stripe (pagos). Solo en el servidor: la clave secreta nunca llega al navegador.
// Las claves van en las variables de entorno: STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET.
// Primero se usan las de PRUEBA (empiezan por sk_test_), que no mueven dinero real.
import "server-only";
import Stripe from "stripe";

let cliente: Stripe | null = null;

// Devuelve null si todavía no hay clave: la tienda enseña «El pago online estará disponible muy pronto»
export function stripe(): Stripe | null {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) return null;
  cliente ??= new Stripe(clave);
  return cliente;
}

export const pagoActivo = () => Boolean(process.env.STRIPE_SECRET_KEY);
