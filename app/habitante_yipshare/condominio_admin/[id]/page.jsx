"use client";

import Image from "next/image";
import { signOut } from "@/lib/session";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleModal } from "@/components/ArticleModal";
import { ArticleDetail, ArticleCard } from "@/components/ArticleView";
import { Icon } from "@/components/Icon";
import { useUser } from "@/components/RequireSession";
import { ConfirmDialog } from "@/components/Modal";
import { ResidentProfileModal } from "@/components/ResidentProfileModal";
import { LoansView } from "@/components/LoansView";
import { ReportsView } from "@/components/ReportsView";
import { RequestsView } from "@/components/RequestsView";
import { AllLoansView } from "@/components/AllLoansView";
import { NeighborsView } from "@/components/NeighborsView";
import { useCondominium } from "@/lib/condominiums";
import { advance, average } from "@/lib/loans";
import { changeReportStatus as saveReportStatus, getCondominiumReports } from "@/lib/reports";
import {
    ME,
    SAMPLE_PROFILE,
    SAMPLE_NEIGHBORS,
    SAMPLE_APPLICANTS,
    SAMPLE_ARTICLES,
    SAMPLE_LOANS,
    SAMPLE_PEOPLE,
    SAMPLE_RATINGS,
} from "@/lib/sampleData";

const SECTIONS = [
    { id: "home", label: "Inicio", icon: "house" },
    { id: "requests", label: "Solicitudes", icon: "bell" },
    { id: "loans", label: "Préstamos", icon: "calendar" },
    { id: "all", label: "Todos los préstamos", icon: "file" },
    { id: "reports", label: "Reportes", icon: "alert" },
];

const ITEM =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide [&>svg]:shrink-0";
const HEADER_ICON = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

