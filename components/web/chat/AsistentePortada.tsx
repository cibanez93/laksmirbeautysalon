"use client";
// Chat de la asistente en la sección de la portada. Comparte la conversación con la ventanita flotante.
import { Esquinas } from "../decoracion";
import CabeceraChat from "./CabeceraChat";
import Chat from "./Chat";

export default function AsistentePortada() {
  return (
    <div className="relative bg-arena p-5 md:p-6">
      <Esquinas />
      <CabeceraChat />
      <Chat />
    </div>
  );
}
