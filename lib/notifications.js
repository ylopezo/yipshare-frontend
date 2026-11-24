import { apiRequest } from "./session";

export const APPROVED = "condominium_approved";
export const REJECTED = "condominium_rejected";

const getAllNotifications = async () => {
    const { status, data } = await apiRequest("GET", "/api/notifications/me");
    if (status !== 200) return [];
    return data.map((n) => ({
        id: n.id,
        title: n.header,
        message: n.body,
        type: n.action?.type,
        code: n.action?.shortCode,
        condominiumId: n.action?.condominiumId,
        loanId: n.action?.loanId,
        isRead: n.read,
    }));
};

export const getNotifications = async () =>
    (await getAllNotifications()).filter((n) => [APPROVED, REJECTED].includes(n.type));

export const getCondominiumNotifications = async (condominiumId, loanIds) =>
    (await getAllNotifications()).filter(
        (n) => (n.condominiumId === condominiumId && ![APPROVED, REJECTED].includes(n.type)) || loanIds.includes(n.loanId)
    );

export const countUnread = async () => (await getNotifications()).filter((n) => !n.isRead).length;

export const markAsRead = (list) =>
    Promise.all(
        list
            .filter((n) => !n.isRead)
            .map((n) => apiRequest("POST", `/api/notifications/me/${n.id}/read`))
    );
