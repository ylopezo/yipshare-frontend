import Link from "next/link";
import { Icon } from "./Icon";

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
            className="flex w-48 cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left border border-neutral-300 transition hover:border-neutral-500"
        >
            <div
                aria-hidden="true"
                className="flex h-24 shrink-0 items-center justify-center bg-gris-imagen text-neutral-400"
            >
                <Icon name="house" size={40} />
            </div>

            <div className="px-3 pb-4 pt-2">
                <span className="inline-block rounded bg-azul-suave px-2 py-0.5 text-xs font-semibold text-azul">
                    {LABEL[role]}
                </span>

                <p className="m-0 mt-1 text-lg font-bold text-azul-texto">{condominium.name}</p>

                <p className="m-0 text-xs font-semibold text-black">Admin: {condominium.admin}</p>
            </div>
        </Link>
    );
}
