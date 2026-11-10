"use client";

import { useState } from "react";
import { DIAS } from "@/lib/prestamos";
import { Icon } from "./Icon";

const DIA_MS = 86_400_000;
const TD = "whitespace-nowrap px-3 py-2.5 align-middle";
const FOCO = "outline-none focus-visible:ring-2 focus-visible:ring-[#2a6aa8]";

// "vencido" no viene del backend: es un préstamo en curso que ya pasó su fecha
const ESTADOS = {
    pendiente: "Pendiente",
    aceptado: "Reservado",
    en_curso: "En préstamo",
    vencido: "Vencido",
    finalizado: "Finalizado",
    rechazado: "Rechazado",
};

const COLUMNAS = [
    { id: "articulo", texto: "Artículo" },
    { id: "presta", texto: "Presta" },
    { id: "recibe", texto: "Recibe" },
    { id: "inicio", texto: "Inicio" },
    { id: "duracion", texto: "Duración" },
    { id: "vence", texto: "Vence" },
    { id: "estado", texto: "Estado" },
];

const fecha = (ms) => new Date(ms).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export function TodosPrestamosVista({ prestamos, personas = {}, yo, onRecordarAction }) {
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [ahora] = useState(() => Date.now());
    const [ocultas, setOcultas] = useState([]);

    const visibles = COLUMNAS.filter((c) => !ocultas.includes(c.id));
    const ver = (id) => !ocultas.includes(id);

    const estadoDe = (p) => (p.estado === "en_curso" && p.fin !== null && p.fin < ahora ? "vencido" : p.estado);
    const nombreDe = (usuario) => (usuario === yo ? "Tú" : (personas[usuario]?.nombre ?? usuario));

    const persona = (usuario) => (
        <>
            {nombreDe(usuario)}
            {personas[usuario]?.depto && <span className="text-zinc-500"> · {personas[usuario].depto}</span>}
        </>
    );

    const q = busqueda.trim().toLowerCase();
    const lista = prestamos
        .filter((p) => filtro === "todos" || estadoDe(p) === filtro)
        .filter((p) => !q || [p.nombre, nombreDe(p.duenio), nombreDe(p.prestatario)].some((t) => t?.toLowerCase().includes(q)));

    const filtros = [
        { valor: "todos", texto: "Todos", total: prestamos.length },
        ...Object.entries(ESTADOS).map(([e, texto]) => ({
            valor: e,
            texto,
            total: prestamos.filter((p) => estadoDe(p) === e).length,
        })),
    ];

    return (
        <>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="m-0 text-lg font-bold">Todos los préstamos</h2>
                    <p className="mb-0 mt-1 text-sm text-zinc-600">Registro de los préstamos del condominio.</p>
                </div>
                <label className="flex w-full items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-500 focus-within:border-[#1e4a73] sm:w-72">
                    <Icon name="search" size={18} />
                    <span className="sr-only">Buscar préstamo</span>
                    <input
                        type="search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Artículo o vecino"
                        className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
                    />
                </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-zinc-300 bg-white">
                <div className="flex overflow-x-auto border-b border-zinc-300 px-2">
                    {filtros.map((f) => (
                        <button
                            key={f.valor}
                            type="button"
                            aria-pressed={filtro === f.valor}
                            onClick={() => setFiltro(f.valor)}
                            className={`-mb-px shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold ${FOCO} ${
                                filtro === f.valor
                                    ? "border-[#1e4a73] text-[#1e4a73]"
                                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                            }`}
                        >
                            {f.texto}{" "}
                            <span
                                className={`font-normal tabular-nums ${f.valor === "vencido" && f.total > 0 ? "font-semibold text-red-700" : "text-zinc-400"}`}
                            >
                                ({f.total})
                            </span>
                        </button>
                    ))}
                </div>

                {ocultas.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                        Columnas ocultas:
                        {COLUMNAS.filter((c) => ocultas.includes(c.id)).map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setOcultas((prev) => prev.filter((x) => x !== c.id))}
                                className={`flex cursor-pointer items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-0.5 font-semibold text-zinc-700 hover:border-[#1e4a73] hover:text-[#1e4a73] ${FOCO}`}
                            >
                                <Icon name="plus" size={12} />
                                {c.texto}
                            </button>
                        ))}
                    </div>
                )}

                {lista.length === 0 ? (
                    <p className="m-0 px-4 py-10 text-center text-sm text-zinc-600">
                        {q ? `Ningún préstamo coincide con “${busqueda.trim()}”. ` : "No hay préstamos en esta categoría."}
                        {q && (
                            <button
                                type="button"
                                onClick={() => setBusqueda("")}
                                className={`cursor-pointer font-semibold text-[#1e4a73] underline ${FOCO}`}
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                            <thead className="bg-zinc-100">
                                <tr>
                                    {visibles.map((c) => (
                                        <th key={c.id} className="border-b border-zinc-300 p-0 font-normal">
                                            <button
                                                type="button"
                                                title="Ocultar columna"
                                                aria-label={`Ocultar columna ${c.texto}`}
                                                disabled={visibles.length === 1}
                                                onClick={() => setOcultas((prev) => [...prev, c.id])}
                                                className={`group flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-bold text-zinc-700 hover:text-[#1e4a73] disabled:cursor-default disabled:hover:text-zinc-700 ${FOCO}`}
                                            >
                                                {c.texto}
                                                <span className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-disabled:hidden">
                                                    <Icon name="close" size={12} />
                                                </span>
                                            </button>
                                        </th>
                                    ))}
                                    <th className="border-b border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-700">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {lista.map((p) => {
                                    const estado = estadoDe(p);
                                    const vencido = estado === "vencido";
                                    // El plazo corre desde la entrega: inicio = vence - duración
                                    const inicio = p.fin !== null ? p.fin - DIAS[p.tiempo] * DIA_MS : null;
                                    return (
                                        <tr key={p.id} className="hover:bg-zinc-50">
                                            {ver("articulo") && (
                                                <td className={`${TD} max-w-56 truncate font-semibold`} title={p.nombre}>
                                                    {p.nombre}
                                                </td>
                                            )}
                                            {ver("presta") && <td className={TD}>{persona(p.duenio)}</td>}
                                            {ver("recibe") && <td className={TD}>{persona(p.prestatario)}</td>}
                                            {ver("inicio") && (
                                                <td className={`${TD} tabular-nums text-zinc-700`}>
                                                    {inicio !== null ? fecha(inicio) : <span className="text-zinc-400">Sin entregar</span>}
                                                </td>
                                            )}
                                            {ver("duracion") && <td className={`${TD} text-zinc-700`}>{p.tiempo}</td>}
                                            {ver("vence") && (
                                                <td className={`${TD} tabular-nums ${vencido ? "font-semibold text-red-700" : "text-zinc-700"}`}>
                                                    {p.fin !== null ? fecha(p.fin) : <span className="text-zinc-400">No definida</span>}
                                                </td>
                                            )}
                                            {ver("estado") && (
                                                <td className={`${TD} ${vencido ? "font-semibold text-red-700" : "text-zinc-700"}`}>
                                                    {ESTADOS[estado]}
                                                </td>
                                            )}
                                            <td className={TD}>
                                                {vencido &&
                                                    onRecordarAction &&
                                                    (p.recordado ? (
                                                        <span className="text-xs text-zinc-500">Recordatorio enviado</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => onRecordarAction(p)}
                                                            className={`cursor-pointer rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700 hover:border-[#1e4a73] hover:text-[#1e4a73] ${FOCO}`}
                                                        >
                                                            Recordar
                                                        </button>
                                                    ))}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {lista.length > 0 && (
                <p className="mb-0 mt-2 text-right text-xs tabular-nums text-zinc-500">
                    Mostrando {lista.length} de {prestamos.length}
                </p>
            )}
        </>
    );
}
