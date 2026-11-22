"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export function RateModal({ neighbor, onSubmitAction, onCancelAction }) {
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");

    return (
        <Modal label="Calificar al vecino" onCloseAction={onCancelAction}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (stars > 0) onSubmitAction(stars, comment.trim());
                }}
                className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl"
            >
                <h2 className="m-0 text-xl font-extrabold uppercase">Calificar al vecino</h2>
                <p className="mb-0 mt-1 text-xs text-slate-500">¿Cómo fue tu préstamo con {neighbor}?</p>

                <div role="radiogroup" aria-label="Calificación" className="mt-4 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={stars === n}
                            aria-label={`${n} de 5 estrellas`}
                            onClick={() => setStars(n)}
                            className={`cursor-pointer text-4xl transition ${n <= stars ? "text-amber-400" : "text-slate-300 hover:text-amber-200"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <label className="sr-only" htmlFor="calificar-comentario">
                    Comentario
                </label>
                <textarea
                    id="calificar-comentario"
                    rows={3}
                    maxLength={300}
                    placeholder="Comentario (opcional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-4 w-full resize-none rounded-2xl border border-slate-500 bg-gris px-4 py-2 text-sm text-slate-700 outline-none focus:border-azul"
                />

                <button
                    type="submit"
                    disabled={stars === 0}
                    className="mx-auto mt-4 block w-3/5 cursor-pointer rounded-full bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Enviar
                </button>

                <button
                    type="button"
                    onClick={onCancelAction}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Omitir
                </button>
            </form>
        </Modal>
    );
}
