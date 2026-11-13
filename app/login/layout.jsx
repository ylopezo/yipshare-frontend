import { GuestOnly } from "@/components/GuestOnly";

export const metadata = {
  title: "Iniciar Sesión",
};

export default function LoginLayout({ children }) {
  return <GuestOnly>{children}</GuestOnly>;
}
