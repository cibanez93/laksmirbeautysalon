"use client";
// Lista de artículos estilo revista, con filtro por categoría
import Link from "next/link";
import { useState } from "react";
import type { TemaBlog } from "@/lib/blog";

interface Props {
  articulos: { slug: string; titulo: string; resumen: string; tema: string; fecha: string; fechaTexto: string; minutos: number }[];
  temas: TemaBlog[];
}

export default function ListaArticulos({ articulos, temas }: Props) {
  const [filtro, setFiltro] = useState<string | null>(null);
  const visibles = filtro ? articulos.filter((a) => a.tema === filtro) : articulos;
  const nombre = (slug: string) => temas.find((t) => t.slug === slug)?.nombre ?? slug;

  const boton = (activo: boolean) =>
    `px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${activo ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-linea text-neutral-700 hover:border-dorado"}`;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-14" role="group" aria-label="Filtrar por tema">
        <button type="button" onClick={() => setFiltro(null)} className={boton(filtro === null)} aria-pressed={filtro === null}>Todos</button>
        {temas.map((c) => (
          <button key={c.slug} type="button" onClick={() => setFiltro(c.slug)} className={boton(filtro === c.slug)} aria-pressed={filtro === c.slug}>
            {c.nombre}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="text-center text-neutral-500">Todavía no hay artículos de este tema.</p>
      ) : (
        <ol className="divide-y divide-linea border-y border-linea">
          {visibles.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className="group grid md:grid-cols-[160px_1fr] gap-2 md:gap-10 py-10">
                <div className="text-xs uppercase tracking-widest text-neutral-500">
                  <time dateTime={a.fecha}>{a.fechaTexto}</time>
                  <p className="text-dorado-oscuro mt-1">{nombre(a.tema)}</p>
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl leading-snug group-hover:text-dorado-oscuro transition-colors">{a.titulo}</h2>
                  <p className="text-neutral-600 mt-3 leading-relaxed">{a.resumen}</p>
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mt-4">
                    {a.minutos} min de lectura · <span className="border-b border-neutral-900 pb-0.5 text-neutral-900 group-hover:text-dorado-oscuro group-hover:border-dorado-oscuro">Leer</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
