"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { ConfirmDialog, Modal } from "./Modal";

export type PerfilUsuario = {
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombres: string;
    edificio: string;
    departamento: string;
    calificacion: number;
};

export type DatosPerfil = Omit<PerfilUsuario, "calificacion">;

type Campo = keyof DatosPerfil;

const NOMBRE: [Campo, string][] = [
    ["apellidoPaterno", "Apellido paterno"],
    ["apellidoMaterno", "Apellido materno"],
    ["nombres", "Nombre(s)"],
];
const DIRECCION: [Campo, string][] = [
    ["edificio", "Edificio"],
    ["departamento", "Departamento"],
];


export function PerfilHabitanteModal({
                                         perfil,
                                         onActualizarAction,
                                         onEliminarAction,
                                         onCloseAction,
                                     }: {
    perfil: PerfilUsuario;
    onActualizarAction: (datos: DatosPerfil) => void;
    onEliminarAction: () => void;
    onCloseAction: () => void;
}) {
    const { calificacion, ...inicial } = perfil;
    const [datos, setDatos] = useState<DatosPerfil>(inicial);
    const [editando, setEditando] = useState(false);
    const [confirmar, setConfirmar] = useState<"guardar" | "eliminar" | null>(null);

    const valido = Object.values(datos).every((v) => v.trim() !== "");

    function cancelarEdicion() {
        setDatos(inicial);
        setEditando(false);
    }

    function handleConfirmar() {
        if (confirmar === "guardar") {
            setEditando(false);
            onActualizarAction(datos);
        } else {
            onEliminarAction();
        }
        setConfirmar(null);
    }

    const campo = ([name, label]: [Campo, string]) => (
        <div key={name} className="mt-3">
            <label htmlFor={`perfil-${name}`} className="text-xs font-bold text-[#1e4a73]">
                {label}
            </label>
            <input
                id={`perfil-${name}`}
                value={datos[name]}
                readOnly={!editando}
                onChange={(e) => setDatos({ ...datos, [name]: e.target.value })}
                className="mt-1 w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-1.5
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
                            <p className="m-0 mt-4 wrap-break-word text-xl font-bold text-[#1e4a73]">
                                {inicial.nombres} {inicial.apellidoPaterno}
                            </p>

                            <p className="m-0 mt-5 text-xs font-bold text-[#1e4a73]">Mi calificación</p>
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
                        </div>

                        <div>
                            {NOMBRE.map(campo)}
                            <p className="m-0 mt-5 text-xs font-bold uppercase text-[#1e4a73]">Dirección</p>
                            {DIRECCION.map(campo)}
                        </div>
                    </div>

                    {editando ? (
                        <>
                            <button
                                type="button"
                                disabled={!valido}
                                onClick={() => setConfirmar("guardar")}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer
                                rounded-full bg-[#1f2d47] py-2 text-sm font-semibold
                                text-white transition hover:bg-[#2c4066] disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="mx-auto mt-3 block w-3/5 max-w-xs cursor-pointer rounded-full border border-[#1f2d47] bg-white py-2 text-sm font-semibold text-[#1f2d47] transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setEditando(true)}
                                className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-full bg-[#1f2d47] py-2 text-sm font-semibold text-white transition hover:bg-[#2c4066]"
                            >
                                Actualizar datos
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmar("eliminar")}
                                className="mx-auto mt-3 block w-3/5 max-w-xs cursor-pointer rounded-full border border-red-600 bg-white py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                                Eliminar cuenta
                            </button>
                        </>
                    )}
                </div>
            </Modal>

            {confirmar && (
                <ConfirmDialog
                    titulo={confirmar === "guardar" ? "¿Guardar los cambios?" : "¿Eliminar cuenta?"}
                    mensaje={
                        confirmar === "guardar" ? "Se actualizarán tus datos." : "Esta acción no se puede deshacer."
                    }
                    onConfirmarAction={handleConfirmar}
                    onCancelarAction={() => setConfirmar(null)}
                />
            )}
        </>
    );
}