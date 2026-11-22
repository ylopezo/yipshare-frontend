"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { approveCondominium, deleteCondominium, getCondominiums, rejectCondominium } from "@/lib/condominiums";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [all, setAll] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getCondominiums().then(({ condominiums }) => setAll(condominiums));
    }, []);

    const drop = (id) => setAll((prev) => prev.filter((c) => c.id !== id));

    const remove = async (id) => {
        const { status } = await deleteCondominium(id);
        if (status !== 204) return alert("No se pudo completar la acción. Intenta de nuevo.");
        drop(id);
    };

    const value = {
        condominiums: all.filter((c) => c.status === "approved"),
        requests: all.filter((c) => c.status === "pending"),
        searchQuery,
        setSearchQuery,

        editCondominium: (updated) => setAll((prev) => prev.map((c) => (c.id === updated.id ? updated : c))),

        deleteCondominium: remove,

        acceptRequest: async (request) => {
            const { status } = await approveCondominium(request.id);
            if (status !== 200) return alert("No se pudo aceptar la solicitud. Intenta de nuevo.");
            setAll((prev) => prev.map((c) => (c.id === request.id ? { ...c, status: "approved" } : c)));
        },

        denyRequest: async (id) => {
            const { status } = await rejectCondominium(id);
            if (status !== 204) return alert("No se pudo denegar la solicitud. Intenta de nuevo.");
            drop(id);
        },
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin debe usarse dentro de <AdminProvider>");
    return ctx;
}
