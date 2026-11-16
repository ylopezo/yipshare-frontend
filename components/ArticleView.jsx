"use client";

import { useState } from "react";
import { STATUSES } from "./ArticleModal";
import { LIGHT_BUTTON } from "./Modal";
import { Icon } from "./Icon";

const COLOR = {
  available: "bg-[#b9f0c8] text-green-900",
  pending: "bg-[#fde9a8] text-amber-900",
  unavailable: "bg-azul text-white",
};

export function ArticleCard({ a, onViewAction, onEditAction }) {
  return (
    <div className="flex w-48 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      <button
        type="button"
        onClick={onViewAction}
        className="flex flex-1 cursor-pointer flex-col text-left hover:bg-slate-50"
      >
        <div className="h-28 w-full shrink-0 bg-[#e4e4e4]">
          {a.image && (
            <img
              src={a.image}
              alt={a.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col px-3 pb-3 pt-2">
          <span
            className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${COLOR[a.status]}`}
          >
            {STATUSES[a.status]}
          </span>
          <p className="m-0 mt-1 wrap-break-word text-lg font-bold text-azul">
            {a.name}
          </p>
          <p className="m-0 text-[10px] text-slate-500">{a.owner}</p>
        </div>
      </button>

      {onEditAction && (
        <button
          type="button"
          onClick={onEditAction}
          className="cursor-pointer self-center pb-3 pt-1 text-[11px] font-semibold text-[#5aa0e8] hover:underline"
        >
          Editar Artículo
        </button>
      )}
    </div>
  );
}

export function ArticleDetail({
  a,
  onBackAction,
  onRequestAction,
  onDeleteAction,
  deleteBlocked,
}) {
  const [duration, setDuration] = useState(a.durations[0]);

  return (
    <>
      <button
        type="button"
        aria-label="Volver"
        onClick={onBackAction}
        className="cursor-pointer rounded-full p-2 text-azul transition hover:bg-white"
      >
        <Icon name="arrow" size={28} />
      </button>

      <div className="mx-auto mt-2 w-full max-w-2xl rounded-[2.5rem] bg-white px-8 py-6 shadow-sm">
        <div className="h-64 overflow-hidden rounded-2xl bg-[#e4e4e4]">
          {a.image && (
            <img
              src={a.image}
              alt={a.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <span
          className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold ${COLOR[a.status]}`}
        >
          {STATUSES[a.status]}
        </span>

        <h2 className="m-0 mt-2 break-words text-lg font-bold uppercase text-azul">
          {a.name}
        </h2>
        <p className="m-0 text-xs font-bold">{a.category}</p>

        <p className="mb-0 mt-3 break-words text-xs font-semibold">
          {a.description}
        </p>
        <p className="mb-0 mt-2 text-xs text-slate-500">
          {a.condition} · Préstamo: {a.durations.join(", ")}
        </p>

        <hr className="my-4 border-slate-300" />

        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            <Icon name="user" size={44} />
          </span>

          <div className="min-w-0">
            <p className="m-0 break-words text-base font-bold text-azul">
              {a.owner} - {a.address}
            </p>

            <div
              role="img"
              aria-label={`Calificación ${a.rating.toFixed(1)} de 5`}
              className="flex items-center gap-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  aria-hidden="true"
                  className={`text-xl ${n <= Math.round(a.rating) ? "text-amber-400" : "text-slate-700"}`}
                >
                  {n <= Math.round(a.rating) ? "★" : "☆"}
                </span>
              ))}
              <span className="ml-1 text-xs font-bold">
                {a.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {onRequestAction && (
        <>
          <div className="mx-auto mt-6 w-full max-w-xs text-center">
            <p className="m-0 text-xs font-bold text-azul">
              Tiempo de préstamo
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {a.durations.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={duration === t}
                  onClick={() => setDuration(t)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    duration === t
                      ? "border-azul bg-azul text-white"
                      : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={a.status !== "available"}
            onClick={() => onRequestAction(duration)}
            className="mx-auto mt-4 block w-full max-w-xs cursor-pointer rounded-full bg-azul py-2 text-base font-bold text-white hover:bg-azul-claro disabled:cursor-not-allowed disabled:opacity-50"
          >
            Solicitar Artículo
          </button>
        </>
      )}

      {onDeleteAction && (
        <>
          <button
            type="button"
            disabled={deleteBlocked}
            onClick={onDeleteAction}
            className={`${LIGHT_BUTTON} mx-auto mt-3 block w-full max-w-xs py-2 text-sm font-bold`}
          >
            Eliminar publicación
          </button>
          {deleteBlocked && (
            <p className="mx-auto mb-0 mt-2 max-w-xs text-center text-xs text-slate-500">
              No se puede eliminar mientras el artículo esté en préstamo.
            </p>
          )}
        </>
      )}
    </>
  );
}
