"use client";
// Lista de servicios con buscador. Es un componente de cliente porque el buscador
// filtra mientras escribes, sin recargar la página.
import { useState } from "react";
import { Adorno, FotoPendiente } from "@/components/web/decoracion";
import Link from "next/link";
import ServicioFila, { type ServicioLista } from "@/components/web/ServicioFila";
import type { Categoria } from "@/lib/categorias";
import { salon } from "@/lib/salon";


export interface GrupoServicios {
  categoria: Categoria;
  servicios: ServicioLista[];
}

// Quita tildes y mayúsculas para buscar "depilacion" y encontrar "Depilación"
const normalizar = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ListaServicios({ grupos }: { grupos: GrupoServicios[] }) {
  const [busqueda, setBusqueda] = useState("");
  const q = normalizar(busqueda.trim());

  const filtrados = q
    ? grupos
        .map((g) => ({ ...g, servicios: g.servicios.filter((s) => normalizar(`${s.nombre} ${s.descripcion}`).includes(q)) }))
        .filter((g) => g.servicios.length > 0)
    : grupos;
  const total = filtrados.reduce((n, g) => n + g.servicios.length, 0);

  return (
    <>
      {/* Buscador + accesos a cada sección */}
      <div className="sticky top-[73px] md:top-[81px] z-20 bg-crema/95 backdrop-blur -mx-4 px-4 py-4 border-b border-linea mb-12">
        <label htmlFor="buscar" className="sr-only">Buscar un servicio</label>
        <input
          id="buscar"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Busca un servicio: mechas, uñas, facial…"
          className="w-full bg-white border border-[#E0D3C2] px-5 py-3.5 text-base focus:border-dorado focus:outline-none"
        />
        {!q && (
          <nav aria-label="Categorías" className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible mt-3 pb-1">
            {grupos.map((g) => (
              <a key={g.categoria.slug} href={`#${g.categoria.slug}`} className="shrink-0 border border-linea bg-white px-3 py-1.5 text-xs uppercase tracking-wider text-neutral-700 hover:border-dorado hover:text-dorado-oscuro">
                {g.categoria.nombre}
              </a>
            ))}
          </nav>
        )}
        {q && (
          <p className="mt-3 text-sm text-neutral-500" aria-live="polite">
            {total === 0 ? "No hay servicios con ese nombre." : `${total} ${total === 1 ? "servicio encontrado" : "servicios encontrados"}`}
          </p>
        )}
      </div>

      {q && total === 0 && (
        <div className="text-center py-10">
          <p className="text-neutral-600 mb-6">Pregunta a nuestra asistente o reserva y te asesoramos en el salón.</p>
          <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="inline-block bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
            Reservar cita
          </a>
        </div>
      )}

      <div className="space-y-20">
        {filtrados.map((g) => (
          <section key={g.categoria.slug} id={g.categoria.slug} className="scroll-mt-48" aria-labelledby={`t-${g.categoria.slug}`}>
            {/* Cabecera de la sección: foto + título */}
            <div className="grid sm:grid-cols-[180px_1fr] gap-6 items-center mb-8">
              <FotoPendiente texto={g.categoria.nombre.toLowerCase()} className="hidden sm:block aspect-square rounded-t-full" />
              <div>
                <h2 id={`t-${g.categoria.slug}`} className="font-serif text-3xl md:text-4xl mb-2">{g.categoria.nombre}</h2>
                <p className="text-neutral-600">{g.categoria.intro}</p>
                <Link href={`/servicios/${g.categoria.slug}`} className="inline-block mt-2 text-xs uppercase tracking-widest text-dorado-oscuro hover:text-neutral-900">
                  Más sobre {g.categoria.nombre.toLowerCase()} →
                </Link>
                <Adorno className="justify-start mt-4" />
              </div>
            </div>

            {/* Lista elegante, estilo carta */}
            <ul className="divide-y divide-linea border-y border-linea">
              {g.servicios.map((s) => <ServicioFila key={s.id} servicio={s} />)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
