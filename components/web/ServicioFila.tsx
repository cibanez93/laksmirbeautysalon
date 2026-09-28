// Una fila de la lista de servicios, estilo carta (sin precio). Si el servicio tiene foto, sale pequeña al lado.
import Image from "next/image";
import { salon } from "@/lib/salon";

export interface ServicioLista {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string | null;
  fotoId?: number | null;
}

export default function ServicioFila({ servicio: s, completo = false }: { servicio: ServicioLista; completo?: boolean }) {
  return (
    <li className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 py-5">
      {s.fotoId && (
        <div className="relative size-20 shrink-0 overflow-hidden rounded-t-full">
          <Image src={`/fotos/${s.fotoId}`} alt={s.nombre} fill unoptimized className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-xl group-hover:text-dorado-oscuro transition-colors">{s.nombre}</h3>
        {s.descripcion && (
          <p className={`text-sm text-neutral-600 leading-relaxed mt-1 whitespace-pre-line ${completo ? "" : "line-clamp-2"}`}>{s.descripcion}</p>
        )}
      </div>
      <div className="flex items-center gap-6 shrink-0">
        {s.duracion && <span className="text-xs uppercase tracking-wider text-neutral-500">{s.duracion}</span>}
        <a
          href={salon.booksy}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-widest border border-neutral-900 px-4 py-2 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          Reservar
        </a>
      </div>
    </li>
  );
}
