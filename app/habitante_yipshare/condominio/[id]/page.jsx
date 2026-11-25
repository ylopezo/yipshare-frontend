"use client";

import Image from "next/image";
import { signOut } from "@/lib/session";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { ArticleModal } from "@/components/ArticleModal";
import { ArticleDetail, ArticleCard } from "@/components/ArticleView";
import { CondominiumNotifications } from "@/components/CondominiumNotifications";
import { Icon } from "@/components/Icon";
import { useUser } from "@/components/RequireSession";
import { ConfirmDialog } from "@/components/Modal";
import { LoansView } from "@/components/LoansView";
import { ReportFormView } from "@/components/ReportFormView";
import { ResidentProfileModal } from "@/components/ResidentProfileModal";
import { average } from "@/lib/loans";
import { getMyUnit, useCondominium } from "@/lib/condominiums";
import { createReport } from "@/lib/reports";
import {
    confirmCode,
    deleteMyAccount,
    generateCode,
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

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium";
const HEADER_ICON = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

export default function CondominiumPage() {
    const user = useUser();
    const { id } = useParams();
    const router = useRouter();

    const me = user?.username;
    const { articles, loans, ratings, refresh } = useCondominiumData(id, me);
    const [searchQuery, setSearchQuery] = useState("");
    const [profile, setProfile] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [modal, setModal] = useState(null);
    const [detailId, setDetailId] = useUrlState("articulo", null);
    const [section, setSection] = useUrlState("seccion", "home");
    const [previous, setPrevious] = useUrlState("anterior", "home");
    const openedNotificationsHere = useRef(false);
    const received = ratings.filter((rating) => rating.to === me);
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

    async function openProfile() {
        const fresh = await getMyProfile();

        if (!fresh) {
            return showError("No se pudo cargar tu perfil.");
        }

        const unit = await getMyUnit(id);

        setProfileData({ ...fresh, unit: unit });
        setProfile(true);
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

    async function save(data) {
        if (await runAction(saveArticle(id, modal === "new" ? null : modal.id, data), refresh)) setModal(null);
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

    const report = (data) => runAction(createReport({ loanId: data.loanId, text: data.details, images: data.images }));

    const detail = articles.find((article) => article.id === detailId);

    const visibleItems = articles.filter((article) => matchesSearch(searchQuery, article.name));

    const mine = visibleItems.filter((article) => article.owner === me);
    const fromOthers = visibleItems.filter((article) => article.owner !== me);

    const sections = [
        { id: "home", label: "Inicio", icon: "house" },
        { id: "loans", label: "Préstamos", icon: "calendar" },
        { id: "reports", label: "Reportes", icon: "alert" },
    ];

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

                    <div className="relative hidden sm:block">
                        <input
                            aria-label="Buscar artículo"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDetailId(null);
                            }}
                            placeholder="Buscar artículo..."
                            className="w-72 rounded-md border border-white/30 bg-transparent py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 lg:w-80"
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
                        onClick={openProfile}
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
                    {section === "notifications" ? (
                        <CondominiumNotifications
                            condominiumId={id}
                            loanIds={loans.map((loan) => loan.id)}
                            onBack={closeNotifications}
                        />
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
                    ) : section === "reports" ? (
                        <ReportFormView loans={loans} user={me} onSend={report} />
                    ) : detail ? (
                        <ArticleDetail
                            key={detail.id}
                            article={detail}
                            onBack={() => setDetailId(null)}
                            onRequest={
                                detail.owner !== me ? (duration) => requestLoan(detail, duration) : undefined
                            }
                        />
                    ) : (
                        <>
                            <h2 className="m-0 text-base font-bold">Mis Artículos</h2>

                            {mine.length === 0 && <p className="mb-0 mt-3 text-sm text-neutral-500">Aún no publicas artículos.</p>}

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