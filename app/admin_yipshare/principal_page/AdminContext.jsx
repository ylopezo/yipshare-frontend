"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    approveCondominium,
    deleteCondominium,
    getCondominiums,
    rejectCondominium,
    toCondominium,
    updateCondominium,
} from "@/lib/condominiums";
import { showError } from "@/lib/errors";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [all, setAll] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getCondominiums().then(({ condominiums }) => setAll(condominiums));
    }, []);

    const drop = (id) => setAll((prev) => prev.filter((condominium) => condominium.id !== id));

    const remove = async (id) => {
        const { status } = await deleteCondominium(id);
        if (status !== 204) return showError("No se pudo completar la acción. Intenta de nuevo.");
        drop(id);
    };

    const value = {
        condominiums: all.filter((condominium) => condominium.status === "approved"),
        requests: all.filter((condominium) => condominium.status === "pending"),
        searchQuery,
        setSearchQuery,

        editCondominium: async (updated) => {
            const { status, data } = await updateCondominium(updated.id, updated);
            if (status !== 200) return showError(data?.error ?? "No se pudieron guardar los cambios. Intenta de nuevo.");
            setAll((prev) =>
                prev.map((condominium) =>
                    condominium.id === updated.id ? toCondominium({ ...data, adminUsername: condominium.admin, unitCount: condominium.unitCount }) : condominium,
                ),
            );
        },

        deleteCondominium: remove,

        acceptRequest: async (request) => {
            const { status } = await approveCondominium(request.id);
            if (status !== 200) return showError("No se pudo aceptar la solicitud. Intenta de nuevo.");
            setAll((prev) => prev.map((condominium) => (condominium.id === request.id ? { ...condominium, status: "approved" } : condominium)));
        },

        denyRequest: async (id) => {
            const { status } = await rejectCondominium(id);
            if (status !== 204) return showError("No se pudo denegar la solicitud. Intenta de nuevo.");
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
