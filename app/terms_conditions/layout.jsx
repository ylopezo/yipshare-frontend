import { GuestOnly } from "@/components/GuestOnly";

export const metadata = {
  title: "Términos y Condiciones",
};

export default function TermsConditionsLayout({ children }) {
  return <GuestOnly>{children}</GuestOnly>;
}
