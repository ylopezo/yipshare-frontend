"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { LogoSessionMenu } from "@/components/LogoSessionMenu";
import { NotificationList } from "@/components/NotificationList";
import { markAsRead, getNotifications } from "@/lib/notifications";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        getNotifications().then((list) => {
            setNotifications(list);
            markAsRead(list);
        });
    }, []);

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul border-b border-white/20 px-4 text-white md:px-6">
                <LogoSessionMenu />

                <h1 className="m-0 ml-2 min-w-0 truncate text-2xl font-bold md:ml-14 md:text-3xl">Notificaciones</h1>

                <Link
                    href="/habitante_yipshare/principal_page"
                    aria-label="Volver a mis condominios"
                    className="ml-auto rounded-full p-1 text-white transition hover:bg-white/10"
                >
                    <Icon name="arrow" size={28} />
                </Link>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                {notifications === null ? null : notifications.length === 0 ? (
                    <p className="m-0 text-sm text-neutral-500">No tienes notificaciones.</p>
                ) : (
                    <NotificationList notifications={notifications} />
                )}
            </main>
        </div>
    );
}
