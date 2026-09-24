import type { Metadata } from "next";
import { brand, abhayaLibre, montserrat } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laksmir Beauty Salon",
  description: "Peluqueria y estetica profesional en Pamplona",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${brand.variable} ${abhayaLibre.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}