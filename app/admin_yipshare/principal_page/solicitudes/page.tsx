"use client";

import { useMemo, useState } from "react";
import { DocumentosModal } from "@/components/DocumentosModal";
import { ConfirmDialog } from "@/components/Modal";
import type { Solicitud } from "@/lib/datos";
import { useAdmin } from "../AdminContext";

type Confirmacion = { accion: "aceptar" | "denegar"; solicitud: Solicitud } | null;

const COLUMNAS = ["Nombre", "Dirección", "Documentos", "Admin. Condominio"];
const GRID = "grid grid-cols-[repeat(4,minmax(0,1fr))_6rem] gap-2";

export default function SolicitudesPage() {
    const { solicitudes, busqueda, aceptarSolicitud, denegarSolicitud } = useAdmin();
    const [verDocumentos, setVerDocumentos] = useState<Solicitud | null>(null);
    const [confirmacion, setConfirmacion] = useState<Confirmacion>(null);

    const filtradas = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        if (!texto) return solicitudes;
        return solicitudes.filter(({ nombre, direccion, aspirante }) =>
            `${nombre} ${direccion} ${aspirante}`.toLowerCase().includes(texto),
        );
    }, [busqueda, solicitudes]);

    return (
        <>
            <h2 className="m-0 text-lg font-bold">Solicitudes de Condominios</h2>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="sticky top-0 z-10 bg-[#e9eef3] px-4 pb-3">
                    <div className={`${GRID} text-center text-xs font-bold md:text-sm`}>
                        {COLUMNAS.map((columna) => (
                            <span key={columna}>{columna}</span>
                        ))}
                        <span aria-hidden="true" />
                    </div>
                </div>

                {filtradas.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-500">
                        {solicitudes.length === 0
                            ? "No hay solicitudes pendientes."
                            : "No se encontraron solicitudes."}
                    </p>
                ) : (
                    <ul className="m-0 list-none space-y-3 p-0 pb-2">
                        {filtradas.map((solicitud) => (
                            <li
                                key={solicitud.id}
                                className="rounded-xl border border-slate-400 bg-white px-4 py-3"
                            >
                                <div className={`${GRID} items-center text-center text-[11px] md:text-xs`}>
                                    <span className="wrap-break-word">{solicitud.nombre}</span>
                                    <span className="wrap-break-word">{solicitud.direccion}</span>
                                    <button
                                        type="button"
                                        onClick={() => setVerDocumentos(solicitud)}
                                        className="cursor-pointer text-[11px] font-semibold uppercase text-[#2a6aa8] hover:underline md:text-xs"
                                    >
                                        Ver documentos
                                    </button>
                                    <span className="wrap-break-word">{solicitud.aspirante}</span>

                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmacion({ accion: "aceptar", solicitud })}
                                            className="w-full cursor-pointer rounded-full bg-[#1e4a73] py-0.5 text-[11px] text-white transition hover:bg-[#2a6aa8]"
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmacion({ accion: "denegar", solicitud })}
                                            className="w-full cursor-pointer rounded-full border border-[#1e4a73] bg-white py-0.5 text-[11px] text-[#1e4a73] transition hover:bg-slate-100"
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

            {verDocumentos && (
                <DocumentosModal solicitud={verDocumentos} onClose={() => setVerDocumentos(null)} />
            )}

            {confirmacion && (
                <ConfirmDialog
                    titulo="¿Estás seguro?"
                    mensaje={
                        confirmacion.accion === "aceptar"
                            ? `Se aceptará el condominio «${confirmacion.solicitud.nombre}» y ${confirmacion.solicitud.aspirante} será su administrador.`
                            : `Se denegará la solicitud del condominio «${confirmacion.solicitud.nombre}».`
                    }
                    onConfirmar={() => {
                        if (confirmacion.accion === "aceptar") {
                            aceptarSolicitud(confirmacion.solicitud);
                        } else {
                            denegarSolicitud(confirmacion.solicitud.id);
                        }
                        setConfirmacion(null);
                    }}
                    onCancelar={() => setConfirmacion(null)}
                />
            )}
        </>
    );
}