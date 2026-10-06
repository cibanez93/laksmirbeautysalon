"use client";
// Primero se pregunta «¿Para quién es el curso?» y, según la respuesta, aparecen los cursos.
// Los cursos están siempre en la página (para Google); solo se ocultan hasta elegir.
// Los presenciales se reservan añadiéndolos al carrito; los online, de momento, «Próximamente».
import Image from "next/image";
import { useState } from "react";
import BotonAnadir from "@/components/tienda/BotonAnadir";
import Loto from "@/components/web/Loto";
import { caminos, formatos, type Curso, type Formato, type Publico } from "@/lib/academia";
import { euros } from "@/lib/tienda";

const filtrosFormato: { valor: Formato | "todos"; texto: string }[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "presencial", texto: formatos.presencial },
  { valor: "online", texto: formatos.online },
];

function TarjetaCurso({ c, oculto }: { c: Curso; oculto: boolean }) {
  const completo = c.plazasLibres === 0;
  return (
    <li className={`relative bg-white border border-linea flex-col ${oculto ? "hidden" : "flex"}`}>
      {c.ejemplo && <span className="absolute z-10 top-3 right-3 bg-dorado text-white text-[10px] uppercase tracking-wider px-2 py-0.5">Ejemplo</span>}
      {c.fotoId && (
        <div className="relative aspect-[3/2] bg-neutral-100">
          <Image src={`/fotos/${c.fotoId}`} alt={c.nombre} fill unoptimized className="object-cover" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <p className="mb-4 text-[10px] uppercase tracking-widest">
          <span className={`px-2 py-1 ${c.formato === "online" ? "bg-neutral-900 text-white" : "bg-arena text-neutral-800"}`}>{formatos[c.formato]}</span>
        </p>
        <h3 className={`font-serif text-2xl leading-tight mb-3 ${c.ejemplo && !c.fotoId ? "pr-10" : ""}`}>{c.nombre}</h3>
        <p className="text-sm text-neutral-600 leading-relaxed mb-5">{c.descripcion}</p>
        <ul className="space-y-1.5 text-sm text-neutral-700 mb-6">
          {c.incluye.map((i) => (
            <li key={i} className="flex gap-2"><span className="text-dorado" aria-hidden="true">◆</span>{i}</li>
          ))}
        </ul>

        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm border-t border-linea pt-4 mb-5">
          {c.fecha && (<><dt className="text-neutral-500">Fecha</dt><dd>{c.fecha}</dd></>)}
          <dt className="text-neutral-500">Duración</dt><dd>{c.duracion}</dd>
          {c.plazas !== undefined && (
            <>
              <dt className="text-neutral-500">Plazas</dt>
              <dd className={c.plazasLibres !== undefined && c.plazasLibres <= 2 ? "text-dorado-oscuro font-medium" : ""}>
                {completo ? "Completo" : `Quedan ${c.plazasLibres} de ${c.plazas}`}
              </dd>
            </>
          )}
        </dl>

        <div className="flex items-center justify-between gap-4">
          <p className="font-serif text-3xl">{euros(c.precio).replace(",00", "")}</p>
          {c.formato === "presencial" && !c.ejemplo && !completo ? (
            <BotonAnadir
              articulo={{ id: `curso-${c.slug}`, tipo: "curso", nombre: c.nombre, detalle: `Curso presencial · ${c.fecha ?? ""}`, precio: c.precio }}
              texto="Reservar plaza"
            />
          ) : (
            <button type="button" disabled className="text-xs uppercase tracking-widest px-4 py-3 bg-dorado text-neutral-900 disabled:opacity-50">
              {completo ? "Completo" : "Próximamente"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default function ElegirCurso({ cursos }: { cursos: Curso[] }) {
  const [publico, setPublico] = useState<Publico | null>(null);
  const [formato, setFormato] = useState<Formato | "todos">("todos");

  const elegir = (p: Publico) => {
    setPublico(p);
    setFormato("todos");
  };

  const delPublico = cursos.filter((c) => c.publico === publico);
  const visibles = formato === "todos" ? delPublico : delPublico.filter((c) => c.formato === formato);
  const camino = caminos.find((c) => c.publico === publico);

  return (
    <>
      {/* La pregunta: dos tarjetas que funcionan como botones */}
      <div role="group" aria-label="¿Para quién es el curso?" className="grid md:grid-cols-2 gap-6">
        {caminos.map((c) => {
          const elegido = publico === c.publico;
          return (
            <button
              key={c.publico}
              type="button"
              onClick={() => elegir(c.publico)}
              aria-pressed={elegido}
              aria-controls="lista-cursos"
              className={`relative text-left border p-8 md:p-10 transition-colors ${
                elegido ? "border-neutral-900 bg-neutral-900 text-white" : "border-linea bg-white hover:border-neutral-900"
              } ${publico && !elegido ? "opacity-60 hover:opacity-100" : ""}`}
            >
              <Loto className="block w-12 h-8 text-dorado mb-5" />
              <span className="block font-serif text-3xl mb-3">{c.titulo}</span>
              <span className={`block leading-relaxed mb-6 ${elegido ? "text-neutral-300" : "text-neutral-600"}`}>{c.texto}</span>
              <span className={`block space-y-2 text-sm ${elegido ? "text-neutral-200" : "text-neutral-700"}`}>
                {c.puntos.map((p) => (
                  <span key={p} className="flex gap-3"><span className="text-dorado" aria-hidden="true">◆</span>{p}</span>
                ))}
              </span>
              <span className={`mt-8 inline-block text-xs uppercase tracking-widest border-b pb-1 ${elegido ? "border-dorado text-dorado" : "border-neutral-900"}`}>
                {elegido ? "✓ Estos son tus cursos" : "Ver cursos"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Los cursos: aparecen al responder */}
      <div id="lista-cursos" aria-live="polite" className="mt-14">
        {!publico ? (
          <p className="text-center text-neutral-500">Elige una opción para ver los cursos.</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <h2 className="font-serif text-3xl">Cursos {camino?.titulo.toLowerCase()}</h2>
              <div role="group" aria-label="Filtrar por formato" className="flex flex-wrap gap-2">
                {filtrosFormato.map((f) => (
                  <button
                    key={f.valor}
                    type="button"
                    onClick={() => setFormato(f.valor)}
                    aria-pressed={formato === f.valor}
                    className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                      formato === f.valor ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 hover:border-neutral-900"
                    }`}
                  >
                    {f.texto}
                  </button>
                ))}
              </div>
            </div>
            {visibles.length === 0 ? (
              <p className="text-center text-neutral-500 py-10">Ahora mismo no hay cursos {formato === "online" ? "online" : "presenciales"} para esta opción. ¡Pronto habrá más!</p>
            ) : null}
          </>
        )}

        {/* Todos los cursos están en la página; se ven solo los que tocan */}
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((c) => <TarjetaCurso key={c.slug} c={c} oculto={!visibles.includes(c)} />)}
        </ul>
      </div>
    </>
  );
}
