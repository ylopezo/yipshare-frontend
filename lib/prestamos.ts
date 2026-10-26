import type { Tiempo } from "../components/ArticuloModal";

export type EstadoPrestamo = "pendiente" | "aceptado" | "en_curso" | "finalizado" | "rechazado";

export type Prestamo = {
    id: number;
    articuloId: number;
    nombre: string;
    imagen: string | null;
    duenio: string;
    prestatario: string;
    tiempo: Tiempo;
    estado: EstadoPrestamo;
    fin: number | null;
};

export type Codigo = { valor: string; expira: number };


export const DIAS: Record<Tiempo, number> = {
    "1 día": 1,
    "2 días": 2,
    "3 días": 3,
    "1 semana": 7,
    "2 semanas": 14,
    "1 mes": 30,
};

export const SEGUNDOS_CODIGO = 300;

export function nuevoCodigo(ahora: number): Codigo {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
    return { valor: String(n).padStart(6, "0"), expira: ahora + SEGUNDOS_CODIGO * 1000 };
}

export const codigoValido = (c: Codigo, escrito: string, ahora: number) =>
    escrito.trim() === c.valor && ahora < c.expira;

export const prestamoActivo = (p: Prestamo) => p.estado === "aceptado" || p.estado === "en_curso";

export function avanzar(p: Prestamo, ahora: number): Prestamo {
    if (p.estado === "aceptado") return { ...p, estado: "en_curso", fin: ahora + DIAS[p.tiempo] * 86_400_000 };
    if (p.estado === "en_curso") return { ...p, estado: "finalizado" };
    return p;
}