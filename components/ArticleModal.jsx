"use client";

import { useRef, useState } from "react";
import { DAYS } from "@/lib/loans";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export const STATUSES = {
    available: "Disponible",
    pending: "Pendiente",
    unavailable: "No disponible",
};

export const CATEGORIES = [
    "Herramientas",
    "Electrodomésticos",
    "Jardinería",
    "Cocina",
    "Limpieza",
    "Electrónica",
    "Automotriz",
    "Otros",
];

export const CONDITIONS = ["Excelente estado", "Buen estado", "Estado intermedio", "Mal estado"];

export const DURATIONS = Object.keys(DAYS);

const INPUT =
    "w-full rounded-xl border border-slate-600 bg-gris px-4 py-2 text-sm text-slate-700 outline-none focus:border-azul";
const LABEL = "mb-1 mt-4 block text-xs font-bold text-azul";

export function ArticleModal({ article, onSaveAction, onCancelAction }) {
    const [name, setName] = useState(article?.name ?? "");
    const [category, setCategory] = useState(article?.category ?? "");
    const [description, setDescription] = useState(article?.description ?? "");
    const [condition, setCondition] = useState(article?.condition ?? "");
    const [durations, setDurations] = useState(article?.durations ?? []);
    const [image, setImage] = useState(article?.image ?? null);

    const selectedFile = useRef(null);

    const title = article ? "Editar artículo" : "Agregar artículo";
    const isValid = name.trim() !== "" && description.trim() !== "" && category && condition && durations.length > 0;

    const toggleDuration = (t) =>
        setDurations((prev) => DURATIONS.filter((x) => (x === t ? !prev.includes(x) : prev.includes(x))));

    return (
        <Modal label={title} onCloseAction={onCancelAction}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isValid || !category || !condition) return;
                    onSaveAction({
                        name: name.trim(),
                        category,
                        description: description.trim(),
                        condition,
                        durations,
                        status: article?.status ?? "available",
                        image,
                    });
                }}
                className="max-h-[90vh] w-[min(94vw,760px)] overflow-y-auto rounded-[2rem] bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase">{title}</h2>

                <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <button
                            type="button"
                            onClick={() => selectedFile.current?.click()}
                            aria-label="Elegir imagen"
                            className="flex aspect-square w-full cursor-pointer items-center
                            justify-center overflow-hidden rounded-xl bg-gris-imagen text-slate-500 hover:bg-[#d8d8d8]"
                        >
                            {image ? (
                                <img src={image} alt="Vista previa de la imagen del artículo" className="h-full w-full object-cover" />
                            ) : (
                                <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                                    <Icon name="plus" size={28} />
                                    Agregar imagen
                                </span>
                            )}
                        </button>
                        <input
                            ref={selectedFile}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f?.type.startsWith("image/")) setImage(URL.createObjectURL(f));
                            }}
                        />
                    </div>

                    <div>
                        <input
                            aria-label="Nombre del artículo"
                            placeholder="Nombre del artículo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={INPUT}
                        />

                        <label htmlFor="articulo-categoria" className={LABEL}>
                            Categoría
                        </label>
                        <select
                            id="articulo-categoria"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`${INPUT} cursor-pointer`}
                        >
                            <option value="" disabled>
                                Elige una categoría
                            </option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="articulo-descripcion" className={LABEL}>
                            Descripción del objeto
                        </label>
                        <textarea
                            id="articulo-descripcion"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${INPUT} resize-none`}
                        />

                        <label htmlFor="articulo-condicion" className={LABEL}>
                            Estado físico
                        </label>
                        <select
                            id="articulo-condicion"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className={`${INPUT} cursor-pointer`}
                        >
                            <option value="" disabled>
                                Elige el estado físico
                            </option>
                            {CONDITIONS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <p className={LABEL}>Tiempo de préstamo (puedes elegir varios)</p>
                        <div className="flex flex-wrap gap-2">
                            {DURATIONS.map((t) => {
                                const active = durations.includes(t);
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => toggleDuration(t)}
                                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${active
                                                ? "border-oscuro bg-oscuro text-white"
                                                : "border-slate-500 bg-gris text-slate-700 hover:bg-[#e2e2e2]"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isValid}
                    className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-xl bg-oscuro py-2 text-sm font-semibold text-white hover:bg-oscuro-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Guardar
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
