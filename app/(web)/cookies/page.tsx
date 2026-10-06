// Política de cookies (LSSI-CE, artículo 22.2, y guía de cookies de la AEPD).
// La web solo usa almacenamiento técnico, que no necesita permiso, y el mapa de Google solo se carga
// si la persona lo pide (por eso no hace falta el típico aviso de cookies).
// Si algún día se añade Google Analytics o similar, habrá que poner un aviso y pedir permiso ANTES.
import type { Metadata } from "next";
import PaginaLegal, { Apartado } from "@/components/web/PaginaLegal";
import { salon } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Política de cookies · Laksmir Beauty Salon",
  robots: { index: false },
};

const usadas = [
  { nombre: "laksmir-carrito", tipo: "Almacenamiento local del navegador", para: "Recordar lo que has añadido al carrito.", dura: "Hasta que vacíes el carrito o borres los datos del navegador" },
  { nombre: "laksmir_session", tipo: "Cookie propia", para: "Mantener la sesión del panel de administración del salón (solo la usa el equipo).", dura: "7 días o hasta cerrar sesión" },
];

export default function CookiesPage() {
  return (
    <PaginaLegal titulo="Política de cookies">
      <Apartado titulo="Qué son las cookies">
        <p>
          Son pequeños archivos que una web guarda en tu navegador para recordar cosas, como lo que tienes en el carrito. Algunas son
          necesarias para que la web funcione y otras sirven para analizar visitas o mostrar publicidad.
        </p>
      </Apartado>

      <Apartado titulo="Qué cookies usa esta web">
        <p>
          La web de {salon.nombre} <strong>solo usa las imprescindibles para funcionar</strong>. No usamos cookies de análisis ni de
          publicidad, por eso no te pedimos permiso al entrar.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-linea">
            <thead className="bg-arena">
              <tr>
                {["Nombre", "Tipo", "Para qué sirve", "Duración"].map((t) => <th key={t} className="p-3 font-medium">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {usadas.map((c) => (
                <tr key={c.nombre} className="border-t border-linea align-top">
                  <td className="p-3">{c.nombre}</td>
                  <td className="p-3">{c.tipo}</td>
                  <td className="p-3">{c.para}</td>
                  <td className="p-3">{c.dura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Apartado>

      <Apartado titulo="El mapa de Google">
        <p>
          En la página de contacto, el mapa de Google Maps no se carga hasta que pulsas «Ver mapa». Si lo haces, Google puede guardar sus
          propias cookies, según su política de privacidad (
          <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">policies.google.com</a>).
        </p>
      </Apartado>

      <Apartado titulo="Enlaces a otras webs">
        <p>
          Cuando vas a Booksy, WhatsApp o Instagram desde nuestra web, sales de ella y esas empresas aplican sus propias cookies.
        </p>
      </Apartado>

      <Apartado titulo="Cómo borrarlas">
        <p>
          Puedes borrar las cookies y los datos guardados desde los ajustes de tu navegador (Chrome, Safari, Firefox…). Si lo haces, se
          vaciará el carrito.
        </p>
      </Apartado>
    </PaginaLegal>
  );
}
