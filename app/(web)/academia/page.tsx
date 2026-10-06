// Página de LAKSMIR ACADEMY: cursos para clientas y profesionales, presenciales y online.
// Los cursos se crean en el panel (Academia). Mientras no haya ninguno, se ven los de ejemplo.
// Todavía no se pueden comprar.
import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { Adorno, TituloSeccion } from "@/components/web/decoracion";
import { cursosEjemplo, preguntasAcademia, type Curso } from "@/lib/academia";
import { aCursoWeb, listarCursosActivos } from "@/lib/cursos";
import { salon } from "@/lib/salon";
import ElegirCurso from "./ElegirCurso";

export const metadata: Metadata = {
  title: "Laksmir Academy: cursos de belleza en Pamplona | Laksmir Beauty Salon",
  description: "Cursos de maquillaje, peluquería, uñas y estética en Ripagaina (Pamplona) y online. Para aprender a cuidarte y para profesionales que quieren crecer.",
};

const formatosTexto = [
  { titulo: "Presencial", texto: `En nuestro salón de ${salon.direccion.localidad}, con fecha y plazas limitadas. Practicas con nosotras a tu lado.` },
  { titulo: "Online", texto: "Vídeos para ver a tu ritmo, desde el móvil o el ordenador, tantas veces como quieras." },
];

const mensajeWhatsapp = encodeURIComponent("Hola, me gustaría que me avisarais de los próximos cursos de Laksmir Academy.");

// Los cursos del panel; si no hay ninguno o la base de datos falla, los de ejemplo
async function getCursos(): Promise<Curso[]> {
  try {
    const cursos = await listarCursosActivos();
    return cursos.length > 0 ? cursos.map(aCursoWeb) : cursosEjemplo;
  } catch (error) {
    console.error("Error al traer los cursos:", error);
    return cursosEjemplo;
  }
}

export default async function AcademiaPage() {
  await connection();
  const cursos = await getCursos();

  return (
    <>
      {/* Portada con el logo de la academia */}
      <section className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-4 md:px-8 py-16 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-4">Laksmir Academy</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">Aprende con nosotras</h1>
          <p className="text-neutral-600 text-lg leading-relaxed mb-10 max-w-md">
            Cursos de belleza para cuidarte en casa y para profesionales que quieren seguir creciendo. En el salón o online, a tu ritmo.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#cursos" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">Elige tu curso</a>
          </div>
        </div>
        <div className="relative max-w-md w-full mx-auto">
          <div aria-hidden="true" className="absolute inset-0 -translate-x-4 -translate-y-4 rounded-full border border-dorado" />
          <Image src="/logo-academy.jpg" alt="Logotipo de Laksmir Academy" width={1448} height={1086} priority className="relative w-full aspect-square object-cover rounded-full" />
        </div>
      </section>

      {/* La pregunta y, según la respuesta, los cursos */}
      <section id="cursos" className="scroll-mt-24 bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Empieza aquí" titulo="¿Para quién es el curso?" />
          <ElegirCurso cursos={cursos} />
        </div>
      </section>

      {/* Presencial u online */}
      <section className="bg-neutral-900 text-white py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-dorado mb-3">Como prefieras</p>
            <h2 className="font-serif text-3xl md:text-4xl">Presencial u online</h2>
            <Adorno className="mt-5" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {formatosTexto.map((f) => (
              <div key={f.titulo} className="border border-dorado/40 p-8 text-center">
                <h3 className="font-serif text-2xl text-dorado mb-3">{f.titulo}</h3>
                <p className="text-neutral-300 leading-relaxed">{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <TituloSeccion antetitulo="Dudas" titulo="Preguntas frecuentes" />
          <div className="divide-y divide-linea border-y border-linea">
            {preguntasAcademia.map((p) => (
              <details key={p.pregunta} className="group py-5">
                <summary className="flex justify-between gap-4 cursor-pointer list-none font-serif text-xl">
                  {p.pregunta}
                  <span className="text-dorado transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-neutral-600 leading-relaxed">{p.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Aviso de nuevos cursos */}
      <section className="bg-arena py-16 px-4 md:px-8 text-center">
        <p className="font-serif text-3xl mb-3">¿Quieres enterarte de los próximos cursos?</p>
        <p className="text-neutral-600 mb-8">Escríbenos y te avisamos en cuanto abramos nuevas fechas.</p>
        <a
          href={`https://wa.me/${salon.whatsapp}?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors"
        >
          WhatsApp
        </a>
      </section>
    </>
  );
}
