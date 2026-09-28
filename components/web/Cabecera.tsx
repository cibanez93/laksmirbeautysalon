import Image from "next/image";
import Link from "next/link";
import IconoCarrito from "@/components/tienda/IconoCarrito";
import { menu, salon } from "@/lib/salon";

export default function Cabecera() {
  return (
    <header className="sticky top-0 z-30 bg-crema/95 backdrop-blur border-b border-linea">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-4 md:px-8 py-3">
        <Link href="/" aria-label={`${salon.nombre}, ir al inicio`}>
          <Image src="/logo.png" alt="" width={800} height={243} priority className="w-auto h-12 md:h-14" />
        </Link>

        <nav aria-label="Menú principal" className="hidden lg:flex gap-6 text-[13px] uppercase tracking-wider text-neutral-700">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className="hover:text-dorado-oscuro transition-colors">{m.texto}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <IconoCarrito />
          <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-xs uppercase tracking-widest px-5 py-3 hover:bg-dorado-oscuro transition-colors">
            Reservar
          </a>
          {/* Menú del móvil: <details> se abre y cierra sin JavaScript */}
          <details className="lg:hidden group">
            <summary className="list-none cursor-pointer border border-neutral-900 px-3 py-2.5 text-xs uppercase tracking-widest">
              <span className="group-open:hidden">Menú</span>
              <span className="hidden group-open:inline">Cerrar</span>
            </summary>
            <nav aria-label="Menú del móvil" className="absolute left-0 right-0 top-full bg-crema border-b border-linea px-4 py-2">
              {menu.map((m) => (
                <Link key={m.href} href={m.href} className="block py-3 border-b border-linea last:border-0 font-serif text-xl">{m.texto}</Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
