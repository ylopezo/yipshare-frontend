"use client";

import { createContext, useContext, useState } from "react";
import { CONDOMINIOS_INICIALES, SOLICITUDES_INICIALES, type Condominio, type Solicitud } from "@/lib/datos";

type AdminContextValue = {
    condominios: Condominio[];
    solicitudes: Solicitud[];
    busqueda: string;
    setBusqueda: (texto: string) => void;
    editarCondominio: (actualizado: Condominio) => void;
    eliminarCondominio: (id: number) => void;
    aceptarSolicitud: (solicitud: Solicitud) => void;
    denegarSolicitud: (id: number) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [condominios, setCondominios] = useState(CONDOMINIOS_INICIALES);
    const [solicitudes, setSolicitudes] = useState(SOLICITUDES_INICIALES);
    const [busqueda, setBusqueda] = useState("");
    const value: AdminContextValue = {
        condominios, solicitudes, busqueda, setBusqueda,
        editarCondominio: (actualizado) => setCondominios((prev) => prev.map((c) => c.id === actualizado.id ? actualizado : c)),
        eliminarCondominio: (id) => setCondominios((prev) => prev.filter((c) => c.id !== id)),
        aceptarSolicitud: (solicitud) => {
            setCondominios((prev) => [...prev, { id: Date.now(), nombre: solicitud.nombre, direccion: solicitud.direccion, cantidad: solicitud.cantidad, admin: solicitud.aspirante }]);
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
