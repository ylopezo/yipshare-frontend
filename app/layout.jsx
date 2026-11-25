import { Encode_Sans_Semi_Expanded, Inconsolata } from "next/font/google";
import "./globals.css";
import { SESSION_SCRIPT } from "@/lib/session";

const encode = Encode_Sans_Semi_Expanded({
    subsets: ["latin"],
    weight: ["300", "500", "600", "700"],
    variable: "--font-encode",
});
const inconsolata = Inconsolata({ subsets: ["latin"], variable: "--font-inconsolata" });

export const metadata = {
    title: "YipShare",
    icons: { icon: "/img/logo_yipshare_icono.png" },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${encode.variable} ${inconsolata.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: SESSION_SCRIPT }} />
            </head>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
