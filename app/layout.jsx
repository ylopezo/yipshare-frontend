import "./globals.css";
import { SESSION_SCRIPT } from "@/lib/session";

export const metadata = {
  title: "YipShare",
  icons: { icon: "/img/logo_yipshare_icono.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SESSION_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
