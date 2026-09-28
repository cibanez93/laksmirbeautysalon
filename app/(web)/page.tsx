// Página de INICIO
// Las fotos y los servicios destacados se eligen en el panel (Destacados); si no hay ninguno
// elegido, se ven los de ejemplo. El antes/después es el más reciente de la galería.
import Link from "next/link";
import { connection } from "next/server";
import AbiertoAhora from "@/components/web/AbiertoAhora";
import AntesDespues from "@/components/web/AntesDespues";
import AsistentePortada from "@/components/web/chat/AsistentePortada";
import { Esquinas, FotoDestacada, TituloSeccion } from "@/components/web/decoracion";
import TarjetaProfesional from "@/components/web/TarjetaProfesional";
import { duracionBonita, nombreBonito } from "@/lib/categorias";
import { obtenerDestacadosSeguro } from "@/lib/destacados";
import { obtenerOpiniones } from "@/lib/opiniones";
import { equipo } from "@/lib/equipo";
import { listarFotos, urlFoto, urlFotoAntes } from "@/lib/fotos";
import { salon } from "@/lib/salon";
import { sinPrecios } from "@/lib/texto";

const categorias = [
  { nombre: "Peluquería", slug: "peluqueria", servicios: 18, tono: "from-[#E9DCCB] to-[#D8C3A8]" },
  { nombre: "Tratamientos faciales", slug: "tratamientos-faciales", servicios: 13, tono: "from-[#F1E6DA] to-[#E2CDB5]" },
  { nombre: "Manicura", slug: "manicura", servicios: 13, tono: "from-[#EADBD0] to-[#D9BFAE]" },
  { nombre: "Pedicura", slug: "pedicura", servicios: 7, tono: "from-[#F2E6DC] to-[#DEC6B2]" },
  { nombre: "Diseño de mirada", slug: "diseno-de-mirada", servicios: 7, tono: "from-[#EFE4D6] to-[#DCC6AB]" },
  { nombre: "Tratamientos corporales", slug: "tratamientos-corporales", servicios: 4, tono: "from-[#E6DDD0] to-[#CFBEA6]" },
  { nombre: "Masajes", slug: "masajes", servicios: 3, tono: "from-[#EDE3D8] to-[#D6C1A9]" },
  { nombre: "Maquillaje", slug: "maquillaje", servicios: 2, tono: "from-[#F0E2D7] to-[#DDC3B0]" },
];

// Servicios destacados de ejemplo: se usan mientras no se elijan otros en el panel (Destacados)
const destacadosEjemplo = [
  { nombre: "Experiencia Brûlée", categoria: "Peluquería", descripcion: "Diagnóstico capilar, diseño del color, balayage premium y tratamiento reparador.", duracion: "5 h" },
  { nombre: "Limpieza facial profunda", categoria: "Tratamientos faciales", descripcion: "Purifica y oxigena la piel con tecnología profesional y oxígeno puro.", duracion: "60 min" },
  { nombre: "Balayage", categoria: "Peluquería", descripcion: "Mechas a mano alzada con un degradado suave y natural, diseñadas a medida para iluminar tu melena.", duracion: "3 h 30 min" },
];


