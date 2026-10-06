// Webhook de Stripe: Stripe llama aquí para avisar de que un pago se ha completado
// o de que la página de pago ha caducado sin pagar.
// La firma (cabecera stripe-signature) demuestra que el aviso viene de verdad de Stripe.
import type Stripe from "stripe";
import { cancelarPedido, confirmarPago } from "@/lib/pedidos";
import { stripe } from "@/lib/stripe";

function datosCliente(sesion: Stripe.Checkout.Session) {
  const envio = sesion.collected_information?.shipping_details;
  const d = envio?.address;
  return {
    nombre: envio?.name ?? sesion.customer_details?.name ?? null,
    email: sesion.customer_details?.email ?? null,
    telefono: sesion.customer_details?.phone ?? null,
    direccion: d ? [d.line1, d.line2, `${d.postal_code ?? ""} ${d.city ?? ""}`.trim(), d.state].filter(Boolean).join(", ") : null,
  };
}

export async function POST(request: Request) {
  const pagos = stripe();
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!pagos || !secreto) return new Response("Pagos no configurados", { status: 503 });

  // Hay que leer el cuerpo como texto, tal cual llega: si no, la firma no coincide
  const cuerpo = await request.text();
  let evento: Stripe.Event;
  try {
    evento = pagos.webhooks.constructEvent(cuerpo, request.headers.get("stripe-signature") ?? "", secreto);
  } catch {
    return new Response("Firma no válida", { status: 400 });
  }

  const sesion = evento.data.object as Stripe.Checkout.Session;
  const pedidoId = Number(sesion.metadata?.pedido_id);

  if (evento.type.startsWith("checkout.session.") && Number.isInteger(pedidoId) && pedidoId > 0) {
    switch (evento.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        if (sesion.payment_status === "paid") await confirmarPago(pedidoId, datosCliente(sesion));
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        await cancelarPedido(pedidoId);
        break;
    }
  }

  // Respondemos 200 para que Stripe sepa que lo hemos recibido (si no, lo reintenta)
  return Response.json({ recibido: true });
}
