"use client";
// Formulario para crear y editar cursos de Laksmir Academy.
// La fecha y las plazas solo aparecen si el curso es presencial.
import Link from "next/link";
import { useActionState, useState } from "react";
import CampoImagen from "@/components/admin/CampoImagen";
import { reducirImagenes } from "@/components/admin/reducirImagen";
import type { CursoBD } from "@/lib/cursos";
import type { EstadoFormulario } from "../actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  inicial?: CursoBD & { version: number };
  textoBoton: string;
}

type Campo = "nombre" | "publico" | "formato" | "descripcion" | "incluye" | "duracion" | "fecha" | "plazas" | "plazas_libres" | "precio" | "orden";

export default function CursoForm({ accion, inicial, textoBoton }: Props) {
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [estado, enviar, enviando] = useActionState(async (prev: EstadoFormulario, formData: FormData) => {
    setErrorLocal(null);
    if (!(await reducirImagenes(formData, ["imagen"]))) {
      setErrorLocal("No se ha podido leer la foto. Prueba con otra imagen (JPG o PNG).");
      return prev;
    }
    return accion(prev, formData);
  }, undefined);

  const v = estado?.valores;
  const valor = (campo: Campo) => String(v ? v[campo] ?? "" : inicial?.[campo] ?? "");
  const activo = v ? v.activo === "on" : inicial?.activo ?? true;
  const [formato, setFormato] = useState(valor("formato") || "presencial");
  const error = errorLocal ?? estado?.error;

  return (
    <form key={JSON.stringify(v)} action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      <label className="campo">
        Nombre del curso *
        <input name="nombre" required maxLength={120} placeholder="Por ejemplo: Automaquillaje para el día a día" defaultValue={valor("nombre")} className="input" />
      </label>

      <div className="grid sm:grid-cols-2 gap-6">
        <label className="campo">
          ¿Para quién es? *
          <select name="publico" required defaultValue={valor("publico") || "clientas"} className="input">
            <option value="clientas">Para ti (clientas)</option>
            <option value="profesionales">Profesionales</option>
          </select>
        </label>
        <label className="campo">
          Formato *
          <select name="formato" required value={formato} onChange={(e) => setFormato(e.target.value)} className="input">
            <option value="presencial">Presencial (en el salón)</option>
            <option value="online">Online (vídeos)</option>
          </select>
        </label>
      </div>

      <label className="campo">
        Descripción *
        <textarea name="descripcion" required rows={3} placeholder="Qué se aprende y para quién es" defaultValue={valor("descripcion")} className="input" />
      </label>

      <label className="campo">
        Qué incluye
        <textarea name="incluye" rows={4} placeholder={"Una cosa por línea, por ejemplo:\nPráctica con modelo real\nMaterial incluido"} defaultValue={valor("incluye")} className="input" />
        <span className="normal-case tracking-normal text-neutral-400">Escribe una cosa en cada línea: en la web sale como una lista.</span>
      </label>

      <div className="grid sm:grid-cols-3 gap-6">
        <label className="campo">
          Duración *
          <input name="duracion" required maxLength={80} placeholder="3 horas" defaultValue={valor("duracion")} className="input" />
        </label>
        <label className="campo">
          Precio (€) *
          <input name="precio" required inputMode="decimal" placeholder="45" defaultValue={valor("precio")} className="input" />
        </label>
        <label className="campo">
          Orden
          <input name="orden" type="number" defaultValue={valor("orden") || "0"} className="input" />
        </label>
      </div>

      {formato === "presencial" && (
        <fieldset className="grid sm:grid-cols-3 gap-6 border border-neutral-200 p-4">
          <legend className="px-2 text-xs uppercase tracking-widest text-neutral-500">Solo cursos presenciales</legend>
          <label className="campo">
            Día y hora *
            <input name="fecha" type="datetime-local" required defaultValue={valor("fecha")} className="input" />
          </label>
          <label className="campo">
            Plazas en total *
            <input name="plazas" type="number" required min={1} defaultValue={valor("plazas")} className="input" />
          </label>
          <label className="campo">
            Plazas libres
            <input name="plazas_libres" type="number" min={0} defaultValue={valor("plazas_libres")} className="input" />
            <span className="normal-case tracking-normal text-neutral-400">Vacío = todas libres · 0 = completo</span>
          </label>
        </fieldset>
      )}

      <CampoImagen
        nombre="imagen"
        etiqueta="Foto del curso"
        actual={inicial?.foto_id ? `/fotos/${inicial.foto_id}?v=${inicial.version}` : undefined}
        permitirQuitar
      />

      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input name="activo" type="checkbox" defaultChecked={activo} className="size-4 accent-neutral-900" />
        Visible en la web
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">{enviando ? "Guardando…" : textoBoton}</button>
        <Link href="/admin/academia" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
