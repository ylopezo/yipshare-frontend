"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export function CalificarModal({ vecino, onEnviarAction, onCancelarAction }) {
    const [estrellas, setEstrellas] = useState(0);
    const [comentario, setComentario] = useState("");

    return (
        <Modal label="Calificar al vecino" onCloseAction={onCancelarAction}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (estrellas > 0) onEnviarAction(estrellas, comentario.trim());
                }}
                className="w-[min(92vw,360px)] rounded-[2rem] bg-white px-8 py-8 text-center shadow-xl"
            >
                <h2 className="m-0 text-xl font-extrabold uppercase">Calificar al vecino</h2>
                <p className="mb-0 mt-1 text-xs text-slate-500">¿Cómo fue tu préstamo con {vecino}?</p>

                <div role="radiogroup" aria-label="Calificación" className="mt-4 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={estrellas === n}
                            aria-label={`${n} de 5 estrellas`}
                            onClick={() => setEstrellas(n)}
                            className={`cursor-pointer text-4xl transition ${n <= estrellas ? "text-amber-400" : "text-slate-300 hover:text-amber-200"}`}
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
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="mt-4 w-full resize-none rounded-2xl border border-slate-500 bg-gris px-4 py-2 text-sm text-slate-700 outline-none focus:border-azul"
                />

                <button
                    type="submit"
                    disabled={estrellas === 0}
                    className="mx-auto mt-4 block w-3/5 cursor-pointer rounded-full bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Enviar
                </button>

                <button
                    type="button"
                    onClick={onCancelarAction}
                    className="mx-auto mt-4 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Omitir
                </button>
            </form>
        </Modal>
    );
}
