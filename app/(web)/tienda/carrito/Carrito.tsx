"use client";
// Contenido del carrito: artículos, mensaje para el regalo, entrega y total.
// «Pagar» manda el carrito al servidor, que comprueba precios y stock y abre la página de pago de Stripe.
import Link from "next/link";
import { useState, useTransition } from "react";
import { useCarrito } from "@/components/tienda/CarritoContexto";
import { envio, euros, MESES_CADUCIDAD, tieneProductos, totales } from "@/lib/tienda";
import { salon } from "@/lib/salon";
import { iniciarPago } from "./actions";

export default function Carrito({ pagoActivo }: { pagoActivo: boolean }) {
  const { articulos, cambiarCantidad, quitar } = useCarrito();
  const [entrega, setEntrega] = useState<"recogida" | "envio">("recogida");
  const [error, setError] = useState<string | null>(null);
  const [pagando, empezarPago] = useTransition();

  const pagar = (formData: FormData) => {
    setError(null);
    empezarPago(async () => {
      const respuesta = await iniciarPago({
        articulos: articulos.map((a) => ({ id: a.id, cantidad: a.cantidad })),
        quiereEnvio: entrega === "envio",
        regalo: { para: String(formData.get("para") ?? ""), de: String(formData.get("de") ?? ""), mensaje: String(formData.get("mensaje") ?? "") },
      });
      if ("url" in respuesta) window.location.href = respuesta.url;
      else setError(respuesta.error);
    });
  };

  if (articulos.length === 0) {
    return (
      <div className="bg-white border border-linea p-10 text-center">
        <p className="text-neutral-600 mb-6">Tu carrito está vacío.</p>
        <Link href="/tienda" className="inline-block bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const hayProductos = tieneProductos(articulos);
  const hayRegalos = articulos.some((a) => a.tipo === "bono" || a.tipo === "tarjeta");
  const { subtotal, gastosEnvio, total } = totales(articulos, entrega);

  return (
    <form action={pagar} className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-8">
        {/* Artículos */}
        <ul className="bg-white border border-linea divide-y divide-linea">
          {articulos.map((a) => (
            <li key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-lg">{a.nombre}</p>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  {a.tipo === "producto" || a.tipo === "curso" ? a.detalle : `Regalo digital · válido ${MESES_CADUCIDAD === 12 ? "1 año" : `${MESES_CADUCIDAD} meses`}`}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center border border-linea" role="group" aria-label={`Cantidad de ${a.nombre}`}>
                  <button type="button" onClick={() => cambiarCantidad(a.id, a.cantidad - 1)} disabled={a.cantidad <= 1} className="size-9 hover:bg-arena disabled:opacity-30" aria-label="Quitar uno">−</button>
                  <span className="w-8 text-center text-sm" aria-live="polite">{a.cantidad}</span>
                  <button type="button" onClick={() => cambiarCantidad(a.id, a.cantidad + 1)} disabled={a.cantidad >= 10} className="size-9 hover:bg-arena disabled:opacity-30" aria-label="Añadir uno">+</button>
                </div>
                <p className="w-20 text-right font-medium">{euros(a.precio * a.cantidad)}</p>
                <button type="button" onClick={() => quitar(a.id)} className="text-sm text-red-700 hover:underline">Quitar</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Mensaje para el regalo */}
        {hayRegalos && (
          <fieldset className="bg-white border border-linea p-6">
            <legend className="font-serif text-xl px-1">Personaliza tu regalo</legend>
            <p className="text-sm text-neutral-500 mb-5">Aparecerá en el bono que podrás imprimir o enviar para regalar.</p>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <label className="campo">
                Para
                <input name="para" placeholder="Nombre de quien lo recibe" className="input" />
              </label>
              <label className="campo">
                De
                <input name="de" placeholder="Tu nombre" className="input" />
              </label>
            </div>
            <label className="campo">
              Mensaje (opcional)
              <textarea name="mensaje" rows={3} maxLength={300} placeholder="¡Feliz cumpleaños! Disfruta de este momento para ti." className="input" />
            </label>
          </fieldset>
        )}

        {/* Entrega de productos */}
        {hayProductos && (
          <fieldset className="bg-white border border-linea p-6">
            <legend className="font-serif text-xl px-1">Entrega de los productos</legend>
            <div className="space-y-3 mt-3">
              <label className="flex items-start gap-3 p-4 border border-linea cursor-pointer has-[:checked]:border-dorado">
                <input type="radio" name="entrega" checked={entrega === "recogida"} onChange={() => setEntrega("recogida")} className="mt-1 accent-neutral-900" />
                <span>
                  <span className="block font-medium">Recogida en el salón · Gratis</span>
                  <span className="text-sm text-neutral-500">{salon.direccion.calle}, {salon.direccion.localidad}. Te avisamos cuando esté listo.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 p-4 border border-linea cursor-pointer has-[:checked]:border-dorado">
                <input type="radio" name="entrega" checked={entrega === "envio"} onChange={() => setEntrega("envio")} className="mt-1 accent-neutral-900" />
                <span>
                  <span className="block font-medium">Envío a casa · {euros(envio.precio)}</span>
                  <span className="text-sm text-neutral-500">Gratis en pedidos de productos de {euros(envio.gratisDesde)} o más.</span>
                </span>
              </label>
            </div>
          </fieldset>
        )}
      </div>

      {/* Resumen */}
      <aside className="bg-arena p-6 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl mb-5">Resumen</h2>
        <dl className="space-y-2 text-sm mb-5">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{euros(subtotal)}</dd></div>
          {hayProductos && (
            <div className="flex justify-between">
              <dt>{entrega === "recogida" ? "Recogida en el salón" : "Envío"}</dt>
              <dd>{gastosEnvio ? euros(gastosEnvio) : "Gratis"}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-[#E0D3C2] pt-3 text-base font-medium"><dt>Total</dt><dd>{euros(total)}</dd></div>
        </dl>
        <p className="text-xs text-neutral-500 mb-5">IVA incluido.</p>
        <button type="submit" disabled={!pagoActivo || pagando} className="w-full bg-neutral-900 text-white text-sm uppercase tracking-widest px-6 py-4 hover:bg-dorado-oscuro transition-colors disabled:opacity-40">
          {pagando ? "Abriendo el pago…" : "Pagar con tarjeta"}
        </button>
        {error && <p role="alert" className="text-sm text-red-700 mt-3">{error}</p>}
        <p className="text-xs text-neutral-500 mt-3 text-center">
          {pagoActivo ? "Pago seguro con Stripe. Tus datos de la tarjeta nunca pasan por nuestra web." : "El pago online se activará muy pronto."}
        </p>
        <Link href="/tienda" className="block text-center text-sm text-neutral-600 underline underline-offset-2 mt-5 hover:text-neutral-900">
          Seguir comprando
        </Link>
      </aside>
    </form>
  );
}