// Datos para Google (schema.org): ayudan a salir en búsquedas locales
const datosGoogle = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: salon.nombre,
  telephone: "+34948042190",
  url: salon.web,
  image: `${salon.web}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: salon.direccion.calle,
    postalCode: salon.direccion.cp,
    addressLocality: salon.direccion.localidad,
    addressRegion: salon.direccion.provincia,
    addressCountry: "ES",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "13:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
  sameAs: [salon.instagram.url, salon.booksy],
};

// El antes/después más reciente subido desde el panel (o uno de ejemplo si no hay)
async function AntesDespuesPortada() {
  await connection();
  const ultima = await listarFotos({ soloVisibles: true })
    .then((lista) => lista.find((f) => f.tipo === "antes_despues"))
    .catch((error) => {
      console.error("Error al traer el antes/después:", error);
      return undefined;
    });
  if (!ultima) return <AntesDespues titulo="Mechas balayage" />;
  return <AntesDespues titulo={ultima.titulo} antes={urlFotoAntes(ultima.id)} despues={urlFoto(ultima.id)} />;
}

// Recorta un texto largo a unas 140 letras sin cortar palabras
const recortar = (t: string) => (t.length <= 140 ? t : `${t.slice(0, 140).replace(/\s+\S*$/, "")}…`);

export default async function InicioPage() {
  await connection();
  const [d, opiniones] = await Promise.all([obtenerDestacadosSeguro(), obtenerOpiniones()]);
  const destacados = destacadosEjemplo.map((ejemplo, i) => {
    const elegido = d[`destacado-${i + 1}`];
    const s = elegido?.servicio;
    const datos = s
      ? { nombre: nombreBonito(s.nombre), categoria: s.categoria ?? "", descripcion: recortar(sinPrecios(s.descripcion)), duracion: duracionBonita(s.duracion_min) ?? "" }
      : ejemplo;
    return { ...datos, clave: `destacado-${i + 1}`, fotoId: elegido?.foto_id };
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosGoogle) }} />

      {/* Portada */}
      <section className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-4 md:px-8 py-16 md:py-24 overflow-hidden md:overflow-visible">
        <span aria-hidden="true" className="pointer-events-none select-none absolute -top-6 -left-4 md:-left-10 font-brand text-[18rem] md:text-[26rem] leading-none text-dorado/10">L</span>
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-5">Peluquería y estética · Ripagaina, Pamplona</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6">
            Tu momento<br />para <em className="text-dorado-oscuro">brillar</em>
          </h1>
          <p className="text-neutral-600 text-lg leading-relaxed max-w-md mb-10">
            Un espacio cercano donde cuidamos tu cabello, tu piel y tu mirada con productos profesionales y mucho mimo.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
              Reservar cita
            </a>
            <a href="#asistente" className="border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">
              ¿Qué necesito?
            </a>
          </div>
          <div className="mb-8">
            <AbiertoAhora />
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="font-serif text-3xl">{opiniones.google.nota} <span className="text-dorado">★</span></p>
              <p className="text-neutral-500">{opiniones.google.total} opiniones en Google</p>
            </div>
            <div className="w-px bg-[#E0D3C2]" />
            <div>
              <p className="font-serif text-3xl">{opiniones.booksy.nota} <span className="text-dorado">★</span></p>
              <p className="text-neutral-500">{opiniones.booksy.total} opiniones en Booksy</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 translate-x-4 -translate-y-4 rounded-t-full border border-dorado" />
          <FotoDestacada id={d.portada?.foto_id} texto="Interior del salón" className="relative aspect-[4/5] rounded-t-full" />
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Lo que hacemos" titulo="Nuestros servicios" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categorias.map((c, i) => (
              <Link key={c.slug} href={`/servicios/${c.slug}`} className={`group ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <div className={`relative bg-gradient-to-br ${c.tono} ${i === 0 ? "aspect-square" : "aspect-[4/3]"} mb-3 transition-transform group-hover:-translate-y-1`}>
                  {d[`categoria-${c.slug}`]?.foto_id && (
                    <div className="absolute inset-0">
                      <FotoDestacada id={d[`categoria-${c.slug}`].foto_id} texto={c.nombre} className="h-full" />
                    </div>
                  )}
                  <div className="absolute inset-3 border border-white/70 transition-colors group-hover:border-dorado" />
                </div>
                <h3 className={`font-serif ${i === 0 ? "text-2xl" : "text-lg"} group-hover:text-dorado-oscuro transition-colors`}>{c.nombre}</h3>
                <p className="text-xs uppercase tracking-wider text-neutral-500">{c.servicios} servicios →</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/servicios" className="inline-block border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Asistente */}
      <section id="asistente" className="scroll-mt-24 px-4 md:px-8 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Asistente con inteligencia artificial</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">¿No sabes qué elegir? Pregúntanos</h2>
            <p className="text-neutral-600 mb-6">
              Nuestra asistente conoce todos nuestros servicios y responde a cualquier hora. Cuéntale qué buscas o toca una de las preguntas y te recomendará lo mejor para ti.
            </p>
            <ul className="space-y-2 text-sm text-neutral-700">
              {["Qué incluye y cuánto dura cada servicio", "Recomendaciones según tu piel y tu cabello", "Packs para novias y eventos", "Te lleva directa a reservar"].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-dorado" aria-hidden="true">◆</span>{t}</li>
              ))}
            </ul>
          </div>
          <AsistentePortada />
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Los más pedidos" titulo="Servicios destacados" />
          <div className="grid md:grid-cols-3 gap-6">
            {destacados.map((s) => (
              <article key={s.clave} className="relative bg-crema border border-[#EDE3D6] flex flex-col">
                <Esquinas />
                <FotoDestacada id={s.fotoId} texto={s.nombre} className="aspect-[3/2]" />
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[11px] uppercase tracking-widest text-dorado-oscuro mb-2">{s.categoria}</p>
                  <h3 className="font-serif text-xl mb-2">{s.nombre}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6 flex-1">{s.descripcion}</p>
                  <div className="flex items-center justify-between border-t border-linea pt-4">
                    <p className="text-xs uppercase tracking-wider text-neutral-500">{s.duracion}</p>
                    <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest border-b border-neutral-900 pb-0.5 hover:text-dorado-oscuro hover:border-dorado-oscuro">
                      Reservar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Antes / después */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <AntesDespuesPortada />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Resultados reales</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Desliza y descubre el cambio</h2>
            <p className="text-neutral-600 mb-8">Arrastra la barra para comparar el antes y el después de nuestros trabajos de color, alisado y tratamientos faciales.</p>
            <Link href="/galeria" className="text-sm uppercase tracking-widest border-b border-neutral-900 pb-1 hover:text-dorado-oscuro hover:border-dorado-oscuro">Ver la galería</Link>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <TituloSeccion antetitulo="Quiénes somos" titulo="Nuestro equipo" />
          <p className="text-center text-neutral-600 max-w-2xl mx-auto -mt-4 mb-14">
            Tres profesionales que se forman continuamente y trabajan con productos y aparatología de uso profesional. Te asesoramos con sinceridad y solo te recomendamos lo que de verdad necesitas.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 items-center">
            {equipo.map((p) => <TarjetaProfesional key={p.nombre} p={p} fotoId={d[`equipo-${p.nombre.toLowerCase()}`]?.foto_id} />)}
          </div>
        </div>
      </section>

      {/* Novias */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2">
          <FotoDestacada id={d.novias?.foto_id} texto="Novia peinada y maquillada" className="aspect-[4/3] md:aspect-auto md:min-h-[420px]" />
          <div className="relative px-8 md:px-14 py-16 flex flex-col justify-center">
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-dorado/40" />
            <p className="text-xs uppercase tracking-[0.3em] text-dorado mb-3">Bodas y eventos</p>
            <h2 className="font-serif text-4xl mb-5">Novias Laksmir</h2>
            <p className="text-neutral-300 leading-relaxed mb-8">Peinado, maquillaje, manicura y tratamientos previos a la boda. Te acompañamos desde la prueba hasta el gran día.</p>
            <Link href="/novias" className="self-start border border-dorado text-dorado text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado hover:text-neutral-900 transition-colors">
              Calcula tu pack de novia
            </Link>
          </div>
        </div>
      </section>

      {/* Tarjeta regalo */}
      <section className="px-4 md:px-8 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">El regalo perfecto</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Regala un momento Laksmir</h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">Tarjetas regalo para cualquier servicio. Cómpralas en Booksy en un minuto.</p>
        <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="inline-block bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
          Comprar tarjeta regalo
        </a>
      </section>
    </>
  );
}
