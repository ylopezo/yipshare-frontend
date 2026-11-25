"use client";

import { useState } from "react";
import { DARK_BUTTON } from "./Modal";

const INPUT =
    "w-full rounded-md border-[1.5px] border-borde bg-gris px-4 py-2 text-sm text-neutral-700 outline-none";

const MAX_IMAGES = 5;

export function ReportFormView({ loans, user, onSend }) {
    const [loanId, setLoanId] = useState("");
    const [details, setDetails] = useState("");
    const [images, setImages] = useState([]);
    const [sent, setSent] = useState(false);

    const other = (loan) => (loan.owner === user ? loan.borrower : loan.owner);

    const isReportable = (loan) => loan.status !== "pending" && loan.status !== "rejected";
    const activeLoans = loans.filter((loan) => (loan.owner === user || loan.borrower === user) && isReportable(loan));
    const chosen = activeLoans.find((loan) => String(loan.id) === loanId);
    const isValid = chosen && details.trim() !== "" && images.length > 0 && images.length <= MAX_IMAGES;

    return (
        <>
            <h2 className="m-0 text-base font-bold">Reportar a un vecino</h2>

            {activeLoans.length === 0 ? (
                <p className="mb-0 mt-3 max-w-md text-sm text-neutral-500">
                    Solo puedes reportar a un vecino con el que tengas o hayas tenido un préstamo.
                </p>
            ) : (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!isValid) return;

                        const ok = await onSend({
                            loanId: chosen.id,
                            details: details.trim(),
                            images,
                        });
                        if (!ok) return;
                        e.target.reset();
                        setLoanId("");
                        setDetails("");
                        setImages([]);
                        setSent(true);
                    }}
                    className="mt-4 w-full max-w-md rounded-lg bg-white px-6 py-6"
                >
                    <label className="sr-only" htmlFor="reportar-prestamo">
                        Préstamo
                    </label>
                    <select
                        id="reportar-prestamo"
                        value={loanId}
                        onChange={(e) => {
                            setLoanId(e.target.value);
                            setSent(false);
                        }}
                        className={`${INPUT} cursor-pointer`}
                    >
                        <option value="" disabled>
                            Elige el préstamo
                        </option>
                        {activeLoans.map((loan) => (
                            <option key={loan.id} value={loan.id}>
                                {loan.name} · {other(loan)}
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
                        value={chosen ? other(chosen) : ""}
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
                        value={details}
                        onChange={(e) => {
                            setDetails(e.target.value);
                            setSent(false);
                        }}
                        className="mt-3 w-full resize-none rounded-md border border-neutral-500
                        bg-gris px-4 py-2 text-sm text-neutral-700 outline-none"
                    />

                    <label htmlFor="reportar-evidencia" className="mt-3 block text-xs font-semibold text-neutral-700">
                        Evidencia (1 a {MAX_IMAGES} imágenes)
                    </label>
                    <input
                        id="reportar-evidencia"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            setImages([...e.target.files]);
                            setSent(false);
                        }}
                        aria-invalid={images.length > MAX_IMAGES}
                        className="mt-1 w-full text-xs text-neutral-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-azul file:px-3 file:py-1 file:text-white"
                    />
                    {images.length > MAX_IMAGES && (
                        <p role="alert" className="mb-0 mt-1 text-xs text-black">
                            Máximo {MAX_IMAGES} imágenes.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`${DARK_BUTTON} mx-auto mt-6 block w-full max-w-xs py-2 text-sm font-semibold`}
                    >
                        Enviar reporte
                    </button>

                    {sent && (
                        <p role="status" className="mb-0 mt-3 text-center text-sm text-black">
                            Reporte enviado. El administrador lo revisará.
                        </p>
                    )}
                </form>
            )}
        </>
    );
}