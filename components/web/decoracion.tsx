// Piezas de diseño reutilizables: adornos dorados, títulos de sección y fotos.
import Image from "next/image";

// Adorno inspirado en el logo: línea, rombo, línea
export function Adorno({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-dorado" />
      <span className="size-1.5 rotate-45 bg-dorado" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-dorado" />
    </div>
  );
}

// Esquinas doradas finas para enmarcar tarjetas (el padre necesita "relative")
export function Esquinas() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-2 z-10">
      <span className="absolute top-0 left-0 size-5 border-t border-l border-dorado" />
      <span className="absolute top-0 right-0 size-5 border-t border-r border-dorado" />
      <span className="absolute bottom-0 left-0 size-5 border-b border-l border-dorado" />
      <span className="absolute bottom-0 right-0 size-5 border-b border-r border-dorado" />
    </div>
  );
}

// Título de sección: antetítulo dorado + título + adorno
export function TituloSeccion({ antetitulo, titulo, as: Tag = "h2" }: { antetitulo: string; titulo: string; as?: "h1" | "h2" }) {
  return (
    <div className="text-center mb-12">
      <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">{antetitulo}</p>
      <Tag className="font-serif text-3xl md:text-4xl text-neutral-900">{titulo}</Tag>
      <Adorno className="mt-5" />
    </div>
  );
}

// Hueco para una foto que todavía no tenemos. Cuando haya fotos reales se cambia por <Image>.
export function FotoPendiente({ texto, className = "" }: { texto: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#E9DCCB] to-[#CDB392] ${className}`} role="img" aria-label={`Foto: ${texto}`}>
      <span className="absolute bottom-3 left-3 bg-white/80 px-2 py-1 text-[11px] uppercase tracking-wider text-neutral-600">
        Foto: {texto}
      </span>
    </div>
  );
}

// Foto elegida en el panel (Destacados). Si todavía no hay ninguna, se ve el hueco de ejemplo.
export function FotoDestacada({ id, texto, className = "" }: { id?: number | null; texto: string; className?: string }) {
  if (!id) return <FotoPendiente texto={texto} className={className} />;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={`/fotos/${id}`} alt={texto} fill unoptimized className="object-cover" />
    </div>
  );
}
