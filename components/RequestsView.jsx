"use client";

import { useState } from "react";
import { DARK_BUTTON, ConfirmDialog } from "./Modal";

export function RequestsView({ applicants, units, onRespond }) {
    const [pending, setPending] = useState(null);
    const [chosen, setChosen] = useState({});

    const unitOf = (applicant) => chosen[applicant.id] ?? applicant.suggestedUnitId ?? "";
    const unitName = (unitId) => units.find((unit) => unit.id === unitId)?.name;

    return (
        <>
            <h2 className="m-0 text-base font-bold">Solicitudes</h2>

            {applicants.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-neutral-500">No hay solicitudes pendientes.</p>
            ) : (
                <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
                    {applicants.map((applicant) => (
                        <li
                            key={applicant.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-neutral-400 bg-white px-4 py-3"
                        >
                            <div className="min-w-0 flex-1 basis-40">
                                <p className="m-0 break-words text-sm font-bold">{applicant.name}</p>
                                <p className="m-0 text-xs text-neutral-500">Indicó: {applicant.unit}</p>
                            </div>

                            <div className="flex flex-1 basis-40 items-center gap-2">
                                <label htmlFor={`unidad-${applicant.id}`} className="text-xs font-bold">
                                    Dpto/Casa
                                </label>
                                <select
                                    id={`unidad-${applicant.id}`}
                                    value={unitOf(applicant)}
                                    onChange={(e) => setChosen({ ...chosen, [applicant.id]: e.target.value })}
                                    className="min-w-0 flex-1 rounded-md border-[1.5px] border-borde bg-gris px-3 py-1 text-xs"
                                >
                                    <option value="" disabled>
                                        Elige una unidad
                                    </option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    disabled={!unitOf(applicant)}
                                    onClick={() => setPending({ a: applicant, accept: true, unitId: unitOf(applicant) })}
                                    className={`${DARK_BUTTON} px-4 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPending({ a: applicant, accept: false })}
                                    className="cursor-pointer rounded-md border-[1.5px] border-oscuro bg-white px-4 py-1 text-xs font-semibold text-oscuro transition hover:bg-neutral-100"
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
                    onConfirm={() => {
                        onRespond(pending.a, pending.accept, pending.unitId);
                        setPending(null);
                    }}
                    onCancel={() => setPending(null)}
                />
            )}
        </>
    );
}
