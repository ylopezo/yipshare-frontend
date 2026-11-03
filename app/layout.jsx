import "./globals.css";

export const metadata = {
    title: "YipShare",
    icons: { icon: "/img/logo_yipshare_icono.png" },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
