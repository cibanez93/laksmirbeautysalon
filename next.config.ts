import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las fotos ya se reducen al subirlas en el panel; así no hace falta el servicio de imágenes de Cloudflare
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      // Para subir fotos desde el panel (se reducen antes a ~300 KB; un antes/después son dos fotos)
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
