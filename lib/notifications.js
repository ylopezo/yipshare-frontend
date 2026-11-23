import { apiRequest } from "./session";

export const APPROVED = "condominium_approved";
export const REJECTED = "condominium_rejected";

export const getNotifications = async () => {
    const { status, data } = await apiRequest("GET", "/api/notifications/me");
    if (status !== 200) return [];
    return data
        .filter((n) => [APPROVED, REJECTED].includes(n.action?.type))
        .map((n) => ({
            id: n.id,
            title: n.header,
            message: n.body,
            type: n.action.type,
            code: n.action.shortCode,
            isRead: n.read,
        }));
};

export const countUnread = async () => (await getNotifications()).filter((n) => !n.isRead).length;

export const markAsRead = (list) =>
    Promise.all(
        list
            .filter((n) => !n.isRead)
            .map((n) => apiRequest("POST", `/api/notifications/me/${n.id}/read`))
    );