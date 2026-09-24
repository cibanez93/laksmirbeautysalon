import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel | Laksmir Beauty Salon",
  // Que Google no muestre el panel en los resultados de búsqueda
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>;
}
