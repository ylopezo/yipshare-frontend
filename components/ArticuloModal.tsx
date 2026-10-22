"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export type Estado = "disponible" | "pendiente" | "no_disponible";

export const ESTADOS: Record<Estado, string> = {
    disponible: "Disponible",
    pendiente: "Pendiente",
    no_disponible: "No disponible",
};

export type Articulo = {
    id: number;
    nombre: string;
    estado: Estado;
    imagen: string | null;
    duenio: string;
};

export type Datos = Pick<Articulo, "nombre" | "estado" | "imagen">;

const INPUT =
    "w-full rounded-xl border border-slate-600 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1e4a73]";

export function ArticuloModal({
                                  articulo,
                                  onGuardarAction,
                                  onCancelarAction,
                              }: {
    articulo: Articulo | null;
    onGuardarAction: (datos: Datos) => void;
    onCancelarAction: () => void;
}) {
    const [nombre, setNombre] = useState(articulo?.nombre ?? "");
    const [estado, setEstado] = useState<Estado>(articulo?.estado ?? "disponible");
    const [imagen, setImagen] = useState(articulo?.imagen ?? null);

    const archivo = useRef<HTMLInputElement>(null);

    const titulo = articulo ? "Editar artículo" : "Agregar artículo";

    return (
        <Modal
            label={titulo}
            onCloseAction={onCancelarAction}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (nombre.trim()) {
                        onGuardarAction({
                            nombre: nombre.trim(),
                            estado,
                            imagen,
                        });
                    }
                }}
                className="w-[min(92vw,400px)] rounded-[2rem] bg-white px-8 py-8 shadow-xl"
            >
                <h2 className="m-0 text-center text-xl font-extrabold uppercase">
                    {titulo}
                </h2>

                <button
                    type="button"
                    onClick={() => archivo.current?.click()}
                    aria-label="Elegir imagen"
                    className="mt-6 flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#e4e4e4] text-slate-500 hover:bg-[#d8d8d8]"
                >
                    {imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imagen}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Icon name="plus" size={28} />
                    )}
                </button>

                <input
                    ref={archivo}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                            setImagen(URL.createObjectURL(f));
                        }
                    }}
                />

                <input
                    aria-label="Nombre del artículo"
                    placeholder="Nombre del artículo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`${INPUT} mt-4`}
                />

                <select
                    aria-label="Estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as Estado)}
                    className={`${INPUT} mt-3 cursor-pointer`}
                >
                    {Object.entries(ESTADOS).map(([clave, texto]) => (
                        <option
                            key={clave}
                            value={clave}
                        >
                            {texto}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={!nombre.trim()}
                    className="mx-auto mt-6 block w-3/5 cursor-pointer rounded-xl bg-[#1f2d47] py-2 text-sm font-semibold text-white hover:bg-[#2c4066] disabled:cursor-not-allowed disabled:opacity-50"
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