"use client";

import Link from "next/link";
import { useState } from "react";
import { APPROVED, REJECTED } from "@/lib/notifications";

const UNITS = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
];
const rtf = new Intl.RelativeTimeFormat("es", { style: "short" });
const rtfDays = new Intl.RelativeTimeFormat("es", { numeric: "auto", style: "short" });

function relativeTime(date) {
    const seconds = (new Date(date) - Date.now()) / 1000;
    const unit = UNITS.find(([, unitSeconds]) => Math.abs(seconds) >= unitSeconds);
    if (!unit) return "ahora";
    return (unit[0] === "day" ? rtfDays : rtf).format(Math.round(seconds / unit[1]), unit[0]);
}

function withBoldNames(text) {
    return text.split(/«(.+?)»/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

async function copyText(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const field = document.createElement("textarea");
    field.value = text;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
}

const SMALL_BUTTON =
    "cursor-pointer rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100";

function InviteCode({ code }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        await copyText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-sm font-bold tracking-widest text-black select-all">
                {code}
            </code>
            <button type="button" onClick={copy} className={SMALL_BUTTON}>
                {copied ? "Copiado ✓" : "Copiar"}
            </button>
            <span aria-live="polite" className="sr-only">
                {copied ? "Código copiado" : ""}
            </span>
        </div>
    );
}

function Content({ notification }) {
    const name = notification.body.match(/«(.+?)»/)?.[1];

    if (notification.type === APPROVED && name) {
        return (
            <>
                <p className="m-0 text-sm text-black">
                    Tu condominio <strong>{name}</strong> fue aceptado. Comparte este código con tus vecinos:
                </p>
                {notification.code && <InviteCode code={notification.code} />}
            </>
        );
    }

    if (notification.type === REJECTED && name) {
        return (
            <>
                <p className="m-0 text-sm text-black">
                    No pudimos aprobar <strong>{name}</strong>. Revisa tus documentos e inténtalo de nuevo.
                </p>
                <Link
                    href="/habitante_yipshare/principal_page#crear"
                    className="mt-1 inline-block text-sm font-semibold text-azul hover:underline"
                >
                    Enviar otra solicitud
                </Link>
            </>
        );
    }

    return (
        <>
            <p className="m-0 text-sm text-black">{withBoldNames(notification.body)}</p>
            {notification.code && <InviteCode code={notification.code} />}
        </>
    );
}

export function NotificationList({ notifications }) {
    return (
        <ul className="m-0 max-w-2xl list-none divide-y divide-neutral-200 overflow-hidden rounded-lg bg-white p-0">
            {notifications.map((notification) => (
                <li key={notification.id} className={`flex gap-3 px-4 py-3 ${notification.read ? "" : "bg-azul-suave/40"}`}>
                    <div className="min-w-0 flex-1 break-words">
                        <Content notification={notification} />
                        {notification.createdAt && (
                            <time dateTime={notification.createdAt} className="mt-1 block text-xs text-neutral-500">
                                {relativeTime(notification.createdAt)}
                            </time>
                        )}
                    </div>

                    {!notification.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-azul-claro">
                            <span className="sr-only">Sin leer</span>
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}
