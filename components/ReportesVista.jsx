"use client";

import { useState } from "react";
import { BOTON_OSCURO } from "./Modal";

export const REPORTE_ESTADOS = [
    { valor: "en_revision", texto: "En revisión", clase: "bg-[#dbe7f5] text-[#1e4a73]" },
    { valor: "pendiente", texto: "Pendiente", clase: "bg-[#fde9a8] text-amber-900" },
    { valor: "finalizado", texto: "Finalizado", clase: "bg-[#b9f0c8] text-green-900" },
];

const INPUT_LECTURA =
    "w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default";

export function ReportesVista({ reportes, onCambiarEstadoAction }) {
    const [seleccionId, setSeleccionId] = useState(null);
    const [estado, setEstado] = useState("pendiente");

    const seleccionado = reportes.find((r) => r.id === seleccionId) ?? null;

    function elegir(r) {
        setSeleccionId(r.id);
        setEstado(r.estado);
    }

    return (
        <>
            <h2 className="m-0 text-base font-bold">Reportes</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,380px)_1fr]">
                <div className="rounded-[2rem] bg-white px-6 py-6 shadow-sm">
                    <label className="sr-only" htmlFor="rep-involucrado">
                        Vecino involucrado
                    </label>
                    <input
                        id="rep-involucrado"
                        readOnly
                        placeholder="Nombre del vecino involucrado"
                        value={seleccionado?.involucrado ?? ""}
                        className={INPUT_LECTURA}
                    />

                    <label className="sr-only" htmlFor="rep-reporto">
                        Vecino que reportó
                    </label>
                    <input
                        id="rep-reporto"
                        readOnly
                        placeholder="Nombre del vecino que reportó"
                        value={seleccionado?.reporto ?? ""}
                        className={`${INPUT_LECTURA} mt-3`}
                    />

                    <label className="sr-only" htmlFor="rep-detalles">
                        Detalles del reporte
                    </label>
                    <textarea
                        id="rep-detalles"
                        readOnly
                        rows={3}
                        placeholder="Detalles del reporte"
                        value={seleccionado?.detalles ?? ""}
                        className="mt-3 w-full resize-none rounded-2xl border border-slate-500 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default"
                    />

                    <p className="mb-2 mt-4 text-xs font-bold text-[#1e4a73]">Estado del reporte</p>
                    <div className="flex flex-wrap gap-2">
                        {REPORTE_ESTADOS.map((e) => (
                            <button
                                key={e.valor}
                                type="button"
                                disabled={!seleccionado}
                                aria-pressed={estado === e.valor}
                                onClick={() => setEstado(e.valor)}
                                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    estado === e.valor
                                        ? "border-[#1e4a73] bg-[#1e4a73] text-white"
                                        : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {e.texto}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={!seleccionado || estado === seleccionado.estado}
                        onClick={() => seleccionado && onCambiarEstadoAction(seleccionado.id, estado)}
                        className={`${BOTON_OSCURO} mx-auto mt-6 block w-full max-w-xs py-2 text-sm font-semibold`}
                    >
                        Modificar Estado
                    </button>
                </div>

                <section>
                    <h3 className="m-0 text-sm font-bold text-slate-700">Reportes Recibidos</h3>

                    {reportes.length === 0 ? (
                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay reportes.</p>
                    ) : (
                        <ul className="m-0 mt-3 list-none p-0">
                            {reportes.map((r) => {
                                const info = REPORTE_ESTADOS.find((e) => e.valor === r.estado);
                                return (
                                    <li key={r.id} className="border-b border-slate-300">
                                        <button
                                            type="button"
                                            aria-pressed={seleccionId === r.id}
                                            onClick={() => elegir(r)}
                                            className={`flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-2 text-left text-xs font-bold hover:bg-white ${seleccionId === r.id ? "bg-white" : ""}`}
                                        >
                                            <span className="min-w-0 truncate">Reporte contra {r.involucrado}</span>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${info.clase}`}
                                            >
                                                {info.texto}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}
