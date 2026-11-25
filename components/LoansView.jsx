"use client";

import { useEffect, useState } from "react";
import { CODE_SECONDS } from "@/lib/loans";
import { getUserReports } from "@/lib/reports";
import { RateModal } from "./RateModal";
import { REPORT_STATUSES } from "./ReportsView";
import { LIGHT_BUTTON, DARK_BUTTON, Modal } from "./Modal";

export const LOAN_STATUS = {
    pending: { text: "Pendiente", cssClass: "text-amber-900" },
    accepted: { text: "Reservado", cssClass: "text-azul" },
    on_loan: { text: "En préstamo", cssClass: "text-green-900" },
    returned: { text: "Finalizado", cssClass: "text-neutral-700" },
    rejected: { text: "Rechazado", cssClass: "text-red-900" },
};

const withExpiry = (value) => value && { value, expiresAt: Date.now() + CODE_SECONDS * 1000 };

function ShowCodeModal({ phase, initialCode, onGenerate, onCancel }) {
    const [code, setCode] = useState(initialCode);
    const [now, setNow] = useState(() => Date.now());

    const generate = async () => {
        const next = withExpiry(await onGenerate());
        if (next) setCode(next);
        else onCancel();
    };

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const remaining = Math.max(0, Math.ceil((code.expiresAt - now) / 1000));

    return (
        <Modal label="Tu código" onClose={onCancel}>
            <div className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center">
                <h2 className="m-0 text-xl font-semibold">Tu código</h2>
                <p className="mb-0 mt-1 text-xs text-neutral-500">
                    Código de {phase}. Dáselo al vecino para que lo ingrese.
                </p>

                <p className="m-0 mt-5 font-mono text-3xl font-bold tracking-widest text-azul">{code.value}</p>
                {remaining > 0 && (
                    <p className="m-0 mt-1 text-xs text-neutral-500">
                        Vence en {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
                    </p>
                )}
                {remaining === 0 && (
                    <button
                        type="button"
                        onClick={generate}
                        className={`${DARK_BUTTON} mx-auto mt-3 block w-3/5 py-2 text-sm font-semibold`}
                    >
                        Generar otro
                    </button>
                )}

                <button
                    type="button"
                    onClick={onCancel}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}

function CodeModal({ phase, onConfirm, onCancel }) {
    const [written, setWritten] = useState("");
    const [error, setError] = useState(false);
    const [sending, setSending] = useState(false);

    return (
        <Modal label="Ingresar código" onClose={onCancel}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    setSending(true);
                    const ok = await onConfirm(written.trim());
                    setSending(false);
                    if (!ok) setError(true);
                }}
                className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center"
            >
                <h2 className="m-0 text-xl font-semibold">Ingresar código</h2>
                <p className="mb-0 mt-1 text-xs text-neutral-500">Código de {phase} que te dio el dueño</p>

                <input
                    aria-label="Código"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="off"
                    placeholder="Código"
                    value={written}
                    onChange={(e) => {
                        setWritten(e.target.value);
                        setError(false);
                    }}
                    className="mt-5 w-full rounded-[15px] border-[1.5px] border-borde bg-gris px-4 py-2 text-center text-lg tracking-widest text-neutral-700 outline-none"
                />
                {error && (
                    <p role="alert" className="mb-0 mt-2 text-sm text-black">
                        Código incorrecto o vencido.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={written.trim().length !== 6 || sending}
                    className={`${DARK_BUTTON} mx-auto mt-4 block w-3/5 py-2 text-sm font-semibold`}
                >
                    Confirmar
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}

export function LoansView({
                              loans,
                              user,
                              onRespond,
                              onGenerateCode,
                              onCode,
                              onRate,
                              ratings = [],
                          }) {
    const [popup, setPopup] = useState(null);
    const close = () => setPopup(null);
    const other = (loan) => (loan.owner === user ? loan.borrower : loan.owner);

    const action = (loan, role) => {
        if (loan.status === "pending" && role === "owner") {
            return {
                text: "Confirmar Petición",
                open: async () => setPopup({ type: "request", p: loan, reports: await getUserReports(loan.otherUserId) }),
            };
        }
        if (loan.status === "accepted" || loan.status === "on_loan") {
            return role === "owner"
                ? {
                    text: "Mostrar Código",
                    open: async () => {
                        const code = withExpiry(await onGenerateCode(loan));
                        if (code) setPopup({ type: "showCode", p: loan, code });
                    },
                }
                : { text: "Ingresar Código", open: () => setPopup({ type: "code", p: loan }) };
        }
        if (loan.status === "returned" && !ratings.some((rating) => rating.loanId === loan.id && rating.from === user)) {
            return {
                text: "Calificar",
                open: () => setPopup({ type: "rate", p: loan }),
            };
        }
        return null;
    };

    const card = (loan, role) => {
        const a = action(loan, role);
        return (
            <li key={loan.id} className="w-48 overflow-hidden rounded-lg bg-white">
                <div className="h-24 bg-gris-imagen">
                    {loan.image && <img src={loan.image} alt={loan.name} className="h-full w-full object-cover" />}
                </div>

                <div className="px-3 pb-3 pt-2">
                    <p className="m-0 break-words text-base font-bold text-azul">{loan.name}</p>
                    <p className="m-0 text-xs text-neutral-500">{role === "borrower" ? loan.owner : loan.borrower}</p>
                    {loan.status === "on_loan" && loan.end && (
                        <p className="m-0 mt-1 text-xs text-neutral-500">
                            Vence:{" "}
                            {new Date(loan.end).toLocaleString("es-MX", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span
                            className={`text-xs font-bold ${LOAN_STATUS[loan.status].cssClass}`}
                        >
                            {LOAN_STATUS[loan.status].text}
                        </span>
                        {a && (
                            <button
                                type="button"
                                onClick={a.open}
                                className={`${DARK_BUTTON} px-3 py-1 text-xs font-semibold`}
                            >
                                {a.text}
                            </button>
                        )}
                    </div>
                </div>
            </li>
        );
    };

    const column = (title, list, role) => (
        <section>
            <h3 className="m-0 text-sm font-bold text-neutral-700">{title}</h3>
            {list.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-neutral-500">No hay préstamos.</p>
            ) : (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-4 p-0">{list.map((loan) => card(loan, role))}</ul>
            )}
        </section>
    );

    return (
        <>
            <h2 className="m-0 text-base font-bold">Mis Préstamos</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-2">
                {column(
                    "Como Prestatario",
                    loans.filter((loan) => loan.borrower === user),
                    "borrower",
                )}
                {column(
                    "Como Dueño",
                    loans.filter((loan) => loan.owner === user),
                    "owner",
                )}
            </div>

            {popup?.type === "request" && (
                <Modal label="Confirmar petición" onClose={close}>
                    <div className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center">
                        <h2 className="m-0 text-xl font-semibold">Confirmar petición</h2>
                        <p className="mb-0 mt-3 text-sm text-neutral-600">
                            {popup.p.borrower} quiere pedir «{popup.p.name}» por {popup.p.duration}.
                        </p>

                        {(() => {
                            const reportsAgainst = popup.reports;
                            return reportsAgainst.length === 0 ? (
                                <p className="mb-0 mt-3 text-xs text-neutral-500">Este vecino no tiene reportes.</p>
                            ) : (
                                <details className="mt-3 text-left">
                                    <summary className="cursor-pointer text-center text-xs font-bold text-azul">
                                        Ver reportes del vecino ({reportsAgainst.length})
                                    </summary>
                                    <ul className="m-0 mt-2 flex max-h-48 list-none flex-col gap-2 overflow-y-auto p-0">
                                        {reportsAgainst.map((report) => {
                                            const info = REPORT_STATUSES.find((e) => e.value === report.status);
                                            return (
                                                <li key={report.id} className="rounded-xl border border-neutral-300 px-3 py-2">
                                                    <span
                                                        className={`text-xs font-bold ${info.cssClass}`}
                                                    >
                                                        {info.text}
                                                    </span>
                                                    <p className="mb-0 mt-1 break-words text-xs text-neutral-600">
                                                        {report.details}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </details>
                            );
                        })()}

                        <button
                            type="button"
                            onClick={() => {
                                onRespond(popup.p, true);
                                close();
                            }}
                            className={`${DARK_BUTTON} mx-auto mt-6 block w-3/5 py-2 text-sm font-semibold`}
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onRespond(popup.p, false);
                                close();
                            }}
                            className={`${LIGHT_BUTTON} mx-auto mt-3 block w-3/5 py-2 text-sm font-semibold`}
                        >
                            Denegar
                        </button>
                        <button
                            type="button"
                            onClick={close}
                            className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
            )}

            {popup?.type === "showCode" && (
                <ShowCodeModal
                    key={popup.p.id}
                    phase={popup.p.status === "accepted" ? "entrega" : "devolución"}
                    initialCode={popup.code}
                    onGenerate={() => onGenerateCode(popup.p)}
                    onCancel={close}
                />
            )}

            {popup?.type === "code" && (
                <CodeModal
                    key={popup.p.id}
                    phase={popup.p.status === "accepted" ? "entrega" : "devolución"}
                    onConfirm={async (code) => {
                        if (!(await onCode(popup.p, code))) return false;
                        setPopup(popup.p.status === "on_loan" ? { type: "rate", p: popup.p } : null);
                        return true;
                    }}
                    onCancel={close}
                />
            )}

            {popup?.type === "rate" && (
                <RateModal
                    neighbor={other(popup.p)}
                    onSend={(stars, comment) => {
                        onRate({
                            loanId: popup.p.id,
                            from: user,
                            to: other(popup.p),
                            stars,
                            comment,
                        });
                        close();
                    }}
                    onCancel={close}
                />
            )}
        </>
    );
}