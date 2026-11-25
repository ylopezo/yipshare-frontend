"use client";

import { useState } from "react";
import { DARK_BUTTON } from "./Modal";

export const REPORT_STATUSES = [
    {
        value: "in_review",
        text: "En revisión",
        cssClass: "bg-azul-suave text-azul",
    },
    {
        value: "pending",
        text: "Pendiente",
        cssClass: "bg-amarillo-suave text-amber-900",
    },
    {
        value: "resolved",
        text: "Finalizado",
        cssClass: "bg-verde-suave text-green-900",
    },
];

const READONLY_INPUT =
    "w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default";

export function ReportsView({ reports, onChangeStatusAction }) {
    const [selectedId, setSelectedId] = useState(null);
    const [status, setStatus] = useState("pending");

    const selected = reports.find((r) => r.id === selectedId) ?? null;

    function choose(r) {
        setSelectedId(r.id);
        setStatus(r.status);
    }

    return (
        <>
            <h2 className="m-0 text-base font-bold">Reportes</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,380px)_1fr]">
                <div className="rounded-[2rem] bg-white px-6 py-6">
                    <label className="sr-only" htmlFor="rep-involucrado">
                        Vecino involucrado
                    </label>
                    <input
                        id="rep-involucrado"
                        readOnly
                        placeholder="Nombre del vecino involucrado"
                        value={selected?.involved ?? ""}
                        className={READONLY_INPUT}
                    />

                    <label className="sr-only" htmlFor="rep-reporto">
                        Vecino que reportó
                    </label>
                    <input
                        id="rep-reporto"
                        readOnly
                        placeholder="Nombre del vecino que reportó"
                        value={selected?.reportedBy ?? ""}
                        className={`${READONLY_INPUT} mt-3`}
                    />

                    <label className="sr-only" htmlFor="rep-detalles">
                        Detalles del reporte
                    </label>
                    <textarea
                        id="rep-detalles"
                        readOnly
                        rows={3}
                        placeholder="Detalles del reporte"
                        value={selected?.details ?? ""}
                        className="mt-3 w-full resize-none rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default"
                    />

                    {selected?.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selected.images.map((src, i) => (
                                <a key={src} href={src} target="_blank" rel="noreferrer">
                                    <img
                                        src={src}
                                        alt={`Evidencia ${i + 1} del reporte`}
                                        className="h-20 w-20 rounded-xl object-cover"
                                    />
                                </a>
                            ))}
                        </div>
                    )}

                    <p className="mb-2 mt-4 text-xs font-bold text-azul">Estado del reporte</p>
                    <div className="flex flex-wrap gap-2">
                        {REPORT_STATUSES.map((e) => (
                            <button
                                key={e.value}
                                type="button"
                                disabled={!selected}
                                aria-pressed={status === e.value}
                                onClick={() => setStatus(e.value)}
                                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    status === e.value
                                        ? "border-azul bg-azul text-white"
                                        : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {e.text}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={!selected || status === selected.status}
                        onClick={() => selected && onChangeStatusAction(selected.id, status)}
                        className={`${DARK_BUTTON} mx-auto mt-6 block w-full max-w-xs py-2 text-sm font-semibold`}
                    >
                        Modificar Estado
                    </button>
                </div>

                <section>
                    <h3 className="m-0 text-sm font-bold text-slate-700">Reportes Recibidos</h3>

                    {reports.length === 0 ? (
                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay reportes.</p>
                    ) : (
                        <ul className="m-0 mt-3 list-none p-0">
                            {reports.map((r) => {
                                const info = REPORT_STATUSES.find((e) => e.value === r.status);
                                return (
                                    <li key={r.id} className="border-b border-slate-300">
                                        <button
                                            type="button"
                                            aria-pressed={selectedId === r.id}
                                            onClick={() => choose(r)}
                                            className={`flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-2 text-left text-xs font-bold hover:bg-white ${selectedId === r.id ? "bg-white" : ""}`}
                                        >
                                            <span className="min-w-0 truncate">Reporte contra {r.involved}</span>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${info.cssClass}`}
                                            >
                                                {info.text}
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
