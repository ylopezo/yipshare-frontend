"use client";

import { useState } from "react";
import { runAction, uploadProfilePicture } from "@/lib/articles";
import { DIAL_CODES, digitsOnly, isPhoneValid } from "@/lib/data";
import { Icon } from "./Icon";
import { LIGHT_BUTTON, ConfirmDialog, Modal } from "./Modal";

const NAME = [
    ["paternalSurname", "Apellido paterno"],
    ["maternalSurname", "Apellido materno"],
    ["givenNames", "Nombre(s)"],
];

export function ResidentProfileModal({ profile, received, onUpdate, onDelete, onClose }) {
    const { rating, unit, photo: loadedPhoto, roles = [], ...initial } = profile;
    const [data, setData] = useState(initial);
    const [photo, setPhoto] = useState(loadedPhoto);

    async function changePhoto(e) {
        const file = e.target.files[0];
        e.target.value = "";
        if (!file || !(await runAction(uploadProfilePicture(file)))) return;
        setPhoto(URL.createObjectURL(file));
    }
    const [editing, setEditing] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [showReceived, setShowReceived] = useState(false);

    const phoneOk = isPhoneValid(data.phone ?? "");
    const isValid = Object.values(data).every((value) => value.trim() !== "") && phoneOk;

    function cancelEdit() {
        setData(initial);
        setEditing(false);
    }

    function handleConfirm() {
        if (confirm === "save") {
            setEditing(false);
            onUpdate(data);
        } else {
            onDelete();
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
                className="mt-1 w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-1.5
                text-sm text-neutral-700 outline-none read-only:cursor-default"
            />
        </div>
    );

    return (
        <>
            <Modal label="Perfil" onClose={onClose}>
                <div className="relative max-h-[90vh] w-[min(94vw,680px)] overflow-y-auto rounded-4xl border border-neutral-400 bg-white px-8 py-8">
                    <button
                        type="button"
                        aria-label="Cerrar perfil"
                        onClick={onClose}
                        className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100"
                    >
                        <Icon name="close" size={18} />
                    </button>

                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <div className="flex flex-col items-center justify-center text-center">
                            <label
                                htmlFor="perfil-foto"
                                className="group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gris-imagen text-neutral-500"
                            >
                                {photo ? (
                                    <img src={photo} alt="Foto de perfil" className="h-full w-full object-cover" />
                                ) : (
                                    <Icon name="user" size={80} />
                                )}
                                <span className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                                    Cambiar foto
                                </span>
                                <input
                                    id="perfil-foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={changePhoto}
                                    className="sr-only"
                                />
                            </label>
                            <p className="m-0 mt-4 wrap-break-word text-xl font-bold text-azul">
                                {initial.givenNames} {initial.paternalSurname}
                            </p>

                            <p className="m-0 mt-5 text-xs font-bold text-azul">Mis roles</p>
                            {roles.length === 0 ? (
                                <p className="m-0 mt-1 text-xs text-neutral-500">
                                    Aún no perteneces a ningún condominio.
                                </p>
                            ) : (
                                <ul className="m-0 mt-1 flex list-none flex-wrap justify-center gap-1 p-0">
                                    {roles.map((role) => (
                                        <li
                                            key={role}
                                            className="rounded-full bg-azul-suave px-2 py-0.5 text-xs font-semibold text-azul"
                                        >
                                            {role}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="m-0 mt-5 text-xs font-bold text-azul">Mi calificación</p>
                            <div
                                role="img"
                                aria-label={`Calificación ${rating.toFixed(1)} de 5`}
                                className="mt-1 flex items-center gap-1"
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        aria-hidden="true"
                                        className={`text-3xl ${star <= Math.round(rating) ? "text-amber-400" : "text-neutral-300"}`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1 text-xs text-neutral-500">{rating.toFixed(1)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowReceived(true)}
                                className="mt-1 cursor-pointer text-xs font-semibold text-black hover:underline"
                            >
                                Ver calificaciones recibidas
                            </button>
                        </div>

                        <div>
                            {NAME.map(field)}
                            {unit && (
                                <div className="mt-3">
                                    <label htmlFor="perfil-unit" className="text-xs font-bold text-azul">
                                        Dpto/Casa
                                    </label>
                                    <input
                                        id="perfil-unit"
                                        value={unit}
                                        readOnly
                                        className="mt-1 w-full cursor-default rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-1.5 text-sm text-neutral-700 outline-none"
                                    />
                                </div>
                            )}

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
                                        className="w-40 shrink-0 cursor-pointer rounded-[15px] border-[1.5px] border-borde bg-gris px-3 py-1.5 text-sm text-neutral-700 outline-none disabled:cursor-default disabled:opacity-100"
                                    >
                                        {DIAL_CODES.map((dialCode) => (
                                            <option key={dialCode.value} value={dialCode.value}>
                                                {dialCode.text}
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
                                        className="min-w-0 flex-1 rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-1.5 text-sm text-neutral-700 outline-none read-only:cursor-default"
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
                                rounded-[15px] bg-oscuro py-2 text-sm font-semibold
                                text-white transition hover:bg-oscuro-hover disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="mx-auto mt-3 block w-3/5 max-w-xs cursor-pointer rounded-[15px] border-[1.5px] border-oscuro bg-white py-2 text-sm font-semibold text-oscuro transition hover:bg-neutral-100"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-[15px] bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover"
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
                <Modal label="Calificaciones recibidas" onClose={() => setShowReceived(false)}>
                    <div className="max-h-[80vh] w-[min(92vw,420px)] overflow-y-auto rounded-[2rem] bg-white px-8 py-8">
                        <h2 className="m-0 text-center text-xl font-semibold">Calificaciones recibidas</h2>

                        {received.length === 0 ? (
                            <p className="mb-0 mt-4 text-center text-sm text-neutral-500">
                                Aún no tienes calificaciones.
                            </p>
                        ) : (
                            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                                {received.map((review) => (
                                    <li
                                        key={`${review.loanId}-${review.from}`}
                                        className="rounded-xl border border-neutral-300 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="m-0 text-sm font-bold text-azul">{review.from}</p>
                                            <span
                                                role="img"
                                                aria-label={`${review.stars} de 5 estrellas`}
                                                className="text-amber-400"
                                            >
                                                {"★".repeat(review.stars)}
                                                <span className="text-neutral-300">{"★".repeat(5 - review.stars)}</span>
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="mb-0 mt-1 break-words text-xs text-neutral-600">{review.comment}</p>
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
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </>
    );
}