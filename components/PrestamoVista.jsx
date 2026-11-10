"use client";

import { useEffect, useState } from "react";
import { codigoValido, nuevoCodigo, SEGUNDOS_CODIGO } from "@/lib/prestamos";
import { CalificarModal } from "./CalificarModal";
import { REPORTE_ESTADOS } from "./ReportesVista";
import { BOTON_OSCURO, Modal } from "./Modal";

export const ESTADO_PRESTAMO = {
    pendiente: {
        texto: "Pendiente de conformación",
        clase: "bg-[#fde9a8] text-amber-900",
    },
    aceptado: { texto: "Reservado", clase: "bg-[#dbe7f5] text-azul" },
    en_curso: { texto: "En préstamo", clase: "bg-[#b9f0c8] text-green-900" },
    finalizado: { texto: "Finalizado", clase: "bg-slate-200 text-slate-700" },
    rechazado: { texto: "Rechazado", clase: "bg-azul text-white" },
};

function CodigoModal({ fase, codigoInicial, onConfirmarAction, onCancelarAction }) {
    const [cod, setCod] = useState(codigoInicial);
    const [ahora, setAhora] = useState(codigoInicial.expira - SEGUNDOS_CODIGO * 1000);
    const [escrito, setEscrito] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setAhora(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setCod(nuevoCodigo(Date.now())), Math.max(0, cod.expira - Date.now()));
        return () => clearTimeout(t);
    }, [cod]);

    const restante = Math.min(SEGUNDOS_CODIGO, Math.max(0, Math.ceil((cod.expira - ahora) / 1000)));

    return (
        <Modal label="Ingresar código" onCloseAction={onCancelarAction}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // shortcut: compara contra el código mostrado aquí para poder probar sin backend;
                    // con backend, el código a escribir es el que genera la otra persona
                    if (codigoValido(cod, escrito, Date.now())) onConfirmarAction();
                    else setError(true);
                }}
                className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl"
            >
                <h2 className="m-0 text-xl font-extrabold uppercase">Ingresar código</h2>
                <p className="mb-0 mt-1 text-xs text-slate-500">Código de {fase}</p>

                <input
                    aria-label="Código"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="off"
                    placeholder="Código"
                    value={escrito}
                    onChange={(e) => {
                        setEscrito(e.target.value);
                        setError(false);
                    }}
                    className="mt-5 w-full rounded-xl border border-slate-600 bg-gris px-4 py-2 text-center text-lg tracking-widest text-slate-700 outline-none focus:border-azul"
                />
                {error && (
                    <p role="alert" className="mb-0 mt-2 text-sm text-azul">
                        Código incorrecto o vencido.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={escrito.trim().length !== 6}
                    className={`${BOTON_OSCURO} mx-auto mt-4 block w-3/5 py-2 text-sm font-semibold`}
                >
                    Confirmar
                </button>

                <div className="mt-6 border-t border-slate-300 pt-4">
                    <p className="m-0 text-xs font-bold text-azul">Tu código</p>
                    <p className="m-0 mt-1 font-mono text-3xl font-bold tracking-widest text-azul">{cod.valor}</p>
                    <p className="m-0 mt-1 text-xs text-slate-500">
                        Vence en {Math.floor(restante / 60)}:{String(restante % 60).padStart(2, "0")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancelarAction}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}

export function PrestamosVista({
    prestamos,
    usuario,
    onResponderAction,
    onCodigoAction,
    onCalificarAction,
    reportes,
    calificaciones = [],
}) {
    const [ventana, setVentana] = useState(null);
    const cerrar = () => setVentana(null);
    const otro = (p) => (p.duenio === usuario ? p.prestatario : p.duenio);

    const accion = (p, rol) => {
        if (p.estado === "pendiente" && rol === "duenio") {
            return {
                texto: "Confirmar Petición",
                abrir: () => setVentana({ tipo: "peticion", p }),
            };
        }
        if (p.estado === "aceptado" || p.estado === "en_curso") {
            return {
                texto: "Ingresar Código",
                abrir: () => setVentana({ tipo: "codigo", p, codigo: nuevoCodigo(Date.now()) }),
            };
        }
        // Las dos personas califican, no solo la que escribió el código de devolución
        if (p.estado === "finalizado" && !calificaciones.some((c) => c.prestamoId === p.id && c.de === usuario)) {
            return {
                texto: "Calificar",
                abrir: () => setVentana({ tipo: "calificar", p }),
            };
        }
        return null;
    };

    const tarjeta = (p, rol) => {
        const a = accion(p, rol);
        return (
            <li key={p.id} className="w-48 overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="h-24 bg-[#e4e4e4]">
                    {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover" />}
                </div>

                <div className="px-3 pb-3 pt-2">
                    <p className="m-0 break-words text-base font-bold text-azul">{p.nombre}</p>
                    <p className="m-0 text-[10px] text-slate-500">{rol === "prestatario" ? p.duenio : p.prestatario}</p>
                    {p.estado === "en_curso" && p.fin && (
                        <p className="m-0 mt-1 text-[10px] text-slate-500">
                            Vence:{" "}
                            {new Date(p.fin).toLocaleString("es-MX", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${ESTADO_PRESTAMO[p.estado].clase}`}
                        >
                            {ESTADO_PRESTAMO[p.estado].texto}
                        </span>
                        {a && (
                            <button
                                type="button"
                                onClick={a.abrir}
                                className={`${BOTON_OSCURO} px-3 py-1 text-[10px] font-semibold`}
                            >
                                {a.texto}
                            </button>
                        )}
                    </div>
                </div>
            </li>
        );
    };

    const columna = (titulo, lista, rol) => (
        <section>
            <h3 className="m-0 text-sm font-bold text-slate-700">{titulo}</h3>
            {lista.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-slate-500">No hay préstamos.</p>
            ) : (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-4 p-0">{lista.map((p) => tarjeta(p, rol))}</ul>
            )}
        </section>
    );

    return (
        <>
            <h2 className="m-0 text-base font-bold">Mis Préstamos</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-2">
                {columna(
                    "Como Prestatario",
                    prestamos.filter((p) => p.prestatario === usuario),
                    "prestatario",
                )}
                {columna(
                    "Como Dueño",
                    prestamos.filter((p) => p.duenio === usuario),
                    "duenio",
                )}
            </div>

            {ventana?.tipo === "peticion" && (
                <Modal label="Confirmar petición" onCloseAction={cerrar}>
                    <div className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl">
                        <h2 className="m-0 text-xl font-extrabold uppercase">Confirmar petición</h2>
                        <p className="mb-0 mt-3 text-sm text-slate-600">
                            {ventana.p.prestatario} quiere pedir «{ventana.p.nombre}» por {ventana.p.tiempo}.
                        </p>

                        {(() => {
                            const contra = reportes.filter((r) => r.involucrado === ventana.p.prestatario);
                            return contra.length === 0 ? (
                                <p className="mb-0 mt-3 text-xs text-slate-500">Este vecino no tiene reportes.</p>
                            ) : (
                                <details className="mt-3 text-left">
                                    <summary className="cursor-pointer text-center text-xs font-bold text-azul">
                                        Ver reportes del vecino ({contra.length})
                                    </summary>
                                    <ul className="m-0 mt-2 flex max-h-48 list-none flex-col gap-2 overflow-y-auto p-0">
                                        {contra.map((r) => {
                                            const info = REPORTE_ESTADOS.find((e) => e.valor === r.estado);
                                            return (
                                                <li key={r.id} className="rounded-xl border border-slate-300 px-3 py-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${info.clase}`}
                                                    >
                                                        {info.texto}
                                                    </span>
                                                    <p className="mb-0 mt-1 break-words text-xs text-slate-600">
                                                        {r.detalles}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </details>
                            );
                        })()}

                        <button
                            type="button"
                            onClick={() => {
                                onResponderAction(ventana.p, true);
                                cerrar();
                            }}
                            className={`${BOTON_OSCURO} mx-auto mt-6 block w-3/5 py-2 text-sm font-semibold`}
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onResponderAction(ventana.p, false);
                                cerrar();
                            }}
                            className="mx-auto mt-3 block w-3/5 cursor-pointer rounded-full border border-azul bg-white py-2 text-sm font-semibold text-azul transition hover:bg-slate-100"
                        >
                            Denegar
                        </button>
                        <button
                            type="button"
                            onClick={cerrar}
                            className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
            )}

            {ventana?.tipo === "codigo" && (
                <CodigoModal
                    key={ventana.p.id}
                    fase={ventana.p.estado === "aceptado" ? "entrega" : "devolución"}
                    codigoInicial={ventana.codigo}
                    onConfirmarAction={() => {
                        onCodigoAction(ventana.p);
                        // El segundo código (devolución) cierra el préstamo: toca calificar al vecino
                        setVentana(ventana.p.estado === "en_curso" ? { tipo: "calificar", p: ventana.p } : null);
                    }}
                    onCancelarAction={cerrar}
                />
            )}

            {ventana?.tipo === "calificar" && (
                <CalificarModal
                    vecino={otro(ventana.p)}
                    onEnviarAction={(estrellas, comentario) => {
                        onCalificarAction({
                            prestamoId: ventana.p.id,
                            de: usuario,
                            para: otro(ventana.p),
                            estrellas,
                            comentario,
                        });
                        cerrar();
                    }}
                    onCancelarAction={cerrar}
                />
            )}
        </>
    );
}
