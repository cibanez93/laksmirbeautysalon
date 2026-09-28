"use server";
// Acción del servidor que envía la conversación a Claude (la IA de Anthropic) y devuelve la respuesta.
// La clave de la API está en ANTHROPIC_API_KEY y nunca llega al navegador.
// Si no hay clave o algo falla, devuelve null y el chat usa las respuestas preparadas.
import Anthropic from "@anthropic-ai/sdk";
import { headers } from "next/headers";
import type { Respuesta } from "../respuestas-asistente";
import { crearInstrucciones, enlacesPermitidos } from "./instrucciones";

const MODELO = "claude-opus-5";
const MAX_MENSAJES = 16; // se envían como mucho los últimos 16 mensajes
const MAX_LETRAS = 600; // tamaño máximo de cada mensaje
const LIMITE_POR_HORA = 30; // preguntas por persona y hora, para evitar abusos y gastos

export interface MensajeHistorial {
  de: "clienta" | "asistente";
  texto: string;
}

// Contador sencillo en memoria por IP. Se reinicia al reiniciar el servidor; suficiente para empezar.
const contador = new Map<string, { veces: number; desde: number }>();

function demasiadasPreguntas(ip: string) {
  const ahora = Date.now();
  const registro = contador.get(ip);
  if (!registro || ahora - registro.desde > 60 * 60 * 1000) {
    contador.set(ip, { veces: 1, desde: ahora });
    return false;
  }
  registro.veces++;
  return registro.veces > LIMITE_POR_HORA;
}

// Formato obligatorio de la respuesta: texto + botones elegidos de la lista permitida
const formatoRespuesta = {
  type: "json_schema" as const,
  schema: {
    type: "object",
    properties: {
      texto: { type: "string" },
      botones: { type: "array", items: { type: "string", enum: Object.keys(enlacesPermitidos) } },
    },
    required: ["texto", "botones"],
    additionalProperties: false,
  },
};

const cliente = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

export async function preguntarAsistente(historial: MensajeHistorial[]): Promise<Respuesta | null> {
  if (!cliente) return null;

  // Los datos llegan del navegador: se comprueban antes de usarlos
  const mensajes = historial
    .filter((m) => (m.de === "clienta" || m.de === "asistente") && typeof m.texto === "string" && m.texto.trim())
    .slice(-MAX_MENSAJES)
    .map((m) => ({ role: m.de === "clienta" ? ("user" as const) : ("assistant" as const), content: m.texto.slice(0, MAX_LETRAS) }));
  // La conversación tiene que empezar y terminar con la clienta
  while (mensajes.length && mensajes[0].role !== "user") mensajes.shift();
  if (!mensajes.length || mensajes.at(-1)!.role !== "user") return null;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (demasiadasPreguntas(ip)) {
    return { texto: "Has hecho muchas preguntas seguidas 😊 Si quieres, escríbenos por WhatsApp y te atendemos personalmente.", enlaces: [enlacesPermitidos.whatsapp] };
  }

  try {
    const respuesta = await cliente.beta.messages.create({
      model: MODELO,
      max_tokens: 4000,
      // Si el modelo se niega a responder por seguridad, Anthropic prueba automáticamente con otro modelo
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      // Las instrucciones son siempre iguales: se guardan en caché y cada pregunta sale más barata
      system: [{ type: "text", text: await crearInstrucciones(), cache_control: { type: "ephemeral" } }],
      messages: mensajes,
      // Esfuerzo bajo: para un chat es suficiente y responde más rápido y barato
      output_config: { effort: "low", format: formatoRespuesta },
    });

    if (respuesta.stop_reason === "refusal") return null;
    const bloque = respuesta.content.find((b) => b.type === "text");
    if (!bloque || bloque.type !== "text") return null;

    const datos = JSON.parse(bloque.text) as { texto: string; botones: string[] };
    const enlaces = [...new Set(datos.botones)].slice(0, 3).map((id) => enlacesPermitidos[id]).filter(Boolean);
    return { texto: datos.texto, enlaces };
  } catch (error) {
    console.error("Error de la asistente:", error);
    return null;
  }
}
