"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { getCondominiumNotifications, markAsRead } from "@/lib/notifications";

export function CondominiumNotifications({ condominiumId, loanIds, onBackAction }) {
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        getCondominiumNotifications(condominiumId, loanIds).then((list) => {
            setNotifications(list);
            markAsRead(list);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [condominiumId]);

    return (
        <>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Volver"
                    onClick={onBackAction}
                    className="cursor-pointer rounded-full p-1 text-black transition hover:bg-white"
                >
                    <Icon name="arrow" size={24} />
                </button>
                <h2 className="m-0 text-base font-bold">Notificaciones</h2>
            </div>

            {notifications === null ? null : notifications.length === 0 ? (
                <p className="mt-24 text-center text-xl font-bold text-celeste">
                    No tienes notificaciones por el momento
                </p>
            ) : (
                <ul className="m-0 mt-4 flex max-w-2xl list-none flex-col gap-3 p-0">
                    {notifications.map((n) => (
                        <li
                            key={n.id}
                            className={`rounded-xl bg-white px-5 py-4 ${n.isRead ? "" : "border-l-4 border-azul-claro"}`}
                        >
                            {!n.isRead && (
                                <span className="rounded-full bg-azul-claro px-2 py-0.5 text-xs font-bold text-white">
                                    Nueva
                                </span>
                            )}
                            <p className="m-0 mt-2 font-bold text-azul-texto">{n.title}</p>
                            <p className="m-0 mt-1 text-sm text-slate-600">{n.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
