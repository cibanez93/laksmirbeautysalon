// Tarjetas regalo en la página de Servicios: un texto corto arriba y las tarjetas debajo, a todo lo ancho.
// En el móvil las tarjetas se deslizan de lado para no ocupar media pantalla.
import type { TarjetaRegalo } from "@/lib/tarjetas";
import { euros, MESES_CADUCIDAD } from "@/lib/tienda";
import BotonAnadir from "./BotonAnadir";
import TarjetaVisual from "./TarjetaVisual";

export default function BloqueTarjetasRegalo({ tarjetas }: { tarjetas: TarjetaRegalo[] }) {
  if (tarjetas.length === 0) return null;
  const validez = MESES_CADUCIDAD === 12 ? "1 año" : `${MESES_CADUCIDAD} meses`;

  return (
    <section id="regalar" aria-labelledby="titulo-regalar" className="scroll-mt-28 relative bg-white border border-linea p-6 md:p-8 mb-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-dorado/30" />
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-8 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-1">Regala Laksmir</p>
            <h2 id="titulo-regalar" className="font-serif text-2xl md:text-3xl">Tarjetas regalo</h2>
          </div>
          <p className="text-sm text-neutral-600 md:text-right">
            Para gastar en lo que quiera · Válidas {validez}
            <span className="block">¿Un servicio concreto? Pulsa <strong className="font-medium text-neutral-900">«Regalar»</strong> junto a él.</span>
          </p>
        </div>

        <ul className="flex gap-3 overflow-x-auto snap-x pb-2 -mx-1 px-1 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {tarjetas.map((t) => (
            <li key={t.id} className="snap-start shrink-0 w-40 md:w-auto flex flex-col gap-2">
              <TarjetaVisual importe={t.importe} fotoId={t.foto_id} nombre={t.nombre} />
              <BotonAnadir
                articulo={{ id: `tarjeta-${t.id}`, tipo: "tarjeta", nombre: `${t.nombre} de ${euros(t.importe)}`, precio: t.importe }}
                texto="Añadir"
                className="!py-2"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
