// Cómo se ve una tarjeta regalo: el diseño subido en el panel o, si no hay, el diseño de Laksmir
// (fondo negro, marcos y esquinas dorados, loto de fondo y el importe grande en el centro).
import Image from "next/image";
import { euros } from "@/lib/tienda";
import { Adorno, Esquinas } from "../web/decoracion";
import Loto from "../web/Loto";

export default function TarjetaVisual({ importe, fotoId, nombre }: { importe: number; fotoId: number | null; nombre: string }) {
  const precio = euros(importe).replace(",00", "");
  const nombrePropio = nombre !== "Tarjeta regalo" ? nombre : null;

  // Diseño propio subido en el panel: la foto con el nombre y el precio en las esquinas
  if (fotoId) {
    return (
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        <Image src={`/fotos/${fotoId}`} alt={`${nombre} de ${precio}`} fill unoptimized className="object-cover" />
        {nombrePropio && <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 text-[11px] uppercase tracking-wider">{nombrePropio}</span>}
        <span className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 font-serif text-lg">{precio}</span>
      </div>
    );
  }

  // Diseño de Laksmir
  return (
    <div
      role="img"
      aria-label={`${nombre} de ${precio}`}
      className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white flex flex-col items-center justify-center text-center px-4"
    >
      {/* Doble marco dorado y esquinas */}
      <div aria-hidden="true" className="absolute inset-2 border border-dorado/50" />
      <div aria-hidden="true" className="absolute inset-3.5 border border-dorado/20" />
      <Esquinas />
      {/* Flor de loto muy suave de fondo */}
      <Loto className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-auto text-dorado/10" grosor={0.6} />

      <p className="relative text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-dorado/90">{nombrePropio ?? "Tarjeta regalo"}</p>
      <Adorno className="relative my-1.5 scale-75" />
      <p className="relative font-serif text-4xl text-dorado leading-none">{precio}</p>
    </div>
  );
}
