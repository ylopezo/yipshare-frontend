"use client";

import { useState } from "react";
import { DARK_BUTTON, ConfirmDialog } from "./Modal";

export function RequestsView({ applicants, units, onRespondAction }) {
    const [pending, setPending] = useState(null);
    const [chosen, setChosen] = useState({});

    const unitOf = (a) => chosen[a.id] ?? a.suggestedUnitId ?? "";
    const unitName = (unitId) => units.find((u) => u.id === unitId)?.name;

    return (
        <>
            <h2 className="m-0 text-base font-bold">Solicitudes</h2>

            {applicants.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-slate-500">No hay solicitudes pendientes.</p>
            ) : (
                <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
                    {applicants.map((a) => (
                        <li
                            key={a.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
                        >
                            <div className="min-w-0 flex-1 basis-40">
                                <p className="m-0 break-words text-sm font-bold">{a.name}</p>
                                <p className="m-0 text-xs text-slate-500">Indicó: {a.unit}</p>
                            </div>

                            <div className="flex flex-1 basis-40 items-center gap-2">
                                <label htmlFor={`unidad-${a.id}`} className="text-xs font-bold">
                                    Dpto/Casa
                                </label>
                                <select
                                    id={`unidad-${a.id}`}
                                    value={unitOf(a)}
                                    onChange={(e) => setChosen({ ...chosen, [a.id]: e.target.value })}
                                    className="min-w-0 flex-1 rounded-full border border-slate-500 bg-gris px-3 py-1 text-xs"
                                >
                                    <option value="" disabled>
                                        Elige una unidad
                                    </option>
                                    {units.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    disabled={!unitOf(a)}
                                    onClick={() => setPending({ a, accept: true, unitId: unitOf(a) })}
                                    className={`${DARK_BUTTON} px-4 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPending({ a, accept: false })}
                                    className="cursor-pointer rounded-full border border-oscuro bg-white px-4 py-1 text-xs font-semibold text-oscuro transition hover:bg-slate-100"
                                >
                                    Denegar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {pending && (
                <ConfirmDialog
                    title={pending.accept ? "¿Aceptar solicitud?" : "¿Denegar solicitud?"}
                    message={
                        pending.accept
                            ? `${pending.a.name} se unirá al condominio como vecino de Dpto/Casa ${unitName(pending.unitId)}.`
                            : `Se rechazará la solicitud de ${pending.a.name} (Dpto/Casa ${pending.a.unit}).`
                    }
                    onConfirmAction={() => {
                        onRespondAction(pending.a, pending.accept, pending.unitId);
                        setPending(null);
                    }}
                    onCancelAction={() => setPending(null)}
                />
            )}
        </>
    );
}
