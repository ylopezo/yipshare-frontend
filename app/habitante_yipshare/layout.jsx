import { RequireSession } from "@/components/RequireSession";

// Todas las páginas del habitante piden sesión; sin ella el servidor responde 401 y RequireSession manda al login
export default function ResidentLayout({ children }) {
  return <RequireSession role="resident">{children}</RequireSession>;
}
