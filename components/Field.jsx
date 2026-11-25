"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function Field({ id, icon, placeholder, error, password = false, className = "", ...input }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={className}>
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-500">
                    <Icon name={icon} size={20} />
                </span>

                <input
                    {...input}
                    id={id}
                    name={id}
                    type={password && !visible ? "password" : "text"}
                    placeholder={placeholder}
                    required
                    className={`w-full rounded-[15px] border-[1.5px] border-borde bg-gris py-2 pl-11 text-lg text-slate-700 outline-none placeholder:text-slate-500 focus:border-slate-900 ${password ? "pr-11" : "pr-3"}`}
                />

                {password && (
                    <button
                        type="button"
                        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={visible}
                        onClick={() => setVisible((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-azul-claro"
                    >
                        <Icon name={visible ? "eyeOff" : "eye"} size={20} />
                    </button>
                )}
            </div>

            <span className="mt-1 block min-h-5 text-sm text-azul">{error}</span>
        </div>
    );
}
