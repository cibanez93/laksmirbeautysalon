import Link from "next/link";
import { paginasLegales } from "@/lib/legal";
import { menu, salon } from "@/lib/salon";
import { Adorno } from "./decoracion";

export default function Pie() {
  const { direccion } = salon;
  return (
    <footer className="bg-arena px-4 md:px-8 pt-16 pb-8">
      <Adorno className="mb-12" />
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm text-neutral-600">
        <div>
          <p className="font-brand text-3xl text-neutral-900">Laksmir</p>
          <p className="text-xs uppercase tracking-widest text-dorado-oscuro mb-5">Beauty Salon</p>
          <nav aria-label="Menú del pie" className="grid grid-cols-2 gap-y-1">
            {menu.map((m) => (
              <Link key={m.href} href={m.href} className="hover:text-dorado-oscuro">{m.texto}</Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-900 mb-3">Dónde estamos</h2>
          <address className="not-italic">
            <p>{direccion.calle}</p>
            <p>{direccion.cp} {direccion.localidad}, {direccion.provincia}</p>
          </address>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-900 mb-3">Contacto</h2>
          <p><a href={salon.telefonoEnlace} className="hover:text-dorado-oscuro">{salon.telefono}</a></p>
          <p><a href={salon.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-dorado-oscuro">{salon.instagram.usuario}</a></p>
          <p><a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="hover:text-dorado-oscuro">Reservar en Booksy</a></p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-900 mb-3">Horario</h2>
          {salon.horario.map((h) => (
            <p key={h.dias}>{h.dias}: {h.horas}</p>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#E0D3C2] flex flex-col sm:flex-row justify-between gap-2 text-xs text-neutral-500">
        <p>
          © {new Date().getFullYear()} {salon.nombre}
          {paginasLegales.map((p) => (
            <span key={p.href}>
              {" · "}
              <Link href={p.href} className="hover:text-dorado-oscuro">{p.texto}</Link>
            </span>
          ))}
        </p>
        <p>
          Diseño y desarrollo web:{" "}
          <a href="https://claudiaibanez.com/diseno-web-peluquerias" target="_blank" rel="noopener" title="Diseño web para peluquerías y centros de estética" className="text-neutral-700 hover:text-dorado-oscuro underline underline-offset-2">
            Claudia Ibáñez
          </a>
        </p>
      </div>
    </footer>
  );
}
