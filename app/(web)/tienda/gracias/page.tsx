// Página de «¡Gracias!» después de pagar en Stripe: estado del pedido y códigos de los bonos.
// Para verla hace falta el número del pedido Y el de la página de pago de Stripe:
// así nadie puede ver los bonos de otra persona cambiando el número en la dirección.
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Adorno, Esquinas } from "@/components/web/decoracion";
import Loto from "@/components/web/Loto";
import { obtenerPedido } from "@/lib/pedidos";
import { salon } from "@/lib/salon";
import { euros } from "@/lib/tienda";
import { BotonImprimir, RecargarEnUnosSegundos, VaciarCarrito } from "./Ayudantes";

export const metadata: Metadata = {
  title: "Gracias por tu compra | Laksmir Beauty Salon",
  robots: { index: false, follow: false },
};

const fechaLarga = (fecha: string) =>
  new Date(`${fecha}T12:00:00Z`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GraciasPage({ searchParams }: PageProps<"/tienda/gracias">) {
  await connection();
  const { pedido: idTexto, sesion } = await searchParams;
  const datos = idTexto ? await obtenerPedido(Number(idTexto)) : null;
  const valido = datos && typeof sesion === "string" && datos.pedido.stripe_sesion === sesion;

  if (!valido) {
    return (
      <Mensaje titulo="No encontramos este pedido">
        Si acabas de pagar y ves este mensaje, escríbenos por WhatsApp o llámanos al {salon.telefono} y lo revisamos.
      </Mensaje>
    );
  }

  const { pedido, lineas, bonos } = datos;

  if (pedido.estado === "pendiente") {
    return (
      <Mensaje titulo="Estamos confirmando tu pago…">
        <RecargarEnUnosSegundos />
        Suele tardar unos segundos. Esta página se actualizará sola.
      </Mensaje>
    );
  }

  if (pedido.estado === "cancelado") {
    return (
      <Mensaje titulo="El pago no se ha completado">
        No se ha cobrado nada. Si quieres, puedes <Link href="/tienda/carrito" className="underline">volver al carrito</Link> e intentarlo de nuevo.
      </Mensaje>
    );
  }

  const cursos = lineas.filter((l) => l.tipo === "curso");
  const productos = lineas.filter((l) => l.tipo === "producto");

  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <VaciarCarrito />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 print:hidden">
          <Loto className="mx-auto w-14 h-10 text-dorado mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-4">¡Gracias{pedido.nombre ? `, ${pedido.nombre.split(" ")[0]}` : ""}!</h1>
          <p className="text-neutral-600">
            Tu pago se ha completado. Pedido nº <strong>{pedido.id}</strong>
            {pedido.email && <> · Stripe te enviará el recibo a <strong>{pedido.email}</strong></>}.
          </p>
          <Adorno className="mt-6" />
        </div>

        {bonos.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 print:hidden">
              <h2 className="font-serif text-2xl">Tus regalos</h2>
              <BotonImprimir />
            </div>
            <p className="text-sm text-neutral-500 mb-6 print:hidden">Guarda estos códigos: son los que se presentan en el salón para canjear el regalo.</p>
            <ul className="space-y-6">
              {bonos.map((b) => (
                <li key={b.id} className="relative bg-neutral-900 text-white text-center px-6 py-10 break-inside-avoid">
                  <div aria-hidden="true" className="absolute inset-2 border border-dorado/50" />
                  <Esquinas />
                  <p className="relative text-[10px] uppercase tracking-[0.3em] text-dorado mb-3">{salon.nombre}</p>
                  <p className="relative font-serif text-2xl md:text-3xl mb-2">{b.descripcion.replace(/^Bono regalo: /, "")}</p>
                  {pedido.regalo_para && <p className="relative text-neutral-300 mb-1">Para {pedido.regalo_para}{pedido.regalo_de ? `, de ${pedido.regalo_de}` : ""}</p>}
                  {pedido.regalo_mensaje && <p className="relative italic text-neutral-300 max-w-md mx-auto mb-4">«{pedido.regalo_mensaje}»</p>}
                  <p className="relative inline-block font-mono text-2xl tracking-[0.25em] text-dorado border border-dorado/60 px-5 py-2 my-3">{b.codigo}</p>
                  <p className="relative text-xs text-neutral-400">Válido hasta el {fechaLarga(b.caduca_en)} · Reserva tu cita en Booksy o al {salon.telefono}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cursos.length > 0 && (
          <div className="bg-white border border-linea p-6 mb-6 print:hidden">
            <h2 className="font-serif text-2xl mb-3">Tu plaza en Laksmir Academy</h2>
            <ul className="space-y-1 mb-3">
              {cursos.map((c) => <li key={c.ref_id}>{c.nombre.replace(/^Curso: /, "")}{c.cantidad > 1 ? ` · ${c.cantidad} plazas` : ""}</li>)}
            </ul>
            <p className="text-sm text-neutral-600">Tu plaza está reservada. Te esperamos en el salón ({salon.direccion.calle}, {salon.direccion.localidad}) el día del curso.</p>
          </div>
        )}

        {productos.length > 0 && (
          <div className="bg-white border border-linea p-6 mb-6 print:hidden">
            <h2 className="font-serif text-2xl mb-3">Tus productos</h2>
            <ul className="space-y-1 mb-3">
              {productos.map((p) => <li key={p.ref_id}>{p.cantidad} × {p.nombre}</li>)}
            </ul>
            <p className="text-sm text-neutral-600">
              {pedido.entrega === "envio"
                ? `Los enviaremos a: ${pedido.direccion ?? "la dirección que indicaste"}.`
                : `Te avisaremos cuando estén listos para recoger en el salón (${salon.direccion.calle}).`}
            </p>
          </div>
        )}

        <p className="text-right text-lg print:hidden">Total pagado: <strong>{euros(pedido.total)}</strong></p>
        <div className="text-center mt-10 print:hidden">
          <Link href="/" className="text-sm uppercase tracking-widest border-b border-neutral-900 pb-1 hover:text-dorado-oscuro hover:border-dorado-oscuro">Volver a la web</Link>
        </div>
      </div>
    </section>
  );
}

function Mensaje({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="px-4 md:px-8 py-24 text-center">
      <Loto className="mx-auto w-14 h-10 text-dorado mb-4" />
      <h1 className="font-serif text-4xl mb-4">{titulo}</h1>
      <p className="text-neutral-600 max-w-md mx-auto">{children}</p>
    </section>
  );
}
