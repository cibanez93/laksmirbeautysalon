"use client";
// Botón flotante "¿Te ayudo?": abre una ventanita con el chat de la asistente en cualquier página.
import { useEffect } from "react";
import CabeceraChat from "./chat/CabeceraChat";
import Chat from "./chat/Chat";
import { useChat } from "./chat/ChatContexto";

export default function BotonAsistente() {
  const { abierto, setAbierto } = useChat();

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto, setAbierto]);

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-label="Chat con la asistente de Laksmir"
          className="fixed z-40 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[380px] bg-arena shadow-2xl border border-dorado/40 p-5"
        >
          <CabeceraChat>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar el chat" className="size-8 flex items-center justify-center text-xl text-neutral-500 hover:text-neutral-900">
              ×
            </button>
          </CabeceraChat>
          <Chat alto="h-[45vh] sm:h-[340px]" enfocar />
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className={`fixed bottom-5 right-5 z-30 items-center gap-2 bg-neutral-900 text-white pl-3 pr-5 py-3 rounded-full shadow-lg hover:bg-dorado-oscuro transition-colors ${abierto ? "hidden sm:flex" : "flex"}`}
      >
        <span className="size-7 rounded-full bg-dorado text-neutral-900 font-brand flex items-center justify-center" aria-hidden="true">L</span>
        <span className="text-sm">{abierto ? "Cerrar" : "¿Te ayudo?"}</span>
      </button>
    </>
  );
}
