import { supabase } from "../lib/supabase";

// Esta función se ejecuta en el servidor antes de mostrar la página,
// y trae los servicios directamente desde la base de datos de Supabase
async function getServicios() {
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al traer los servicios:", error);
    return [];
  }

  return data;
}

export default async function Home() {
  const servicios = await getServicios();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Cabecera */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
        <h1 className="text-xl font-light tracking-widest uppercase">
          Laksmir Beauty Salon
        </h1>
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wide text-neutral-600">
          <a href="#servicios" className="hover:text-neutral-900">Servicios</a>
          <a href="#reservas" className="hover:text-neutral-900">Reservas</a>
          <a href="#contacto" className="hover:text-neutral-900">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-4">
          Belleza y bienestar
        </p>
        <h2 className="text-4xl md:text-6xl font-light mb-6 max-w-2xl">
          Permítete brillar
        </h2>
        <p className="text-neutral-500 max-w-md mb-10">
          Peluquería y estética profesional. Reserva tu cita y déjate cuidar.
        </p>
        
          <a href="#reservas"
          className="border border-neutral-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-900 hover:text-white transition-colors"
        >
          Reservar cita
        </a>
      </section>

      {/* Servicios — ahora vienen de Supabase */}
      <section id="servicios" className="px-8 py-24 bg-neutral-50">
        <h3 className="text-center text-sm uppercase tracking-[0.3em] text-neutral-400 mb-16">
          Nuestros servicios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="text-center">
              <h4 className="text-lg font-light mb-3">{servicio.nombre}</h4>
              <p className="text-sm text-neutral-500">{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reservas */}
      <section id="reservas" className="px-8 py-24 text-center">
        <h3 className="text-3xl font-light mb-6">Reserva tu cita</h3>
        <p className="text-neutral-500 max-w-md mx-auto mb-10">
          Elige el servicio y el horario que mejor te convenga.
        </p>
        
        <a href="#"
          className="inline-block bg-neutral-900 text-white px-8 py-3 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors"
        >
          Ver disponibilidad
        </a>
      </section>

      {/* Contacto / Footer */}
      <footer id="contacto" className="px-8 py-16 border-t border-neutral-100 text-center text-sm text-neutral-500">
        <p>© 2024 Laksmir Beauty Salon. Todos los derechos reservados.</p>
        <p className="mt-2">Dirección: Calle la Valeta 1, Valle de egües, Navarra</p>
        <p className="mt-2">Teléfono: +34 948 042 190</p>
      </footer>
    </main>
  );
}