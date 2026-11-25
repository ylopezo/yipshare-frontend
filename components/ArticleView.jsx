"use client";

import { useState } from "react";
import { LIGHT_BUTTON } from "./Modal";
import { Icon } from "./Icon";

const ARTICLE_STATUS = {
    available: { text: "Disponible", cssClass: "text-green-900" },
    pending: { text: "Pendiente", cssClass: "text-amber-900" },
    not_available: { text: "No disponible", cssClass: "text-neutral-700" },
};

export function ArticleCard({ article, onView, onEdit }) {
    return (
        <div className="flex w-48 flex-col overflow-hidden rounded-lg bg-white">
            <button
                type="button"
                onClick={onView}
                className="flex flex-1 cursor-pointer flex-col text-left hover:bg-neutral-50"
            >
                <div className="h-28 w-full shrink-0 bg-gris-imagen">
                    {article.image && <img src={article.image} alt={article.name} className="h-full w-full object-cover" />}
                </div>

                <div className="flex flex-col px-3 pb-3 pt-2">
                    <span
                        className={`self-start text-xs font-semibold ${ARTICLE_STATUS[article.status].cssClass}`}
                    >
                        {ARTICLE_STATUS[article.status].text}
                    </span>
                    <p className="m-0 mt-1 wrap-break-word text-lg font-bold text-azul">{article.name}</p>
                    <p className="m-0 text-xs text-neutral-500">{article.owner}</p>
                </div>
            </button>

            {onEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="cursor-pointer self-center pb-3 pt-1 text-xs font-semibold text-black hover:underline"
                >
                    Editar Artículo
                </button>
            )}
        </div>
    );
}

export function ArticleDetail({ article, onBack, onRequest, onDelete, deleteBlocked }) {
    const [duration, setDuration] = useState(article.durations[0]);

    return (
        <>
            <button
                type="button"
                aria-label="Volver"
                onClick={onBack}
                className="cursor-pointer rounded-full p-2 text-azul transition hover:bg-white"
            >
                <Icon name="arrow" size={28} />
            </button>

            <div className="mx-auto mt-2 w-full max-w-2xl rounded-lg bg-white p-6">
                <div className="h-64 overflow-hidden rounded-lg bg-gris-imagen">
                    {article.image && <img src={article.image} alt={article.name} className="h-full w-full object-cover" />}
                </div>

                <span className={`mt-4 inline-block text-sm font-semibold ${ARTICLE_STATUS[article.status].cssClass}`}>
                    {ARTICLE_STATUS[article.status].text}
                </span>

                <h2 className="m-0 mt-2 break-words text-lg font-semibold text-azul">{article.name}</h2>
                <p className="m-0 text-xs font-bold">{article.category}</p>

                <p className="mb-0 mt-3 break-words text-xs font-semibold">{article.description}</p>
                <p className="mb-0 mt-2 text-xs text-neutral-500">
                    {article.condition} · Préstamo: {article.durations.join(", ")}
                </p>

                <hr className="my-4 border-neutral-300" />

                <div className="flex items-center gap-4">
                    <span className="text-neutral-500">
                        <Icon name="user" size={44} />
                    </span>

                    <div className="min-w-0">
                        <p className="m-0 break-words text-base font-bold text-azul">
                            {article.owner} - {article.address}
                        </p>

                        <div
                            role="img"
                            aria-label={`Calificación ${article.rating.toFixed(1)} de 5`}
                            className="flex items-center gap-1"
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    aria-hidden="true"
                                    className={`text-xl ${star <= Math.round(article.rating) ? "text-amber-400" : "text-neutral-700"}`}
                                >
                                    {star <= Math.round(article.rating) ? "★" : "☆"}
                                </span>
                            ))}
                            <span className="ml-1 text-xs font-bold">{article.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {onRequest && (
                <>
                    <div className="mx-auto mt-6 w-full max-w-xs text-center">
                        <p className="m-0 text-xs font-semibold text-neutral-700">Tiempo de préstamo</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                            {article.durations.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    aria-pressed={duration === option}
                                    onClick={() => setDuration(option)}
                                    className={`cursor-pointer rounded-md border px-3 py-1 text-xs font-semibold transition ${
                                        duration === option
                                            ? "border-azul bg-azul text-white"
                                            : "border-neutral-500 bg-white text-neutral-700 hover:bg-neutral-100"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={article.status !== "available"}
                        onClick={() => onRequest(duration)}
                        className="mx-auto mt-4 block w-full max-w-xs cursor-pointer rounded-md bg-azul py-2 text-base font-bold text-white hover:bg-azul-claro disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Solicitar Artículo
                    </button>
                </>
            )}

            {onDelete && (
                <>
                    <button
                        type="button"
                        disabled={deleteBlocked}
                        onClick={onDelete}
                        className={`${LIGHT_BUTTON} mx-auto mt-3 block w-full max-w-xs py-2 text-sm font-bold`}
                    >
                        Eliminar publicación
                    </button>
                    {deleteBlocked && (
                        <p className="mx-auto mb-0 mt-2 max-w-xs text-center text-xs text-neutral-500">
                            No se puede eliminar mientras el artículo esté en préstamo.
                        </p>
                    )}
                </>
            )}
        </>
    );
}
