import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "YipShare",
    icons: { icon: "/img/logo_yipshare_icono.png" },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body>{children}</body>
        </html>
    );
}