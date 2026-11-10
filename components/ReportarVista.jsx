"use client";

import { useState } from "react";
import { BOTON_OSCURO } from "./Modal";

const INPUT =
    "w-full rounded-full border border-slate-500 bg-gris px-4 py-2 text-sm text-slate-700 outline-none focus:border-azul";

export function ReportarVista({ prestamos, usuario, onEnviarAction }) {
    const [prestamoId, setPrestamoId] = useState("");
    const [detalles, setDetalles] = useState("");
    const [enviado, setEnviado] = useState(false);

    const otro = (p) => (p.duenio === usuario ? p.prestatario : p.duenio);

    // Se puede reportar desde que el préstamo se acepta, también ya devuelto (p. ej. llegó dañado)
    const reportables = (p) => p.estado !== "pendiente" && p.estado !== "rechazado";
    const activos = prestamos.filter((p) => (p.duenio === usuario || p.prestatario === usuario) && reportables(p));
    const elegido = activos.find((p) => String(p.id) === prestamoId);
    const valido = elegido && detalles.trim() !== "";

    return (
        <>
            <h2 className="m-0 text-base font-bold">Reportar a un vecino</h2>

            {activos.length === 0 ? (
                <p className="mb-0 mt-3 max-w-md text-sm text-slate-500">
                    Solo puedes reportar a un vecino con el que tengas o hayas tenido un préstamo.
                </p>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!elegido || !detalles.trim()) return;

                        onEnviarAction({
                            prestamoId: elegido.id,
                            involucrado: otro(elegido),
                            detalles: detalles.trim(),
                        });
                        setPrestamoId("");
                        setDetalles("");
                        setEnviado(true);
                    }}
                    className="mt-4 w-full max-w-md rounded-4xl bg-white px-6 py-6 shadow-sm"
                >
                    <label className="sr-only" htmlFor="reportar-prestamo">
                        Préstamo
                    </label>
                    <select
                        id="reportar-prestamo"
                        value={prestamoId}
                        onChange={(e) => {
                            setPrestamoId(e.target.value);
                            setEnviado(false);
                        }}
                        className={`${INPUT} cursor-pointer`}
                    >
                        <option value="" disabled>
                            Elige el préstamo
                        </option>
                        {activos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} · {otro(p)}
                            </option>
                        ))}
                    </select>

                    <label className="sr-only" htmlFor="reportar-involucrado">
                        Vecino involucrado
                    </label>
                    <input
                        id="reportar-involucrado"
                        readOnly
                        placeholder="Nombre del vecino involucrado"
                        value={elegido ? otro(elegido) : ""}
                        className={`${INPUT} mt-3 read-only:cursor-default`}
                    />

                    <label className="sr-only" htmlFor="reportar-detalles">
                        Detalles del reporte
                    </label>
                    <textarea
                        id="reportar-detalles"
                        rows={4}
                        maxLength={500}
                        placeholder="Detalles del reporte"
                        value={detalles}
                        onChange={(e) => {
                            setDetalles(e.target.value);
                            setEnviado(false);
                        }}
                        className="mt-3 w-full resize-none rounded-2xl border border-slate-500
                        bg-gris px-4 py-2 text-sm text-slate-700 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={!valido}
                        className={`${BOTON_OSCURO} mx-auto mt-6 block w-full max-w-xs py-2 text-sm font-semibold`}
                    >
                        Enviar reporte
                    </button>

                    {enviado && (
                        <p role="status" className="mb-0 mt-3 text-center text-sm font-semibold text-green-700">
                            Reporte enviado. El administrador lo revisará.
                        </p>
                    )}
                </form>
            )}
        </>
    );
}
