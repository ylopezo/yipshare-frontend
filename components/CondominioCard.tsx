import type { CondominioUsuario } from "@/lib/datosHabitante";

export type RolEnCondominio = "admin" | "habitante";

const ETIQUETA: Record<RolEnCondominio, string> = {
    admin: "Usted es administrador",
    habitante: "Usted es miembro",
};

export function CondominioCard({
                                   condominio,
                                   rol,
                                   onClick,
                               }: {
    condominio: CondominioUsuario;
    rol: RolEnCondominio;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-48 cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
        >
            <div className="h-24 shrink-0 bg-[#e4e4e4]" />

            <div className="px-3 pb-4 pt-2">
                <span className="inline-block rounded-full bg-[#dbe7f5] px-2 py-0.5 text-[9px] font-bold text-[#1e4a73]">
                    {ETIQUETA[rol]}
                </span>

                <p className="m-0 mt-1 text-lg font-bold text-[#2a5a88]">
                    {condominio.nombre}
                </p>

                <p className="m-0 text-[10px] font-semibold text-[#78b0ea]">
                    Admin: {condominio.admin}
                </p>
            </div>
        </button>
    );
}