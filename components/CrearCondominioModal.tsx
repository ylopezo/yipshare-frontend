"use client";

import { useState } from "react";
import { Modal } from "./Modal";

type Dir = "calle" | "colonia" | "cp" | "municipio" | "ciudad";
type Doc = "escritura" | "acta" | "rfc" | "identificacion";

const DIRECCION: [Dir, string][] = [
    ["calle", "Calle"],
    ["colonia", "Colonia"],
    ["cp", "C.P."],
    ["municipio", "Alcaldía / Municipio"],
    ["ciudad", "Ciudad"],
];

const DOCUMENTOS: [Doc, string][] = [
    ["escritura", "Escritura Constitutiva del Régimen de Propiedad en Condominio"],
    ["acta", "Acta de Asamblea de Nombramiento del Administrador"],
    ["rfc", "RFC del Condominio"],
    ["identificacion", "Identificación oficial del Administrador"],
];

export type DatosCrear = {
    nombre: string;
    direccion: Record<Dir, string>;
    cantidad: number;
    documentos: Record<Doc, File>;
};

const INPUT =
    "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 " +
    "py-2 text-sm text-slate-700 outline-none placeholder:text-slate-500 " +
    "focus:border-[#1e4a73]";

export function CrearCondominioModal({
                                         onCrearAction,
                                         onCancelarAction,
                                     }: {
    onCrearAction: (datos: DatosCrear) => void;
    onCancelarAction: () => void;
}) {
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState<Record<Dir, string>>({
        calle: "",
        colonia: "",
        cp: "",
        municipio: "",
        ciudad: "",
    });
    const [cantidad, setCantidad] = useState("");
    const [docs, setDocs] = useState<Partial<Record<Doc, File>>>({});
    const [error, setError] = useState("");

    const cantidadNum = Number(cantidad);
    const completo = (d: Partial<Record<Doc, File>>): d is Record<Doc, File> =>
        DOCUMENTOS.every(([clave]) => d[clave]);

    const valido =
        nombre.trim() !== "" &&
        Object.values(direccion).every((v) => v.trim() !== "") &&
        /^\d{5}$/.test(direccion.cp.trim()) &&
        Number.isInteger(cantidadNum) &&
        cantidadNum > 0 &&
        completo(docs);

    function elegirPdf(clave: Doc, e: React.ChangeEvent<HTMLInputElement>) {
        const archivo = e.target.files?.[0];
        if (archivo && archivo.type !== "application/pdf") {
            e.target.value = "";
            setError("Solo se aceptan archivos PDF.");
            return;
        }
        setError("");
        setDocs((prev) => ({ ...prev, [clave]: archivo }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!valido || !completo(docs)) return;

        onCrearAction({
            nombre: nombre.trim(),
            direccion,
            cantidad: cantidadNum,
            documentos: docs,
        });
    }

    return (
        <Modal label="Crear condominio" onCloseAction={onCancelarAction}>
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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`${INPUT} mt-6`}
                />

                <p className="mb-0 mt-5 text-sm font-bold uppercase text-[#1e4a73]">Dirección</p>
                {DIRECCION.map(([clave, etiqueta]) => (
                    <input
                        key={clave}
                        aria-label={etiqueta}
                        placeholder={etiqueta}
                        inputMode={clave === "cp" ? "numeric" : undefined}
                        maxLength={clave === "cp" ? 5 : undefined}
                        value={direccion[clave]}
                        onChange={(e) => setDireccion({ ...direccion, [clave]: e.target.value })}
                        className={`${INPUT} mt-3`}
                    />
                ))}

                <input
                    type="number"
                    min={1}
                    aria-label="Cantidad de unidades"
                    placeholder="Cantidad de unidades"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className={`${INPUT} mt-5`}
                />

                <p className="mb-0 mt-5 text-sm font-bold uppercase text-[#1e4a73]">Documentos (PDF)</p>
                {DOCUMENTOS.map(([clave, etiqueta]) => (
                    <div key={clave} className="mt-3">
                        <span className="text-xs font-bold text-[#1e4a73]">{etiqueta}</span>
                        <label className="mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-xl
                         border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 hover:bg-[#e2e2e2]">
                            <span className="truncate">{docs[clave]?.name ?? "Elegir PDF"}</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                className="sr-only"
                                onChange={(e) => elegirPdf(clave, e)}
                            />
                        </label>
                    </div>
                ))}

                {error && (
                    <p role="alert" className="mb-0 mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!valido}
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white transition hover:bg-[#2c4066] disabled:opacity-50"
                >
                    Crear condominio
                </button>

                <button
                    type="button"
                    onClick={onCancelarAction}
                    className="mx-auto mt-3 block cursor-pointer text-sm font-bold text-[#2a5a88] hover:underline"
                >
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}