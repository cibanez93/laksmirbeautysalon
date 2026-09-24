import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Laksmir Beauty Salon | Web en mantenimiento",
  description: "Estamos renovando nuestra web. Puedes reservar tu cita en Booksy o llamarnos.",
};

export default function MantenimientoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 bg-white text-neutral-900">
      <Image src="/logo.png" alt="Laksmir Beauty Salon" width={800} height={243} priority className="w-auto h-20 md:h-24 mb-12" />

      <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Estamos renovando nuestra web</p>
      <h1 className="text-3xl md:text-5xl font-light mb-6 max-w-xl">Volvemos muy pronto</h1>
      <p className="text-neutral-600 max-w-md mb-10">
        Mientras tanto, puedes seguir reservando tu cita como siempre.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <a
          href="https://booksy.com/es-es/17203_laksmir-beauty_peluqueria_54309_sarriguren"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-900 text-white px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors"
        >
          Reservar en Booksy
        </a>
        <a
          href="tel:+34948042190"
          className="border border-neutral-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-900 hover:text-white transition-colors"
        >
          Llamar al 948 04 21 90
        </a>
      </div>

      <div className="text-sm text-neutral-500 space-y-1">
        <p>Calle la Valeta 1, Sarriguren (Navarra)</p>
        <p>
          <a href="https://www.instagram.com/laksmirbeauty/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 underline underline-offset-4">
            @laksmirbeauty
          </a>
        </p>
      </div>
    </main>
  );
}
