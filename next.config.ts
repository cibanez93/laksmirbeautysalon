import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Para subir fotos desde el panel (se reducen antes a ~300 KB; un antes/después son dos fotos)
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
