"use client";

import { useState } from "react";
import type { EstadoPrestamo, Prestamo } from "@/lib/prestamos";
import { ESTADO_PRESTAMO } from "./PrestamoVista";

type Filtro = EstadoPrestamo | "todos";

const CELDA = "border-b border-slate-300 px-3 py-2";

export function TodosPrestamosVista({ prestamos }: { prestamos: Prestamo[] }) {
    const [filtro, setFiltro] = useState<Filtro>("todos");
    const [ahora] = useState(() => Date.now());

    const vencido = (p: Prestamo) => p.estado === "en_curso" && p.fin !== null && p.fin < ahora;
    const lista = filtro === "todos" ? prestamos : prestamos.filter((p) => p.estado === filtro);
    const vencidos = prestamos.filter(vencido).length;

    const filtros: { valor: Filtro; texto: string; total: number }[] = [
        { valor: "todos", texto: "Todos", total: prestamos.length },
        ...(Object.keys(ESTADO_PRESTAMO) as EstadoPrestamo[]).map((e) => ({
            valor: e,
            texto: ESTADO_PRESTAMO[e].texto,
            total: prestamos.filter((p) => p.estado === e).length,
        })),
    ];

    return (
        <>
            <h2 className="m-0 text-base font-bold">Todos los préstamos</h2>
            <p className="mb-0 mt-1 text-xs text-slate-500">
                Registro de los préstamos del condominio.
                {vencidos > 0 && (
                    <span className="ml-2 font-bold text-red-600">
                        {vencidos} {vencidos === 1 ? "préstamo vencido" : "préstamos vencidos"}
                    </span>
                )}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {filtros.map((f) => (
                    <button
                        key={f.valor}
                        type="button"
                        aria-pressed={filtro === f.valor}
                        onClick={() => setFiltro(f.valor)}
                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            filtro === f.valor
                                ? "border-[#1e4a73] bg-[#1e4a73] text-white"
                                : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        {f.texto} ({f.total})
                    </button>
                ))}
            </div>

            {lista.length === 0 ? (
                <p className="mb-0 mt-4 text-sm text-slate-500">No hay préstamos.</p>
            ) : (
                <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                        <thead className="font-bold text-[#1e4a73]">
                            <tr>
                                <th className={CELDA}>Artículo</th>
                                <th className={CELDA}>Dueño</th>
                                <th className={CELDA}>Prestatario</th>
                                <th className={CELDA}>Tiempo</th>
                                <th className={CELDA}>Estado</th>
                                <th className={CELDA}>Vence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((p) => (
                                <tr key={p.id}>
                                    <td className={`${CELDA} font-bold`}>{p.nombre}</td>
                                    <td className={CELDA}>{p.duenio}</td>
                                    <td className={CELDA}>{p.prestatario}</td>
                                    <td className={CELDA}>{p.tiempo}</td>
                                    <td className={CELDA}>
                                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${ESTADO_PRESTAMO[p.estado].clase}`}>
                                            {ESTADO_PRESTAMO[p.estado].texto}
                                        </span>
                                        {vencido(p) && (
                                            <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white">
                                                Vencido
                                            </span>
                                        )}
                                    </td>
                                    <td className={CELDA}>
                                        {p.fin
                                            ? new Date(p.fin).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
