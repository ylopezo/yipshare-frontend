"use client";

import { CONTRASENA_OCULTA, USUARIO_ADMIN } from "@/lib/datos";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export function PerfilModal({ onClose }: { onClose: () => void }) {
    return (
        <Modal
            label="Perfil"
            onClose={onClose}
        >
            <div className="relative w-[min(90vw,320px)] rounded-[2rem] border border-slate-400 bg-white px-7 py-8 shadow-xl">
                <button
                    type="button"
                    aria-label="Cerrar perfil"
                    onClick={onClose}
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                >
                    <Icon name="close" size={18} />
                </button>

                <div className="flex items-center justify-center gap-4">
                    <span className="text-slate-500">
                        <Icon name="user" size={58} />
                    </span>

                    <p className="m-0 text-base font-bold text-[#1e4a73]">
                        Admin
                    </p>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="perfil-usuario"
                        className="text-xs font-bold text-[#1e4a73]"
                    >
                        Nombre Usuario
                    </label>

                    <input
                        id="perfil-usuario"
                        type="text"
                        readOnly
                        value={USUARIO_ADMIN}
                        className="mt-1 w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-1.5 text-sm text-slate-700 outline-none"
                    />
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="perfil-contrasena"
                        className="text-xs font-bold text-[#1e4a73]"
                    >
                        Contraseña
                    </label>

                    <input
                        id="perfil-contrasena"
                        type="password"
                        readOnly
                        value={CONTRASENA_OCULTA}
                        className="mt-1 w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-1.5 text-sm text-slate-700 outline-none"
                    />
                </div>
            </div>
        </Modal>
    );
}