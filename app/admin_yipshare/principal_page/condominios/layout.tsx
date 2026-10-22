export default function CondominiumsLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body>{children}</body>
        </html>
    );
}
