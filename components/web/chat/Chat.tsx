"use client";
// La conversación con la asistente: mensajes, preguntas sugeridas y campo para escribir.
// Se usa en la sección de la portada y en la ventanita flotante.
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useChat } from "./ChatContexto";

const sugerencias = ["¿Qué corte me favorece?", "Tengo el cabello dañado", "¿Qué necesito para mis uñas?", "Pack para mi boda", "¿Qué hacéis para la piel?"];

export default function Chat({ alto = "h-[360px]", enfocar = false }: { alto?: string; enfocar?: boolean }) {
  const { mensajes, escribiendo, enviar } = useChat();
  const [texto, setTexto] = useState("");
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const idCampo = useId();

  // Bajar al último mensaje cada vez que llega uno nuevo
  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo]);

  useEffect(() => {
    if (enfocar) campo.current?.focus();
  }, [enfocar]);

  const mandar = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(texto);
    setTexto("");
  };

  const soloBienvenida = mensajes.length === 1;

  return (
    <div className="flex flex-col">
      <div ref={lista} className={`${alto} overflow-y-auto space-y-3 pr-1 mb-4`} aria-live="polite" aria-label="Conversación con la asistente">
        {mensajes.map((m, i) => {
          const esAsistente = m.de === "asistente";
          return (
            <div key={i} className={`flex ${esAsistente ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${esAsistente ? "bg-white border border-linea rounded-2xl rounded-bl-sm" : "bg-neutral-900 text-white rounded-2xl rounded-br-sm"}`}>
                <p>{m.texto}</p>
                {m.enlaces && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {m.enlaces.map((e) =>
                      e.href.startsWith("http") ? (
                        <a key={e.texto} href={e.href} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider bg-neutral-900 text-white px-3 py-1.5 hover:bg-dorado-oscuro">
                          {e.texto}
                        </a>
                      ) : (
                        <Link key={e.texto} href={e.href} className="text-xs uppercase tracking-wider border border-neutral-900 px-3 py-1.5 hover:bg-neutral-900 hover:text-white">
                          {e.texto}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {escribiendo && (
          <div className="flex justify-start" aria-label="La asistente está escribiendo">
            <div className="bg-white border border-linea rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-1.5 rounded-full bg-dorado animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {soloBienvenida && (
        <>
          <p className="text-xs text-neutral-500 mb-2">Prueba a preguntar:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {sugerencias.map((q) => (
              <button key={q} type="button" onClick={() => enviar(q)} className="bg-white border border-dorado text-[#7A5E3D] rounded-full px-3 py-1.5 text-xs hover:bg-dorado hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>
        </>
      )}

      <form onSubmit={mandar} className="flex gap-2">
        <label htmlFor={idCampo} className="sr-only">Escribe tu pregunta</label>
        <input
          ref={campo}
          id={idCampo}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu pregunta…"
          autoComplete="off"
          className="flex-1 min-w-0 bg-white border border-[#E0D3C2] px-4 py-3 text-sm focus:border-dorado focus:outline-none"
        />
        <button type="submit" disabled={!texto.trim() || escribiendo} className="bg-neutral-900 text-white px-5 text-sm uppercase tracking-wider hover:bg-dorado-oscuro transition-colors disabled:opacity-40">
          Enviar
        </button>
      </form>
    </div>
  );
}
