import { RequiereSesion } from "@/components/RequiereSesion";

// Todas las páginas del habitante piden sesión; sin ella el servidor responde 401 y RequiereSesion manda al login
export default function HabitanteLayout({ children }) {
    return <RequiereSesion>{children}</RequiereSesion>;
}
