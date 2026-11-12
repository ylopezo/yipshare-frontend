"use client";

import { useState } from "react";
import { Modal } from "./Modal";

// El backend genera códigos de 6 caracteres (shortCode)
const CODE_PATTERN = /^[A-Z0-9]{6}$/;
const ADDRESS = /^[\p{L}\d .#-]+$/u;

function validateAddress(value, name) {
    const v = value.trim();
    if (!v) return `Indica ${name}.`;
    if (v.length > 30) return "Máximo 30 caracteres.";
    if (!ADDRESS.test(v)) return "Solo letras, números, espacios, punto, # o guion.";
    return "";
}

function ErrorMessage({ id, text }) {
    return text ? (
        <p id={id} role="alert" className="mb-0 mt-1 px-1 text-xs text-azul">
            {text}
        </p>
    ) : null;
}

export function JoinCondominiumModal({ onJoinAction, onCancelAction }) {
    const [code, setCode] = useState("");
    const [building, setBuilding] = useState("");
    const [apartment, setApartment] = useState("");
    const [touched, setTouched] = useState({});

    const errors = {
        code: !code
            ? "Ingresa el código del condominio."
            : !CODE_PATTERN.test(code)
              ? "El código debe tener 6 letras o números."
              : "",
        building: validateAddress(building, "el edificio"),
        apartment: validateAddress(apartment, "el departamento"),
    };
    const isValid = Object.values(errors).every((e) => !e);
    const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
    const show = (field) => (touched[field] ? errors[field] : "");

    const inputClass =
        "w-full rounded-xl border border-slate-600 bg-gris px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-azul aria-[invalid=true]:border-azul";

    function handleSubmit(e) {
        e.preventDefault();
        setTouched({ code: true, building: true, apartment: true });

        if (isValid) {
            onJoinAction({
                code,
                building: building.trim(),
                apartment: apartment.trim(),
            });
        }
    }

    return (
        <Modal label="Unirse a condominio" onCloseAction={onCancelAction}>
            <form
                noValidate
                onSubmit={handleSubmit}
                className="w-[min(92vw,400px)] rounded-[2rem] bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase tracking-wide text-black">
                    Unirse a condominio
                </h2>

                <input
                    type="text"
                    aria-label="Código de condominio"
                    placeholder="Código de Condominio"
                    value={code}
                    maxLength={6}
                    autoComplete="off"
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                    onBlur={() => touch("code")}
                    aria-invalid={!!show("code")}
                    aria-describedby="err-codigo"
                    className={`${inputClass} mt-6`}
                />
                <ErrorMessage id="err-codigo" text={show("code")} />

                <p className="mb-2 mt-5 text-sm font-bold uppercase text-azul">Dirección</p>

                <input
                    type="text"
                    aria-label="Edificio"
                    placeholder="Ej: Edificio 2"
                    value={building}
                    maxLength={30}
                    onChange={(e) => setBuilding(e.target.value)}
                    onBlur={() => touch("building")}
                    aria-invalid={!!show("building")}
                    aria-describedby="err-edificio"
                    className={inputClass}
                />
                <ErrorMessage id="err-edificio" text={show("building")} />

                <input
                    type="text"
                    aria-label="Departamento"
                    placeholder="Ej: Departamento 14"
                    value={apartment}
                    maxLength={30}
                    onChange={(e) => setApartment(e.target.value)}
                    onBlur={() => touch("apartment")}
                    aria-invalid={!!show("apartment")}
                    aria-describedby="err-departamento"
                    className={`${inputClass} mt-3`}
                />
                <ErrorMessage id="err-departamento" text={show("apartment")} />

                <button
                    type="submit"
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover"
                >
                    Entrar
                </button>

                <button
                    type="button"
                    onClick={onCancelAction}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}
