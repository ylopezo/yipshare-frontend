"use client";

import { useState } from "react";
import { Modal } from "./Modal";

const ADDRESS = [
    ["street", "Calle"],
    ["neighborhood", "Colonia"],
    ["postalCode", "C.P."],
    ["municipality", "Alcaldía / Municipio"],
    ["city", "Ciudad"],
    ["state", "Estado"],
];

const DOCUMENTS = [
    ["ecrpcDocument", "Escritura Constitutiva del Régimen de Propiedad en Condominio"],
    ["aanaDocument", "Acta de Asamblea de Nombramiento del Administrador"],
    ["ownerIneDocument", "RFC del Condominio"],
    ["condominiumRfcDocument", "Identificación oficial del Administrador"],
];

const MAX_PDF_BYTES = 50 * 1024 * 1024;

const INPUT =
    "w-full rounded-xl border border-slate-600 bg-gris px-4 " +
    "py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 " +
    "focus:border-azul";

export function CreateCondominiumModal({ onCreateAction, onCancelAction }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState({
        street: "",
        neighborhood: "",
        postalCode: "",
        municipality: "",
        city: "",
        state: "",
    });
    const [unitCount, setUnitCount] = useState("");
    const [docs, setDocs] = useState({});
    const [error, setError] = useState("");

    const unitCountNum = Number(unitCount);
    const isComplete = (d) => DOCUMENTS.every(([fieldKey]) => d[fieldKey]);

    const isValid =
        name.trim() !== "" &&
        Object.values(address).every((v) => v.trim() !== "") &&
        /^\d{5}$/.test(address.postalCode.trim()) &&
        Number.isInteger(unitCountNum) &&
        unitCountNum > 0 &&
        isComplete(docs);

    function choosePdf(fieldKey, e) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type !== "application/pdf") {
            e.target.value = "";
            setError("Solo se aceptan archivos PDF.");
            return;
        }
        if (selectedFile && selectedFile.size > MAX_PDF_BYTES) {
            e.target.value = "";
            setError("Cada PDF debe pesar 50 MB o menos.");
            return;
        }
        setError("");
        setDocs((prev) => ({ ...prev, [fieldKey]: selectedFile }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!isValid || !isComplete(docs)) return;

        onCreateAction({
            name: name.trim(),
            address,
            unitCount: unitCountNum,
            documents: docs,
        });
    }

    return (
        <Modal label="Crear condominio" onCloseAction={onCancelAction}>
            <form
                onSubmit={handleSubmit}
                className="max-h-[90vh] w-[min(92vw,400px)] overflow-y-auto rounded-4xl bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase tracking-wide text-black">
                    Crear condominio
                </h2>
                <p className="mb-0 mt-2 text-center text-sm text-slate-500">
                    Completa los siguientes campos para crear un nuevo condominio.
                </p>
                <input
                    aria-label="Nombre del condominio"
                    placeholder="Nombre del condominio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${INPUT} mt-6`}
                />

                <p className="mb-0 mt-5 text-sm font-bold uppercase text-azul">Dirección</p>
                {ADDRESS.map(([fieldKey, label]) => (
                    <input
                        key={fieldKey}
                        aria-label={label}
                        placeholder={label}
                        inputMode={fieldKey === "postalCode" ? "numeric" : undefined}
                        maxLength={fieldKey === "postalCode" ? 5 : undefined}
                        value={address[fieldKey]}
                        onChange={(e) => setAddress({ ...address, [fieldKey]: e.target.value })}
                        className={`${INPUT} mt-3`}
                    />
                ))}

                <input
                    type="number"
                    min={1}
                    aria-label="Cantidad de unidades"
                    placeholder="Cantidad de unidades"
                    value={unitCount}
                    onChange={(e) => setUnitCount(e.target.value)}
                    className={`${INPUT} mt-5`}
                />

                <p className="mb-0 mt-5 text-sm font-bold uppercase text-azul">Documentos (PDF)</p>
                {DOCUMENTS.map(([fieldKey, label]) => (
                    <div key={fieldKey} className="mt-3">
                        <span className="text-xs font-bold text-azul">{label}</span>
                        <label
                            className="mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-xl
                         border border-slate-600 bg-gris px-4 py-2 text-sm text-slate-700 hover:bg-[#e2e2e2]"
                        >
                            <span className="truncate">{docs[fieldKey]?.name ?? "Elegir PDF"}</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                className="sr-only"
                                onChange={(e) => choosePdf(fieldKey, e)}
                            />
                        </label>
                    </div>
                ))}

                {error && (
                    <p role="alert" className="mb-0 mt-3 text-sm text-azul">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!isValid}
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-oscuro py-2 text-sm font-semibold text-white transition hover:bg-oscuro-hover disabled:opacity-50"
                >
                    Crear condominio
                </button>

                <button
                    type="button"
                    onClick={onCancelAction}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-azul-texto hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}
