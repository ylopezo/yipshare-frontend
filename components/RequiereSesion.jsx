"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtenerPerfil } from "@/lib/sesion";
import { Cargando } from "./Cargando";

// Igual que el middleware requiereSesion del servidor, pero en el front:
// 401 "no sé quién eres" → al login. 403 "sé quién eres, pero no puedes" → aviso.
// shortcut: solo protege la vista; la seguridad real es el 401/403 de cada ruta del backend.
export function RequiereSesion({ rol, children }) {
    const router = useRouter();
    const [estado, setEstado] = useState("cargando");

    useEffect(() => {
        obtenerPerfil().then(({ status, datos }) => {
            if (status !== 200) return router.replace("/login");
            const rolUsuario = datos.usuario?.rol;
            setEstado(rol && rolUsuario !== rol ? "prohibido" : "permitido");
        });
    }, [rol, router]);

    if (estado === "prohibido") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#e9eef3] px-4 text-center font-sans">
                <h1 className="m-0 text-3xl font-black text-[#1e4a73]">403</h1>
                <p className="m-0 text-lg">Sabemos quién eres, pero no tienes permiso para ver esta página.</p>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="cursor-pointer rounded-lg bg-[#1e4a73] px-4 py-2 font-bold text-white"
                >
                    Regresar
                </button>
            </div>
        );
    }

    // Siempre se renderiza children (Next necesita el segmento para la navegación instantánea); queda oculto hasta confirmar la sesión
    return (
        <>
            {estado === "cargando" && <Cargando />}
            <div hidden={estado !== "permitido"} className="contents">
                {children}
            </div>
        </>
    );
}