export default function CondominiumAdminPage() {
    const user = useUser();
    const { id } = useParams();
    const router = useRouter();

    const [articles, setArticles] = useState(SAMPLE_ARTICLES);
    const [loans, setLoans] = useState(SAMPLE_LOANS);
    const [neighbors, setNeighbors] = useState(SAMPLE_NEIGHBORS);
    const [applicants, setApplicants] = useState(SAMPLE_APPLICANTS);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        getCondominiumReports(id).then(({ reports }) => setReports(reports));
    }, [id]);
    const [ratings, setRatings] = useState(SAMPLE_RATINGS);
    const received = ratings.filter((c) => c.to === ME);
    const myRating = average(received);

    const [section, setSection] = useState("home");
    const [previous, setPrevious] = useState("home");
    const [tab, setTab] = useState("articles");
    const [searchQuery, setSearchQuery] = useState("");
    const [profile, setProfile] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [profileData, setProfileData] = useState(SAMPLE_PROFILE);
    const [modal, setModal] = useState(null);
    const [detailId, setDetailId] = useState(null);
    const [confirm, setConfirm] = useState(null);

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

    function goTo(destination) {
        setSection(destination);
        setDetailId(null);
        setSearchQuery("");
    }

    function openNotifications() {
        setPrevious(section);
        setSection("notifications");
        setDetailId(null);
    }

    function changeTab(p) {
        setTab(p);
        setSearchQuery("");
        setDetailId(null);
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

    function changeArticleStatus(targetArticleId, status) {
        setArticles((prev) => prev.map((a) => (a.id === targetArticleId ? { ...a, status } : a)));
    }

    function deleteArticle(a) {
        setArticles((prev) => prev.filter((x) => x.id !== a.id));
        setLoans((prev) =>
            prev.filter((p) => !(p.articleId === a.id && (p.status === "pending" || p.status === "accepted"))),
        );
        setDetailId(null);
    }

    function requestLoan(a, duration) {
        const newItem = {
            id: crypto.getRandomValues(new Uint32Array(1))[0],
            articleId: a.id,
            name: a.name,
            image: a.image,
            owner: a.owner,
            borrower: ME,
            duration,
            status: "pending",
            end: null,
        };

        setLoans((prev) => [...prev, newItem]);
        changeArticleStatus(a.id, "pending");
    }

    function respond(p, accept) {
        const status = accept ? "accepted" : "rejected";

        setLoans((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
        if (!accept) changeArticleStatus(p.articleId, "available");
    }

    function registerCode(p) {
        const updated = advance(p, Date.now());

        setLoans((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
        if (updated.status === "in_progress") changeArticleStatus(p.articleId, "unavailable");
        if (updated.status === "finished") changeArticleStatus(p.articleId, "available");
    }

    function rate(c) {
        setRatings((prev) => [...prev, c]);
    }

    function togglePermission(v) {
        setNeighbors((prev) => prev.map((x) => (x.id === v.id ? { ...x, upToDate: !x.upToDate } : x)));
    }

    function kickOut(v) {
        const removed = loans.filter(
            (p) => (p.owner === v.user || p.borrower === v.user) && (p.status === "pending" || p.status === "accepted"),
        );
        const removedIds = new Set(removed.map((p) => p.id));
        const releasedArticles = new Set(removed.map((p) => p.articleId));

        setLoans((prev) => prev.filter((p) => !removedIds.has(p.id)));
        setArticles((prev) =>
            prev
                .filter((a) => a.owner !== v.user)
                .map((a) => (releasedArticles.has(a.id) ? { ...a, status: "available" } : a)),
        );
        setNeighbors((prev) => prev.filter((x) => x.id !== v.id));
    }

    function respondApplicant(a, accept) {
        setApplicants((prev) => prev.filter((x) => x.id !== a.id));
        if (accept) {
            setNeighbors((prev) => [
                ...prev,
                {
                    id: a.id,
                    name: a.name,
                    user: a.user,
                    unit: a.unit,
                    upToDate: true,
                },
            ]);
        }
    }

    async function changeReportStatus(targetReportId, status) {
        const { status: httpStatus } = await saveReportStatus(id, targetReportId, status);
        if (httpStatus !== 200) return alert("No se pudo cambiar el estado del reporte.");
        setReports((prev) => prev.map((r) => (r.id === targetReportId ? { ...r, status } : r)));
    }

    function handleConfirm() {
        if (confirm?.type === "delete") deleteArticle(confirm.article);
        if (confirm?.type === "kickOut") kickOut(confirm.neighbor);
        setConfirm(null);
    }

    const text = searchQuery.trim().toLowerCase();

    const detail = articles.find((a) => a.id === detailId);
    const visibleItems = articles.filter((a) => a.name.toLowerCase().includes(text));
    const mine = visibleItems.filter((a) => a.owner === ME);
    const fromOthers = visibleItems.filter((a) => a.owner !== ME);

    const visibleNeighbors = neighbors.filter((v) => `${v.name} ${v.user}`.toLowerCase().includes(text));

    const inProgress = (articleId) => loans.some((p) => p.articleId === articleId && p.status === "in_progress");

    const itemClass = (active) =>
        `${ITEM} cursor-pointer ${active ? "text-white" : "text-white/40 hover:text-white/80"}`;

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-fondo font-sans text-black">
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

                        <button
                            type="button"
                            aria-label="Notificaciones"
                            onClick={openNotifications}
                            className={HEADER_ICON}
                        >
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

                    {section === "home" && !detail && (
                        <div className="relative hidden sm:block">
                            <input
                                aria-label={tab === "articles" ? "Buscar artículo" : "Buscar vecino"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={tab === "articles" ? "Buscar artículo..." : "Buscar vecino..."}
                                className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:bg-white/20 lg:w-80"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <Icon name="search" size={18} />
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                {section !== "notifications" && (
                    <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-azul px-1 pt-8 md:w-56 md:px-3">
                        {SECTIONS.map(({ id, label, icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => goTo(id)}
                                aria-current={section === id ? "page" : undefined}
                                className={`${itemClass(section === id)} relative`}
                            >
                                <Icon name={icon} size={26} />
                                <span className="hidden md:inline">{label}</span>
                                {id === "requests" && applicants.length > 0 && (
                                    <span
                                        aria-label={`${applicants.length} solicitudes pendientes`}
                                        className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-azul md:right-3 md:top-3"
                                    >
                                        {applicants.length}
                                    </span>
                                )}
                            </button>
                        ))}

                        <button type="button" onClick={() => setProfile(true)} className={itemClass(false)}>
                            <Icon name="user" size={26} />
                            <span className="hidden md:inline">Perfil</span>
                        </button>

                        <button type="button" onClick={() => setLeaving(true)} className={itemClass(false)}>
                            <Icon name="logout" size={26} />
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>

                        {condominium.code && (
                            <div className="hidden rounded-xl bg-white/10 px-3 py-2 text-white md:block">
                                <p className="m-0 text-xs">Código para unirse</p>
                                <p className="m-0 select-all text-lg font-bold tracking-widest">{condominium.code}</p>
                            </div>
                        )}
                    </aside>
                )}

                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {section === "notifications" ? (
                        <>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    aria-label="Volver"
                                    onClick={() => setSection(previous)}
                                    className="cursor-pointer rounded-full p-1 text-black transition hover:bg-white"
                                >
                                    <Icon name="arrow" size={24} />
                                </button>
                                <h2 className="m-0 text-base font-bold">Notificaciones</h2>
                            </div>

                            <p className="mt-24 text-center text-xl font-bold text-celeste">
                                No tienes notificaciones por el momento
                            </p>
                        </>
                    ) : section === "requests" ? (
                        <RequestsView applicants={applicants} onRespondAction={respondApplicant} />
                    ) : section === "loans" ? (
                        <LoansView
                            loans={loans}
                            user={ME}
                            onRespondAction={respond}
                            onCodeAction={registerCode}
                            reports={reports}
                            ratings={ratings}
                            onRateAction={rate}
                        />
                    ) : section === "all" ? (
                        <AllLoansView
                            loans={loans}
                            people={SAMPLE_PEOPLE}
                            me={ME}
                            onRemindAction={(p) => {
                                setLoans((prev) => prev.map((x) => (x.id === p.id ? { ...x, reminded: true } : x)));
                            }}
                        />
                    ) : section === "reports" ? (
                        <ReportsView reports={reports} onChangeStatusAction={changeReportStatus} />
                    ) : detail ? (
                        <ArticleDetail
                            key={detail.id}
                            a={detail}
                            onBackAction={() => setDetailId(null)}
                            onRequestAction={
                                detail.owner !== ME ? (duration) => requestLoan(detail, duration) : undefined
                            }
                            onDeleteAction={() => setConfirm({ type: "delete", article: detail })}
                            deleteBlocked={inProgress(detail.id)}
                        />
                    ) : (
                        <>
                            <div className="flex justify-center gap-6">
                                {["articles", "neighbors"].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        aria-pressed={tab === p}
                                        onClick={() => changeTab(p)}
                                        className={`w-32 cursor-pointer rounded-xl border px-4 py-1.5 text-sm font-bold transition ${
                                            tab === p
                                                ? "border-azul bg-azul text-white"
                                                : "border-slate-400 bg-[#d3d6da] text-slate-500 hover:bg-[#c5c9ce]"
                                        }`}
                                    >
                                        {p === "articles" ? "Artículos" : "Vecinos"}
                                    </button>
                                ))}
                            </div>

                            {tab === "neighbors" ? (
                                <div className="mt-6">
                                    <NeighborsView
                                        neighbors={visibleNeighbors}
                                        onPermissionAction={togglePermission}
                                        onKickOutAction={(v) => setConfirm({ type: "kickOut", neighbor: v })}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="m-0 mt-4 text-base font-bold">Mis Artículos</h2>

                                    {mine.length === 0 && (
                                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>
                                    )}

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

            {confirm && (
                <ConfirmDialog
                    title={confirm.type === "delete" ? "¿Eliminar publicación?" : "¿Expulsar vecino?"}
                    message={
                        confirm.type === "delete"
                            ? `Se eliminará «${confirm.article.name}» de ${confirm.article.owner} y se cancelarán sus solicitudes pendientes.`
                            : `${confirm.neighbor.name} saldrá del condominio y se eliminarán sus artículos y préstamos pendientes.`
                    }
                    onConfirmAction={handleConfirm}
                    onCancelAction={() => setConfirm(null)}
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
