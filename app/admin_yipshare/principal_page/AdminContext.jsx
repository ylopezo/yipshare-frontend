"use client";

import { createContext, useContext, useState } from "react";
import { CONDOMINIOS_INICIALES, SOLICITUDES_INICIALES } from "@/lib/datos";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [condominios, setCondominios] = useState(CONDOMINIOS_INICIALES);
    const [solicitudes, setSolicitudes] = useState(SOLICITUDES_INICIALES);
    const [busqueda, setBusqueda] = useState("");

    const value = {
        condominios,
        solicitudes,
        busqueda,
        setBusqueda,

        editarCondominio: (actualizado) =>
            setCondominios((prev) => prev.map((c) => (c.id === actualizado.id ? actualizado : c))),

        eliminarCondominio: (id) => setCondominios((prev) => prev.filter((c) => c.id !== id)),

        aceptarSolicitud: (solicitud) => {
            setCondominios((prev) => [
                ...prev,
                {
                    id: crypto.getRandomValues(new Uint32Array(1))[0], // ID numérico aleatorio y robusto
                    nombre: solicitud.nombre,
                    direccion: solicitud.direccion,
                    cantidad: solicitud.cantidad,
                    admin: solicitud.aspirante,
                },
            ]);
            setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id));
        },

        denegarSolicitud: (id) => setSolicitudes((prev) => prev.filter((s) => s.id !== id)),
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin debe usarse dentro de <AdminProvider>");
    return ctx;
}
