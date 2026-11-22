"use client";

import { useEffect, useState } from "react";
import { documentUrl, getCondominiumDocuments } from "@/lib/condominiums";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

const LABELS = {
    ecrpcDocument: "Escritura Constitutiva del Régimen de Propiedad en Condominio",
    aanaDocument: "Acta de Asamblea de Nombramiento del Administrador",
    ownerIneDocument: "Identificación oficial del Administrador",
    condominiumRfcDocument: "RFC del Condominio",
};

async function openDocument(id) {
    const tab = window.open("", "_blank");
    const url = await documentUrl(id);
    if (url) tab.location.href = url;
    else {
        tab?.close();
        alert("No se pudo abrir el documento.");
    }
}

export function DocumentsModal({ request, onCloseAction }) {
    const [documents, setDocuments] = useState(undefined);

    useEffect(() => {
        getCondominiumDocuments(request.id).then(setDocuments);
    }, [request.id]);

    return (
        <Modal label="Documentos de la solicitud" onCloseAction={onCloseAction}>
            <div
                className="relative w-[min(90vw,380px)] rounded-4xl border border-slate-400
             bg-white px-7 py-8 shadow-xl"
            >
                <button
                    type="button"
                    aria-label="Cerrar documentos"
                    onClick={onCloseAction}
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-1
                    text-slate-500 transition hover:bg-slate-100"
                >
                    <Icon name="close" size={18} />
                </button>

                <h2 className="m-0 text-center text-lg font-bold text-azul">Documentos</h2>

                <p className="mb-0 mt-1 text-center text-xs text-slate-600">
                    {request.name} · {request.applicant}
                </p>

                {documents === undefined ? (
                    <p className="mb-0 mt-5 text-center text-xs text-slate-500">Cargando documentos...</p>
                ) : documents === null ? (
                    <p role="alert" className="mb-0 mt-5 text-center text-xs text-azul">
                        No se pudieron cargar los documentos.
                    </p>
                ) : documents.length === 0 ? (
                    <p className="mb-0 mt-5 text-center text-xs text-slate-500">
                        Esta solicitud ya no tiene documentos.
                    </p>
                ) : (
                    <ul className="m-0 mt-5 list-none space-y-2 p-0">
                        {documents.map((doc) => (
                            <li
                                key={doc.id}
                                className="flex items-center gap-3 rounded-xl border border-slate-300 bg-gris px-3 py-2"
                            >
                                <span className="text-azul">
                                    <Icon name="file" size={22} />
                                </span>

                                <span className="min-w-0 flex-1 text-xs text-slate-700">
                                    {LABELS[doc.type] ?? doc.type}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => openDocument(doc.id)}
                                    className="cursor-pointer text-xs font-semibold uppercase text-azul-claro hover:underline"
                                >
                                    Abrir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <p className="mb-0 mt-4 text-center text-xs text-slate-500">
                    Los documentos se eliminan para siempre al aceptar o rechazar la solicitud.
                </p>

                <button
                    type="button"
                    onClick={onCloseAction}
                    className="mt-6 w-full cursor-pointer rounded-full bg-azul py-2 text-sm font-semibold text-white transition
                    hover:bg-azul-claro"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}
