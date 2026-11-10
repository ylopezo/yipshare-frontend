import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // redirect() inside a page breaks cacheComponents prerender validation
  // El front pide /api/... al mismo sitio y Next lo reenvía al backend: la cookie de sesión queda en el mismo origen (sameSite lax)
  async rewrites() {
    return [{ source: "/api/:ruta*", destination: `${process.env.API_URL || "http://localhost:4600"}/api/:ruta*` }];
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
