import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,
    async rewrites() {
        return [
            {
                source: "/api/:ruta*",
                destination: `${process.env.API_URL || "https://yipshare-backend.oelohey.dev"}/:ruta*`,
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
