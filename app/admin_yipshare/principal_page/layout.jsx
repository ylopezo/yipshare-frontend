"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ConfirmDialog } from "@/components/Modal";
import { ProfileModal } from "@/components/ProfileModal";
import { RequireSession } from "@/components/RequireSession";
import { signOut } from "@/lib/session";
import { AdminProvider, useAdmin } from "./AdminContext";

const BASE = "/admin_yipshare/principal_page";
const MENU = [
    { href: `${BASE}/condominios`, label: "Condominios", icon: "house" },
    { href: `${BASE}/solicitudes`, label: "Solicitudes", icon: "bell" },
];

function AdminShell({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { searchQuery, setSearchQuery } = useAdmin();
    const [profileOpen, setProfileOpen] = useState(false);
    const [signOutOpen, setSignOutOpen] = useState(false);
    const inRequests = pathname.startsWith(`${BASE}/solicitudes`);
    const searchPlaceholder = inRequests ? "Buscar solicitud..." : "Buscar condominio...";

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul px-4 text-white md:px-6">
                <Image
                    src="/img/logo_yipshare_icono.png"
                    alt="YipShare"
                    width={190}
                    height={56}
                    priority
                    className="h-14 w-auto object-contain"
                />

                <div className="ml-2 min-w-0 md:ml-14">
                    <h1 className="m-0 truncate text-2xl font-bold md:text-3xl">Hola, Administrador</h1>
                    <p className="m-0 truncate text-sm font-semibold text-celeste">Administrador Global</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`${BASE}/solicitudes`}
                            aria-label="Notificaciones"
                            onClick={() => setSearchQuery("")}
                            className="cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"
                        >
                            <Icon name="bell" size={28} />
                        </Link>

                        <button
                            type="button"
                            aria-label="Perfil"
                            aria-haspopup="dialog"
                            onClick={() => setProfileOpen(true)}
                            className="cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"
                        >
                            <Icon name="user" size={30} />
                        </button>
                    </div>

                    <div className="relative hidden sm:block">
                        <label htmlFor="search" className="sr-only">
                            {searchPlaceholder}
                        </label>
                        <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white outline-none transition lg:w-80"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
                            <Icon name="search" size={18} />
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-16 shrink-0 flex-col bg-azul pt-8 md:w-56">
                    <nav className="space-y-3 px-1 md:px-3">
                        {MENU.map(({ href, label, icon }) => {
                            const active = pathname.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSearchQuery("")}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide transition ${active ? "text-white" : "text-white/40 hover:text-white/80"}`}
                                >
                                    <Icon name={icon} size={26} />
                                    <span className="hidden md:inline">{label}</span>
                                </Link>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => setSignOutOpen(true)}
                            className="mt-4 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-white/40 transition hover:text-white/80"
                        >
                            <Icon name="logout" size={26} />
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>
                    </nav>
                </aside>

                <main className="flex min-w-0 flex-1 flex-col px-4 pb-6 pt-6 md:px-10">{children}</main>
            </div>

            {profileOpen && <ProfileModal onCloseAction={() => setProfileOpen(false)} />}

            {signOutOpen && (
                <ConfirmDialog
                    title="¿Estás seguro?"
                    message="Se cerrará tu sesión de administrador."
                    onConfirmAction={async () => {
                        setSignOutOpen(false);
                        await signOut();
                        router.replace("/login");
                    }}
                    onCancelAction={() => setSignOutOpen(false)}
                />
            )}
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <RequireSession role="global_admin">
            <AdminProvider>
                <AdminShell>{children}</AdminShell>
            </AdminProvider>
        </RequireSession>
    );
}
