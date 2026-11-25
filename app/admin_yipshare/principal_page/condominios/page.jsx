"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/Modal";
import { EditCondominiumModal } from "@/components/EditCondominiumModal";
import { useAdmin } from "../AdminContext";
const COLUMNS = ["Nombre", "Dirección", "Cant. Dptos/Casas", "Admin. Condominio"];
const GRID = "grid grid-cols-4 gap-2";

export default function CondominiumsPage() {
    const { condominiums, searchQuery, editCondominium, deleteCondominium } = useAdmin();
    const [dialog, setDialog] = useState(null);

    const text = searchQuery.trim().toLowerCase();
    const filtered = condominiums.filter(({ name, address, admin }) =>
        `${name} ${address} ${admin}`.toLowerCase().includes(text),
    );

    return (
        <>
            <h2 className="m-0 text-lg font-bold">Condominios Registrados</h2>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="sticky top-0 z-10 bg-fondo px-4 pb-3">
                    <div className={`${GRID} text-center text-xs font-bold md:text-sm`}>
                        {COLUMNS.map((column) => (
                            <span key={column}>{column}</span>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-500">No se encontraron condominios.</p>
                ) : (
                    <ul className="m-0 list-none space-y-3 p-0 pb-2">
                        {filtered.map((condominium) => (
                            <li key={condominium.id} className="rounded-xl border border-slate-400 bg-white px-4 py-3">
                                <div className={`${GRID} items-center text-center text-xs`}>
                                    <span className="break-words">{condominium.name}</span>
                                    <span className="break-words">{condominium.address}</span>
                                    <span>{condominium.unitCount}</span>
                                    <span className="break-words text-azul">{condominium.admin}</span>
                                </div>

                                <div className={`${GRID} mt-2`}>
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ type: "edit", condominium })}
                                        className="col-start-2 mx-auto w-20 cursor-pointer rounded-[15px] bg-azul py-0.5 text-xs text-white transition hover:bg-azul-claro md:w-24"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ type: "delete", condominium })}
                                        className="col-start-3 mx-auto w-20 cursor-pointer rounded-[15px] border-[1.5px] border-azul bg-white py-0.5 text-xs text-azul transition hover:bg-slate-100 md:w-24"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {dialog?.type === "delete" && (
                <ConfirmDialog
                    title="¿Estás seguro?"
                    message={`Se eliminará el condominio «${dialog.condominium.name}». Esta acción no se puede deshacer.`}
                    onConfirmAction={() => {
                        deleteCondominium(dialog.condominium.id);
                        setDialog(null);
                    }}
                    onCancelAction={() => setDialog(null)}
                />
            )}

            {dialog?.type === "edit" && (
                <EditCondominiumModal
                    condominium={dialog.condominium}
                    onSaveAction={(updated) => setDialog({ ...dialog, updated })}
                    onCancelAction={() => setDialog(null)}
                />
            )}

            {dialog?.updated && (
                <ConfirmDialog
                    title="¿Guardar cambios?"
                    message={`Se actualizarán los datos del condominio «${dialog.condominium.name}».`}
                    onConfirmAction={() => {
                        editCondominium(dialog.updated);
                        setDialog(null);
                    }}
                    onCancelAction={() => setDialog({ type: "edit", condominium: dialog.condominium })}
                />
            )}
        </>
    );
}
