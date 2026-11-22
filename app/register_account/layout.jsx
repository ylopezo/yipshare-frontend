import { GuestOnly } from "@/components/GuestOnly";

export const metadata = {
    title: "Registrarse",
};

export default function LoginLayout({ children }) {
    return <GuestOnly>{children}</GuestOnly>;
}
