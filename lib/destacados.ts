// Fotos destacadas: qué foto de la galería se ve en cada sitio de la web.
// Se eligen en el panel (/admin/destacados) y se guardan en la tabla "destacados".
import "server-only";
import type { RowDataPacket } from "mysql2";
import { categorias } from "./categorias";
import { db } from "./db";
import { equipo } from "./equipo";

export interface Ubicacion {
  id: string;
  nombre: string;
  grupo: string;
  conServicio?: boolean; // en los servicios destacados también se elige el servicio
}

// Huecos de las galerías pequeñas de Nosotras («Nuestro salón») y Novias («Galería de novias»)
export const fotosSalon = [
  { id: "salon-fachada", texto: "Fachada" },
  { id: "salon-peluqueria", texto: "Zona de peluquería" },
  { id: "salon-estetica", texto: "Cabina de estética" },
  { id: "salon-manicura", texto: "Zona de manicura" },
  { id: "salon-detalle", texto: "Detalle" },
];

export const fotosNovias = ["Recogido", "Maquillaje", "Detalle del peinado", "Novia completa", "Manicura", "Semirrecogido", "Maquillaje natural", "Novia con velo"].map(
  (texto, i) => ({ id: `novias-galeria-${i + 1}`, texto })
);

// Todos los sitios de la web con foto. El id es lo que se guarda en la base de datos.
export const ubicaciones: Ubicacion[] = [
  { id: "portada", nombre: "Foto principal de la portada", grupo: "Portada" },
  { id: "destacado-1", nombre: "Servicio destacado 1", grupo: "Servicios destacados de la portada", conServicio: true },
  { id: "destacado-2", nombre: "Servicio destacado 2", grupo: "Servicios destacados de la portada", conServicio: true },
  { id: "destacado-3", nombre: "Servicio destacado 3", grupo: "Servicios destacados de la portada", conServicio: true },
  ...equipo.map((p) => ({ id: `equipo-${p.nombre.toLowerCase()}`, nombre: p.nombre, grupo: "Equipo" })),
  ...categorias.map((c) => ({ id: `categoria-${c.slug}`, nombre: c.nombre, grupo: "Categorías" })),
  { id: "nosotras", nombre: "«Nuestra historia» (si no eliges, sale la de la portada)", grupo: "Nosotras" },
  ...fotosSalon.map((f) => ({ id: f.id, nombre: `Nuestro salón: ${f.texto.toLowerCase()}`, grupo: "Nosotras" })),
  { id: "novias", nombre: "Novias (portada y página de novias)", grupo: "Novias" },
  { id: "novias-invitadas", nombre: "Invitadas y madrinas", grupo: "Novias" },
  ...fotosNovias.map((f, i) => ({ id: f.id, nombre: `Galería de novias ${i + 1}: ${f.texto.toLowerCase()}`, grupo: "Novias" })),
];

export const esUbicacion = (id: string) => ubicaciones.some((u) => u.id === id);

export interface ServicioDestacado {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_min: number | null;
  categoria: string | null; // nombre de la categoría
}

export interface Destacado {
  foto_id: number | null;
  servicio: ServicioDestacado | null;
}

// Devuelve los destacados guardados, por ubicación: { "portada": {...}, "destacado-1": {...} }
export async function obtenerDestacados(): Promise<Record<string, Destacado>> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT d.ubicacion, d.foto_id,
            s.id AS servicio_id, s.nombre, s.descripcion, s.duracion_min, c.nombre AS categoria
       FROM destacados d
       LEFT JOIN servicios s ON s.id = d.servicio_id
       LEFT JOIN categorias c ON c.id = s.categoria_id`
  );
  return Object.fromEntries(
    rows.map((f) => [
      f.ubicacion,
      {
        foto_id: f.foto_id,
        servicio: f.servicio_id
          ? { id: f.servicio_id, nombre: f.nombre, descripcion: f.descripcion, duracion_min: f.duracion_min, categoria: f.categoria }
          : null,
      },
    ])
  );
}

// Para las páginas públicas: si la base de datos falla, se ven las fotos de ejemplo
export async function obtenerDestacadosSeguro(): Promise<Record<string, Destacado>> {
  try {
    return await obtenerDestacados();
  } catch (error) {
    console.error("Error al traer los destacados:", error);
    return {};
  }
}

// Guarda o cambia la foto (y el servicio) de una ubicación.
// ON DUPLICATE KEY UPDATE: si la ubicación ya existe la actualiza; si no, la crea.
export async function guardarDestacado(ubicacion: string, foto_id: number | null, servicio_id: number | null) {
  await db.execute(
    `INSERT INTO destacados (ubicacion, foto_id, servicio_id) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE foto_id = VALUES(foto_id), servicio_id = VALUES(servicio_id)`,
    [ubicacion, foto_id, servicio_id]
  );
}
