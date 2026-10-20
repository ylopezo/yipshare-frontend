"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/Modal";
import { EditarCondominioModal } from "@/components/EditarCondominioModal";
import type { Condominio } from "@/lib/datos";
import { useAdmin } from "../AdminContext";

type Dialogo = { tipo: "eliminar" | "editar"; condominio: Condominio } | null;
const COLUMNAS = ["Nombre", "Dirección", "Cant. Dptos/Casas", "Admin. Condominio"];
const GRID = "grid grid-cols-4 gap-2";

export default function CondominiosPage() {
    const { condominios, busqueda, editarCondominio, eliminarCondominio } = useAdmin();
    const [dialogo, setDialogo] = useState<Dialogo>(null);
    const filtrados = useMemo(() => { const texto = busqueda.trim().toLowerCase(); return texto ? condominios.filter(({ nombre, direccion, admin }) => `${nombre} ${direccion} ${admin}`.toLowerCase().includes(texto)) : condominios; }, [busqueda, condominios]);
    return <>
        <h2 className="m-0 text-lg font-bold">Condominios Registrados</h2>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"><div className="sticky top-0 z-10 bg-[#e9eef3] px-4 pb-3">
            <div className={`${GRID} text-center text-xs font-bold md:text-sm`}>{COLUMNAS.map((columna) =>
                <span key={columna}>{columna}</span>)}</div></div>
        {filtrados.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No se encontraron condominios.</p> : <ul className="m-0 list-none space-y-3 p-0 pb-2">{filtrados.map((condominio) => <li key={condominio.id}
                                                                                                                                                                                                                   className="rounded-xl border border-slate-400 bg-white px-4 py-3"><div className={`${GRID} 
                                                                                                                                                                                                        items-center text-center text-[11px] md:text-xs`}><span className="break-words">{condominio.nombre}</span><span className="break-words">{condominio.direccion}</span><span>{condominio.cantidad}</span><span className="break-words text-[#1e4a73]">{condominio.admin}</span></div><div className={`${GRID} mt-2`}><button type="button" onClick={() => setDialogo({ tipo: "editar", condominio })}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              className="col-start-2 mx-auto w-20 cursor-pointer rounded-full bg-[#1e4a73] py-0.5 text-[11px] text-white transition hover:bg-[#2a6aa8] md:w-24">Editar</button><button type="button" onClick={() => setDialogo({ tipo: "eliminar", condominio })} className="col-start-3 mx-auto w-20 cursor-pointer rounded-full border border-[#1e4a73] bg-white py-0.5 text-[11px] text-[#1e4a73] transition hover:bg-slate-100 md:w-24">Eliminar</button></div></li>)}</ul>}
    </div>
    {dialogo?.tipo === "eliminar" && <ConfirmDialog titulo="¿Estás seguro?" mensaje={`Se eliminará el condominio «${dialogo.condominio.nombre}». Esta acción no se puede deshacer.`} onConfirmar={() => { eliminarCondominio(dialogo.condominio.id); setDialogo(null); }} onCancelar={() => setDialogo(null)} />}
    {dialogo?.tipo === "editar" && <EditarCondominioModal condominio={dialogo.condominio} onGuardar={(actualizado) => { editarCondominio(actualizado); setDialogo(null); }} onCancelar={() => setDialogo(null)} />}
    </>;
}
