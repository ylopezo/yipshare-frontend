"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CondominiumCard } from "@/components/CondominiumCard";
import { CreateCondominiumModal } from "@/components/CreateCondominiumModal";
import { Icon } from "@/components/Icon";
import { useUser } from "@/components/RequireSession";
import { LogoSessionMenu } from "@/components/LogoSessionMenu";
import { ConfirmDialog } from "@/components/Modal";
import { JoinCondominiumModal } from "@/components/JoinCondominiumModal";
import { createCondominium, getMyCondominiums, joinCondominium } from "@/lib/condominiums";
import { countUnread } from "@/lib/notifications";
import { ResidentProfileModal } from "@/components/ResidentProfileModal";
import { fetchProfile } from "@/lib/session";

const JOIN_ERRORS = {
    404: "No existe un condominio aprobado con ese código.",
    409: {
        "Already a member": "Ya eres miembro de ese condominio.",
        "Request already pending":
            "Ya enviaste una solicitud a ese condominio; espera a que el administrador la revise.",
    },
};

function Section({ title, empty, children }) {
    return (
        <section className="mb-8">
            <h2 className="m-0 text-base font-bold">{title}</h2>
            {empty ? (
                <p className="mt-4 text-sm text-slate-500">Sin condominios por ahora.</p>
            ) : (
                <div className="mt-4 flex flex-wrap gap-4">{children}</div>
            )}
        </section>
    );
}

