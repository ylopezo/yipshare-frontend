"use client";

import { useEffect, useRef } from "react";

export const DARK_BUTTON =
    "cursor-pointer rounded-[15px] bg-oscuro text-white transition hover:bg-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50";

export const LIGHT_BUTTON =
    "cursor-pointer rounded-[15px] border-[1.5px] border-azul bg-white text-azul transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50";

export function Modal({ children, onClose, label }) {
    const ref = useRef(null);

    useEffect(() => {
        const onKeyDown = (e) => {
            const dialogs = document.querySelectorAll('[role="dialog"]');
            if (e.key === "Escape" && dialogs[dialogs.length - 1] === ref.current) onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div ref={ref} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export function ConfirmDialog({ title, message, onConfirm, onCancel }) {
    return (
        <Modal label={title} onClose={onCancel}>
            <div className="w-[min(90vw,340px)] rounded-2xl bg-white p-6 text-center">
                <h2 className="m-0 text-lg font-bold text-azul">{title}</h2>
                <p className="mb-0 mt-2 text-sm text-neutral-600">{message}</p>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`${LIGHT_BUTTON} flex-1 py-2 text-sm font-semibold`}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer rounded-[15px] bg-azul py-2 text-sm font-semibold text-white transition hover:bg-azul-claro"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
