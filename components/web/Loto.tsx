// Flor de loto, símbolo de Lakshmi y de Laksmir. Dibujada con líneas finas para que
// combine con el estilo del logo. Toma el color del texto (usa text-dorado, etc.).
export default function Loto({ className = "size-6", grosor = 1.2 }: { className?: string; grosor?: number }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Pétalo central */}
      <path d="M24 3c4 5 5.5 10.5 4.2 16.5C27.5 23 26 25.5 24 27c-2-1.5-3.5-4-4.2-7.5C18.5 13.5 20 8 24 3Z" />
      {/* Pétalos interiores */}
      <path d="M24 27c-1.5-6-5.5-10.5-12-12.5.5 6.5 4.5 11 12 12.5Z" />
      <path d="M24 27c1.5-6 5.5-10.5 12-12.5-.5 6.5-4.5 11-12 12.5Z" />
      {/* Pétalos exteriores */}
      <path d="M24 27.5c-5-2.5-11-3.5-18-2 4 3.5 10.5 4.5 18 2Z" />
      <path d="M24 27.5c5-2.5 11-3.5 18-2-4 3.5-10.5 4.5-18 2Z" />
      {/* Agua */}
      <path d="M14 30.5h20" />
    </svg>
  );
}
