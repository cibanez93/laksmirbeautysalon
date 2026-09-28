// Panel: qué foto de la galería se ve en cada sitio de la web
import Link from "next/link";
import { nombreBonito } from "@/lib/categorias";
import { obtenerDestacados, ubicaciones } from "@/lib/destacados";
import { listarFotos } from "@/lib/fotos";
import { listarCategorias, listarServicios } from "@/lib/servicios";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../MenuAdmin";
import { guardarDestacado } from "./actions";
import ElegirDestacado from "./ElegirDestacado";

export default async function AdminDestacadosPage() {
  const sesion = await requireSession();
  const [guardados, todasFotos, servicios, categorias] = await Promise.all([
    obtenerDestacados(),
    listarFotos({ soloVisibles: false }),
    listarServicios(),
    listarCategorias(),
  ]);

  // Solo las fotos normales (los antes/después tienen su propio sitio en la galería)
  const fotos = todasFotos.filter((f) => f.tipo === "foto").map((f) => ({ id: f.id, titulo: f.titulo, visible: f.visible }));
  const nombreCategoria = (id: number | null) => categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
  const opcionesServicio = servicios
    .filter((s) => s.activo)
    .map((s) => ({ id: s.id, nombre: nombreBonito(s.nombre), categoria: nombreCategoria(s.categoria_id) }));
  const grupos = [...new Set(ubicaciones.map((u) => u.grupo))];

  return (
    <>
      <MenuAdmin activa="Destacados" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light">Destacados</h1>
        <p className="text-sm text-neutral-500 mb-2">Elige qué foto se ve en cada sitio de la web. Las fotos salen de la galería.</p>
        <p className="text-sm text-neutral-500 mb-10">
          ¿Quieres usar una foto que no salga en la galería (por ejemplo, la de una compañera)? Súbela en{" "}
          <Link href="/admin/galeria" className="underline">Galería</Link> y márcala como oculta.
        </p>

        {fotos.length === 0 && (
          <p className="bg-white border border-neutral-200 p-6 text-center text-neutral-500 mb-10">
            Todavía no hay fotos en la galería. <Link href="/admin/galeria/nueva" className="underline">Sube la primera</Link> para poder elegirla aquí.
          </p>
        )}

        <div className="space-y-12">
          {grupos.map((grupo) => (
            <section key={grupo}>
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">{grupo}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ubicaciones
                  .filter((u) => u.grupo === grupo)
                  .map((u) => (
                    <ElegirDestacado
                      // La clave cambia al guardar: así la tarjeta se vuelve a crear con lo guardado
                      key={`${u.id}-${guardados[u.id]?.foto_id}-${guardados[u.id]?.servicio?.id}`}
                      nombre={u.nombre}
                      accion={guardarDestacado.bind(null, u.id)}
                      fotos={fotos}
                      servicios={u.conServicio ? opcionesServicio : undefined}
                      fotoActual={guardados[u.id]?.foto_id ?? null}
                      servicioActual={guardados[u.id]?.servicio?.id ?? null}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
