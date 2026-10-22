import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Página Principal",
};
export default function PrincipalPageLayout({ children }: { children: React.ReactNode }) {
    return children;
}