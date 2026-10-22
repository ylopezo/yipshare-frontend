"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "./Modal";

export function LogoMenuSesion() {
    const router = useRouter();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuAbierto) return;

        const onMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setMenuAbierto(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuAbierto(false);
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuAbierto]);

    function handleConfirmar() {
        setConfirmando(false);
        router.replace("/login");
    }

    return (
        <>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    aria-label="Menú de sesión"
                    aria-haspopup="menu"
                    aria-expanded={menuAbierto}
                    onClick={() => setMenuAbierto((abierto) => !abierto)}
                    className="cursor-pointer rounded-lg transition hover:opacity-80"
                >
                    <Image
                        src="/img/logo_yipshare_icono.png"
                        alt="YipShare"
                        width={190}
                        height={56}
                        priority
                        className="h-14 w-auto object-contain"
                    />
                </button>

                {menuAbierto && (
                    <div
                        role="menu"
                        className="absolute left-0 top-full z-60 mt-2 w-full overflow-hidden rounded bg-white text-left shadow-lg"
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setMenuAbierto(false);
                                setConfirmando(true);
                            }}
                            className="block w-full cursor-pointer px-3 py-2 text-left text-sm font-bold text-[#2a5a88] hover:bg-slate-100"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>

            {confirmando && (
                <ConfirmDialog
                    titulo="¿Estás seguro?"
                    mensaje="Se cerrará tu sesión."
                    onConfirmarAction={handleConfirmar}
                    onCancelarAction={() => setConfirmando(false)}
                />
            )}
        </>
    );
}