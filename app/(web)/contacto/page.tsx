// Página de CONTACTO: formas de contacto, dirección, horario y mapa.
import type { Metadata } from "next";
import { Adorno, TituloSeccion } from "@/components/web/decoracion";
import { salon } from "@/lib/salon";
import AbiertoAhora from "@/components/web/AbiertoAhora";
import Mapa from "./Mapa";

export const metadata: Metadata = {
  title: "Contacto y cómo llegar | Laksmir Beauty Salon, Ripagaina",
  description: "Dirección, teléfono, WhatsApp y horario de Laksmir Beauty Salon en Calle la Valeta 1, Ripagaina (Pamplona). Reserva tu cita online.",
};

const formas = [
  { titulo: "Reservar online", texto: "Elige servicio y hora en Booksy", accion: "Reservar", href: salon.booksy, icono: "📅", principal: true },
  { titulo: "Llámanos", texto: salon.telefono, accion: "Llamar", href: salon.telefonoEnlace, icono: "📞" },
  { titulo: "WhatsApp", texto: "Escríbenos y te respondemos", accion: "Abrir WhatsApp", href: `https://wa.me/${salon.whatsapp}`, icono: "💬" },
  { titulo: "Instagram", texto: salon.instagram.usuario, accion: "Ver Instagram", href: salon.instagram.url, icono: "📷" },
];


export default function ContactoPage() {
  const externo = (href: string) => href.startsWith("http");
  return (
    <>
      <section className="px-4 md:px-8 pt-16 md:pt-20 pb-16">
        <div className="max-w-5xl mx-auto">
          <TituloSeccion as="h1" antetitulo="Estamos para ayudarte" titulo="Contacto" />
          <div className="flex justify-center -mt-4 mb-12">
            <AbiertoAhora />
          </div>

          {/* Formas de contacto */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {formas.map((f) => (
              <a
                key={f.titulo}
                href={f.href}
                {...(externo(f.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group flex flex-col items-center text-center p-6 border transition-colors ${f.principal ? "bg-neutral-900 text-white border-neutral-900 hover:bg-dorado-oscuro hover:border-dorado-oscuro" : "bg-white border-linea hover:border-dorado"}`}
              >
                <span className="text-2xl mb-3" aria-hidden="true">{f.icono}</span>
                <span className="font-serif text-xl">{f.titulo}</span>
                <span className={`text-sm mt-1 mb-5 ${f.principal ? "text-neutral-300" : "text-neutral-600"}`}>{f.texto}</span>
                <span className={`mt-auto text-xs uppercase tracking-widest border-b pb-0.5 ${f.principal ? "border-dorado text-dorado" : "border-neutral-900 group-hover:text-dorado-oscuro group-hover:border-dorado-oscuro"}`}>
                  {f.accion} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dirección y horario */}
      <section className="bg-white px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Dirección</h2>
            <address className="not-italic font-serif text-2xl leading-snug">
              {salon.direccion.calle}<br />
              {salon.direccion.cp} {salon.direccion.localidad}, {salon.direccion.provincia}
            </address>
            <a href={salon.mapas.comoLlegar} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 bg-neutral-900 text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-dorado-oscuro transition-colors">
              Cómo llegar
            </a>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Horario</h2>
            <dl className="divide-y divide-linea border-y border-linea">
              {salon.horario.map((h) => (
                <div key={h.dias} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-neutral-600">{h.dias}</dt>
                  <dd className={h.horas === "Cerrado" ? "text-neutral-400" : "font-medium"}>{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <TituloSeccion antetitulo="Te esperamos" titulo="Encuéntranos" />
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border border-dorado" />
            <div className="relative h-[420px] md:h-[480px]"><Mapa /></div>
          </div>
          <Adorno className="mt-14" />
        </div>
      </section>
    </>
  );
}
