"use client";
// Formulario para escribir y editar artículos del blog
import Link from "next/link";
import { useActionState } from "react";
import type { EstadoFormulario } from "../actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  temas: { slug: string; nombre: string }[];
  autoras: string[];
  hoy: string;
  inicial?: { titulo: string; resumen: string; contenido: string; tema: string; autora: string; fecha: string; publicado: boolean };
  textoBoton: string;
}

const AYUDA = `Escribe el texto así:
- Deja una línea en blanco entre párrafos.
- Empieza una línea con "## " para poner un subtítulo.
- Empieza cada línea con "- " para hacer una lista.`;

export default function ArticuloForm({ accion, temas, autoras, hoy, inicial, textoBoton }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  // Si hubo un error, se rellena con lo que se había escrito
  const v = estado?.valores;
  const valor = (campo: keyof NonNullable<Props["inicial"]>, porDefecto = "") => String(v ? v[campo] ?? "" : inicial?.[campo] ?? porDefecto);
  const publicado = v ? v.publicado === "on" : inicial?.publicado ?? false;

  return (
    <form key={JSON.stringify(v)} action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      <label className="campo">
        Título *
        <input name="titulo" required maxLength={200} defaultValue={valor("titulo")} className="input" />
      </label>

      <label className="campo">
        Resumen * <span className="normal-case tracking-normal text-neutral-400">Una o dos frases. Se ve en la lista del blog y en Google.</span>
        <textarea name="resumen" required maxLength={300} rows={2} defaultValue={valor("resumen")} className="input" />
      </label>

      <div className="grid sm:grid-cols-3 gap-6">
        <label className="campo">
          Tema *
          <select name="tema" required defaultValue={valor("tema")} className="input">
            <option value="" disabled>Elige un tema</option>
            {temas.map((t) => <option key={t.slug} value={t.slug}>{t.nombre}</option>)}
          </select>
        </label>
        <label className="campo">
          Firma *
          <select name="autora" required defaultValue={valor("autora")} className="input">
            <option value="" disabled>¿Quién lo escribe?</option>
            {autoras.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="campo">
          Fecha *
          <input name="fecha" type="date" required defaultValue={valor("fecha", hoy)} className="input" />
        </label>
      </div>

      <label className="campo">
        Texto del artículo *
        <span className="normal-case tracking-normal text-neutral-400 whitespace-pre-line">{AYUDA}</span>
        <textarea name="contenido" required rows={16} defaultValue={valor("contenido")} className="input font-mono text-sm leading-relaxed" />
      </label>

      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input name="publicado" type="checkbox" defaultChecked={publicado} className="size-4 accent-neutral-900" />
        Publicado (si no lo marcas, se guarda como borrador y no se ve en la web)
      </label>

      {estado?.error && <p role="alert" className="text-sm text-red-700">{estado.error}</p>}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">{enviando ? "Guardando…" : textoBoton}</button>
        <Link href="/admin/blog" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
