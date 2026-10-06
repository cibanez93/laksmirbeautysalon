// Página de SERVICIOS: tarjetas regalo arriba y todos los servicios por secciones, sin precios, con buscador.
import type { Metadata } from "next";
import { connection } from "next/server";
import BloqueTarjetasRegalo from "@/components/tienda/BloqueTarjetasRegalo";
import AbrirAsistente from "@/components/web/chat/AbrirAsistente";
import { TituloSeccion } from "@/components/web/decoracion";
import { categorias, duracionBonita, nombreBonito } from "@/lib/categorias";
import { obtenerDestacadosSeguro } from "@/lib/destacados";
import { listarServiciosActivos } from "@/lib/servicios";
import { listarTarjetasActivas, type TarjetaRegalo } from "@/lib/tarjetas";
import ListaServicios, { type GrupoServicios } from "./ListaServicios";

export const metadata: Metadata = {
  title: "Servicios de peluquería y estética en Ripagaina, Pamplona | Laksmir Beauty Salon",
  description: "Peluquería, tratamientos faciales y corporales, manicura, maquillaje, masajes y diseño de mirada en Ripagaina (Pamplona). Reserva online o regala una tarjeta regalo.",
};

async function getGrupos(): Promise<GrupoServicios[] | null> {
  await connection(); // se lee la base de datos en cada visita
  try {
    const [servicios, destacados] = await Promise.all([listarServiciosActivos(), obtenerDestacadosSeguro()]);
    return categorias
      .map((c) => ({
        categoria: c,
        fotoId: destacados[`categoria-${c.slug}`]?.foto_id ?? null,
        servicios: servicios
          .filter((s) => s.categoria === c.slug)
          .map((s) => ({
            id: s.id,
            nombre: nombreBonito(s.nombre),
            descripcion: s.descripcion,
            duracion: duracionBonita(s.duracion_min),
            fotoId: s.foto_id,
            // Si se puede regalar, sale el botón "Regalar"
            regalo: s.regalable && s.precio ? { precio: s.precio, categoria: c.nombre } : null,
          })),
      }))
      .filter((g) => g.servicios.length > 0);
  } catch (error) {
    console.error("Error al traer los servicios:", error);
    return null;
  }
}

async function getTarjetas(): Promise<TarjetaRegalo[]> {
  try {
    return await listarTarjetasActivas();
  } catch (error) {
    console.error("Error al traer las tarjetas regalo:", error);
    return [];
  }
}

export default async function ServiciosPage() {
  const [grupos, tarjetas] = await Promise.all([getGrupos(), getTarjetas()]);

  return (
    <div className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <TituloSeccion as="h1" antetitulo="Peluquería y estética" titulo="Nuestros servicios" />
        <p className="text-center text-neutral-600 max-w-xl mx-auto -mt-4 mb-12">
          Todo lo que podemos hacer por ti. ¿Dudas sobre qué elegir?{" "}
          <AbrirAsistente className="text-dorado-oscuro underline underline-offset-2 hover:text-neutral-900">Pregunta a nuestra asistente</AbrirAsistente>.
        </p>

        <BloqueTarjetasRegalo tarjetas={tarjetas} />

        {grupos ? (
          <ListaServicios grupos={grupos} />
        ) : (
          <p className="text-center text-neutral-500">No se han podido cargar los servicios. Inténtalo de nuevo más tarde.</p>
        )}
      </div>
    </div>
  );
}
