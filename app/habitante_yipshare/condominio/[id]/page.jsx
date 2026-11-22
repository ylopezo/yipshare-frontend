"use client";

import Image from "next/image";
import { signOut } from "@/lib/session";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArticleModal } from "@/components/ArticleModal";
import { ArticleDetail, ArticleCard } from "@/components/ArticleView";
import { Icon } from "@/components/Icon";
import { useUser } from "@/components/RequireSession";
import { ConfirmDialog } from "@/components/Modal";
import { LoansView } from "@/components/LoansView";
import { ReportFormView } from "@/components/ReportFormView";
import { ResidentProfileModal } from "@/components/ResidentProfileModal";
import { advance, average } from "@/lib/loans";
import { useCondominium } from "@/lib/condominiums";

const ME = "mi_usuario";

const SAMPLE_PROFILE = {
    paternalSurname: "Pérez",
    maternalSurname: "López",
    givenNames: "Juan Carlos",
    building: "Edificio 2",
    apartment: "Departamento 14",
    dialCode: "MX",
    phone: "5512345678",
    rating: 4.2,
};

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide";
const HEADER_ICON = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

export default function CondominiumPage() {
    const user = useUser();
    const { id } = useParams();
    const router = useRouter();

    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [profile, setProfile] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [profileData, setProfileData] = useState(SAMPLE_PROFILE);
    const [modal, setModal] = useState(null);
    const [detailId, setDetailId] = useState(null);
    const [section, setSection] = useState("home");
    const [loans, setLoans] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [reports, setReports] = useState([]);
    const received = ratings.filter((c) => c.to === ME);
    const myRating = average(received);

    const { loading, condominium } = useCondominium(id);

    if (loading) return null;

    if (!condominium) {
        return (
            <main className="p-10">
                <p>No se encontró el condominio.</p>

                <Link href="/habitante_yipshare/principal_page" className="font-bold text-azul-claro hover:underline">
                    Volver
                </Link>
            </main>
        );
    }

    function save(data) {
        if (modal === "new") {
            const randomId = crypto.getRandomValues(new Uint32Array(1))[0];

            setArticles((prev) => [
                ...prev,
                {
                    ...data,
                    id: randomId,
                    owner: ME,
                    address: `${profileData.building}, ${profileData.apartment}`,
                    rating: myRating,
                },
            ]);
        } else if (modal) {
            const edited = modal.id;

            setArticles((prev) => prev.map((a) => (a.id === edited ? { ...a, ...data } : a)));
        }

        setModal(null);
    }

    function changeStatus(targetArticleId, status) {
        setArticles((prev) => prev.map((a) => (a.id === targetArticleId ? { ...a, status } : a)));
    }

    function requestLoan(a, duration) {
        const randomId = crypto.getRandomValues(new Uint32Array(1))[0];

        setLoans((prev) => [
            ...prev,
            {
                id: randomId,
                articleId: a.id,
                name: a.name,
                image: a.image,
                owner: a.owner,
                borrower: ME,
                duration,
                status: "pending",
                end: null,
            },
        ]);
        changeStatus(a.id, "pending");
        setDetailId(null);
        setSection("loans");
    }

    function respond(p, accept) {
        setLoans((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: accept ? "accepted" : "rejected" } : x)));
        if (!accept) changeStatus(p.articleId, "available");
    }

    function registerCode(p) {
        const newItem = advance(p, Date.now());

        setLoans((prev) => prev.map((x) => (x.id === p.id ? newItem : x)));
        changeStatus(p.articleId, newItem.status === "in_progress" ? "unavailable" : "available");
    }

    function report(data) {
        setReports((prev) => [
            ...prev,
            {
                id: crypto.getRandomValues(new Uint32Array(1))[0],
                involved: data.involved,
                reportedBy: ME,
                details: data.details,
                status: "pending",
            },
        ]);
    }

    const detail = articles.find((a) => a.id === detailId);

    const visibleItems = articles.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const mine = visibleItems.filter((a) => a.owner === ME);
    const fromOthers = visibleItems.filter((a) => a.owner !== ME);

    const sections = [
        { id: "home", label: "Inicio", icon: "house" },
        { id: "loans", label: "Préstamos", icon: "calendar" },
        { id: "reports", label: "Reportes", icon: "alert" },
    ];

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul px-4 text-white md:px-6">
                <Link href="/habitante_yipshare/principal_page" aria-label="Volver a mis condominios">
                    <Image
                        src="/img/logo_yipshare_icono.png"
                        alt="YipShare"
                        width={190}
                        height={56}
                        priority
                        className="h-14 w-auto object-contain"
                    />
                </Link>

                <div className="ml-2 min-w-0 md:ml-14">
                    <h1 className="m-0 truncate text-2xl font-bold md:text-3xl">Hola, {user?.name}</h1>

                    <p className="m-0 truncate text-sm font-semibold text-celeste">{condominium.name}</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Agregar artículo"
                            onClick={() => setModal("new")}
                            className={HEADER_ICON}
                        >
                            <Icon name="plus" size={28} />
                        </button>

                        <button type="button" aria-label="Notificaciones" className={HEADER_ICON}>
                            <Icon name="bell" size={28} />
                        </button>

                        <button
                            type="button"
                            aria-label="Perfil"
                            onClick={() => setProfile(true)}
                            className={HEADER_ICON}
                        >
                            <Icon name="user" size={30} />
                        </button>
                    </div>

                    <div className="relative hidden sm:block">
                        <input
                            aria-label="Buscar artículo"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDetailId(null);
                            }}
                            placeholder="Buscar artículo..."
                            className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:bg-white/20 lg:w-80"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <Icon name="search" size={18} />
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-azul px-1 pt-8 md:w-56 md:px-3">
                    {sections.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setSection(id);
                                setDetailId(null);
                            }}
                            aria-current={section === id ? "page" : undefined}
                            className={`${ITEM} cursor-pointer ${section === id ? "text-white" : "text-white/40 hover:text-white/80"}`}
                        >
                            <Icon name={icon} size={26} />
                            <span className="hidden md:inline">{label}</span>
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setProfile(true)}
                        className={`${ITEM} cursor-pointer text-white/40 hover:text-white/80`}
                    >
                        <Icon name="user" size={26} />
                        <span className="hidden md:inline">Perfil</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setLeaving(true)}
                        className={`${ITEM} cursor-pointer text-white/40 hover:text-white/80`}
                    >
                        <Icon name="logout" size={26} />
                        <span className="hidden md:inline">Cerrar sesión</span>
                    </button>
                </aside>

                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {section === "loans" ? (
                        <LoansView
                            loans={loans}
                            user={ME}
                            onRespondAction={respond}
                            onCodeAction={registerCode}
                            reports={reports}
                            ratings={ratings}
                            onRateAction={(c) => {
                                setRatings((prev) => [...prev, c]);
                            }}
                        />
                    ) : section === "reports" ? (
                        <ReportFormView loans={loans} user={ME} onSubmitAction={report} />
                    ) : detail ? (
                        <ArticleDetail
                            key={detail.id}
                            a={detail}
                            onBackAction={() => setDetailId(null)}
                            onRequestAction={
                                detail.owner !== ME ? (duration) => requestLoan(detail, duration) : undefined
                            }
                        />
                    ) : (
                        <>
                            <h2 className="m-0 text-base font-bold">Mis Artículos</h2>

                            {mine.length === 0 && <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>}

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                {mine.map((a) => (
                                    <ArticleCard
                                        key={a.id}
                                        a={a}
                                        onViewAction={() => setDetailId(a.id)}
                                        onEditAction={() => setModal(a)}
                                    />
                                ))}

                                <button
                                    type="button"
                                    aria-label="Agregar artículo"
                                    onClick={() => setModal("new")}
                                    className="ml-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-azul text-white shadow-md hover:bg-azul-claro"
                                >
                                    <Icon name="plus" size={26} />
                                </button>
                            </div>

                            <h2 className="m-0 mt-10 text-base font-bold">Artículos Disponibles</h2>

                            {fromOthers.length === 0 && (
                                <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-4">
                                {fromOthers.map((a) => (
                                    <ArticleCard key={a.id} a={a} onViewAction={() => setDetailId(a.id)} />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {profile && (
                <ResidentProfileModal
                    profile={{ ...profileData, rating: myRating }}
                    received={received}
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

            {modal && (
                <ArticleModal
                    key={modal === "new" ? "new" : modal.id}
                    article={modal === "new" ? null : modal}
                    onSaveAction={save}
                    onCancelAction={() => setModal(null)}
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
        </div>
    );
}
