// Cómo se ve una tarjeta regalo: el diseño subido en el panel o, si no hay, el negro y dorado de Laksmir
import Image from "next/image";
import { euros } from "@/lib/tienda";

export default function TarjetaVisual({ importe, fotoId, nombre }: { importe: number; fotoId: number | null; nombre: string }) {
  const precio = euros(importe).replace(",00", "");
  if (fotoId) {
    return (
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        <Image src={`/fotos/${fotoId}`} alt={`${nombre} de ${precio}`} fill unoptimized className="object-cover" />
        <span className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 font-serif text-lg">{precio}</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-[3/2] bg-gradient-to-br from-neutral-900 to-neutral-700 text-white p-4 flex flex-col justify-between">
      <div aria-hidden="true" className="absolute inset-2 border border-dorado/40" />
      <p className="relative font-brand text-xl">Laksmir</p>
      <p className="relative font-serif text-3xl text-dorado text-right">{precio}</p>
    </div>
  );
}
