"use client";

import { useEffect } from "react";

export function Modal({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>;
}

export function ConfirmDialog({ titulo, mensaje, onConfirmar, onCancelar }: { titulo: string; mensaje: string; onConfirmar: () => void; onCancelar: () => void }) {
    return <Modal label={titulo} onClose={onCancelar}>
        <div className="w-[min(90vw,340px)] rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="m-0 text-lg font-bold text-[#1e4a73]">{titulo}</h2>
            <p className="mb-0 mt-2 text-sm text-slate-600">{mensaje}</p>
            <div className="mt-6 flex gap-3">
                <button type="button" onClick={onCancelar} className="flex-1 cursor-pointer rounded-full border border-[#1e4a73] bg-white py-2 text-sm font-semibold text-[#1e4a73] transition hover:bg-slate-100">Cancelar</button>
                <button type="button" onClick={onConfirmar} className="flex-1 cursor-pointer rounded-full bg-[#1e4a73] py-2 text-sm font-semibold text-white transition hover:bg-[#2a6aa8]">Sí</button>
            </div>
        </div>
    </Modal>;
}
