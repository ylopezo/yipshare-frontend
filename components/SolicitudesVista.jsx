"use client";

import { useState } from "react";
import { BOTON_OSCURO, ConfirmDialog } from "./Modal";

export function SolicitudesVista({ aspirantes, onResponderAction }) {
    const [pendiente, setPendiente] = useState(null); // { a, aceptar }

    return (
        <>
            <h2 className="m-0 text-base font-bold">Solicitudes</h2>

            {aspirantes.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-slate-500">No hay solicitudes pendientes.</p>
            ) : (
                <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
                    {aspirantes.map((a) => (
                        <li
                            key={a.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
                        >
                            <p className="m-0 min-w-0 flex-1 basis-40 break-words text-sm font-bold">{a.nombre}</p>
                            <p className="m-0 flex-1 basis-40 text-xs font-bold">Dpto/Casa: {a.depto}</p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPendiente({ a, aceptar: true })}
                                    className={`${BOTON_OSCURO} px-4 py-1 text-xs font-semibold`}
                                >
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPendiente({ a, aceptar: false })}
                                    className="cursor-pointer rounded-full border border-oscuro bg-white px-4 py-1 text-xs font-semibold text-oscuro transition hover:bg-slate-100"
                                >
                                    Denegar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {pendiente && (
                <ConfirmDialog
                    titulo={pendiente.aceptar ? "¿Aceptar solicitud?" : "¿Denegar solicitud?"}
                    mensaje={
                        pendiente.aceptar
                            ? `${pendiente.a.nombre} (Dpto/Casa ${pendiente.a.depto}) se unirá al condominio como vecino.`
                            : `Se rechazará la solicitud de ${pendiente.a.nombre} (Dpto/Casa ${pendiente.a.depto}).`
                    }
                    onConfirmarAction={() => {
                        onResponderAction(pendiente.a, pendiente.aceptar);
                        setPendiente(null);
                    }}
                    onCancelarAction={() => setPendiente(null)}
                />
            )}
        </>
    );
}
