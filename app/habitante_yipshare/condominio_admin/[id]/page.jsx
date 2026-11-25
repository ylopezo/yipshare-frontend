"use client";

import Image from "next/image";
import { signOut } from "@/lib/session";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { ArticleModal } from "@/components/ArticleModal";
import { ArticleDetail, ArticleCard } from "@/components/ArticleView";
import { CondominiumNotifications } from "@/components/CondominiumNotifications";
import { Icon } from "@/components/Icon";
import { useUser } from "@/components/RequireSession";
import { ConfirmDialog } from "@/components/Modal";
import { ResidentProfileModal } from "@/components/ResidentProfileModal";
import { LoansView } from "@/components/LoansView";
import { ReportsView } from "@/components/ReportsView";
import { RequestsView } from "@/components/RequestsView";
import { AllLoansView } from "@/components/AllLoansView";
import { NeighborsView } from "@/components/NeighborsView";
import {
    approveMember,
    getMembers,
    getMyUnit,
    getPendingMembers,
    getUnits,
    rejectMember,
    removeMember,
    setLoanAccess,
    useCondominium,
} from "@/lib/condominiums";
import { average } from "@/lib/loans";
import { changeReportStatus as saveReportStatus, getCondominiumReports } from "@/lib/reports";
import {
    confirmCode,
    deleteArticle as removeArticle,
    deleteMyAccount,
    generateCode,
    getCondominiumLoans,
    getMyProfile,
    rateLoan,
    requestLoan as sendLoanRequest,
    respondLoan,
    runAction,
    saveArticle,
    updateMyProfile,
    useCondominiumData,
} from "@/lib/articles";
import { showError } from "@/lib/errors";
import { matchesSearch } from "@/lib/data";

const SECTIONS = [
    { id: "home", label: "Inicio", icon: "house" },
    { id: "requests", label: "Solicitudes", icon: "bell" },
    { id: "loans", label: "Préstamos", icon: "calendar" },
    { id: "all", label: "Todos los préstamos", icon: "file" },
    { id: "reports", label: "Reportes", icon: "alert" },
];

const ITEM =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium [&>svg]:shrink-0";
const HEADER_ICON = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

