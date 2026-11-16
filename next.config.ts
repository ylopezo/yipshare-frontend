import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      {
        source: "/api/:ruta*",
        destination: `${process.env.API_URL || "http://localhost:4600"}/:ruta*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin_yipshare/principal_page",
        destination: "/admin_yipshare/principal_page/condominios",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
