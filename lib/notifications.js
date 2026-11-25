import { apiRequest } from "./session";

export const APPROVED = "condominium_approved";
export const REJECTED = "condominium_rejected";

const getAllNotifications = async () => {
    const { status, data } = await apiRequest("GET", "/api/notifications/me");
    if (status !== 200) return [];
    return data.map((notification) => ({
        id: notification.id,
        header: notification.header,
        body: notification.body,
        type: notification.action?.type,
        code: notification.action?.shortCode,
        condominiumId: notification.action?.condominiumId,
        loanId: notification.action?.loanId,
        read: notification.read,
        createdAt: notification.createdAt,
    }));
};

export const getNotifications = async () =>
    (await getAllNotifications()).filter((notification) => [APPROVED, REJECTED].includes(notification.type));

export const getCondominiumNotifications = async (condominiumId, loanIds) =>
    (await getAllNotifications()).filter(
        (notification) => (notification.condominiumId === condominiumId && ![APPROVED, REJECTED].includes(notification.type)) || loanIds.includes(notification.loanId)
    );

export const countUnread = async () => (await getNotifications()).filter((notification) => !notification.read).length;

export const markAsRead = (list) =>
    Promise.all(
        list
            .filter((notification) => !notification.read)
            .map((notification) => apiRequest("POST", `/api/notifications/me/${notification.id}/read`))
    );
