// Página NOSOTRAS: historia, valores, equipo en detalle, el salón y las marcas.
// BORRADOR: la historia y los valores los tiene que revisar Carla.
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Adorno, Esquinas, FotoDestacada, FotoPendiente, TituloSeccion } from "@/components/web/decoracion";
import { obtenerDestacadosSeguro } from "@/lib/destacados";
import Loto from "@/components/web/Loto";
import { categorias } from "@/lib/categorias";
import { equipo } from "@/lib/equipo";
import { salon } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Nosotras: el equipo de Laksmir Beauty Salon en Ripagaina, Pamplona",
  description: "Conoce a Carla, Helen y Erika, el equipo de Laksmir Beauty Salon. Peluquería y estética profesional en Ripagaina desde 2020.",
};

const APERTURA = 2020;

const valores = [
  { titulo: "Trato cercano", texto: "Te escuchamos y nos tomamos el tiempo de entender qué buscas. Aquí no eres una cita más." },
  { titulo: "Sinceridad", texto: "Solo te recomendamos lo que de verdad necesitas, aunque sea menos de lo que venías a pedir." },
  { titulo: "Calidad profesional", texto: "Trabajamos con productos y aparatología de uso profesional para que los resultados se noten y duren." },
  { titulo: "Formación continua", texto: "Nos formamos constantemente para ofrecerte las últimas técnicas y tratamientos." },
];

const marcas = ["Wella Professionals", "SP System Professional", "Casmara", "Kinetics", "Tanino Therapy"];

