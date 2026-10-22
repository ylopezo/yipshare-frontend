"use client";

import { useEffect } from "react";

export function Modal({ children, onCloseAction, label }: { children: React.ReactNode; onCloseAction: () => void; label: string }) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseAction(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onCloseAction]);

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCloseAction}>
        <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>;
}

export function ConfirmDialog({ titulo, mensaje, onConfirmarAction, onCancelarAction }: { titulo: string; mensaje: string; onConfirmarAction: () => void; onCancelarAction: () => void }) {
    return <Modal label={titulo} onCloseAction={onCancelarAction}>
        <div className="w-[min(90vw,340px)] rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="m-0 text-lg font-bold text-[#1e4a73]">{titulo}</h2>
            <p className="mb-0 mt-2 text-sm text-slate-600">{mensaje}</p>
            <div className="mt-6 flex gap-3">
                <button type="button" onClick={onCancelarAction} className="flex-1 cursor-pointer rounded-full border border-[#1e4a73] bg-white py-2 text-sm font-semibold text-[#1e4a73] transition hover:bg-slate-100">Cancelar</button>
                <button type="button" onClick={onConfirmarAction} className="flex-1 cursor-pointer rounded-full bg-[#1e4a73] py-2 text-sm font-semibold text-white transition hover:bg-[#2a6aa8]">Confirmar</button>
            </div>
        </div>
    </Modal>;
}
