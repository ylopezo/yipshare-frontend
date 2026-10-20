"use client";

import { useState } from "react";
import type { Condominio } from "@/lib/datos";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export function EditarCondominioModal({ condominio, onGuardar, onCancelar }: { condominio: Condominio; onGuardar: (actualizado: Condominio) => void; onCancelar: () => void }) {
    const [nombre, setNombre] = useState(condominio.nombre);
    const [direccion, setDireccion] = useState(condominio.direccion);
    const [cantidad, setCantidad] = useState(String(condominio.cantidad));
    const [admin, setAdmin] = useState(condominio.admin);
    const cantidadNum = Number(cantidad);
    const valido = nombre.trim() !== "" && direccion.trim() !== "" && admin.trim() !== "" && Number.isInteger(cantidadNum) && cantidadNum > 0;
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!valido) return;
        onGuardar({ ...condominio, nombre: nombre.trim(), direccion: direccion.trim(), cantidad: cantidadNum, admin: admin.trim() });
    }
    const inputClase = "mt-1 w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-1.5 text-sm text-slate-700 outline-none focus:border-[#1e4a73]";
    const labelClase = "text-xs font-bold text-[#1e4a73]";
    return <Modal label="Editar condominio" onClose={onCancelar}><form onSubmit={handleSubmit} className="relative w-[min(90vw,360px)] rounded-[2rem] border border-slate-400 bg-white px-7 py-8 shadow-xl">
        <button type="button" aria-label="Cerrar" onClick={onCancelar} className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"><Icon name="close" size={18} /></button>
        <h2 className="m-0 text-center text-lg font-bold text-[#1e4a73]">Editar condominio</h2>
        <div className="mt-5"><label htmlFor="edit-nombre" className={labelClase}>Nombre</label><input id="edit-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} /></div>
        <div className="mt-3"><label htmlFor="edit-direccion" className={labelClase}>Dirección</label><input id="edit-direccion" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={inputClase} /></div>
        <div className="mt-3"><label htmlFor="edit-cantidad" className={labelClase}>Cant. Dptos/Casas</label><input id="edit-cantidad" type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={inputClase} /></div>
        <div className="mt-3"><label htmlFor="edit-admin" className={labelClase}>Admin. Condominio</label><input id="edit-admin" type="text" value={admin} onChange={(e) => setAdmin(e.target.value)} className={inputClase} /></div>
        <div className="mt-6 flex gap-3"><button type="button" onClick={onCancelar} className="flex-1 cursor-pointer rounded-full border border-[#1e4a73] bg-white py-2 text-sm font-semibold text-[#1e4a73] transition hover:bg-slate-100">Cancelar</button><button type="submit" disabled={!valido} className="flex-1 cursor-pointer rounded-full bg-[#1e4a73] py-2 text-sm font-semibold text-white transition hover:bg-[#2a6aa8] disabled:cursor-not-allowed disabled:opacity-50">Guardar</button></div>
    </form></Modal>;
}
