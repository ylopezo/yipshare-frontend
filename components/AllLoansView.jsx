"use client";

import { useState } from "react";
import { LOAN_STATUS } from "./LoansView";
import { DAYS } from "@/lib/loans";
import { Icon } from "./Icon";
import { matchesSearch } from "@/lib/data";

const DAY_MS = 86_400_000;
const TD = "whitespace-nowrap px-3 py-2.5 align-middle";

const FILTER_ORDER = ["pending", "accepted", "on_loan", "overdue", "returned", "rejected"];
const statusText = (status) => (status === "overdue" ? "Vencido" : LOAN_STATUS[status].text);

const COLUMNS = [
    { id: "article", text: "Artículo" },
    { id: "lends", text: "Presta" },
    { id: "borrows", text: "Recibe" },
    { id: "start", text: "Inicio" },
    { id: "duration", text: "Duración" },
    { id: "due", text: "Vence" },
    { id: "status", text: "Estado" },
];

const date = (ms) =>
    new Date(ms).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export function AllLoansView({ loans, people = {}, me }) {
    const [filterValue, setFilterValue] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [now] = useState(() => Date.now());
    const [hiddenIds, setHiddenIds] = useState([]);

    const visibleItems = COLUMNS.filter((column) => !hiddenIds.includes(column.id));
    const view = (id) => !hiddenIds.includes(id);

    const statusOf = (loan) => (loan.status === "on_loan" && loan.end !== null && loan.end < now ? "overdue" : loan.status);
    const nameOf = (user) => (user === me ? "Tú" : (people[user]?.name ?? user));

    const person = (user) => (
        <>
            {nameOf(user)}
            {people[user]?.unit && <span className="text-zinc-500"> · {people[user].unit}</span>}
        </>
    );

    const q = searchQuery.trim().toLowerCase();
    const list = loans
        .filter((loan) => filterValue === "all" || statusOf(loan) === filterValue)
        .filter((loan) => matchesSearch(q, loan.name, nameOf(loan.owner), nameOf(loan.borrower)));

    const filters = [
        { value: "all", text: "Todos", total: loans.length },
        ...FILTER_ORDER.map((status) => ({
            value: status,
            text: statusText(status),
            total: loans.filter((loan) => statusOf(loan) === status).length,
        })),
    ];

    return (
        <>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="m-0 text-lg font-bold">Todos los préstamos</h2>
                    <p className="mb-0 mt-1 text-sm text-zinc-600">Registro de los préstamos del condominio.</p>
                </div>
                <label className="flex w-full items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-500 sm:w-72">
                    <Icon name="search" size={18} />
                    <span className="sr-only">Buscar préstamo</span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Artículo o vecino"
                        className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
                    />
                </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-zinc-300 bg-white">
                <div className="flex overflow-x-auto border-b border-zinc-300 px-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            aria-pressed={filterValue === filter.value}
                            onClick={() => setFilterValue(filter.value)}
                            className={`-mb-px shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold ${
                                filterValue === filter.value
                                    ? "border-azul text-azul"
                                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                            }`}
                        >
                            {filter.text}{" "}
                            <span
                                className={`font-normal tabular-nums ${filter.value === "overdue" && filter.total > 0 ? "font-semibold text-azul" : "text-zinc-400"}`}
                            >
                                ({filter.total})
                            </span>
                        </button>
                    ))}
                </div>

                {hiddenIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                        Columnas ocultas:
                        {COLUMNS.filter((column) => hiddenIds.includes(column.id)).map((column) => (
                            <button
                                key={column.id}
                                type="button"
                                onClick={() => setHiddenIds((prev) => prev.filter((hiddenId) => hiddenId !== column.id))}
                                className={`flex cursor-pointer items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-0.5 font-semibold text-zinc-700 hover:border-azul hover:text-azul`}
                            >
                                <Icon name="plus" size={12} />
                                {column.text}
                            </button>
                        ))}
                    </div>
                )}

                {list.length === 0 ? (
                    <p className="m-0 px-4 py-10 text-center text-sm text-zinc-600">
                        {q
                            ? `Ningún préstamo coincide con “${searchQuery.trim()}”. `
                            : "No hay préstamos en esta categoría."}
                        {q && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className={`cursor-pointer font-semibold text-azul underline`}
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                            <thead className="bg-oscuro">
                                <tr>
                                    {visibleItems.map((column) => (
                                        <th key={column.id} className="border-b border-zinc-300 p-0 font-normal">
                                            <button
                                                type="button"
                                                title="Ocultar columna"
                                                aria-label={`Ocultar columna ${column.text}`}
                                                disabled={visibleItems.length === 1}
                                                onClick={() => setHiddenIds((prev) => [...prev, column.id])}
                                                className={`group flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-white disabled:cursor-default`}
                                            >
                                                {column.text}
                                                <span className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-disabled:hidden">
                                                    <Icon name="close" size={12} />
                                                </span>
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {list.map((loan) => {
                                    const status = statusOf(loan);
                                    const overdue = status === "overdue";
                                    const home = loan.end !== null ? loan.end - DAYS[loan.duration] * DAY_MS : null;
                                    return (
                                        <tr key={loan.id} className="hover:bg-zinc-50">
                                            {view("article") && (
                                                <td className={`${TD} max-w-56 truncate font-semibold`} title={loan.name}>
                                                    {loan.name}
                                                </td>
                                            )}
                                            {view("lends") && <td className={TD}>{person(loan.owner)}</td>}
                                            {view("borrows") && <td className={TD}>{person(loan.borrower)}</td>}
                                            {view("start") && (
                                                <td className={`${TD} tabular-nums text-zinc-700`}>
                                                    {home !== null ? (
                                                        date(home)
                                                    ) : (
                                                        <span className="text-zinc-400">Sin entregar</span>
                                                    )}
                                                </td>
                                            )}
                                            {view("duration") && (
                                                <td className={`${TD} text-zinc-700`}>{loan.duration}</td>
                                            )}
                                            {view("due") && (
                                                <td
                                                    className={`${TD} tabular-nums ${overdue ? "font-semibold text-azul" : "text-zinc-700"}`}
                                                >
                                                    {loan.end !== null ? (
                                                        date(loan.end)
                                                    ) : (
                                                        <span className="text-zinc-400">No definida</span>
                                                    )}
                                                </td>
                                            )}
                                            {view("status") && (
                                                <td
                                                    className={`${TD} ${overdue ? "font-semibold text-azul" : "text-zinc-700"}`}
                                                >
                                                    {statusText(status)}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {list.length > 0 && (
                <p className="mb-0 mt-2 text-right text-xs tabular-nums text-zinc-500">
                    Mostrando {list.length} de {loans.length}
                </p>
            )}
        </>
    );
}
