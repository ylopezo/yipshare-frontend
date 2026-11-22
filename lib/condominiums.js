import { useEffect, useState } from "react";
import { apiRequest, apiRequestFormData, fileUrl } from "./session";

const DOCUMENT_FIELDS = {
    deed: "deed",
    minutes: "minutes",
    rfc: "taxId",
    idDocument: "identification",
};

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

    console.log(formData);

    return apiRequestFormData("POST", "/api/condominiums", formData);
};

export const toCondominium = (c) => ({
    id: c.condominiumId,
    name: c.name,
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

export const deleteCondominium = (id) => apiRequest("DELETE", `/api/condominiums/${id}`);

export const rejectCondominium = (id) => apiRequest("POST", `/api/condominiums/${id}/reject`);

export const joinCondominium = ({ code, building, apartment }) =>
    apiRequest("POST", "/api/condominiums/join", {
        code: code,
        unit: `${building}, ${apartment}`,
    });

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