export default function CondominiumAdminPage() {
    const user = useUser();
    const { id } = useParams();
    const router = useRouter();

    const me = user?.username;
    const { articles, loans, ratings, refresh: refreshMine } = useCondominiumData(id, me);
    const [allLoans, setAllLoans] = useState([]);
    const [neighbors, setNeighbors] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [units, setUnits] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        getCondominiumReports(id).then(({ reports }) => setReports(reports));
        getCondominiumLoans(id).then(setAllLoans);
        getMembers(id).then(setNeighbors);
        getPendingMembers(id).then(setApplicants);
        getUnits(id).then(setUnits);
    }, [id]);

    const refreshMembers = () =>
        Promise.all([getMembers(id).then(setNeighbors), getPendingMembers(id).then(setApplicants)]);

    const refresh = () => Promise.all([refreshMine(), getCondominiumLoans(id).then(setAllLoans)]);
    const received = ratings.filter((rating) => rating.to === me);
    const myRating = average(received);

    const [section, setSection] = useUrlState("seccion", "home");
    const [previous, setPrevious] = useUrlState("anterior", "home");
    const openedNotificationsHere = useRef(false);
    const [tab, setTab] = useUrlState("pestana", "articles");
    const [searchQuery, setSearchQuery] = useState("");
    const [profile, setProfile] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [modal, setModal] = useState(null);
    const [detailId, setDetailId] = useUrlState("articulo", null);
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
        if (section === "notifications") return;
        setPrevious(section);
        setSection("notifications");
        setDetailId(null);
        openedNotificationsHere.current = true;
    }

    function closeNotifications() {
        if (openedNotificationsHere.current) history.back();
        else setSection(previous);
    }

    function changeTab(nextTab) {
        setTab(nextTab);
        setSearchQuery("");
        setDetailId(null);
    }

    async function save(data) {
        if (await runAction(saveArticle(id, modal === "new" ? null : modal.id, data), refresh)) setModal(null);
    }

    async function deleteArticle(article) {
        if (await runAction(removeArticle(id, article.id), refresh)) setDetailId(null);
    }

    async function requestLoan(article, duration) {
        if (!(await runAction(sendLoanRequest(article.id, duration), refresh))) return;
        setDetailId(null);
        setSection("loans");
    }

    const respond = (loan, accept) => runAction(respondLoan(loan.id, accept), refresh);

    async function registerCode(loan, code) {
        const { status } = await confirmCode(loan.id, code);
        await refresh();
        return status === 200;
    }

    const rate = (rating) => runAction(rateLoan({ loanId: rating.loanId, stars: rating.stars, comment: rating.comment }), refresh);

    const togglePermission = (neighbor) => runAction(setLoanAccess(id, neighbor.id, !neighbor.upToDate), refreshMembers);

    const kickOut = (neighbor) => runAction(removeMember(id, neighbor.id), refreshMembers);

    async function respondApplicant(applicant, accept, unitId) {
        if (accept) {
            await runAction(approveMember(id, applicant, unitId), refreshMembers);
        } else {
            await runAction(rejectMember(id, applicant.id), refreshMembers);
        }
    }

    async function openProfile() {
        const fresh = await getMyProfile();

        if (!fresh) {
            return showError("No se pudo cargar tu perfil.");
        }

        const unit = await getMyUnit(id);

        setProfileData({ ...fresh, unit: unit });
        setProfile(true);
    }

    async function changeReportStatus(targetReportId, status) {
        const { status: httpStatus } = await saveReportStatus(id, targetReportId, status);
        if (httpStatus !== 200) return showError("No se pudo cambiar el estado del reporte.");
        setReports((prev) => prev.map((report) => (report.id === targetReportId ? { ...report, status } : report)));
    }

    function handleConfirm() {
        if (confirm?.type === "delete") deleteArticle(confirm.article);
        if (confirm?.type === "kickOut") kickOut(confirm.neighbor);
        setConfirm(null);
    }


    const detail = articles.find((article) => article.id === detailId);
    const visibleItems = articles.filter((article) => matchesSearch(searchQuery, article.name));
    const mine = visibleItems.filter((article) => article.owner === me);
    const fromOthers = visibleItems.filter((article) => article.owner !== me);

    const visibleNeighbors = neighbors.filter((neighbor) => matchesSearch(searchQuery, neighbor.name, neighbor.user));

    const inProgress = (articleId) => allLoans.some((loan) => loan.articleId === articleId && loan.status === "on_loan");

    const itemClass = (active) =>
        `${ITEM} cursor-pointer ${active ? "text-white" : "text-white/40 hover:text-white/80"}`;

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul border-b border-white/20 px-4 text-white md:px-6">
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
                    <p className="m-0 truncate text-sm font-semibold text-white">{condominium.name}</p>
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

                        <button type="button" aria-label="Perfil" onClick={openProfile} className={HEADER_ICON}>
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
                                className="w-72 rounded-md border border-white/30 bg-transparent py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 lg:w-80"
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

                        <button type="button" onClick={openProfile} className={itemClass(false)}>
                            <Icon name="user" size={26} />
                            <span className="hidden md:inline">Perfil</span>
                        </button>

                        <button type="button" onClick={() => setLeaving(true)} className={itemClass(false)}>
                            <Icon name="logout" size={26} />
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>

                        {condominium.code && (
                            <div className="hidden rounded-lg bg-white/10 px-3 py-2 text-white md:block">
                                <p className="m-0 text-xs">Código para unirse</p>
                                <p className="m-0 select-all text-lg font-bold tracking-widest">{condominium.code}</p>
                            </div>
                        )}
                    </aside>
                )}

                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {section === "notifications" ? (
                        <CondominiumNotifications
                            condominiumId={id}
                            loanIds={loans.map((loan) => loan.id)}
                            onBack={closeNotifications}
                        />
                    ) : section === "requests" ? (
                        <RequestsView applicants={applicants} units={units} onRespond={respondApplicant} />
                    ) : section === "loans" ? (
                        <LoansView
                            loans={loans}
                            user={me}
                            onRespond={respond}
                            onGenerateCode={(loan) => generateCode(loan.id)}
                            onCode={registerCode}
                            ratings={ratings}
                            onRate={rate}
                        />
                    ) : section === "all" ? (
                        <AllLoansView loans={allLoans} me={me} />
                    ) : section === "reports" ? (
                        <ReportsView reports={reports} onChangeStatus={changeReportStatus} />
                    ) : detail ? (
                        <ArticleDetail
                            key={detail.id}
                            article={detail}
                            onBack={() => setDetailId(null)}
                            onRequest={
                                detail.owner !== me ? (duration) => requestLoan(detail, duration) : undefined
                            }
                            onDelete={() => setConfirm({ type: "delete", article: detail })}
                            deleteBlocked={inProgress(detail.id)}
                        />
                    ) : (
                        <>
                            <div className="flex justify-center gap-6">
                                {["articles", "neighbors"].map((tabName) => (
                                    <button
                                        key={tabName}
                                        type="button"
                                        aria-pressed={tab === tabName}
                                        onClick={() => changeTab(tabName)}
                                        className={`w-32 cursor-pointer rounded-lg border px-4 py-1.5 text-sm font-bold transition ${
                                            tab === tabName
                                                ? "border-azul bg-azul text-white"
                                                : "border-neutral-400 bg-[#d3d6da] text-neutral-500 hover:bg-[#c5c9ce]"
                                        }`}
                                    >
                                        {tabName === "articles" ? "Artículos" : "Vecinos"}
                                    </button>
                                ))}
                            </div>

                            {tab === "neighbors" ? (
                                <div className="mt-6">
                                    <NeighborsView
                                        neighbors={visibleNeighbors}
                                        onPermission={togglePermission}
                                        onKickOut={(neighbor) => setConfirm({ type: "kickOut", neighbor })}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="m-0 mt-4 text-base font-bold">Mis Artículos</h2>

                                    {mine.length === 0 && (
                                        <p className="mb-0 mt-3 text-sm text-neutral-500">Aún no publicas artículos.</p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        {mine.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                                onView={() => setDetailId(article.id)}
                                                onEdit={() => setModal(article)}
                                            />
                                        ))}

                                        <button
                                            type="button"
                                            aria-label="Agregar artículo"
                                            onClick={() => setModal("new")}
                                            className="ml-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-azul text-white hover:bg-azul-claro"
                                        >
                                            <Icon name="plus" size={26} />
                                        </button>
                                    </div>

                                    <h2 className="m-0 mt-10 text-base font-bold">Artículos Disponibles</h2>

                                    {fromOthers.length === 0 && (
                                        <p className="mb-0 mt-3 text-sm text-neutral-500">Tus vecinos todavía no publican artículos.</p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-4">
                                        {fromOthers.map((article) => (
                                            <ArticleCard key={article.id} article={article} onView={() => setDetailId(article.id)} />
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
                    onUpdate={async (data) => {
                        if (await runAction(updateMyProfile(data))) {
                            setProfileData({ ...profileData, ...data });
                            setProfile(false);
                        }
                    }}
                    onDelete={async () => {
                        if (await runAction(deleteMyAccount())) {
                            await signOut();
                            router.replace("/login");
                        }
                    }}
                    onClose={() => setProfile(false)}
                />
            )}

            {modal && (
                <ArticleModal
                    key={modal === "new" ? "new" : modal.id}
                    article={modal === "new" ? null : modal}
                    onSave={save}
                    onCancel={() => setModal(null)}
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
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}

            {leaving && (
                <ConfirmDialog
                    title="¿Estás seguro?"
                    message="Se cerrará tu sesión."
                    onConfirm={async () => {
                        await signOut();
                        router.replace("/login");
                    }}
                    onCancel={() => setLeaving(false)}
                />
            )}
        </div>
    );
}