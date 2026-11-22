import Link from "next/link";

const LABEL = {
    admin: "Usted es administrador",
    resident: "Usted es miembro",
};

const BASE_ROUTE = {
    admin: "/habitante_yipshare/condominio_admin",
    resident: "/habitante_yipshare/condominio",
};

export function CondominiumCard({ condominium, role }) {
    return (
        <Link
            href={`${BASE_ROUTE[role]}/${condominium.id}`}
            className="flex w-48 cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
        >
            <div className="h-24 shrink-0 bg-gris-imagen" />

            <div className="px-3 pb-4 pt-2">
                <span className="inline-block rounded-full bg-azul-suave px-2 py-0.5 text-xs font-bold text-azul">
                    {LABEL[role]}
                </span>

                <p className="m-0 mt-1 text-lg font-bold text-azul-texto">{condominium.name}</p>

                <p className="m-0 text-xs font-semibold text-celeste">Admin: {condominium.admin}</p>
            </div>
        </Link>
    );
}
