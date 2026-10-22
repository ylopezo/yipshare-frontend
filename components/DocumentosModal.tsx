"use client";

import { DOCUMENTOS_EJEMPLO, type Solicitud } from "@/lib/datos";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export function DocumentosModal({
                                    solicitud,
                                    onCloseAction,
                                }: {
    solicitud: Solicitud;
    onCloseAction: () => void;
}) {
    return (
        <Modal
            label="Documentos de la solicitud"
            onCloseAction={onCloseAction}
        >
            <div className="relative w-[min(90vw,380px)] rounded-[2rem] border border-slate-400 bg-white px-7 py-8 shadow-xl">
                <button
                    type="button"
                    aria-label="Cerrar documentos"
                    onClick={onCloseAction}
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                >
                    <Icon name="close" size={18} />
                </button>

                <h2 className="m-0 text-center text-lg font-bold text-[#1e4a73]">
                    Documentos
                </h2>

                <p className="mb-0 mt-1 text-center text-xs text-slate-600">
                    {solicitud.nombre} · {solicitud.aspirante}
                </p>

                <ul className="m-0 mt-5 list-none space-y-2 p-0">
                    {DOCUMENTOS_EJEMPLO.map((doc) => (
                        <li
                            key={doc}
                            className="flex items-center gap-3 rounded-xl border border-slate-300 bg-[#eeeeee] px-3 py-2"
                        >
                            <span className="text-[#1e4a73]">
                                <Icon name="file" size={22} />
                            </span>

                            <span className="min-w-0 flex-1 text-xs text-slate-700">
                                {doc}
                            </span>

                            <button
                                type="button"
                                className="cursor-pointer text-[11px] font-semibold uppercase text-[#2a6aa8] hover:underline"
                            >
                                Abrir
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={onCloseAction}
                    className="mt-6 w-full cursor-pointer rounded-full bg-[#1e4a73] py-2 text-sm font-semibold text-white transition hover:bg-[#2a6aa8]"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}