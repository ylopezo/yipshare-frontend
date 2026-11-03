"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export const ESTADOS = {
    disponible: "Disponible",
    pendiente: "Pendiente",
    no_disponible: "No disponible",
};

export const CATEGORIAS = [
    "Herramientas",
    "Electrodomésticos",
    "Jardinería",
    "Cocina",
    "Limpieza",
    "Electrónica",
    "Automotriz",
    "Otros",
];

export const CONDICIONES = ["Excelente estado", "Buen estado", "Estado intermedio", "Mal estado"];

export const TIEMPOS = ["1 día", "2 días", "3 días", "1 semana", "2 semanas", "1 mes"];

const INPUT =
    "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1e4a73]";
const ETIQUETA = "mb-1 mt-4 block text-xs font-bold text-[#1e4a73]";

export function ArticuloModal({ articulo, onGuardarAction, onCancelarAction }) {
    const [nombre, setNombre] = useState(articulo?.nombre ?? "");
    const [categoria, setCategoria] = useState(articulo?.categoria ?? "");
    const [descripcion, setDescripcion] = useState(articulo?.descripcion ?? "");
    const [condicion, setCondicion] = useState(articulo?.condicion ?? "");
    const [tiempos, setTiempos] = useState(articulo?.tiempos ?? []);
    const [imagen, setImagen] = useState(articulo?.imagen ?? null);

    const archivo = useRef(null);

    const titulo = articulo ? "Editar artículo" : "Agregar artículo";
    const valido = nombre.trim() !== "" && descripcion.trim() !== "" && categoria && condicion && tiempos.length > 0;

    const alternarTiempo = (t) =>
        setTiempos((prev) => TIEMPOS.filter((x) => (x === t ? !prev.includes(x) : prev.includes(x))));

    return (
        <Modal label={titulo} onCloseAction={onCancelarAction}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!valido || !categoria || !condicion) return;
                    onGuardarAction({
                        nombre: nombre.trim(),
                        categoria,
                        descripcion: descripcion.trim(),
                        condicion,
                        tiempos,
                        estado: articulo?.estado ?? "disponible",
                        imagen,
                    });
                }}
                className="max-h-[90vh] w-[min(94vw,760px)] overflow-y-auto rounded-[2rem] bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase">{titulo}</h2>

                <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <button
                            type="button"
                            onClick={() => archivo.current?.click()}
                            aria-label="Elegir imagen"
                            className="flex aspect-square w-full cursor-pointer items-center
                            justify-center overflow-hidden rounded-xl bg-[#e4e4e4] text-slate-500 hover:bg-[#d8d8d8]"
                        >
                            {imagen ? (
                                <img src={imagen} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                                    <Icon name="plus" size={28} />
                                    Agregar imagen
                                </span>
                            )}
                        </button>
                        <input
                            ref={archivo}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f?.type.startsWith("image/")) setImagen(URL.createObjectURL(f));
                            }}
                        />
                    </div>

                    <div>
                        <input
                            aria-label="Nombre del artículo"
                            placeholder="Nombre del artículo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={INPUT}
                        />

                        <label htmlFor="articulo-categoria" className={ETIQUETA}>
                            Categoría
                        </label>
                        <select
                            id="articulo-categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className={`${INPUT} cursor-pointer`}
                        >
                            <option value="" disabled>
                                Elige una categoría
                            </option>
                            {CATEGORIAS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="articulo-descripcion" className={ETIQUETA}>
                            Descripción del objeto
                        </label>
                        <textarea
                            id="articulo-descripcion"
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className={`${INPUT} resize-none`}
                        />

                        <label htmlFor="articulo-condicion" className={ETIQUETA}>
                            Estado físico
                        </label>
                        <select
                            id="articulo-condicion"
                            value={condicion}
                            onChange={(e) => setCondicion(e.target.value)}
                            className={`${INPUT} cursor-pointer`}
                        >
                            <option value="" disabled>
                                Elige el estado físico
                            </option>
                            {CONDICIONES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <p className={ETIQUETA}>Tiempo de préstamo (puedes elegir varios)</p>
                        <div className="flex flex-wrap gap-2">
                            {TIEMPOS.map((t) => {
                                const activo = tiempos.includes(t);
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        aria-pressed={activo}
                                        onClick={() => alternarTiempo(t)}
                                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                            activo
                                                ? "border-[#1f2d47] bg-[#1f2d47] text-white"
                                                : "border-slate-500 bg-[#eeeeee] text-slate-700 hover:bg-[#e2e2e2]"
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
                    disabled={!valido}
                    className="mx-auto mt-8 block w-3/5 max-w-xs cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white hover:bg-[#2c4066] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Guardar
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
