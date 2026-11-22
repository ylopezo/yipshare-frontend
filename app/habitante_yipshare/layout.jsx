import { RequireSession } from "@/components/RequireSession";

export default function ResidentLayout({ children }) {
    return <RequireSession role="resident">{children}</RequireSession>;
}
