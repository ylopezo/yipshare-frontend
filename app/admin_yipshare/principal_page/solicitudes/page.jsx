"use client";

import { useState } from "react";
import { DocumentsModal } from "@/components/DocumentsModal";
import { ConfirmDialog } from "@/components/Modal";
import { useAdmin } from "../AdminContext";
import { matchesSearch } from "@/lib/data";

const COLUMNS = ["Nombre", "Dirección", "Documentos", "Admin. Condominio"];
const GRID = "grid grid-cols-[repeat(4,minmax(0,1fr))_6rem] gap-2";

export default function RequestsPage() {
    const { requests, searchQuery, acceptRequest, denyRequest } = useAdmin();
    const [viewDocuments, setViewDocuments] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const filtered = requests.filter((request) => matchesSearch(searchQuery, request.name, request.address, request.admin));

    return (
        <>
            <h2 className="m-0 text-lg font-bold">Solicitudes de Condominios</h2>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="sticky top-0 z-10 bg-fondo px-4 pb-3">
                    <div className={`${GRID} text-center text-xs font-bold md:text-sm`}>
                        {COLUMNS.map((column) => (
                            <span key={column}>{column}</span>
                        ))}
                        <span aria-hidden="true" />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="py-10 text-center text-sm text-neutral-500">
                        {requests.length === 0 ? "No hay solicitudes pendientes." : "No se encontraron solicitudes."}
                    </p>
                ) : (
                    <ul className="m-0 list-none space-y-3 p-0 pb-2">
                        {filtered.map((request) => (
                            <li key={request.id} className="rounded-lg border border-neutral-400 bg-white px-4 py-3">
                                <div className={`${GRID} items-center text-center text-xs`}>
                                    <span className="wrap-break-word">{request.name}</span>
                                    <span className="wrap-break-word">{request.address}</span>

                                    <button
                                        type="button"
                                        onClick={() => setViewDocuments(request)}
                                        className="cursor-pointer text-xs font-semibold text-azul-claro underline-offset-2 hover:underline md:text-xs"
                                    >
                                        Ver documentos
                                    </button>

                                    <span className="break-words">{request.admin}</span>

                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmation({ action: "accept", request })}
                                            className="w-full cursor-pointer rounded-md bg-azul py-0.5 text-xs text-white transition hover:bg-azul-claro"
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmation({ action: "deny", request })}
                                            className="w-full cursor-pointer rounded-md border-[1.5px] border-azul bg-white py-0.5 text-xs text-azul transition hover:bg-neutral-100"
                                        >
                                            Denegar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {viewDocuments && <DocumentsModal request={viewDocuments} onClose={() => setViewDocuments(null)} />}

            {confirmation && (
                <ConfirmDialog
                    title="¿Estás seguro?"
                    message={
                        confirmation.action === "accept"
                            ? `Se aceptará el condominio «${confirmation.request.name}» y ${confirmation.request.admin} será su administrador.`
                            : `Se denegará la solicitud del condominio «${confirmation.request.name}».`
                    }
                    onConfirm={() => {
                        if (confirmation.action === "accept") {
                            acceptRequest(confirmation.request);
                        } else {
                            denyRequest(confirmation.request.id);
                        }
                        setConfirmation(null);
                    }}
                    onCancel={() => setConfirmation(null)}
                />
            )}
        </>
    );
}
