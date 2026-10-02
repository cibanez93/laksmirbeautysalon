"use client";
// Formulario para subir o editar fotos de la galería. Antes de enviarlas, las reduce en el
// propio navegador para que pesen poco y la web vaya rápida.
// Al editar, si no eliges una foto nueva, se queda la que había.
import Link from "next/link";
import { useActionState, useState } from "react";
import CampoImagen from "@/components/admin/CampoImagen";
import { reducirImagenes } from "@/components/admin/reducirImagen";
import type { EstadoFormulario } from "../actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  categorias: { id: number; nombre: string }[];
  // Al editar: los datos actuales de la foto
  inicial?: { id: number; titulo: string; categoria_id: number | null; tipo: "foto" | "antes_despues"; forma: string; version: number };
}

export default function FormularioFoto({ accion, categorias, inicial }: Props) {
  const [tipo, setTipo] = useState<"foto" | "antes_despues">(inicial?.tipo ?? "foto");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Antes de llamar a la acción del servidor, reducimos las fotos elegidas
  const [estado, enviar, enviando] = useActionState(async (prev: EstadoFormulario, formData: FormData) => {
    setErrorLocal(null);
    if (!(await reducirImagenes(formData, ["imagen", "imagen_antes"]))) {
      setErrorLocal("No se ha podido leer la foto. Prueba con otra imagen (JPG o PNG).");
      return prev;
    }
    return accion(prev, formData);
  }, undefined);

  const error = errorLocal ?? estado?.error;
  const v = estado?.valores;
  // Al editar se añade un número de versión a la dirección para ver siempre la foto actual
  const actual = (parte: "" | "/antes") => (inicial ? `/fotos/${inicial.id}${parte}?v=${inicial.version}` : undefined);

  return (
    <form action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      {inicial ? (
        <p className="text-sm text-neutral-500">
          Tipo: <strong className="text-neutral-800">{inicial.tipo === "antes_despues" ? "Antes y después" : "Foto normal"}</strong>
          <input type="hidden" name="tipo" value={inicial.tipo} />
        </p>
      ) : (
        <fieldset className="flex flex-wrap gap-6">
          <legend className="campo mb-3">Tipo</legend>
          {[
            { valor: "foto", texto: "Foto normal" },
            { valor: "antes_despues", texto: "Antes y después" },
          ].map((t) => (
            <label key={t.valor} className="flex items-center gap-2 text-sm">
              <input type="radio" name="tipo" value={t.valor} checked={tipo === t.valor} onChange={() => setTipo(t.valor as typeof tipo)} className="accent-neutral-900" />
              {t.texto}
            </label>
          ))}
        </fieldset>
      )}

      <label className="campo">
        Título (opcional, ayuda a Google a entender la foto)
        <input name="titulo" maxLength={120} placeholder="Por ejemplo: Balayage rubio" defaultValue={v?.titulo ?? inicial?.titulo} className="input" />
      </label>

      <div className="grid sm:grid-cols-2 gap-6">
        <label className="campo">
          Categoría
          <select name="categoria_id" defaultValue={v?.categoria_id ?? String(inicial?.categoria_id ?? "")} className="input">
            <option value="">Sin categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </label>
        {tipo === "foto" && (
          <label className="campo">
            Forma en la galería
            <select name="forma" defaultValue={v?.forma ?? inicial?.forma ?? "cuadrada"} className="input">
              <option value="cuadrada">Cuadrada</option>
              <option value="vertical">Vertical (más alta)</option>
              <option value="horizontal">Horizontal (más ancha)</option>
            </select>
          </label>
        )}
      </div>

      {tipo === "antes_despues" ? (
        <div className="grid sm:grid-cols-2 gap-6">
          <CampoImagen nombre="imagen_antes" etiqueta={inicial ? "Cambiar la foto de ANTES" : "Foto de ANTES *"} actual={actual("/antes")} obligatorio />
          <CampoImagen nombre="imagen" etiqueta={inicial ? "Cambiar la foto de DESPUÉS" : "Foto de DESPUÉS *"} actual={actual("")} obligatorio />
        </div>
      ) : (
        <CampoImagen nombre="imagen" etiqueta={inicial ? "Cambiar la foto" : "Foto *"} actual={actual("")} obligatorio />
      )}

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">
          {enviando ? "Guardando…" : inicial ? "Guardar cambios" : "Subir"}
        </button>
        <Link href="/admin/galeria" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