export default async function NosotrasPage() {
  await connection();
  const d = await obtenerDestacadosSeguro();
  const años = new Date().getFullYear() - APERTURA;
  const nombreCategoria = (slug: string) => categorias.find((c) => c.slug === slug)?.nombre ?? slug;

  return (
    <>
      {/* Historia */}
      <section className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-4 md:px-8 py-16 md:py-24">
        <div className="relative order-2 md:order-1">
          <div aria-hidden="true" className="absolute inset-0 -translate-x-4 -translate-y-4 rounded-t-full border border-dorado" />
          <FotoDestacada id={d.portada?.foto_id} texto="El equipo en el salón" className="relative aspect-[4/5] rounded-t-full" />
          <div className="absolute -bottom-6 -right-2 md:-right-6 bg-white shadow-sm px-6 py-5 border border-linea text-center">
            <p className="font-serif text-4xl text-dorado-oscuro">{APERTURA}</p>
            <p className="text-[11px] uppercase tracking-widest text-neutral-500">Desde entonces en Ripagaina</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-4">Nuestra historia</p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Nosotras somos Laksmir</h1>
          <div className="space-y-4 text-neutral-600 text-lg leading-relaxed">
            <p>
              Laksmir abrió sus puertas en {APERTURA} en el barrio de Ripagaina, Pamplona, con una idea clara: crear un espacio cercano donde cuidarse de pies a cabeza sea un placer y cada persona se sienta escuchada.
            </p>
            <p>
              {años > 1 ? `Hoy, ${años} años después, ` : "Hoy "}somos un equipo de tres profesionales de la peluquería y la estética que comparten la misma forma de trabajar: con mimo, con sinceridad y con productos profesionales.
            </p>
          </div>
          <div className="mt-8 flex gap-10">
            <div>
              <p className="font-serif text-3xl">{salon.opiniones.booksy.total + salon.opiniones.google.total}+</p>
              <p className="text-sm text-neutral-500">opiniones de clientas</p>
            </div>
            <div className="w-px bg-[#E0D3C2]" />
            <div>
              <p className="font-serif text-3xl">{categorias.length}</p>
              <p className="text-sm text-neutral-500">especialidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* El nombre */}
      <section className="bg-neutral-900 text-white px-4 md:px-8 py-20">
        <div className="relative max-w-3xl mx-auto text-center py-10 px-6 md:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-dorado/40" />
          <Loto className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[28rem] max-w-[90%] h-auto text-dorado/10" grosor={0.5} />
          <p className="relative text-xs uppercase tracking-[0.3em] text-dorado mb-4">El nombre</p>
          <p className="relative font-brand text-5xl md:text-6xl mb-4">Laksmir</p>
          <Adorno className="mb-8" />
          <p className="relative text-neutral-200 text-lg leading-relaxed">
            Laksmir es una palabra creada por la fundadora, inspirada en <em className="text-dorado not-italic font-serif text-xl">Lakshmi</em>, la diosa de la belleza y la abundancia en la India. Modificamos un poco el nombre para darle personalidad propia: así nació Laksmir. Un nombre con mucho significado para ella, que resume lo que queremos para cada persona que entra por la puerta: que se sienta bella y cuidada.
          </p>

          {/* La leyenda, contada con nuestras palabras */}
          <div className="relative mt-12 pt-10 border-t border-dorado/30 text-left space-y-5 text-neutral-300 leading-relaxed">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-dorado">La leyenda de Lakshmi</p>
            <p>
              Cuenta la mitología de la India que, hace mucho tiempo, dioses y demonios unieron sus fuerzas para batir el gran océano de leche. Durante días y noches removieron sus aguas sin descanso, y de sus profundidades fueron surgiendo tesoros maravillosos.
            </p>
            <p>
              El más bello de todos llegó al final: Lakshmi, que emergió de las aguas sentada sobre una flor de loto abierta, radiante, llevando consigo la belleza, la abundancia y la buena fortuna allá donde iba.
            </p>
            <p>
              El loto es su símbolo porque nace en el barro y, aun así, florece limpio y luminoso sobre el agua. Es la belleza que siempre está ahí y solo necesita el cuidado adecuado para salir a la luz.
            </p>
            <p className="font-serif text-xl text-white text-center pt-4">
              Eso es lo que hacemos en Laksmir: sacar a la luz la belleza que ya llevas dentro.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Cómo trabajamos" titulo="Nuestros valores" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v, i) => (
              <div key={v.titulo} className="relative bg-crema border border-[#EDE3D6] p-7">
                <Esquinas />
                <p className="font-serif text-4xl text-dorado mb-4">0{i + 1}</p>
                <h3 className="font-serif text-xl mb-2">{v.titulo}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo en detalle */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <TituloSeccion antetitulo="Quiénes somos" titulo="Nuestro equipo" />
          <div className="space-y-20">
            {[...equipo].sort((a, b) => Number(!!b.fundadora) - Number(!!a.fundadora)).map((p, i) => (
              <article key={p.nombre} className={`grid gap-8 md:gap-14 items-center ${i % 2 ? "md:grid-cols-[3fr_2fr] md:[&>*:first-child]:order-2" : "md:grid-cols-[2fr_3fr]"}`}>
                <div className="relative">
                  <div aria-hidden="true" className={`absolute inset-0 translate-y-4 rounded-t-full border border-dorado ${i % 2 ? "-translate-x-4" : "translate-x-4"}`} />
                  <FotoDestacada id={d[`equipo-${p.nombre.toLowerCase()}`]?.foto_id} texto={p.nombre} className="relative aspect-[3/4] rounded-t-full" />
                </div>
                <div>
                  {p.fundadora && <span className="inline-block bg-dorado text-white text-[10px] uppercase tracking-[0.25em] px-3 py-1 mb-4">Fundadora</span>}
                  <h3 className="font-serif text-4xl">{p.nombre}</h3>
                  <p className="text-xs uppercase tracking-[0.25em] text-dorado-oscuro mt-2">{p.cargo}</p>
                  <Adorno className="justify-start my-5" />
                  <div className="space-y-4 text-neutral-600 leading-relaxed mb-8">
                    {p.historia.map((parrafo) => <p key={parrafo.slice(0, 20)}>{parrafo}</p>)}
                  </div>
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Puedes reservar con {p.nombre}</p>
                  <ul className="flex flex-wrap gap-2 mb-8">
                    {p.categorias.map((slug) => (
                      <li key={slug}>
                        <Link href={`/servicios/${slug}`} className="inline-block border border-linea bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-dorado hover:text-dorado-oscuro">
                          {nombreCategoria(slug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className={`inline-block text-xs uppercase tracking-widest px-6 py-3 transition-colors ${p.fundadora ? "bg-neutral-900 text-white hover:bg-dorado-oscuro" : "border border-neutral-900 hover:bg-neutral-900 hover:text-white"}`}>
                    Reservar con {p.nombre}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* El salón y las marcas */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Te esperamos" titulo="Nuestro salón" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-20">
            <FotoPendiente texto="fachada" className="col-span-2 row-span-2 aspect-square" />
            <FotoPendiente texto="zona de peluquería" className="aspect-square" />
            <FotoPendiente texto="cabina de estética" className="aspect-square" />
            <FotoPendiente texto="zona de manicura" className="aspect-square" />
            <FotoPendiente texto="detalle" className="aspect-square" />
          </div>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Solo lo mejor para ti</p>
            <h2 className="font-serif text-3xl mb-4">Marcas con las que trabajamos</h2>
            <Adorno className="mb-10" />
            <ul className="flex flex-wrap justify-center gap-4">
              {marcas.map((m) => (
                <li key={m} className="border border-linea bg-crema px-10 py-6 font-serif text-2xl tracking-wide text-neutral-700">{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Llamada final */}
      <section className="px-4 md:px-8 py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">¿Nos conocemos?</h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">Reserva tu cita y ven a conocernos. Te esperamos en {salon.direccion.calle}, {salon.direccion.localidad}.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">Reservar cita</a>
          <Link href="/contacto" className="border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">Cómo llegar</Link>
        </div>
      </section>
    </>
  );
}
