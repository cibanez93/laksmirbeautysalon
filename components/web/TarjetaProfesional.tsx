// Tarjeta de una profesional del equipo, con botón para reservar con ella.
// Con destacar={false} todas las tarjetas salen iguales, sin la etiqueta de fundadora.
import type { Profesional } from "@/lib/equipo";
import { salon } from "@/lib/salon";
import { Adorno, FotoDestacada } from "./decoracion";

export default function TarjetaProfesional({ p: profesional, destacar = true, fotoId }: { p: Profesional; destacar?: boolean; fotoId?: number | null }) {
  const p = { ...profesional, fundadora: destacar && profesional.fundadora };
  return (
    <article
      className={`relative flex flex-col text-center bg-crema border px-6 py-8 ${p.fundadora ? "border-dorado md:-my-6 md:py-10 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] order-first md:order-none" : "border-[#EDE3D6] md:py-6"}`}
    >
      {p.fundadora && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-dorado text-white text-[10px] uppercase tracking-[0.25em] px-3 py-1">Fundadora</span>
      )}
      <FotoDestacada id={fotoId} texto={p.nombre} className={`mx-auto rounded-t-full aspect-[3/4] ${p.fundadora ? "w-44 md:w-48" : "w-36 md:w-40"}`} />
      <h3 className={`font-serif mt-6 ${p.fundadora ? "text-3xl" : "text-2xl"}`}>{p.nombre}</h3>
      <p className="text-[11px] uppercase tracking-[0.25em] text-dorado-oscuro mt-1">{p.cargo}</p>
      <Adorno className="my-4" />
      <ul className="flex flex-wrap justify-center gap-1.5 mb-4">
        {p.especialidades.map((e) => (
          <li key={e} className="border border-[#E0D3C2] bg-white px-2.5 py-1 text-[11px] text-neutral-700">{e}</li>
        ))}
      </ul>
      <p className="text-sm text-neutral-600 leading-relaxed mb-6">{p.texto}</p>
      <a
        href={salon.booksy}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto text-xs uppercase tracking-widest px-5 py-3 transition-colors ${p.fundadora ? "bg-neutral-900 text-white hover:bg-dorado-oscuro" : "border border-neutral-900 hover:bg-neutral-900 hover:text-white"}`}
      >
        Reservar con {p.nombre}
      </a>
    </article>
  );
}
