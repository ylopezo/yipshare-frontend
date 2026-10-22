"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export type DatosUnirse = {
    codigo: string;
    edificio: string;
    departamento: string;
};

export function UnirseCondominioModal({
                                          onEntrar,
                                          onCancelar,
                                      }: {
    onEntrar: (datos: DatosUnirse) => void;
    onCancelar: () => void;
}) {
    const [codigo, setCodigo] = useState("");
    const [edificio, setEdificio] = useState("");
    const [departamento, setDepartamento] = useState("");

    const valido =
        codigo.trim() !== "" &&
        edificio.trim() !== "" &&
        departamento.trim() !== "";

    const inputClase =
        "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-[#1e4a73]";

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (valido) {
            onEntrar({
                codigo: codigo.trim(),
                edificio: edificio.trim(),
                departamento: departamento.trim(),
            });
        }
    }

    return (
        <Modal
            label="Unirse a condominio"
            onClose={onCancelar}
        >
            <form
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
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className={`${inputClase} mt-6`}
                />

                <p className="mb-2 mt-5 text-sm font-bold uppercase text-[#1e4a73]">
                    Dirección
                </p>

                <input
                    type="text"
                    aria-label="Edificio"
                    placeholder="Ej: Edificio 2"
                    value={edificio}
                    onChange={(e) => setEdificio(e.target.value)}
                    className={inputClase}
                />

                <input
                    type="text"
                    aria-label="Departamento"
                    placeholder="Ej: Departamento 14"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className={`${inputClase} mt-3`}
                />

                <button
                    type="submit"
                    disabled={!valido}
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white transition hover:bg-[#2c4066] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Entrar
                </button>

                <button
                    type="button"
                    onClick={onCancelar}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}