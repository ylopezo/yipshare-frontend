"use client";

import { BOTON_CLARO } from "./Modal";

function Interruptor({ activo, onCambiar, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={activo}
            aria-label={label}
            onClick={onCambiar}
            className={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition ${activo ? "bg-azul" : "bg-slate-300"}`}
        >
            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${activo ? "left-7" : "left-1"}`}
            />
        </button>
    );
}

export function VecinosVista({ vecinos, onPermisoAction, onExpulsarAction }) {
    if (vecinos.length === 0) {
        return <p className="m-0 text-sm text-slate-500">No hay vecinos.</p>;
    }

    return (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {vecinos.map((v) => (
                <li
                    key={v.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
                >
                    <div className="min-w-0 flex-1 basis-40">
                        <p className="m-0 break-words text-sm font-bold">{v.nombre}</p>
                        <p className={`m-0 text-[11px] ${v.alCorriente ? "text-[#5aa0e8]" : "text-azul"}`}>
                            {v.alCorriente ? "Al Corriente" : "Adeudo de Mantenimiento"}
                        </p>
                    </div>

                    <p className="m-0 flex-1 basis-40 text-xs font-bold">Dpto/Casa: {v.depto}</p>

                    <div className="flex items-center gap-4">
                        <Interruptor
                            activo={v.alCorriente}
                            onCambiar={() => onPermisoAction(v)}
                            label={`Permiso para pedir artículos de ${v.nombre}`}
                        />
                        <button
                            type="button"
                            onClick={() => onExpulsarAction(v)}
                            className={`${BOTON_CLARO} px-3 py-1 text-xs font-semibold`}
                        >
                            Expulsar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
