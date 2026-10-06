// Modo mantenimiento: mientras esté activo, las visitas ven /mantenimiento.
// Está ACTIVADO por defecto. Para desactivarlo, pon MANTENIMIENTO=false
// en las variables de entorno (en local, en .env.desarrollo; en Cloudflare, en wrangler.jsonc).
// Vista previa: quien ha entrado en el panel ve la web entera, para revisar cómo queda.
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, usuarioDeToken } from "@/lib/session";
import { VISTA_PREVIA } from "@/lib/vista-previa";

// ¿Trae una sesión del panel que existe de verdad en la base de datos?
// Si la base de datos falla, se enseña el mantenimiento (lo más seguro).
async function esDelEquipo(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return false;
  return usuarioDeToken(token).then(Boolean).catch(() => false);
}

export default async function proxy(request: NextRequest) {
  const enMantenimiento = process.env.MANTENIMIENTO !== "false";
  const { pathname } = request.nextUrl;

  if (enMantenimiento && pathname !== "/mantenimiento") {
    if (await esDelEquipo(request)) {
      // Cookie visible para el navegador: solo sirve para enseñar el aviso de «Vista previa»
      const respuesta = NextResponse.next();
      respuesta.cookies.set(VISTA_PREVIA, "1", { path: "/", maxAge: 60 * 60, sameSite: "lax" });
      return respuesta;
    }
    // 503 = "vuelvo pronto": Google no sustituye la web por esta página
    return NextResponse.rewrite(new URL("/mantenimiento", request.url), { status: 503 });
  }

  if (!enMantenimiento && pathname === "/mantenimiento") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Sin mantenimiento ya no hace falta el aviso
  const respuesta = NextResponse.next();
  if (request.cookies.has(VISTA_PREVIA)) respuesta.cookies.delete(VISTA_PREVIA);
  return respuesta;
}

export const config = {
  // No toca el panel, la API (el aviso de pagos de Stripe), las fotos, los archivos de Next, las imágenes ni las fuentes
  matcher: ["/((?!admin|api/|fotos/|_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|otf|ttf|woff2?)$).*)"],
};
