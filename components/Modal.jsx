"use client";

import { useEffect, useRef } from "react";

export const BOTON_OSCURO =
    "cursor-pointer rounded-full bg-oscuro text-white transition hover:bg-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50";

export function Modal({ children, onCloseAction, label }) {
    const ref = useRef(null);

    useEffect(() => {
        const onKeyDown = (e) => {
            // con modales apilados, Esc solo cierra el de arriba
            const dialogos = document.querySelectorAll('[role="dialog"]');
            if (e.key === "Escape" && dialogos[dialogos.length - 1] === ref.current) onCloseAction();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onCloseAction]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCloseAction}>
            <div ref={ref} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export function ConfirmDialog({ titulo, mensaje, onConfirmarAction, onCancelarAction }) {
    return (
        <Modal label={titulo} onCloseAction={onCancelarAction}>
            <div className="w-[min(90vw,340px)] rounded-2xl bg-white p-6 text-center shadow-xl">
                <h2 className="m-0 text-lg font-bold text-azul">{titulo}</h2>
                <p className="mb-0 mt-2 text-sm text-slate-600">{mensaje}</p>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancelarAction}
                        className="flex-1 cursor-pointer rounded-full border border-azul bg-white py-2 text-sm font-semibold text-azul transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmarAction}
                        className="flex-1 cursor-pointer rounded-full bg-azul py-2 text-sm font-semibold text-white transition hover:bg-azul-claro"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
