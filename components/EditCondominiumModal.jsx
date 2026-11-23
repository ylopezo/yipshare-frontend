"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

const ADDRESS_LABELS = [
    ["street", "Calle y número"],
    ["neighborhood", "Colonia"],
    ["postalCode", "Código postal"],
    ["municipality", "Municipio / Alcaldía"],
    ["city", "Ciudad"],
    ["state", "Estado"],
];

export function EditCondominiumModal({ condominium, onSaveAction, onCancelAction }) {
    const [name, setName] = useState(condominium.name);
    const [fields, setFields] = useState(condominium.fields);

    const isValid =
        name.trim() !== "" &&
        Object.values(fields).every((v) => v.trim() !== "") &&
        /^\d{5}$/.test(fields.postalCode.trim());

    function handleSubmit(e) {
        e.preventDefault();

        if (!isValid) {
            return;
        }

        onSaveAction({
            ...condominium,
            name: name.trim(),
            fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])),
        });
    }

    const inputClass =
        "mt-1 w-full rounded-full border border-slate-500 bg-gris px-4 py-1.5 text-sm text-slate-700 outline-none focus:border-azul";
    const labelClass = "text-xs font-bold text-azul";

    return (
        <Modal label="Editar condominio" onCloseAction={onCancelAction}>
            <form
                onSubmit={handleSubmit}
                className="relative max-h-[90vh] w-[min(90vw,360px)] overflow-y-auto rounded-[2rem] border border-slate-400 bg-white px-7 py-8 shadow-xl"
            >
                <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={onCancelAction}
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                >
                    <Icon name="close" size={18} />
                </button>

                <h2 className="m-0 text-center text-lg font-bold text-azul">Editar condominio</h2>

                <div className="mt-5">
                    <label htmlFor="edit-nombre" className={labelClass}>
                        Nombre
                    </label>

                    <input
                        id="edit-nombre"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                    />
                </div>

                {ADDRESS_LABELS.map(([key, label]) => (
                    <div key={key} className="mt-3">
                        <label htmlFor={`edit-${key}`} className={labelClass}>
                            {label}
                        </label>

                        <input
                            id={`edit-${key}`}
                            type="text"
                            inputMode={key === "postalCode" ? "numeric" : undefined}
                            maxLength={key === "postalCode" ? 5 : undefined}
                            value={fields[key]}
                            onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                ))}

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancelAction}
                        className="flex-1 cursor-pointer rounded-full border border-azul bg-white py-2 text-sm font-semibold text-azul transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={!isValid}
                        className="flex-1 cursor-pointer rounded-full bg-azul py-2 text-sm font-semibold text-white transition hover:bg-azul-claro disabled:opacity-50"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </Modal>
    );
}