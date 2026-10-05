"use client";
// Menú del móvil. Es un <details> (se abre y cierra sin JavaScript), pero como la cabecera
// no se vuelve a cargar al cambiar de página, hay que cerrarlo a mano: al pulsar un enlace
// o al tocar fuera del menú.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { menu } from "@/lib/salon";

export default function MenuMovil() {
  const detalles = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const alTocarFuera = (e: PointerEvent) => {
      const menuAbierto = detalles.current;
      if (menuAbierto?.open && !menuAbierto.contains(e.target as Node)) menuAbierto.open = false;
    };
    document.addEventListener("pointerdown", alTocarFuera);
    return () => document.removeEventListener("pointerdown", alTocarFuera);
  }, []);

  const cerrar = () => {
    if (detalles.current) detalles.current.open = false;
  };

  return (
    <details ref={detalles} className="lg:hidden group">
      <summary className="list-none cursor-pointer border border-neutral-900 px-3 py-2.5 text-xs uppercase tracking-widest">
        <span className="group-open:hidden">Menú</span>
        <span className="hidden group-open:inline">Cerrar</span>
      </summary>
      <nav aria-label="Menú del móvil" className="absolute left-0 right-0 top-full bg-crema border-b border-linea px-4 py-2">
        {menu.map((m) => (
          <Link key={m.href} href={m.href} onClick={cerrar} className="block py-3 border-b border-linea last:border-0 font-serif text-xl">{m.texto}</Link>
        ))}
      </nav>
    </details>
  );
}
