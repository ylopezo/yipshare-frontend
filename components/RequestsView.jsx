"use client";

import { useState } from "react";
import { DARK_BUTTON, ConfirmDialog } from "./Modal";

export function RequestsView({ applicants, onRespondAction }) {
  const [pending, setPending] = useState(null); // { a, aceptar }

  return (
    <>
      <h2 className="m-0 text-base font-bold">Solicitudes</h2>

      {applicants.length === 0 ? (
        <p className="mb-0 mt-3 text-sm text-slate-500">
          No hay solicitudes pendientes.
        </p>
      ) : (
        <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
          {applicants.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
            >
              <p className="m-0 min-w-0 flex-1 basis-40 break-words text-sm font-bold">
                {a.name}
              </p>
              <p className="m-0 flex-1 basis-40 text-xs font-bold">
                Dpto/Casa: {a.unit}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPending({ a, accept: true })}
                  className={`${DARK_BUTTON} px-4 py-1 text-xs font-semibold`}
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
              ? `${pending.a.name} (Dpto/Casa ${pending.a.unit}) se unirá al condominio como vecino.`
              : `Se rechazará la solicitud de ${pending.a.name} (Dpto/Casa ${pending.a.unit}).`
          }
          onConfirmAction={() => {
            onRespondAction(pending.a, pending.accept);
            setPending(null);
          }}
          onCancelAction={() => setPending(null)}
        />
      )}
    </>
  );
}
