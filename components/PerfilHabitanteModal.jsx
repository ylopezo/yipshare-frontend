"use client";

import { useState } from "react";
import { LADAS, soloDigitos, telefonoValido } from "@/lib/datos";
import { Icon } from "./Icon";
import { BOTON_CLARO, ConfirmDialog, Modal } from "./Modal";

const NOMBRE = [
    ["apellidoPaterno", "Apellido paterno"],
    ["apellidoMaterno", "Apellido materno"],
    ["nombres", "Nombre(s)"],
];
const DIRECCION = [
    ["edificio", "Edificio"],
    ["departamento", "Departamento"],
];

export function PerfilHabitanteModal({ perfil, recibidas, onActualizarAction, onEliminarAction, onCloseAction }) {
    const { calificacion, ...inicial } = perfil;
    const [datos, setDatos] = useState(inicial);
    const [editando, setEditando] = useState(false);
    const [confirmar, setConfirmar] = useState(null);
    const [verRecibidas, setVerRecibidas] = useState(false);

    const telefonoOk = telefonoValido(datos.telefono ?? "");
    const valido = Object.values(datos).every((v) => v.trim() !== "") && telefonoOk;

    function cancelarEdicion() {
        setDatos(inicial);
        setEditando(false);
    }

    function manejarConfirmar() {
        if (confirmar === "guardar") {
            setEditando(false);
            onActualizarAction(datos);
        } else {
            onEliminarAction();
        }
        setConfirmar(null);
    }

    const campo = ([name, label]) => (
        <div key={name} className="mt-3">
            <label htmlFor={`perfil-${name}`} className="text-xs font-bold text-azul">
                {label}
            </label>
            <input
                id={`perfil-${name}`}
                value={datos[name]}
                readOnly={!editando}
                onChange={(e) => setDatos({ ...datos, [name]: e.target.value })}
                className="mt-1 w-full rounded-full border border-slate-500 bg-gris px-4 py-1.5
                text-sm text-slate-700 outline-none read-only:cursor-default"
            />
        </div>
    );

    return (
        <>
            <Modal label="Perfil" onCloseAction={onCloseAction}>
                <div className="relative max-h-[90vh] w-[min(94vw,680px)] overflow-y-auto rounded-4xl border border-slate-400 bg-white px-8 py-8 shadow-xl">
                    <button
                        type="button"
                        aria-label="Cerrar perfil"
                        onClick={onCloseAction}
                        className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                    >
                        <Icon name="close" size={18} />
                    </button>

                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="flex h-32 w-32 items-center justify-center rounded-full bg-[#e4e4e4] text-slate-500">
                                <Icon name="user" size={80} />
                            </span>
                            <p className="m-0 mt-4 wrap-break-word text-xl font-bold text-azul">
                                {inicial.nombres} {inicial.apellidoPaterno}
                            </p>

                            <p className="m-0 mt-5 text-xs font-bold text-azul">Mi calificación</p>
                            <div
                                role="img"
                                aria-label={`Calificación ${calificacion.toFixed(1)} de 5`}
                                className="mt-1 flex items-center gap-1"
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span
                                        key={n}
                                        aria-hidden="true"
                                        className={`text-3xl ${n <= Math.round(calificacion) ? "text-amber-400" : "text-slate-300"}`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1 text-xs text-slate-500">{calificacion.toFixed(1)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setVerRecibidas(true)}
                                className="mt-1 cursor-pointer text-xs font-semibold text-[#5aa0e8] hover:underline"
                            >
                                Ver calificaciones recibidas
                            </button>
                        </div>

                        <div>
                            {NOMBRE.map(campo)}
                            <p className="m-0 mt-5 text-xs font-bold uppercase text-azul">Dirección</p>
                            {DIRECCION.map(campo)}

                            <div className="mt-3">
                                <label htmlFor="perfil-telefono" className="text-xs font-bold text-azul">
                                    Teléfono
                                </label>
                                <div className="mt-1 flex gap-2">
                                    <label htmlFor="perfil-lada" className="sr-only">
                                        Lada
                                    </label>
                                    <select
                                        id="perfil-lada"
                                        value={datos.lada ?? "MX"}
                                        disabled={!editando}
                                        onChange={(e) => setDatos({ ...datos, lada: e.target.value })}
                                        className="w-40 shrink-0 cursor-pointer rounded-full border border-slate-500 bg-gris px-3 py-1.5 text-sm text-slate-700 outline-none disabled:cursor-default disabled:opacity-100"
                                    >
                                        {LADAS.map((l) => (
                                            <option key={l.valor} value={l.valor}>
                                                {l.texto}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="perfil-telefono"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={datos.telefono ?? ""}
                                        readOnly={!editando}
                                        aria-invalid={editando && !telefonoOk}
                                        aria-describedby="perfil-telefono-error"
                                        onChange={(e) =>
                                            setDatos({
                                                ...datos,
                                                telefono: soloDigitos(e.target.value),
                                            })
                                        }
                                        className="min-w-0 flex-1 rounded-full border border-slate-500 bg-gris px-4 py-1.5 text-sm text-slate-700 outline-none read-only:cursor-default"
                                    />
                                </div>
                                {editando && !telefonoOk && (
                                    <p id="perfil-telefono-error" className="m-0 mt-1 text-xs text-azul">
                                        El teléfono debe tener 10 dígitos.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {editando ? (
                        <>
                            <button
                                type="button"
                                disabled={!valido}
                                onClick={() => setConfirmar("guardar")}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer
                                rounded-full bg-oscuro py-2 text-sm font-semibold
                                text-white transition hover:bg-oscuro-hover disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="mx-auto mt-3 block w-3/5 max-w-xs cursor-pointer rounded-full border border-oscuro bg-white py-2 text-sm font-semibold text-oscuro transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setEditando(true)}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-full bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover"
                            >
                                Actualizar datos
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmar("eliminar")}
                                className={`${BOTON_CLARO} mx-auto mt-3 block w-3/5 max-w-xs py-2 text-sm font-semibold`}
                            >
                                Eliminar cuenta
                            </button>
                        </>
                    )}
                </div>
            </Modal>

            {verRecibidas && (
                <Modal label="Calificaciones recibidas" onCloseAction={() => setVerRecibidas(false)}>
                    <div className="max-h-[80vh] w-[min(92vw,420px)] overflow-y-auto rounded-[2rem] bg-white px-8 py-8 shadow-xl">
                        <h2 className="m-0 text-center text-xl font-extrabold uppercase">Calificaciones recibidas</h2>

                        {recibidas.length === 0 ? (
                            <p className="mb-0 mt-4 text-center text-sm text-slate-500">
                                Aún no tienes calificaciones.
                            </p>
                        ) : (
                            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                                {recibidas.map((c) => (
                                    <li
                                        key={`${c.prestamoId}-${c.de}`}
                                        className="rounded-xl border border-slate-300 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="m-0 text-sm font-bold text-azul">{c.de}</p>
                                            <span
                                                role="img"
                                                aria-label={`${c.estrellas} de 5 estrellas`}
                                                className="text-amber-400"
                                            >
                                                {"★".repeat(c.estrellas)}
                                                <span className="text-slate-300">{"★".repeat(5 - c.estrellas)}</span>
                                            </span>
                                        </div>
                                        {c.comentario && (
                                            <p className="mb-0 mt-1 break-words text-xs text-slate-600">
                                                {c.comentario}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="button"
                            onClick={() => setVerRecibidas(false)}
                            className="mx-auto mt-6 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}

            {confirmar && (
                <ConfirmDialog
                    titulo={confirmar === "guardar" ? "¿Guardar los cambios?" : "¿Eliminar cuenta?"}
                    mensaje={
                        confirmar === "guardar" ? "Se actualizarán tus datos." : "Esta acción no se puede deshacer."
                    }
                    onConfirmarAction={manejarConfirmar}
                    onCancelarAction={() => setConfirmar(null)}
                />
            )}
        </>
    );
}
