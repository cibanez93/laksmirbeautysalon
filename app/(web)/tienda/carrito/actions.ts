"use server";
// Botón «Pagar»: comprueba el carrito con la base de datos, reserva stock y plazas,
// crea el pedido y abre la página de pago de Stripe.
import { headers } from "next/headers";
import { cancelarPedido, crearPedido, guardarSesionStripe, prepararLineas } from "@/lib/pedidos";
import { stripe } from "@/lib/stripe";

interface DatosPago {
  articulos: { id: string; cantidad: number }[];
  quiereEnvio: boolean;
  regalo: { para: string; de: string; mensaje: string };
}

const MINUTOS_PARA_PAGAR = 31; // Stripe pide un mínimo de 30 minutos

export async function iniciarPago(datos: DatosPago): Promise<{ url: string } | { error: string }> {
  const pagos = stripe();
  if (!pagos) return { error: "El pago online todavía no está activado." };

  const lineas = await prepararLineas(Array.isArray(datos?.articulos) ? datos.articulos : []);
  if (typeof lineas === "string") return { error: lineas };

  const corta = (texto: unknown, max: number) => String(texto ?? "").trim().slice(0, max);
  const pedido = await crearPedido(lineas, {
    quiereEnvio: datos.quiereEnvio === true,
    regalo_para: corta(datos.regalo?.para, 80),
    regalo_de: corta(datos.regalo?.de, 80),
    regalo_mensaje: corta(datos.regalo?.mensaje, 300),
  });
  if (typeof pedido === "string") return { error: pedido };

  const origen = (await headers()).get("origin") ?? "http://localhost:3000";
  const { entrega, gastos_envio } = pedido.totales;

  try {
    const sesion = await pagos.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      client_reference_id: String(pedido.id),
      metadata: { pedido_id: String(pedido.id) },
      line_items: lineas.map((l) => ({
        quantity: l.cantidad,
        price_data: { currency: "eur", unit_amount: Math.round(l.precio * 100), product_data: { name: l.nombre } },
      })),
      phone_number_collection: { enabled: true },
      ...(entrega === "envio" && {
        shipping_address_collection: { allowed_countries: ["ES"] },
        shipping_options: [{
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: gastos_envio > 0 ? "Envío a domicilio" : "Envío gratis",
            fixed_amount: { amount: Math.round(gastos_envio * 100), currency: "eur" },
          },
        }],
      }),
      expires_at: Math.floor(Date.now() / 1000) + MINUTOS_PARA_PAGAR * 60,
      success_url: `${origen}/tienda/gracias?pedido=${pedido.id}&sesion={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origen}/tienda/carrito`,
    });
    await guardarSesionStripe(pedido.id, sesion.id);
    if (!sesion.url) throw new Error("Stripe no ha devuelto la dirección de pago");
    return { url: sesion.url };
  } catch (error) {
    // Si Stripe falla, se libera lo reservado
    console.error("Error al crear el pago en Stripe:", error);
    await cancelarPedido(pedido.id);
    return { error: "No hemos podido abrir la página de pago. Inténtalo de nuevo en unos minutos." };
  }
}
