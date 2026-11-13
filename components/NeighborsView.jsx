"use client";

import { LIGHT_BUTTON } from "./Modal";

function Toggle({ active, onChangeValue, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      onClick={onChangeValue}
      className={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition ${active ? "bg-azul" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${active ? "left-7" : "left-1"}`}
      />
    </button>
  );
}

export function NeighborsView({
  neighbors,
  onPermissionAction,
  onKickOutAction,
}) {
  if (neighbors.length === 0) {
    return <p className="m-0 text-sm text-slate-500">No hay vecinos.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {neighbors.map((v) => (
        <li
          key={v.id}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
        >
          <div className="min-w-0 flex-1 basis-40">
            <p className="m-0 break-words text-sm font-bold">{v.name}</p>
            <p
              className={`m-0 text-[11px] ${v.upToDate ? "text-[#5aa0e8]" : "text-azul"}`}
            >
              {v.upToDate ? "Al Corriente" : "Adeudo de Mantenimiento"}
            </p>
          </div>

          <p className="m-0 flex-1 basis-40 text-xs font-bold">
            Dpto/Casa: {v.unit}
          </p>

          <div className="flex items-center gap-4">
            <Toggle
              active={v.upToDate}
              onChangeValue={() => onPermissionAction(v)}
              label={`Permiso para pedir artículos de ${v.name}`}
            />
            <button
              type="button"
              onClick={() => onKickOutAction(v)}
              className={`${LIGHT_BUTTON} px-3 py-1 text-xs font-semibold`}
            >
              Expulsar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
