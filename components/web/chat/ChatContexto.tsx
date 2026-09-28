"use client";
// Estado compartido del chat: la misma conversación se ve en la ventanita flotante
// y en la sección de la portada. Así, si empiezas en un sitio, sigues en el otro.
import { createContext, useCallback, useContext, useState } from "react";
import { preguntarAsistente } from "@/lib/asistente/preguntar";
import { responder, type Enlace } from "@/lib/respuestas-asistente";

export interface Mensaje {
  de: "clienta" | "asistente";
  texto: string;
  enlaces?: Enlace[];
}

interface ChatEstado {
  mensajes: Mensaje[];
  escribiendo: boolean;
  abierto: boolean;
  setAbierto: (abierto: boolean) => void;
  enviar: (texto: string) => void;
}

const bienvenida: Mensaje = {
  de: "asistente",
  texto: "¡Hola! Soy la asistente de Laksmir 💛 Cuéntame qué buscas o qué te preocupa de tu cabello, tu piel o tus uñas, y te recomiendo lo mejor para ti.",
};

const Contexto = createContext<ChatEstado | null>(null);

export function ChatProveedor({ children }: { children: React.ReactNode }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([bienvenida]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const enviar = useCallback(
    async (texto: string) => {
      const limpio = texto.trim();
      if (!limpio || escribiendo) return;
      const historial = [...mensajes, { de: "clienta" as const, texto: limpio }];
      setMensajes(historial);
      setEscribiendo(true);
      // Primero se pregunta a la IA; si no está disponible, se usan las respuestas preparadas
      let respuesta = null;
      try {
        respuesta = await preguntarAsistente(historial.map(({ de, texto }) => ({ de, texto })));
      } catch {
        respuesta = null;
      }
      const anteriores = mensajes.filter((m) => m.de === "clienta").map((m) => m.texto);
      setMensajes((m) => [...m, { de: "asistente", ...(respuesta ?? responder(limpio, anteriores)) }]);
      setEscribiendo(false);
    },
    [mensajes, escribiendo],
  );

  return (
    <Contexto.Provider value={{ mensajes, escribiendo, abierto, setAbierto, enviar }}>
      {children}
    </Contexto.Provider>
  );
}

export function useChat() {
  const chat = useContext(Contexto);
  if (!chat) throw new Error("useChat se tiene que usar dentro de <ChatProveedor>");
  return chat;
}
