// Cabecera del chat: avatar con la L de Laksmir y estado "en línea"
export default function CabeceraChat({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#E0D3C2]">
      <span className="size-9 rounded-full bg-neutral-900 text-dorado font-brand text-lg flex items-center justify-center" aria-hidden="true">L</span>
      <div className="flex-1">
        <p className="text-sm font-medium">Asistente Laksmir</p>
        <p className="text-xs text-green-700">● En línea</p>
      </div>
      {children}
    </div>
  );
}
