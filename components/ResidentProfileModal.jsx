"use client";

import { useState } from "react";
import { DIAL_CODES, digitsOnly, isPhoneValid } from "@/lib/data";
import { Icon } from "./Icon";
import { LIGHT_BUTTON, ConfirmDialog, Modal } from "./Modal";

const NAME = [
    ["paternalSurname", "Apellido paterno"],
    ["maternalSurname", "Apellido materno"],
    ["givenNames", "Nombre(s)"],
];
const ADDRESS = [
    ["building", "Edificio"],
    ["apartment", "Departamento"],
];

export function ResidentProfileModal({ profile, received, onUpdateAction, onDeleteAction, onCloseAction }) {
    const { rating, ...initial } = profile;
    const [data, setData] = useState(initial);
    const [editing, setEditing] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [showReceived, setShowReceived] = useState(false);

    const phoneOk = isPhoneValid(data.phone ?? "");
    const isValid = Object.values(data).every((v) => v.trim() !== "") && phoneOk;

    function cancelEdit() {
        setData(initial);
        setEditing(false);
    }

    function handleConfirm() {
        if (confirm === "save") {
            setEditing(false);
            onUpdateAction(data);
        } else {
            onDeleteAction();
        }
        setConfirm(null);
    }

    const field = ([name, label]) => (
        <div key={name} className="mt-3">
            <label htmlFor={`perfil-${name}`} className="text-xs font-bold text-azul">
                {label}
            </label>
            <input
                id={`perfil-${name}`}
                value={data[name]}
                readOnly={!editing}
                onChange={(e) => setData({ ...data, [name]: e.target.value })}
                className="mt-1 w-full rounded-full border border-slate-500 bg-gris px-4 py-1.5
                text-sm text-slate-700 outline-none read-only:cursor-default"
            />
        </div>
    );

    return (
        <>
            <Modal label="Perfil" onCloseAction={onCloseAction}>
                <div className="relative max-h-[90vh] w-[min(94vw,680px)] overflow-y-auto rounded-4xl border border-slate-400 bg-white px-8 py-8 shadow-xl">
                    <button
                        type="button"
                        aria-label="Cerrar perfil"
                        onClick={onCloseAction}
                        className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                    >
                        <Icon name="close" size={18} />
                    </button>

                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="flex h-32 w-32 items-center justify-center rounded-full bg-gris-imagen text-slate-500">
                                <Icon name="user" size={80} />
                            </span>
                            <p className="m-0 mt-4 wrap-break-word text-xl font-bold text-azul">
                                {initial.givenNames} {initial.paternalSurname}
                            </p>

                            <p className="m-0 mt-5 text-xs font-bold text-azul">Mi calificación</p>
                            <div
                                role="img"
                                aria-label={`Calificación ${rating.toFixed(1)} de 5`}
                                className="mt-1 flex items-center gap-1"
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span
                                        key={n}
                                        aria-hidden="true"
                                        className={`text-3xl ${n <= Math.round(rating) ? "text-amber-400" : "text-slate-300"}`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1 text-xs text-slate-500">{rating.toFixed(1)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowReceived(true)}
                                className="mt-1 cursor-pointer text-xs font-semibold text-azul-link hover:underline"
                            >
                                Ver calificaciones recibidas
                            </button>
                        </div>

                        <div>
                            {NAME.map(field)}
                            <p className="m-0 mt-5 text-xs font-bold uppercase text-azul">Dirección</p>
                            {ADDRESS.map(field)}

                            <div className="mt-3">
                                <label htmlFor="perfil-telefono" className="text-xs font-bold text-azul">
                                    Teléfono
                                </label>
                                <div className="mt-1 flex gap-2">
                                    <label htmlFor="perfil-lada" className="sr-only">
                                        Lada
                                    </label>
                                    <select
                                        id="perfil-lada"
                                        value={data.dialCode ?? "MX"}
                                        disabled={!editing}
                                        onChange={(e) => setData({ ...data, dialCode: e.target.value })}
                                        className="w-40 shrink-0 cursor-pointer rounded-full border border-slate-500 bg-gris px-3 py-1.5 text-sm text-slate-700 outline-none disabled:cursor-default disabled:opacity-100"
                                    >
                                        {DIAL_CODES.map((l) => (
                                            <option key={l.value} value={l.value}>
                                                {l.text}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="perfil-telefono"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={data.phone ?? ""}
                                        readOnly={!editing}
                                        aria-invalid={editing && !phoneOk}
                                        aria-describedby="perfil-telefono-error"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                phone: digitsOnly(e.target.value),
                                            })
                                        }
                                        className="min-w-0 flex-1 rounded-full border border-slate-500 bg-gris px-4 py-1.5 text-sm text-slate-700 outline-none read-only:cursor-default"
                                    />
                                </div>
                                {editing && !phoneOk && (
                                    <p id="perfil-telefono-error" className="m-0 mt-1 text-xs text-azul">
                                        El teléfono debe tener 10 dígitos.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {editing ? (
                        <>
                            <button
                                type="button"
                                disabled={!isValid}
                                onClick={() => setConfirm("save")}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer
                                rounded-full bg-oscuro py-2 text-sm font-semibold
                                text-white transition hover:bg-oscuro-hover disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="mx-auto mt-3 block w-3/5 max-w-xs cursor-pointer rounded-full border border-oscuro bg-white py-2 text-sm font-semibold text-oscuro transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-full bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover"
                            >
                                Actualizar datos
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirm("delete")}
                                className={`${LIGHT_BUTTON} mx-auto mt-3 block w-3/5 max-w-xs py-2 text-sm font-semibold`}
                            >
                                Eliminar cuenta
                            </button>
                        </>
                    )}
                </div>
            </Modal>

            {showReceived && (
                <Modal label="Calificaciones recibidas" onCloseAction={() => setShowReceived(false)}>
                    <div className="max-h-[80vh] w-[min(92vw,420px)] overflow-y-auto rounded-[2rem] bg-white px-8 py-8 shadow-xl">
                        <h2 className="m-0 text-center text-xl font-extrabold uppercase">Calificaciones recibidas</h2>

                        {received.length === 0 ? (
                            <p className="mb-0 mt-4 text-center text-sm text-slate-500">
                                Aún no tienes calificaciones.
                            </p>
                        ) : (
                            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                                {received.map((c) => (
                                    <li
                                        key={`${c.loanId}-${c.from}`}
                                        className="rounded-xl border border-slate-300 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="m-0 text-sm font-bold text-azul">{c.from}</p>
                                            <span
                                                role="img"
                                                aria-label={`${c.stars} de 5 estrellas`}
                                                className="text-amber-400"
                                            >
                                                {"★".repeat(c.stars)}
                                                <span className="text-slate-300">{"★".repeat(5 - c.stars)}</span>
                                            </span>
                                        </div>
                                        {c.comment && (
                                            <p className="mb-0 mt-1 break-words text-xs text-slate-600">{c.comment}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowReceived(false)}
                            className="mx-auto mt-6 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}

            {confirm && (
                <ConfirmDialog
                    title={confirm === "save" ? "¿Guardar los cambios?" : "¿Eliminar cuenta?"}
                    message={confirm === "save" ? "Se actualizarán tus datos." : "Esta acción no se puede deshacer."}
                    onConfirmAction={handleConfirm}
                    onCancelAction={() => setConfirm(null)}
                />
            )}
        </>
    );
}
