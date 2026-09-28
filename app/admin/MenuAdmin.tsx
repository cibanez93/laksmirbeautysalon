// Menú del panel: secciones, enlace a la web y cerrar sesión
import Image from "next/image";
import Link from "next/link";
import { logout } from "./actions";

const secciones = [
  { texto: "Servicios", href: "/admin" },
  { texto: "Galería", href: "/admin/galeria" },
  { texto: "Destacados", href: "/admin/destacados" },
  { texto: "Blog", href: "/admin/blog" },
];

export default function MenuAdmin({ activa, email }: { activa: "Servicios" | "Galería" | "Destacados" | "Blog"; email: string }) {
  return (
    <header className="bg-white border-b border-neutral-200 mb-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Laksmir" width={800} height={243} className="w-auto h-9" />
          <span className="hidden sm:block text-xs uppercase tracking-widest text-neutral-400">Panel</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="hidden md:block text-neutral-500">{email}</span>
          <Link href="/" target="_blank" className="text-neutral-600 hover:underline">Ver la web ↗</Link>
          <form action={logout}>
            <button type="submit" className="text-neutral-600 hover:underline">Cerrar sesión</button>
          </form>
        </div>
      </div>
      <nav aria-label="Secciones del panel" className="max-w-5xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto">
        {secciones.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={s.texto === activa ? "page" : undefined}
            className={`px-4 py-3 text-sm uppercase tracking-wider border-b-2 transition-colors ${s.texto === activa ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}
          >
            {s.texto}
          </Link>
        ))}
      </nav>
    </header>
  );
}
