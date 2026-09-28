"use client";
// Formulario para subir o editar fotos de la galería. Antes de enviarlas, las reduce en el
// propio navegador (máximo 1600 píxeles, formato JPEG) para que pesen poco y la web vaya rápida.
// Al editar, si no eliges una foto nueva, se queda la que había.
import Link from "next/link";
import { useActionState, useState } from "react";
import type { EstadoFormulario } from "../actions";

const LADO_MAXIMO = 1600;

// Dibuja la foto en un lienzo más pequeño y la guarda como JPEG
async function reducir(archivo: File): Promise<File> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext("2d")!.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  const blob = await new Promise<Blob>((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error("No se pudo procesar"))), "image/jpeg", 0.82));
  return new File([blob], "foto.jpg", { type: "image/jpeg" });
}

function CampoFoto({ nombre, etiqueta, actual }: { nombre: string; etiqueta: string; actual?: string }) {
  const [vista, setVista] = useState<string | null>(actual ?? null);
  return (
    <label className="campo">
      {etiqueta}
      <input
        name={nombre}
        type="file"
        accept="image/*"
        required={!actual}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          setVista(archivo ? URL.createObjectURL(archivo) : actual ?? null);
        }}
        className="input file:mr-4 file:border-0 file:bg-neutral-900 file:text-white file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider"
      />
      {actual && <span className="normal-case tracking-normal text-neutral-400">Si no eliges ninguna, se queda la foto actual.</span>}
      {vista && (
        // eslint-disable-next-line @next/next/no-img-element -- vista previa, no hace falta optimizar
        <img src={vista} alt="" className="mt-2 h-40 w-auto object-cover border border-neutral-200" />
      )}
    </label>
  );
}

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
    try {
      for (const campo of ["imagen", "imagen_antes"]) {
        const archivo = formData.get(campo);
        if (archivo instanceof File && archivo.size > 0) formData.set(campo, await reducir(archivo));
      }
    } catch {
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
        Título *
        <input name="titulo" required maxLength={120} placeholder="Por ejemplo: Balayage rubio" defaultValue={v?.titulo ?? inicial?.titulo} className="input" />
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
          <CampoFoto nombre="imagen_antes" etiqueta={inicial ? "Cambiar la foto de ANTES" : "Foto de ANTES *"} actual={actual("/antes")} />
          <CampoFoto nombre="imagen" etiqueta={inicial ? "Cambiar la foto de DESPUÉS" : "Foto de DESPUÉS *"} actual={actual("")} />
        </div>
      ) : (
        <CampoFoto nombre="imagen" etiqueta={inicial ? "Cambiar la foto" : "Foto *"} actual={actual("")} />
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
