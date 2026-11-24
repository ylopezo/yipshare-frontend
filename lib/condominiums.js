import { useEffect, useState } from "react";
import { apiRequest, apiRequestFormData, fileUrl } from "./session";

export const createCondominium = async ({ name, address, unitCount, documents }) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("street", address.street.trim());
    formData.append("neighborhood", address.neighborhood.trim());
    formData.append("postalCode", address.postalCode.trim());
    formData.append("municipality", address.municipality.trim());
    formData.append("city", address.city.trim());
    formData.append("state", address.state.trim());
    formData.append("units", Number(unitCount));

    const documentKeys = ["ecrpcDocument", "aanaDocument", "ownerIneDocument", "condominiumRfcDocument"];

    for (const key of documentKeys) {
        const file = documents?.[key];
        if (file) {
            formData.append(key, file);
        }
    }

    return apiRequestFormData("POST", "/api/condominiums", formData);
};

const ADDRESS_FIELDS = ["street", "neighborhood", "postalCode", "municipality", "city", "state"];

export const toCondominium = (c) => ({
    id: c.condominiumId,
    name: c.name,
    fields: Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, c[k] ?? ""])),
    address: `${c.street}, ${c.neighborhood}, ${c.municipality}, ${c.city}, ${c.state}, C.P. ${c.postalCode}`,
    unitCount: c.unitCount,
    admin: c.adminUsername,
    applicant: c.adminUsername,
    status: c.digitalState,
    code: c.code,
});

export const getCondominiums = async () => {
    const { status, data } = await apiRequest("GET", "/api/condominiums");
    return {
        status,
        condominiums: status === 200 ? data.map(toCondominium) : [],
    };
};

export const getCondominiumDocuments = async (id) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${id}/documents`);
    return status === 200 ? data : null;
};

export const documentUrl = (documentId) => fileUrl(`/api/uploads/docs/${documentId}`);

export const approveCondominium = (id) => apiRequest("POST", `/api/condominiums/${id}/approve`);

export const updateCondominium = (id, { name, fields }) =>
    apiRequest("PATCH", `/api/condominiums/${id}`, { name, ...fields });

export const deleteCondominium = (id) => apiRequest("DELETE", `/api/condominiums/${id}`);

export const rejectCondominium = (id) => apiRequest("POST", `/api/condominiums/${id}/reject`);

export const joinCondominium = ({ code, unit }) => apiRequest("POST", "/api/condominiums/join", { code, unit });

const toCard = (c) => ({
    id: c.condominiumId,
    name: c.name,
    admin: c.adminUsername,
});

export const getMyCondominiums = async () => {
    const { status, data } = await apiRequest("GET", "/api/condominiums/mine");
    if (status !== 200) return { registered: [], joined: [] };
    return {
        registered: data.registered.map(toCard),
        joined: data.joined.map(toCard),
    };
};

export function useCondominium(id) {
    const [result, setResult] = useState({ loading: true, condominium: null });

    useEffect(() => {
        let isCurrent = true;
        apiRequest("GET", `/api/condominiums/${id}`).then(({ status, data }) => {
            if (isCurrent)
                setResult({
                    loading: false,
                    condominium: status === 200 ? toCondominium(data) : null,
                });
        });
        return () => {
            isCurrent = false;
        };
    }, [id]);

    return result;
}

export const getMembers = async (id) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${id}/members`);
    if (status !== 200) return [];
    return data.map((m) => ({
        id: m.userId,
        name: `${m.name} ${m.paternalSurname}`,
        user: m.username,
        unit: m.unitName,
        upToDate: m.canRequestLoans,
        isAdmin: m.isAdmin,
    }));
};

export const getPendingMembers = async (id) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${id}/members/pending`);
    if (status !== 200) return [];
    return data.map((m) => ({
        id: m.userId,
        name: [m.name, m.paternalSurname, m.maternalSurname].filter(Boolean).join(" "),
        user: m.username,
        unit: m.unit,
        suggestedUnitId: m.suggestedUnitId,
    }));
};

export const getUnits = async (id) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${id}/units`);
    if (status !== 200) return [];
    return data
        .map((u) => ({ id: u.condominiumUnitId, name: u.name }))
        .sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));
};

export const getMyUnit = async (id) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${id}/members/me`);
    return status === 200 ? data.unitName : null;
};

export const approveMember = (id, applicant, unitId) =>
    apiRequest("POST", `/api/condominiums/${id}/members/${applicant.id}/approve`, { unitId });

export const rejectMember = (id, userId) => apiRequest("DELETE", `/api/condominiums/${id}/members/${userId}/reject`);

export const setLoanAccess = (id, userId, allowed) =>
    apiRequest("PUT", `/api/condominiums/${id}/members/${userId}/loan-access`, { allowed });

export const removeMember = (id, userId) => apiRequest("DELETE", `/api/condominiums/${id}/members/${userId}`);