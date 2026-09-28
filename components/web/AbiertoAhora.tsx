"use client";
// Dice si el salón está abierto en este momento, con la hora de España.
// Se calcula en el navegador para que siempre esté al día.
import { useSyncExternalStore } from "react";
import { salon } from "@/lib/salon";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Hora actual en España: día de la semana (0-6) y hora con decimales (10.5 = 10:30)
function ahoraEnEspaña() {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const valor = (t: string) => partes.find((p) => p.type === t)?.value ?? "0";
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday"));
  return { dia, hora: Number(valor("hour")) + Number(valor("minute")) / 60 };
}

function estado() {
  const { dia, hora } = ahoraEnEspaña();
  const hoy = salon.horarioPorDia[dia];
  if (hoy && hora >= hoy[0] && hora < hoy[1]) return { abierto: true, texto: `Abierto ahora · cierra a las ${hoy[1]}:00` };
  if (hoy && hora < hoy[0]) return { abierto: false, texto: `Cerrado ahora · abre hoy a las ${hoy[0]}:00` };
  // Buscar el siguiente día que abre
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const h = salon.horarioPorDia[d];
    if (h) return { abierto: false, texto: `Cerrado ahora · abre ${i === 1 ? "mañana" : `el ${DIAS[d]}`} a las ${h[0]}:00` };
  }
  return { abierto: false, texto: "Cerrado" };
}

// Se recalcula cada minuto
const suscribir = (aviso: () => void) => {
  const id = setInterval(aviso, 60_000);
  return () => clearInterval(id);
};

export default function AbiertoAhora() {
  const texto = useSyncExternalStore(suscribir, () => JSON.stringify(estado()), () => "");
  if (!texto) return <span className="inline-block h-7" />; // en el servidor aún no sabemos la hora
  const e = JSON.parse(texto) as { abierto: boolean; texto: string };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm ${e.abierto ? "bg-green-50 text-green-800" : "bg-neutral-100 text-neutral-700"}`}>
      <span className={`size-2 rounded-full ${e.abierto ? "bg-green-600" : "bg-neutral-400"}`} aria-hidden="true" />
      {e.texto}
    </span>
  );
}
