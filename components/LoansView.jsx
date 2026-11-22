"use client";

import { useEffect, useState } from "react";
import { CODE_SECONDS } from "@/lib/loans";
import { RateModal } from "./RateModal";
import { REPORT_STATUSES } from "./ReportsView";
import { LIGHT_BUTTON, DARK_BUTTON, Modal } from "./Modal";

export const LOAN_STATUS = {
    pending: {
        text: "Pendiente de conformación",
        cssClass: "bg-amarillo-suave text-amber-900",
    },
    accepted: { text: "Reservado", cssClass: "bg-azul-suave text-azul" },
    in_progress: { text: "En préstamo", cssClass: "bg-verde-suave text-green-900" },
    finished: { text: "Finalizado", cssClass: "bg-slate-200 text-slate-700" },
    rejected: { text: "Rechazado", cssClass: "bg-azul text-white" },
};

const withExpiry = (value) => value && { value, expiresAt: Date.now() + CODE_SECONDS * 1000 };

function ShowCodeModal({ phase, initialCode, onGenerateAction, onCancelAction }) {
    const [code, setCode] = useState(initialCode);
    const [now, setNow] = useState(() => Date.now());

    const generate = async () => {
        const next = withExpiry(await onGenerateAction());
        if (next) setCode(next);
        else onCancelAction();
    };

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const remaining = Math.max(0, Math.ceil((code.expiresAt - now) / 1000));

    return (
        <Modal label="Tu código" onCloseAction={onCancelAction}>
            <div className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl">
                <h2 className="m-0 text-xl font-extrabold uppercase">Tu código</h2>
                <p className="mb-0 mt-1 text-xs text-slate-500">
                    Código de {phase}. Dáselo al vecino para que lo ingrese.
                </p>

                <p className="m-0 mt-5 font-mono text-3xl font-bold tracking-widest text-azul">{code.value}</p>
                {remaining > 0 && (
                    <p className="m-0 mt-1 text-xs text-slate-500">
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
                    onClick={onCancelAction}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}

function CodeModal({ phase, onConfirmAction, onCancelAction }) {
    const [written, setWritten] = useState("");
    const [error, setError] = useState(false);
    const [sending, setSending] = useState(false);

    return (
        <Modal label="Ingresar código" onCloseAction={onCancelAction}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    setSending(true);
                    const ok = await onConfirmAction(written.trim());
                    setSending(false);
                    if (!ok) setError(true);
                }}
                className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl"
            >
                <h2 className="m-0 text-xl font-extrabold uppercase">Ingresar código</h2>
                <p className="mb-0 mt-1 text-xs text-slate-500">Código de {phase} que te dio el dueño</p>

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
                    className="mt-5 w-full rounded-xl border border-slate-600 bg-gris px-4 py-2 text-center text-lg tracking-widest text-slate-700 outline-none focus:border-azul"
                />
                {error && (
                    <p role="alert" className="mb-0 mt-2 text-sm text-azul">
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
                    onClick={onCancelAction}
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
    onRespondAction,
    onGenerateCodeAction,
    onCodeAction,
    onRateAction,
    reports,
    ratings = [],
}) {
    const [popup, setPopup] = useState(null);
    const close = () => setPopup(null);
    const other = (p) => (p.owner === user ? p.borrower : p.owner);

    const action = (p, role) => {
        if (p.status === "pending" && role === "owner") {
            return {
                text: "Confirmar Petición",
                open: () => setPopup({ type: "request", p }),
            };
        }
        if (p.status === "accepted" || p.status === "in_progress") {
            return role === "owner"
                ? {
                      text: "Mostrar Código",
                      open: async () => {
                          const code = withExpiry(await onGenerateCodeAction(p));
                          if (code) setPopup({ type: "showCode", p, code });
                      },
                  }
                : { text: "Ingresar Código", open: () => setPopup({ type: "code", p }) };
        }
        if (p.status === "finished" && !ratings.some((c) => c.loanId === p.id && c.from === user)) {
            return {
                text: "Calificar",
                open: () => setPopup({ type: "rate", p }),
            };
        }
        return null;
    };

    const card = (p, role) => {
        const a = action(p, role);
        return (
            <li key={p.id} className="w-48 overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="h-24 bg-gris-imagen">
                    {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
                </div>

                <div className="px-3 pb-3 pt-2">
                    <p className="m-0 break-words text-base font-bold text-azul">{p.name}</p>
                    <p className="m-0 text-xs text-slate-500">{role === "borrower" ? p.owner : p.borrower}</p>
                    {p.status === "in_progress" && p.end && (
                        <p className="m-0 mt-1 text-xs text-slate-500">
                            Vence:{" "}
                            {new Date(p.end).toLocaleString("es-MX", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${LOAN_STATUS[p.status].cssClass}`}
                        >
                            {LOAN_STATUS[p.status].text}
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
            <h3 className="m-0 text-sm font-bold text-slate-700">{title}</h3>
            {list.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-slate-500">No hay préstamos.</p>
            ) : (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-4 p-0">{list.map((p) => card(p, role))}</ul>
            )}
        </section>
    );

    return (
        <>
            <h2 className="m-0 text-base font-bold">Mis Préstamos</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-2">
                {column(
                    "Como Prestatario",
                    loans.filter((p) => p.borrower === user),
                    "borrower",
                )}
                {column(
                    "Como Dueño",
                    loans.filter((p) => p.owner === user),
                    "owner",
                )}
            </div>

            {popup?.type === "request" && (
                <Modal label="Confirmar petición" onCloseAction={close}>
                    <div className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl">
                        <h2 className="m-0 text-xl font-extrabold uppercase">Confirmar petición</h2>
                        <p className="mb-0 mt-3 text-sm text-slate-600">
                            {popup.p.borrower} quiere pedir «{popup.p.name}» por {popup.p.duration}.
                        </p>

                        {(() => {
                            const reportsAgainst = reports.filter((r) => r.involved === popup.p.borrower);
                            return reportsAgainst.length === 0 ? (
                                <p className="mb-0 mt-3 text-xs text-slate-500">Este vecino no tiene reportes.</p>
                            ) : (
                                <details className="mt-3 text-left">
                                    <summary className="cursor-pointer text-center text-xs font-bold text-azul">
                                        Ver reportes del vecino ({reportsAgainst.length})
                                    </summary>
                                    <ul className="m-0 mt-2 flex max-h-48 list-none flex-col gap-2 overflow-y-auto p-0">
                                        {reportsAgainst.map((r) => {
                                            const info = REPORT_STATUSES.find((e) => e.value === r.status);
                                            return (
                                                <li key={r.id} className="rounded-xl border border-slate-300 px-3 py-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${info.cssClass}`}
                                                    >
                                                        {info.text}
                                                    </span>
                                                    <p className="mb-0 mt-1 break-words text-xs text-slate-600">
                                                        {r.details}
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
                                onRespondAction(popup.p, true);
                                close();
                            }}
                            className={`${DARK_BUTTON} mx-auto mt-6 block w-3/5 py-2 text-sm font-semibold`}
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onRespondAction(popup.p, false);
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
                    onGenerateAction={() => onGenerateCodeAction(popup.p)}
                    onCancelAction={close}
                />
            )}

            {popup?.type === "code" && (
                <CodeModal
                    key={popup.p.id}
                    phase={popup.p.status === "accepted" ? "entrega" : "devolución"}
                    onConfirmAction={async (code) => {
                        if (!(await onCodeAction(popup.p, code))) return false;
                        setPopup(popup.p.status === "in_progress" ? { type: "rate", p: popup.p } : null);
                        return true;
                    }}
                    onCancelAction={close}
                />
            )}

            {popup?.type === "rate" && (
                <RateModal
                    neighbor={other(popup.p)}
                    onSubmitAction={(stars, comment) => {
                        onRateAction({
                            loanId: popup.p.id,
                            from: user,
                            to: other(popup.p),
                            stars,
                            comment,
                        });
                        close();
                    }}
                    onCancelAction={close}
                />
            )}
        </>
    );
}
