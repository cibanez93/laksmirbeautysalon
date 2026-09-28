"use client";
// Bonos regalo de servicios, con filtro por categoría
import { useState } from "react";
import BotonAnadir from "@/components/tienda/BotonAnadir";
import { FotoDestacada } from "@/components/web/decoracion";
import { euros } from "@/lib/tienda";

export interface Bono {
  id: number;
  fotoId: number | null;
  nombre: string;
  categoria: string; // nombre de la categoría
  duracion: string | null;
  precio: number;
}

export default function ListaBonos({ bonos, categorias }: { bonos: Bono[]; categorias: string[] }) {
  const [filtro, setFiltro] = useState<string | null>(null);
  const visibles = filtro ? bonos.filter((b) => b.categoria === filtro) : bonos;
  const boton = (activo: boolean) =>
    `shrink-0 px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${activo ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-linea text-neutral-700 hover:border-dorado"}`;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto md:flex-wrap md:justify-center pb-2 mb-10" role="group" aria-label="Filtrar bonos por categoría">
        <button type="button" onClick={() => setFiltro(null)} className={boton(filtro === null)} aria-pressed={filtro === null}>Todos</button>
        {categorias.map((c) => (
          <button key={c} type="button" onClick={() => setFiltro(c)} className={boton(filtro === c)} aria-pressed={filtro === c}>{c}</button>
        ))}
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibles.map((b) => (
          <li key={b.id} className="bg-white border border-linea flex flex-col">
            {b.fotoId && <FotoDestacada id={b.fotoId} texto={b.nombre} className="aspect-[3/2]" />}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-[11px] uppercase tracking-widest text-dorado-oscuro mb-1">{b.categoria}</p>
              <h3 className="font-serif text-lg leading-snug mb-2">{b.nombre}</h3>
              {b.duracion && <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">{b.duracion}</p>}
              <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-linea">
                <p className="font-serif text-xl">{euros(b.precio)}</p>
                <BotonAnadir articulo={{ id: `bono-${b.id}`, tipo: "bono", nombre: `Bono regalo: ${b.nombre}`, detalle: b.categoria, precio: b.precio }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
