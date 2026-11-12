import { useEffect, useState } from "react";
import { apiRequest } from "./session";

export const createCondominium = ({ name, address }) =>
    apiRequest("POST", "/api/condominiums", {
        name: name,
        street: address.street.trim(),
        neighborhood: address.neighborhood.trim(),
        postalCode: address.postalCode.trim(),
        municipality: address.municipality.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
    });

export const toCondominium = (c) => ({
    id: c.condominiumId,
    name: c.name,
    address: `${c.street}, ${c.neighborhood}, ${c.municipality}, ${c.city}, ${c.state}, C.P. ${c.postalCode}`,
    unitCount: c.unitCount,
    admin: c.adminUsername,
    applicant: c.adminUsername,
    status: c.digitalState,
});

export const getCondominiums = async () => {
    const { status, data } = await apiRequest("GET", "/api/condominiums");
    return { status, condominiums: status === 200 ? data.map(toCondominium) : [] };
};

export const approveCondominium = (id) => apiRequest("POST", `/api/condominiums/${id}/approve`);

export const deleteCondominium = (id) => apiRequest("DELETE", `/api/condominiums/${id}`);

export const rejectCondominium = (id) => apiRequest("POST", `/api/condominiums/${id}/reject`);

export const joinCondominium = ({ code, building, apartment }) =>
    apiRequest("POST", "/api/condominiums/join", { code: code, unit: `${building}, ${apartment}` });

const toCard = (c) => ({ id: c.condominiumId, name: c.name, admin: c.adminUsername });

export const getMyCondominiums = async () => {
    const { status, data } = await apiRequest("GET", "/api/condominiums/mine");
    if (status !== 200) return { registered: [], joined: [] };
    return { registered: data.registered.map(toCard), joined: data.joined.map(toCard) };
};

// { cargando, condominio }; condominio es null si no existe o no tienes acceso
export function useCondominium(id) {
    const [result, setResult] = useState({ loading: true, condominium: null });

    useEffect(() => {
        let isCurrent = true;
        apiRequest("GET", `/api/condominiums/${id}`).then(({ status, data }) => {
            if (isCurrent) setResult({ loading: false, condominium: status === 200 ? toCondominium(data) : null });
        });
        return () => {
            isCurrent = false;
        };
    }, [id]);

    return result;
}
