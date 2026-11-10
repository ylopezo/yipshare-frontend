"use client";

import { useState } from "react";
import { Modal } from "./Modal";

// shortcut: formato de código supuesto (6–10 letras/números); ajustar cuando el backend defina el real
const CODIGO = /^[A-Z0-9]{6,10}$/;
const DIRECCION = /^[\p{L}\d .#-]+$/u;

function validarDireccion(valor, nombre) {
    const v = valor.trim();
    if (!v) return `Indica ${nombre}.`;
    if (v.length > 30) return "Máximo 30 caracteres.";
    if (!DIRECCION.test(v)) return "Solo letras, números, espacios, punto, # o guion.";
    return "";
}

function MensajeError({ id, texto }) {
    return texto ? (
        <p id={id} role="alert" className="mb-0 mt-1 px-1 text-xs text-red-600">
            {texto}
        </p>
    ) : null;
}

export function UnirseCondominioModal({ onEntrarAction, onCancelarAction }) {
    const [codigo, setCodigo] = useState("");
    const [edificio, setEdificio] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [tocados, setTocados] = useState({});

    const errores = {
        codigo: !codigo
            ? "Ingresa el código del condominio."
            : !CODIGO.test(codigo)
              ? "El código debe tener de 6 a 10 letras o números."
              : "",
        edificio: validarDireccion(edificio, "el edificio"),
        departamento: validarDireccion(departamento, "el departamento"),
    };
    const valido = Object.values(errores).every((e) => !e);
    const tocar = (campo) => setTocados((prev) => ({ ...prev, [campo]: true }));
    const mostrar = (campo) => (tocados[campo] ? errores[campo] : "");

    const inputClase =
        "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-[#1e4a73] aria-[invalid=true]:border-red-500";

    function manejarEnvio(e) {
        e.preventDefault();
        setTocados({ codigo: true, edificio: true, departamento: true });

        if (valido) {
            onEntrarAction({
                codigo,
                edificio: edificio.trim(),
                departamento: departamento.trim(),
            });
        }
    }

    return (
        <Modal label="Unirse a condominio" onCloseAction={onCancelarAction}>
            <form
                noValidate
                onSubmit={manejarEnvio}
                className="w-[min(92vw,400px)] rounded-[2rem] bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase tracking-wide text-black">
                    Unirse a condominio
                </h2>

                <input
                    type="text"
                    aria-label="Código de condominio"
                    placeholder="Código de Condominio"
                    value={codigo}
                    maxLength={10}
                    autoComplete="off"
                    onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/\s/g, ""))}
                    onBlur={() => tocar("codigo")}
                    aria-invalid={!!mostrar("codigo")}
                    aria-describedby="err-codigo"
                    className={`${inputClase} mt-6`}
                />
                <MensajeError id="err-codigo" texto={mostrar("codigo")} />

                <p className="mb-2 mt-5 text-sm font-bold uppercase text-[#1e4a73]">Dirección</p>

                <input
                    type="text"
                    aria-label="Edificio"
                    placeholder="Ej: Edificio 2"
                    value={edificio}
                    maxLength={30}
                    onChange={(e) => setEdificio(e.target.value)}
                    onBlur={() => tocar("edificio")}
                    aria-invalid={!!mostrar("edificio")}
                    aria-describedby="err-edificio"
                    className={inputClase}
                />
                <MensajeError id="err-edificio" texto={mostrar("edificio")} />

                <input
                    type="text"
                    aria-label="Departamento"
                    placeholder="Ej: Departamento 14"
                    value={departamento}
                    maxLength={30}
                    onChange={(e) => setDepartamento(e.target.value)}
                    onBlur={() => tocar("departamento")}
                    aria-invalid={!!mostrar("departamento")}
                    aria-describedby="err-departamento"
                    className={`${inputClase} mt-3`}
                />
                <MensajeError id="err-departamento" texto={mostrar("departamento")} />

                <button
                    type="submit"
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white transition hover:bg-[#2c4066]"
                >
                    Entrar
                </button>

                <button
                    type="button"
                    onClick={onCancelarAction}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}
