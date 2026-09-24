import { supabase } from "../lib/supabase";
import Image from "next/image";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

async function getServicios(): Promise<{ data: Servicio[]; error: boolean }> {
  const { data, error } = await supabase
    .from("servicios")
    .select("id, nombre, descripcion")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al traer los servicios:", error);
    return { data: [], error: true };
  }

  return { data: data ?? [], error: false };
}

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Laksmir Beauty Salon",
  telephone: "+34948042190",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle la Valeta 1",
    addressLocality: "Valle de Egues",
    addressRegion: "Navarra",
    addressCountry: "ES",
  },
  url: "https://laksmirbeautysalon.com",
};

export default async function Home() {
  const { data: servicios, error } = await getServicios();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      <header className="flex items-center justify-between px-8 py-3 border-b border-neutral-100">
        <a href="/" aria-label="Laksmir Beauty Salon - Inicio">
          <span className="sr-only">Laksmir Beauty Salon</span>
          <Image
            src="/logo.png"
            alt=""
            aria-hidden="true"
            width={800}
            height={243}
            priority
            className="w-auto h-16 md:h-20"
          />
        </a>
        <nav aria-label="Navegacion principal" className="hidden md:flex gap-8 text-sm uppercase tracking-wide text-neutral-600">
          <a href="#servicios" className="hover:text-neutral-900 transition-colors">Servicios</a>
          <a href="#reservas" className="hover:text-neutral-900 transition-colors">Reservas</a>
          <a href="#contacto" className="hover:text-neutral-900 transition-colors">Contacto</a>
        </nav>
      </header>

      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Belleza y bienestar</p>
        <h1 className="text-4xl md:text-6xl font-light mb-6 max-w-2xl">Permitete brillar</h1>
        <p className="text-neutral-600 max-w-md mb-10">Peluqueria y estetica profesional en Pamplona. Reserva tu cita y dejate cuidar.</p>
        <a href="#reservas" className="border border-neutral-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-900 hover:text-white transition-colors">Reservar cita</a>
      </section>

      <section id="servicios" className="px-8 py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-neutral-200 pb-6">
            <h2 className="text-2xl font-light">Nuestros servicios</h2>
            <span className="hidden md:block text-xs uppercase tracking-widest text-neutral-400">
              Peluqueria &amp; Estetica
            </span>
          </div>

          {error ? (
            <p className="text-neutral-500">No se han podido cargar los servicios. Intentalo de nuevo mas tarde.</p>
          ) : servicios.length === 0 ? (
            <p className="text-neutral-500">Proximamente publicaremos nuestro catalogo de servicios.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14">
              {servicios.map((servicio, index) => (
                <div key={servicio.id} className="border-t border-neutral-200 pt-6">
                  <span className="text-xs text-neutral-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-light mt-2 mb-3">{servicio.nombre}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{servicio.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="reservas" className="px-8 py-24 text-center">
        <h2 className="text-3xl font-light mb-6">Reserva tu cita</h2>
        <p className="text-neutral-500 max-w-md mx-auto mb-10">Elige el servicio y el horario que mejor te convenga.</p>
        
          <a href="https://booksy.com/es-es/17203_laksmir-beauty_peluqueria_54309_sarriguren"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-neutral-900 text-white px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors"
        >
          Ver disponibilidad
        </a>
      </section>

      <footer id="contacto" className="px-8 py-16 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-neutral-500">
          <div>
            <h3 className="font-brand text-xl text-neutral-900 mb-3">Laksmir</h3>
            <p>Beauty Salon</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Direccion</h4>
            <p>Calle la Valeta 1</p>
            <p>Valle de Egues, Navarra</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Contacto</h4>
            <p>+34 948 042 190</p>
          </div>
        </div>
        <p className="max-w-5xl mx-auto mt-10 pt-6 border-t border-neutral-100 text-xs text-neutral-400">
          Copyright 2026 Laksmir Beauty Salon. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}