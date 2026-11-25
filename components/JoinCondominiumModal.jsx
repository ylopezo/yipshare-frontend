"use client";

import { useState } from "react";
import { Modal } from "./Modal";

const CODE_PATTERN = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;

const formatCode = (value) => {
    const chars = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    return chars.length > 3 ? `${chars.slice(0, 3)}-${chars.slice(3)}` : chars;
};
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
    const [unit, setUnit] = useState("");
    const [touched, setTouched] = useState({});

    const errors = {
        code: !code
            ? "Ingresa el código del condominio."
            : !CODE_PATTERN.test(code)
              ? "El código debe tener el formato ABC-DEF."
              : "",
        unit: validateAddress(unit, "el número de departamento o casa"),
    };
    const isValid = Object.values(errors).every((e) => !e);
    const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
    const show = (field) => (touched[field] ? errors[field] : "");

    const inputClass =
        "w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-azul aria-[invalid=true]:border-azul";

    function handleSubmit(e) {
        e.preventDefault();
        setTouched({ code: true, unit: true });

        if (isValid) {
            onJoinAction({
                code,
                unit: unit.trim(),
            });
        }
    }

    return (
        <Modal label="Unirse a condominio" onCloseAction={onCancelAction}>
            <form
                noValidate
                onSubmit={handleSubmit}
                className="w-[min(92vw,400px)] rounded-[2rem] bg-white px-8 py-8"
            >
                <h2 className="m-0 text-center text-xl font-semibold text-black">
                    Unirse a condominio
                </h2>

                <input
                    type="text"
                    aria-label="Código de condominio"
                    placeholder="Código de Condominio (ABC-DEF)"
                    value={code}
                    maxLength={7}
                    autoComplete="off"
                    onChange={(e) => setCode(formatCode(e.target.value))}
                    onBlur={() => touch("code")}
                    aria-invalid={!!show("code")}
                    aria-describedby="err-codigo"
                    className={`${inputClass} mt-6`}
                />
                <ErrorMessage id="err-codigo" text={show("code")} />

                <p className="mb-2 mt-5 text-sm font-semibold text-azul">Dpto/Casa</p>

                <input
                    type="text"
                    aria-label="Número de departamento o casa"
                    placeholder="Ej: 14"
                    value={unit}
                    maxLength={30}
                    onChange={(e) => setUnit(e.target.value)}
                    onBlur={() => touch("unit")}
                    aria-invalid={!!show("unit")}
                    aria-describedby="err-unidad"
                    className={inputClass}
                />
                <ErrorMessage id="err-unidad" text={show("unit")} />

                <button
                    type="submit"
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover"
                >
                    Entrar
                </button>

                <button
                    type="button"
                    onClick={onCancelAction}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}
