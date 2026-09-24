// Modo mantenimiento: mientras esté activo, las visitas ven /mantenimiento.
// Está ACTIVADO por defecto. Para desactivarlo, pon MANTENIMIENTO=false
// en las variables de entorno (en local, en .env.local).
import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const enMantenimiento = process.env.MANTENIMIENTO !== "false";
  const { pathname } = request.nextUrl;

  if (enMantenimiento && pathname !== "/mantenimiento") {
    // 503 = "vuelvo pronto": Google no sustituye la web por esta página
    return NextResponse.rewrite(new URL("/mantenimiento", request.url), { status: 503 });
  }

  if (!enMantenimiento && pathname === "/mantenimiento") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // No toca el panel, los archivos de Next, las imágenes ni las fuentes
  matcher: ["/((?!admin|_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|otf|ttf|woff2?)$).*)"],
};
