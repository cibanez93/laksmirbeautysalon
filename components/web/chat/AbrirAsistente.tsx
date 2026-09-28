"use client";
// Botón o enlace que abre la ventanita de la asistente desde cualquier página
import { useChat } from "./ChatContexto";

export default function AbrirAsistente({ children, className }: { children: React.ReactNode; className?: string }) {
  const { setAbierto } = useChat();
  return (
    <button type="button" onClick={() => setAbierto(true)} className={className}>
      {children}
    </button>
  );
}
