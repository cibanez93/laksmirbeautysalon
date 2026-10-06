// Diseño común de las páginas legales: título, fecha de actualización y texto con apartados
import type { ReactNode } from "react";
import { actualizado } from "@/lib/legal";
import { Adorno } from "./decoracion";

export function Apartado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl text-neutral-900 pt-4">{titulo}</h2>
      {children}
    </section>
  );
}

export default function PaginaLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <article className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">{titulo}</h1>
        <p className="text-xs uppercase tracking-widest text-neutral-500">Última actualización: {actualizado}</p>
        <Adorno className="justify-start my-10" />
        <div className="space-y-5 text-neutral-700 leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-dorado-oscuro [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </div>
    </article>
  );
}
