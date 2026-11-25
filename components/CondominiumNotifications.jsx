"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { NotificationList } from "./NotificationList";
import { getCondominiumNotifications, markAsRead } from "@/lib/notifications";

export function CondominiumNotifications({ condominiumId, loanIds, onBack }) {
    const [notifications, setNotifications] = useState(null);
    const loanKey = loanIds.join(",");

    useEffect(() => {
        getCondominiumNotifications(condominiumId, loanKey.split(",")).then((list) => {
            setNotifications(list);
            markAsRead(list);
        });
    }, [condominiumId, loanKey]);

    return (
        <>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Volver"
                    onClick={onBack}
                    className="cursor-pointer rounded-full p-1 text-black transition hover:bg-white"
                >
                    <Icon name="arrow" size={24} />
                </button>
                <h2 className="m-0 text-base font-bold">Notificaciones</h2>
            </div>

            {notifications === null ? null : notifications.length === 0 ? (
                <p className="mb-0 mt-4 text-sm text-neutral-500">No tienes notificaciones.</p>
            ) : (
                <div className="mt-4">
                    <NotificationList notifications={notifications} />
                </div>
            )}
        </>
    );
}
