"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { LogoSessionMenu } from "@/components/LogoSessionMenu";
import { APPROVED, markAsRead, getNotifications } from "@/lib/notifications";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        getNotifications().then((list) => {
            setNotifications(list);
            if (list.some((n) => !n.isRead)) markAsRead();
        });
    }, []);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul px-4 text-white md:px-6">
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
                    <p className="m-0 text-sm text-slate-500">No tienes notificaciones.</p>
                ) : (
                    <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0">
                        {notifications.map((n) => {
                            const accepted = n.type === APPROVED;
                            return (
                                <li
                                    key={n.id}
                                    className={`rounded-xl bg-white px-5 py-4 shadow-sm ${n.isRead ? "" : "border-l-4 border-azul-claro"}`}
                                >
                                    {!n.isRead && (
                                        <span className="mr-2 rounded-full bg-azul-claro px-2 py-0.5 text-[10px] font-bold text-white">
                                            Nueva
                                        </span>
                                    )}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            accepted ? "bg-verde-suave text-green-900" : "bg-rojo-suave text-red-900"
                                        }`}
                                    >
                                        {accepted ? "Aceptado" : "Rechazado"}
                                    </span>

                                    <p className="m-0 mt-2 font-bold text-azul-texto">{n.title}</p>
                                    <p className="m-0 mt-1 text-sm text-slate-600">{n.message}</p>

                                    {n.code && (
                                        <p className="m-0 mt-3 text-sm text-slate-600">
                                            Código para unirse:{" "}
                                            <span className="rounded-lg bg-azul-suave px-3 py-1 font-mono text-lg font-bold tracking-widest text-azul select-all">
                                                {n.code}
                                            </span>
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
}
