"use client";

import { HIDDEN_PASSWORD } from "@/lib/data";
import { Icon } from "./Icon";
import { useUser } from "./RequireSession";
import { Modal } from "./Modal";

export function ProfileModal({ onClose, title = "Admin" }) {
    const user = useUser()?.username ?? "";

    return (
        <Modal label="Perfil" onClose={onClose}>
            <div className="relative w-[min(90vw,320px)] rounded-4xl border border-neutral-400 bg-white px-7 py-8">
                <button
                    type="button"
                    aria-label="Cerrar perfil"
                    onClick={onClose}
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100"
                >
                    <Icon name="close" size={18} />
                </button>

                <div className="flex items-center justify-center gap-4">
                    <span className="text-neutral-500">
                        <Icon name="user" size={58} />
                    </span>
                    <p className="m-0 text-base font-bold text-azul">{title}</p>
                </div>

                <div className="mt-6">
                    <label htmlFor="perfil-usuario" className="text-xs font-bold text-azul">
                        Nombre Usuario
                    </label>
                    <input
                        id="perfil-usuario"
                        type="text"
                        readOnly
                        value={user}
                        className="mt-1 w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-1.5 text-sm text-neutral-700 outline-none"
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="perfil-contrasena" className="text-xs font-bold text-azul">
                        Contraseña
                    </label>
                    <input
                        id="perfil-contrasena"
                        type="password"
                        readOnly
                        value={HIDDEN_PASSWORD}
                        className="mt-1 w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-1.5 text-sm text-neutral-700 outline-none"
                    />
                </div>
            </div>
        </Modal>
    );
}