export default function ResidentHomePage() {
    const user = useUser();
    const [registered, setRegistered] = useState([]);
    const [joined, setJoined] = useState([]);
    const [unread, setUnread] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        getMyCondominiums().then(({ registered, joined }) => {
            setRegistered(registered);
            setJoined(joined);
        });
        countUnread().then(setUnread);
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [notice, setNotice] = useState(null);
    const [profile, setProfile] = useState(false);
    const [profileData, setProfileData] = useState({});

    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onMouseDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen]);

    const text = searchQuery.trim().toLowerCase();
    const filterList = (list) => list.filter(({ name, admin }) => `${name} ${admin}`.toLowerCase().includes(text));

    const filteredRegistered = filterList(registered);
    const filteredJoined = filterList(joined);

    const noCondominiums = registered.length === 0 && joined.length === 0;

    const noResults = !noCondominiums && filteredRegistered.length === 0 && filteredJoined.length === 0;

    const [confirmation, setConfirmation] = useState(null);

    const openModal = (type) => {
        setMenuOpen(false);
        setModal(type);
    };

    const handleJoin = async (data) => {
        setModal(null);
        const { status, data: response } = await joinCondominium(data);
        if (status === 201) {
            setNotice("Tu solicitud fue enviada. El administrador del condominio te aceptará.");
            return;
        }
        const error = status === 409 ? JOIN_ERRORS[409][response.message] : JOIN_ERRORS[status];
        setNotice(error || response.error || "No se pudo enviar la solicitud. Intenta de nuevo.");
    };

    const handleCreate = async (data) => {
        setModal(null);
        const { status, data: response } = await createCondominium(data);
        setNotice(
            status === 201
                ? "Tu solicitud fue enviada. El condominio aparecerá cuando sea aprobada."
                : response.error || "No se pudo enviar la solicitud. Intenta de nuevo.",
        );
    };

    const primaryButton =
        "w-56 cursor-pointer rounded-lg bg-oscuro py-2 text-xs font-semibold text-white transition hover:bg-oscuro-hover";

    const ITEM =
        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide [&>svg]:shrink-0";

    const itemClass = (active) =>
        `${ITEM} cursor-pointer ${active ? "text-white" : "text-white/40 hover:text-white/80"}`;

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul px-4 text-white md:px-6">
                <LogoSessionMenu />

                <h1 className="m-0 ml-2 min-w-0 truncate text-2xl font-bold md:ml-14 md:text-3xl">
                    Hola, {user?.name}
                </h1>

                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <div ref={menuRef} className="relative">
                            <button
                                type="button"
                                aria-label="Unirse o crear condominio"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((isOpen) => !isOpen)}
                                className="cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"
                            >
                                <Icon name="plus" size={28} />
                            </button>

                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded bg-white text-left shadow-lg"
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => openModal("join")}
                                        className="block w-full cursor-pointer border-b border-slate-300 px-3 py-2 text-left text-sm font-bold text-azul-texto hover:bg-slate-100"
                                    >
                                        Unirse a Condominio
                                    </button>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => openModal("create")}
                                        className="block w-full cursor-pointer px-3 py-2 text-left text-sm font-bold text-azul-texto hover:bg-slate-100"
                                    >
                                        Crear Condominio
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/habitante_yipshare/notificaciones"
                            aria-label={unread > 0 ? `Notificaciones, ${unread} sin leer` : "Notificaciones"}
                            className="relative cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"
                        >
                            <Icon name="bell" size={28} />
                            {unread > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-azul"
                                >
                                    {unread > 9 ? "9+" : unread}
                                </span>
                            )}
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
                            Buscar condominio
                        </label>

                        <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar condominio..."
                            className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white placeholder:text-white/70 outline-none transition focus:bg-white/20 lg:w-80"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
                            <Icon name="search" size={18} />
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-azul px-1 pt-8 md:w-56 md:px-3">
                    <button
                        type="button"
                        onClick={async () => {
                            const fresh = await fetchProfile();
                            setProfile(true);
                        }}
                        className={itemClass(false)}
                    >
                        <Icon name="user" size={26} />
                        <span className="hidden md:inline">Perfil</span>
                    </button>

                    <button type="button" onClick={() => setLeaving(true)} className={itemClass(false)}>
                        <Icon name="logout" size={26} />
                        <span className="hidden md:inline">Cerrar sesión</span>
                    </button>
                </aside>

                <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {notice && (
                        <div
                            role="status"
                            className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-celeste bg-azul-suave px-4 py-2 text-sm text-azul"
                        >
                            <span>{notice}</span>

                            <button
                                type="button"
                                aria-label="Cerrar aviso"
                                onClick={() => setNotice(null)}
                                className="cursor-pointer rounded-full p-1 hover:bg-white/60"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}

                    {noCondominiums ? (
                        <>
                            <h2 className="m-0 text-base font-bold">Condominios Registrados</h2>

                            <h2 className="m-0 mt-6 text-base font-bold">Condominios Unidos</h2>

                            <div className="mt-12 flex flex-col items-center gap-3">
                                <p className="m-0 text-xs font-bold text-celeste">No hay condominios disponibles</p>

                                <button type="button" onClick={() => setModal("create")} className={primaryButton}>
                                    Crear Condominio
                                </button>

                                <button type="button" onClick={() => setModal("join")} className={primaryButton}>
                                    Unirse a Condominio
                                </button>
                            </div>
                        </>
                    ) : noResults ? (
                        <p className="py-10 text-center text-sm text-slate-500">No se encontraron condominios.</p>
                    ) : (
                        <>
                            <Section title="Condominios Registrados" empty={filteredRegistered.length === 0}>
                                {filteredRegistered.map((condominium) => (
                                    <CondominiumCard key={condominium.id} condominium={condominium} role="admin" />
                                ))}
                            </Section>

                            <Section title="Condominios Unidos" empty={filteredJoined.length === 0}>
                                {filteredJoined.map((condominium) => (
                                    <CondominiumCard key={condominium.id} condominium={condominium} role="resident" />
                                ))}
                            </Section>
                        </>
                    )}
                </main>
            </div>

            {modal === "join" && (
                <JoinCondominiumModal
                    onJoinAction={(data) =>
                        setConfirmation({
                            title: "¿Enviar solicitud?",
                            message: `Se enviará tu solicitud para unirte al condominio con código ${data.code} como habitante de ${data.building}, ${data.apartment}.`,
                            run: () => handleJoin(data),
                        })
                    }
                    onCancelAction={() => setModal(null)}
                />
            )}

            {modal === "create" && (
                <CreateCondominiumModal
                    onCreateAction={(data) =>
                        setConfirmation({
                            title: "¿Enviar solicitud?",
                            message: `Se enviará la solicitud para registrar «${data.name}». Revisa que los datos y documentos sean correctos.`,
                            run: () => handleCreate(data),
                        })
                    }
                    onCancelAction={() => setModal(null)}
                />
            )}

            {confirmation && (
                <ConfirmDialog
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirmAction={() => {
                        confirmation.run();
                        setConfirmation(null);
                    }}
                    onCancelAction={() => setConfirmation(null)}
                />
            )}

            {leaving && (
                <ConfirmDialog
                    title="¿Estás seguro?"
                    message="Se cerrará tu sesión."
                    onConfirmAction={async () => {
                        await signOut();
                        router.replace("/login");
                    }}
                    onCancelAction={() => setLeaving(false)}
                />
            )}

            {profile && (
                <ResidentProfileModal
                    profile={{ ...profileData, rating: 0 }}
                    received={{}}
                    onUpdateAction={(data) => {
                        setProfileData({ ...profileData, ...data });
                        setProfile(false);
                    }}
                    onDeleteAction={() => {
                        router.replace("/login");
                    }}
                    onCloseAction={() => setProfile(false)}
                />
            )}
        </div>
    );
}
