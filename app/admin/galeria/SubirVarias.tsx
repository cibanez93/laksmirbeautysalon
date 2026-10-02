"use client";
// Subida rápida de fotos, como en WordPress: eliges (o arrastras) varias de golpe y se suben
// una a una, sin título. Luego se eligen en Destacados o se editan si hace falta.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { reducir } from "@/components/admin/reducirImagen";
import { subirFotoRapida } from "./actions";

export default function SubirVarias({ categorias }: { categorias: { id: number; nombre: string }[] }) {
  const router = useRouter();
  const [categoria, setCategoria] = useState("");
  const [visible, setVisible] = useState(true);
  const [encima, setEncima] = useState(false);
  const [progreso, setProgreso] = useState<{ hechas: number; total: number } | null>(null);
  const [fallos, setFallos] = useState<string[]>([]);

  async function subir(archivos: File[]) {
    const fotos = archivos.filter((a) => a.type.startsWith("image/"));
    if (fotos.length === 0 || progreso) return;
    setFallos([]);
    const errores: string[] = [];

    // De una en una: así cada envío pesa poco y si una falla, las demás se suben igual
    for (const [i, archivo] of fotos.entries()) {
      setProgreso({ hechas: i, total: fotos.length });
      try {
        const datos = new FormData();
        datos.set("imagen", await reducir(archivo));
        datos.set("categoria_id", categoria);
        if (visible) datos.set("visible", "si");
        const res = await subirFotoRapida(datos);
        if (res.error) errores.push(`${archivo.name}: ${res.error}`);
      } catch {
        errores.push(`${archivo.name}: no se ha podido leer la foto.`);
      }
    }

    setProgreso(null);
    setFallos(errores);
    router.refresh();
  }

  return (
    <div className="bg-white border border-neutral-200 p-5 mb-8">
      <label
        onDragOver={(e) => { e.preventDefault(); setEncima(true); }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => { e.preventDefault(); setEncima(false); subir([...e.dataTransfer.files]); }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
          encima ? "border-neutral-900 bg-neutral-50" : "border-neutral-300 hover:border-neutral-500"
        } ${progreso ? "pointer-events-none opacity-60" : ""}`}
      >
        <input type="file" accept="image/*" multiple className="sr-only" disabled={!!progreso}
          onChange={(e) => { subir([...(e.target.files ?? [])]); e.target.value = ""; }} />
        {progreso ? (
          <>
            <span className="text-lg">Subiendo {progreso.hechas + 1} de {progreso.total}…</span>
            <span className="w-48 h-1.5 bg-neutral-200">
              <span className="block h-full bg-neutral-900 transition-all" style={{ width: `${(progreso.hechas / progreso.total) * 100}%` }} />
            </span>
          </>
        ) : (
          <>
            <span className="text-lg">Arrastra aquí las fotos o <span className="underline">elígelas</span></span>
            <span className="text-sm text-neutral-500">Puedes elegir muchas a la vez. No hace falta ponerles título.</span>
          </>
        )}
      </label>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-4 text-sm">
        <label className="flex items-center gap-2">
          Categoría
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input !py-1.5 !text-sm !w-auto">
            <option value="">Sin categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-neutral-900" />
          Mostrarlas en la galería de la web
        </label>
      </div>

      {fallos.length > 0 && (
        <div role="alert" className="mt-4 text-sm text-red-700">
          <p>Estas fotos no se han podido subir:</p>
          <ul className="list-disc pl-5">{fallos.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
