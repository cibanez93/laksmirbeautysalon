export default function Home() {
  const servicios = [
    {
      nombre: "Peluquería",
      descripcion: "Cortes, coloración y tratamientos capilares.",
    },
    {
      nombre: "Manicura y Pedicura",
      descripcion: "Cuidado completo de manos y pies.",
    },
    {
      nombre: "Tratamientos Faciales",
      descripcion: "Higienes faciales y cuidados personalizados.",
    },
    {
      nombre: "Diseño de Mirada",
      descripcion: "Cejas, pestañas y micropigmentación.",
    },
  ];

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

      {/* Servicios */}
      <section id="servicios" className="px-8 py-24 bg-neutral-50">
        <h3 className="text-center text-sm uppercase tracking-[0.3em] text-neutral-400 mb-16">
          Nuestros servicios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {servicios.map((servicio) => (
            <div key={servicio.nombre} className="text-center">
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
        <p className="mb-2">Ripagaina, Pamplona</p>
        <p className="mb-2">laksmirbeauty@gmail.com</p>
        <p>© 2026 Laksmir Beauty Salon</p>
      </footer>
    </main>
  );
}