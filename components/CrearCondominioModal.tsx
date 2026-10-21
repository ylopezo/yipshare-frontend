"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export type DatosCrear = {
    nombre: string;
    direccion: string;
    cantidad: number;
};

export function CrearCondominioModal({
    onCrear,
    onCancelar,
}: {
    onCrear: (datos: DatosCrear) => void;
    onCancelar: () => void;
}) {
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [cantidad, setCantidad] = useState("");
    const cantidadNum = Number(cantidad);
    const valido = nombre.trim() !== "" && direccion.trim() !== "" && Number.isInteger(cantidadNum) && cantidadNum > 0;
    const inputClase =
        "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-[#1e4a73]";

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (valido) onCrear({ nombre: nombre.trim(), direccion: direccion.trim(), cantidad: cantidadNum });
    }

    return (
        <Modal label="Crear condominio" onClose={onCancelar}>
            <form onSubmit={handleSubmit} className="w-[min(92vw,400px)] rounded-[2rem] bg-white px-8 py-8 shadow-xl">
                <h2 className="m-0 text-center text-xl font-extrabold uppercase tracking-wide text-black">Crear condominio</h2>
                <input type="text" aria-label="Nombre del condominio" placeholder="Nombre del condominio" value={nombre} onChange={(e) => setNombre(e.target.value)} className={`${inputClase} mt-6`} />
                <input type="text" aria-label="Dirección" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={`${inputClase} mt-3`} />
                <input type="number" min={1} aria-label="Cantidad de departamentos o casas" placeholder="Cant. Dptos/Casas" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={`${inputClase} mt-3`} />
                <button type="submit" disabled={!valido} className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white transition hover:bg-[#2c4066] disabled:cursor-not-allowed disabled:opacity-50">Enviar solicitud</button>
                <button type="button" onClick={onCancelar} className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline">Cancelar</button>
            </form>
        </Modal>
    );
}
