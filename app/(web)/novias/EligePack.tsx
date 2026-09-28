"use client";
// La novia elige un pack, pone su nombre y la fecha, y se abre WhatsApp con el mensaje escrito.
// Todos los packs miden lo mismo; el elegido se agranda un poco para que se note.
import { useState } from "react";
import { Adorno } from "@/components/web/decoracion";
import type { Pack } from "@/lib/novias";
import { salon } from "@/lib/salon";

export default function EligePack({ packs }: { packs: Pack[] }) {
  const [elegido, setElegido] = useState(packs.find((p) => p.destacado)?.id ?? packs[0].id);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");

  const pack = packs.find((p) => p.id === elegido)!;
  const fechaBonita = fecha ? new Date(`${fecha}T12:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";

  const mensaje = [
    `¡Hola! Soy ${nombre.trim() || "una novia"} y me caso${fechaBonita ? ` el ${fechaBonita}` : " pronto"}.`,
    `Me interesa el pack de novia *${pack.nombre}*. ¿Me podéis dar más información?`,
  ].join("\n");
  const enlace = `https://wa.me/${salon.whatsapp}?text=${encodeURIComponent(mensaje)}`;

  return (
    <>
      {/* Los tres packs: se elige uno pulsando */}
      <fieldset>
        <legend className="sr-only">Elige tu pack</legend>
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {packs.map((p) => {
            const activo = p.id === elegido;
            return (
              <label
                key={p.id}
                className={`relative flex flex-col cursor-pointer bg-crema border px-6 py-8 transition-all duration-300 ${activo ? "z-10 scale-[1.04] md:scale-[1.07] border-dorado ring-1 ring-dorado shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]" : "scale-100 border-[#EDE3D6] hover:border-dorado"}`}
              >
                <input type="radio" name="pack" value={p.id} checked={activo} onChange={() => setElegido(p.id)} className="sr-only" />
                {p.destacado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-dorado text-white text-[10px] uppercase tracking-[0.25em] px-3 py-1 whitespace-nowrap">El más elegido</span>
                )}
                <p className="text-center text-[11px] uppercase tracking-[0.3em] text-dorado-oscuro">Pack</p>
                <h3 className="text-center font-serif text-3xl mt-1">{p.nombre}</h3>
                <p className="text-center text-sm text-neutral-500 mt-2">{p.lema}</p>
                <Adorno className="my-6" />
                <ul className="space-y-3 text-sm text-neutral-700 mb-8">
                  {p.incluye.map((i) => (
                    <li key={i} className="flex gap-3"><span className="text-dorado" aria-hidden="true">◆</span>{i}</li>
                  ))}
                </ul>
                <span className={`mt-auto text-center text-xs uppercase tracking-widest px-5 py-3 ${activo ? "bg-neutral-900 text-white" : "border border-neutral-900"}`}>
                  {activo ? "✓ Elegido" : "Elegir este pack"}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Datos y botón de WhatsApp */}
      <div id="pedir-info" className="scroll-mt-28 max-w-2xl mx-auto mt-20 bg-arena p-6 md:p-10">
        <h3 className="font-serif text-2xl md:text-3xl text-center mb-2">Pide información de tu pack</h3>
        <p className="text-center text-neutral-600 text-sm mb-8">Te respondemos por WhatsApp con todos los detalles y el presupuesto.</p>
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <label className="campo">
            Tu nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" className="input" />
          </label>
          <label className="campo">
            Fecha de la boda
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input" />
          </label>
        </div>
        <p className="text-sm text-neutral-600 mb-6">
          Pack elegido: <strong className="font-serif text-lg text-neutral-900">{pack.nombre}</strong>
        </p>
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#25D366] text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-[#1EBE5A] transition-colors"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" /></svg>
          Enviar por WhatsApp
        </a>
      </div>
    </>
  );
}
