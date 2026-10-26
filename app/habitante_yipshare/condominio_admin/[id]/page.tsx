"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    ESTADOS,
    ArticuloModal,
    type Articulo,
    type Datos,
    type Estado,
    type Tiempo,
} from "@/components/ArticuloModal";
import { Icon } from "@/components/Icon";
import { ConfirmDialog } from "@/components/Modal";
import { PerfilHabitanteModal, type DatosPerfil, type PerfilUsuario } from "@/components/PerfilHabitanteModal";
import { PrestamosVista } from "@/components/PrestamoVista";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES } from "@/lib/datosHabitante";
import { avanzar, type EstadoPrestamo, type Prestamo } from "@/lib/prestamos";

const YO = "mi_usuario";

type Seccion = "inicio" | "solicitudes" | "prestamos" | "reportes" | "notificaciones";
type Pestana = "articulos" | "vecinos";
type EstadoReporte = "en_revision" | "pendiente" | "finalizado";

type Vecino = { id: number; nombre: string; usuario: string; depto: string; alCorriente: boolean };
type Aspirante = { id: number; nombre: string; usuario: string; depto: string };
type Reporte = { id: number; involucrado: string; reporto: string; detalles: string; estado: EstadoReporte };

type Confirmacion =
    | { tipo: "eliminar"; articulo: Articulo }
    | { tipo: "expulsar"; vecino: Vecino }
    | null;

// -Datos de ejemplo

const PERFIL_EJEMPLO: PerfilUsuario = {
    apellidoPaterno: "Pérez",
    apellidoMaterno: "López",
    nombres: "Juan Carlos",
    edificio: "Edificio 2",
    departamento: "Departamento 14",
    calificacion: 4.2,
};

const VECINOS_EJEMPLO: Vecino[] = [
    { id: 1, nombre: "Ana Martínez", usuario: "vecino_ana", depto: "Edificio 1, Dpto 3", alCorriente: true },
    { id: 2, nombre: "Luis Hernández", usuario: "vecino_luis", depto: "Edificio 1, Dpto 8", alCorriente: true },
    { id: 3, nombre: "Marta Ruiz", usuario: "vecino_marta", depto: "Edificio 3, Dpto 5", alCorriente: false },
];

const ASPIRANTES_EJEMPLO: Aspirante[] = [
    { id: 10, nombre: "Pedro Sánchez", usuario: "vecino_pedro", depto: "Edificio 2, Dpto 6" },
    { id: 11, nombre: "Laura Gómez", usuario: "vecino_laura", depto: "Edificio 4, Dpto 12" },
];

const REPORTES_EJEMPLO: Reporte[] = [
    { id: 1, involucrado: "vecino_luis", reporto: "vecino_ana", detalles: "No devolvió el artículo en la fecha acordada.", estado: "pendiente" },
    { id: 2, involucrado: "vecino_marta", reporto: "vecino_pedro", detalles: "El artículo se entregó dañado.", estado: "en_revision" },
];

const ARTICULOS_EJEMPLO: Articulo[] = [
    {
        id: 101,
        nombre: "Taladro",
        categoria: "Herramientas",
        descripcion: "Taladro inalámbrico con juego de brocas.",
        condicion: "Buen estado",
        tiempos: ["1 día", "2 días"],
        estado: "disponible",
        imagen: null,
        duenio: "vecino_ana",
        direccion: "Edificio 1, Departamento 3",
        calificacion: 4.5,
    },
    {
        id: 102,
        nombre: "Escalera",
        categoria: "Herramientas",
        descripcion: "Escalera de aluminio de 3 metros.",
        condicion: "Excelente estado",
        tiempos: ["1 día", "3 días"],
        estado: "disponible",
        imagen: null,
        duenio: "vecino_luis",
        direccion: "Edificio 1, Departamento 8",
        calificacion: 3.8,
    },
];

const PRESTAMOS_EJEMPLO: Prestamo[] = [
    { id: 1, articuloId: -1, nombre: "Taladro", imagen: null, duenio: "vecino_ana", prestatario: YO, tiempo: "2 días", estado: "pendiente", fin: null },
    { id: 2, articuloId: -2, nombre: "Escalera", imagen: null, duenio: YO, prestatario: "vecino_luis", tiempo: "1 día", estado: "pendiente", fin: null },
    { id: 3, articuloId: -3, nombre: "Bocina", imagen: null, duenio: "vecino_marta", prestatario: YO, tiempo: "3 días", estado: "aceptado", fin: null },
    { id: 4, articuloId: -4, nombre: "Podadora", imagen: null, duenio: YO, prestatario: "vecino_pedro", tiempo: "1 semana", estado: "aceptado", fin: null },
];

// -Estilos compartidos

const COLOR: Record<Estado, string> = {
    disponible: "bg-[#b9f0c8] text-green-900",
    pendiente: "bg-[#fde9a8] text-amber-900",
    no_disponible: "bg-[#f6b5b5] text-red-900",
};

const REPORTE_ESTADOS: { valor: EstadoReporte; texto: string; clase: string }[] = [
    { valor: "en_revision", texto: "En revisión", clase: "bg-[#dbe7f5] text-[#1e4a73]" },
    { valor: "pendiente", texto: "Pendiente", clase: "bg-[#fde9a8] text-amber-900" },
    { valor: "finalizado", texto: "Finalizado", clase: "bg-[#b9f0c8] text-green-900" },
];

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide";
const ICONO_HEADER = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";
const BOTON_OSCURO =
    "cursor-pointer rounded-full bg-[#1f2d47] text-white transition hover:bg-[#2c4066] disabled:cursor-not-allowed disabled:opacity-50";
const BOTON_PELIGRO =
    "cursor-pointer rounded-full border border-red-600 bg-white text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50";
const INPUT_LECTURA =
    "w-full rounded-full border border-slate-500 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default";

// -Componentes

function Tarjeta({ a, onVer, onEditar }: { a: Articulo; onVer: () => void; onEditar?: () => void }) {
    return (
        <div className="flex w-48 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            <button
                type="button"
                onClick={onVer}
                className="flex flex-1 cursor-pointer flex-col text-left hover:bg-slate-50"
            >
                <div className="h-28 w-full shrink-0 bg-[#e4e4e4]">
                    {a.imagen && <img src={a.imagen} alt={a.nombre} className="h-full w-full object-cover" />}
                </div>

                <div className="flex flex-col px-3 pb-3 pt-2">
                    <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${COLOR[a.estado]}`}>
                        {ESTADOS[a.estado]}
                    </span>
                    <p className="m-0 mt-1 break-words text-lg font-bold text-[#1e4a73]">{a.nombre}</p>
                    <p className="m-0 text-[10px] text-slate-500">{a.duenio}</p>
                </div>
            </button>

            {onEditar && (
                <button
                    type="button"
                    onClick={onEditar}
                    className="cursor-pointer self-center pb-3 pt-1 text-[11px] font-semibold text-[#5aa0e8] hover:underline"
                >
                    Editar Artículo
                </button>
            )}
        </div>
    );
}

function Ficha({
                   a,
                   onVolver,
                   onSolicitar,
                   onEliminar,
                   eliminarBloqueado,
               }: {
    a: Articulo;
    onVolver: () => void;
    onSolicitar?: (tiempo: Tiempo) => void;
    onEliminar: () => void;
    eliminarBloqueado: boolean;
}) {
    const [tiempo, setTiempo] = useState<Tiempo>(a.tiempos[0]);

    return (
        <>
            <button
                type="button"
                aria-label="Volver"
                onClick={onVolver}
                className="cursor-pointer rounded-full p-2 text-[#1e4a73] transition hover:bg-white"
            >
                <Icon name="arrow" size={28} />
            </button>

            <div className="mx-auto mt-2 w-full max-w-2xl rounded-[2.5rem] bg-white px-8 py-6 shadow-sm">
                <div className="h-64 overflow-hidden rounded-2xl bg-[#e4e4e4]">
                    {a.imagen && <img src={a.imagen} alt={a.nombre} className="h-full w-full object-cover" />}
                </div>

                <span className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold ${COLOR[a.estado]}`}>
                    {ESTADOS[a.estado]}
                </span>

                <h2 className="m-0 mt-2 break-words text-lg font-bold uppercase text-[#1e4a73]">{a.nombre}</h2>
                <p className="m-0 text-xs font-bold">{a.categoria}</p>

                <p className="mb-0 mt-3 break-words text-xs font-semibold">{a.descripcion}</p>
                <p className="mb-0 mt-2 text-xs text-slate-500">
                    {a.condicion} · Préstamo: {a.tiempos.join(", ")}
                </p>

                <hr className="my-4 border-slate-300" />

                <div className="flex items-center gap-4">
                    <span className="text-slate-500">
                        <Icon name="user" size={44} />
                    </span>

                    <div className="min-w-0">
                        <p className="m-0 break-words text-base font-bold text-[#1e4a73]">
                            {a.duenio} - {a.direccion}
                        </p>

                        <div
                            role="img"
                            aria-label={`Calificación ${a.calificacion.toFixed(1)} de 5`}
                            className="flex items-center gap-1"
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <span
                                    key={n}
                                    aria-hidden="true"
                                    className={`text-xl ${n <= Math.round(a.calificacion) ? "text-amber-400" : "text-slate-700"}`}
                                >
                                    {n <= Math.round(a.calificacion) ? "★" : "☆"}
                                </span>
                            ))}
                            <span className="ml-1 text-xs font-bold">{a.calificacion.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {onSolicitar && (
                <>
                    <div className="mx-auto mt-6 w-full max-w-xs text-center">
                        <p className="m-0 text-xs font-bold text-[#1e4a73]">Tiempo de préstamo</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                            {a.tiempos.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    aria-pressed={tiempo === t}
                                    onClick={() => setTiempo(t)}
                                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                        tiempo === t
                                            ? "border-[#1e4a73] bg-[#1e4a73] text-white"
                                            : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={a.estado !== "disponible"}
                        onClick={() => onSolicitar(tiempo)}
                        className="mx-auto mt-4 block w-full max-w-xs cursor-pointer rounded-full bg-[#1e4a73] py-2 text-base font-bold text-white hover:bg-[#2a6aa8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Solicitar Artículo
                    </button>
                </>
            )}

            {/* Acción exclusiva del administrador */}
            <button
                type="button"
                disabled={eliminarBloqueado}
                onClick={onEliminar}
                className={`${BOTON_PELIGRO} mx-auto mt-3 block w-full max-w-xs py-2 text-sm font-bold`}
            >
                Eliminar publicación
            </button>
            {eliminarBloqueado && (
                <p className="mx-auto mb-0 mt-2 max-w-xs text-center text-xs text-slate-500">
                    No se puede eliminar mientras el artículo esté en préstamo.
                </p>
            )}
        </>
    );
}

function Interruptor({
                         activo,
                         onCambiar,
                         label,
                     }: {
    activo: boolean;
    onCambiar: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={activo}
            aria-label={label}
            onClick={onCambiar}
            className={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition ${
                activo ? "bg-[#1e4a73]" : "bg-slate-300"
            }`}
        >
            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                    activo ? "left-7" : "left-1"
                }`}
            />
        </button>
    );
}

function VecinosVista({
                          vecinos,
                          onPermiso,
                          onExpulsar,
                      }: {
    vecinos: Vecino[];
    onPermiso: (v: Vecino) => void;
    onExpulsar: (v: Vecino) => void;
}) {
    if (vecinos.length === 0) {
        return <p className="m-0 text-sm text-slate-500">No hay vecinos.</p>;
    }

    return (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {vecinos.map((v) => (
                <li
                    key={v.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
                >
                    <div className="min-w-0 flex-1 basis-40">
                        <p className="m-0 break-words text-sm font-bold">{v.nombre}</p>
                        <p className={`m-0 text-[11px] ${v.alCorriente ? "text-[#5aa0e8]" : "text-red-600"}`}>
                            {v.alCorriente ? "Al Corriente" : "Adeudo de Mantenimiento"}
                        </p>
                    </div>

                    <p className="m-0 flex-1 basis-40 text-xs font-bold">Dpto/Casa: {v.depto}</p>

                    <div className="flex items-center gap-4">
                        <Interruptor
                            activo={v.alCorriente}
                            onCambiar={() => onPermiso(v)}
                            label={`Permiso para pedir artículos de ${v.nombre}`}
                        />
                        <button
                            type="button"
                            onClick={() => onExpulsar(v)}
                            className={`${BOTON_PELIGRO} px-3 py-1 text-xs font-semibold`}
                        >
                            Expulsar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function SolicitudesVista({
                              aspirantes,
                              onResponder,
                          }: {
    aspirantes: Aspirante[];
    onResponder: (a: Aspirante, aceptar: boolean) => void;
}) {
    return (
        <>
            <h2 className="m-0 text-base font-bold">Solicitudes</h2>

            {aspirantes.length === 0 ? (
                <p className="mb-0 mt-3 text-sm text-slate-500">No hay solicitudes pendientes.</p>
            ) : (
                <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
                    {aspirantes.map((a) => (
                        <li
                            key={a.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-400 bg-white px-4 py-3"
                        >
                            <p className="m-0 min-w-0 flex-1 basis-40 break-words text-sm font-bold">{a.nombre}</p>
                            <p className="m-0 flex-1 basis-40 text-xs font-bold">Dpto/Casa: {a.depto}</p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => onResponder(a, true)}
                                    className={`${BOTON_OSCURO} px-4 py-1 text-xs font-semibold`}
                                >
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onResponder(a, false)}
                                    className="cursor-pointer rounded-full border border-[#1f2d47] bg-white px-4 py-1 text-xs font-semibold text-[#1f2d47] transition hover:bg-slate-100"
                                >
                                    Denegar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

function ReportesVista({
                           reportes,
                           onCambiarEstado,
                       }: {
    reportes: Reporte[];
    onCambiarEstado: (id: number, estado: EstadoReporte) => void;
}) {
    const [seleccionId, setSeleccionId] = useState<number | null>(null);
    const [estado, setEstado] = useState<EstadoReporte>("pendiente");

    const seleccionado = reportes.find((r) => r.id === seleccionId) ?? null;

    function elegir(r: Reporte) {
        setSeleccionId(r.id);
        setEstado(r.estado);
    }

    return (
        <>
            <h2 className="m-0 text-base font-bold">Reportes</h2>

            <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,380px)_1fr]">
                <div className="rounded-[2rem] bg-white px-6 py-6 shadow-sm">
                    <label className="sr-only" htmlFor="rep-involucrado">Vecino involucrado</label>
                    <input
                        id="rep-involucrado"
                        readOnly
                        placeholder="Nombre del vecino involucrado"
                        value={seleccionado?.involucrado ?? ""}
                        className={INPUT_LECTURA}
                    />

                    <label className="sr-only" htmlFor="rep-reporto">Vecino que reportó</label>
                    <input
                        id="rep-reporto"
                        readOnly
                        placeholder="Nombre del vecino que reportó"
                        value={seleccionado?.reporto ?? ""}
                        className={`${INPUT_LECTURA} mt-3`}
                    />

                    <label className="sr-only" htmlFor="rep-detalles">Detalles del reporte</label>
                    <textarea
                        id="rep-detalles"
                        readOnly
                        rows={3}
                        placeholder="Detalles del reporte"
                        value={seleccionado?.detalles ?? ""}
                        className="mt-3 w-full resize-none rounded-2xl border border-slate-500 bg-[#eeeeee] px-4 py-2 text-sm text-slate-700 outline-none read-only:cursor-default"
                    />

                    <p className="mb-2 mt-4 text-xs font-bold text-[#1e4a73]">Estado del reporte</p>
                    <div className="flex flex-wrap gap-2">
                        {REPORTE_ESTADOS.map((e) => (
                            <button
                                key={e.valor}
                                type="button"
                                disabled={!seleccionado}
                                aria-pressed={estado === e.valor}
                                onClick={() => setEstado(e.valor)}
                                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    estado === e.valor
                                        ? "border-[#1e4a73] bg-[#1e4a73] text-white"
                                        : "border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {e.texto}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={!seleccionado || estado === seleccionado.estado}
                        onClick={() => seleccionado && onCambiarEstado(seleccionado.id, estado)}
                        className={`${BOTON_OSCURO} mx-auto mt-6 block w-full max-w-xs py-2 text-sm font-semibold`}
                    >
                        Modificar Estado
                    </button>
                </div>

                <section>
                    <h3 className="m-0 text-sm font-bold text-slate-700">Reportes Recibidos</h3>

                    {reportes.length === 0 ? (
                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay reportes.</p>
                    ) : (
                        <ul className="m-0 mt-3 list-none p-0">
                            {reportes.map((r) => {
                                const info = REPORTE_ESTADOS.find((e) => e.valor === r.estado)!;
                                return (
                                    <li key={r.id} className="border-b border-slate-300">
                                        <button
                                            type="button"
                                            aria-pressed={seleccionId === r.id}
                                            onClick={() => elegir(r)}
                                            className={`flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-2 text-left text-xs font-bold hover:bg-white ${
                                                seleccionId === r.id ? "bg-white" : ""
                                            }`}
                                        >
                                            <span className="min-w-0 truncate">
                                                Reporte contra {r.involucrado}
                                            </span>
                                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${info.clase}`}>
                                                {info.texto}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}

// -Página

export default function CondominioAdminPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [articulos, setArticulos] = useState<Articulo[]>(ARTICULOS_EJEMPLO);
    const [prestamos, setPrestamos] = useState<Prestamo[]>(PRESTAMOS_EJEMPLO);
    const [vecinos, setVecinos] = useState<Vecino[]>(VECINOS_EJEMPLO);
    const [aspirantes, setAspirantes] = useState<Aspirante[]>(ASPIRANTES_EJEMPLO);
    const [reportes, setReportes] = useState<Reporte[]>(REPORTES_EJEMPLO);

    const [seccion, setSeccion] = useState<Seccion>("inicio");
    const [previa, setPrevia] = useState<Seccion>("inicio");
    const [pestana, setPestana] = useState<Pestana>("articulos");
    const [busqueda, setBusqueda] = useState("");
    const [perfil, setPerfil] = useState(false);
    const [salir, setSalir] = useState(false);
    const [datosPerfil, setDatosPerfil] = useState(PERFIL_EJEMPLO);
    const [modal, setModal] = useState<Articulo | "nuevo" | null>(null);
    const [detalleId, setDetalleId] = useState<number | null>(null);
    const [confirmar, setConfirmar] = useState<Confirmacion>(null);

    const condominio = REGISTRADOS_INICIALES.find((c) => String(c.id) === id);

    if (!condominio) {
        return (
            <main className="p-10">
                <p>No se encontró el condominio.</p>

                <Link
                    href="/admin_yipshare/principal_page"
                    className="font-bold text-[#2a6aa8] hover:underline"
                >
                    Volver
                </Link>
            </main>
        );
    }

    function irA(destino: Seccion) {
        setSeccion(destino);
        setDetalleId(null);
        setBusqueda("");
    }

    function abrirNotificaciones() {
        setPrevia(seccion);
        setSeccion("notificaciones");
        setDetalleId(null);
    }

    function cambiarPestana(p: Pestana) {
        setPestana(p);
        setBusqueda("");
        setDetalleId(null);
    }

    // -Artículos

    function guardar(datos: Datos) {
        if (modal === "nuevo") {
            const randomId = crypto.getRandomValues(new Uint32Array(1))[0];

            setArticulos((prev) => [
                ...prev,
                {
                    ...datos,
                    id: randomId,
                    duenio: YO,
                    direccion: `${datosPerfil.edificio}, ${datosPerfil.departamento}`,
                    calificacion: datosPerfil.calificacion,
                },
            ]);
        } else if (modal) {
            const editado = modal.id;
            setArticulos((prev) => prev.map((a) => (a.id === editado ? { ...a, ...datos } : a)));
        }

        setModal(null);
    }

    function cambiarEstadoArticulo(idArticulo: number, estado: Estado) {
        setArticulos((prev) => prev.map((a) => (a.id === idArticulo ? { ...a, estado } : a)));
    }

    function eliminarArticulo(a: Articulo) {
        // TODO: borrar la publicación en el backend y avisar al dueño
        setArticulos((prev) => prev.filter((x) => x.id !== a.id));
        setPrestamos((prev) =>
            prev.filter((p) => !(p.articuloId === a.id && (p.estado === "pendiente" || p.estado === "aceptado")))
        );
        setDetalleId(null);
    }

    // -Préstamos

    function solicitar(a: Articulo, tiempo: Tiempo) {
        // TODO: enviar la solicitud al backend
        const nuevo: Prestamo = {
            id: crypto.getRandomValues(new Uint32Array(1))[0],
            articuloId: a.id,
            nombre: a.nombre,
            imagen: a.imagen,
            duenio: a.duenio,
            prestatario: YO,
            tiempo,
            estado: "pendiente",
            fin: null,
        };

        setPrestamos((prev) => [...prev, nuevo]);
        cambiarEstadoArticulo(a.id, "pendiente");
    }

    function responder(p: Prestamo, aceptar: boolean) {
        // TODO: avisar al backend
        const estado: EstadoPrestamo = aceptar ? "aceptado" : "rechazado";

        setPrestamos((prev) => prev.map((x) => (x.id === p.id ? { ...x, estado } : x)));
        if (!aceptar) cambiarEstadoArticulo(p.articuloId, "disponible");
    }

    function registrarCodigo(p: Prestamo) {
        // TODO: validar el código en el backend
        const actualizado = avanzar(p, Date.now());

        setPrestamos((prev) => prev.map((x) => (x.id === p.id ? actualizado : x)));
        if (actualizado.estado === "en_curso") cambiarEstadoArticulo(p.articuloId, "no_disponible");
        if (actualizado.estado === "finalizado") cambiarEstadoArticulo(p.articuloId, "disponible");
    }

    // -Vecinos

    function alternarPermiso(v: Vecino) {
        // TODO: guardar el permiso en el backend (si es false, no puede pedir artículos)
        setVecinos((prev) => prev.map((x) => (x.id === v.id ? { ...x, alCorriente: !x.alCorriente } : x)));
    }

    function expulsar(v: Vecino) {
        // TODO: sacar al vecino del condominio en el backend
        const quitados = prestamos.filter(
            (p) =>
                (p.duenio === v.usuario || p.prestatario === v.usuario) &&
                (p.estado === "pendiente" || p.estado === "aceptado")
        );
        const idsQuitados = new Set(quitados.map((p) => p.id));
        const articulosLiberados = new Set(quitados.map((p) => p.articuloId));

        setPrestamos((prev) => prev.filter((p) => !idsQuitados.has(p.id)));
        setArticulos((prev) =>
            prev
                .filter((a) => a.duenio !== v.usuario)
                .map((a) => (articulosLiberados.has(a.id) ? { ...a, estado: "disponible" } : a))
        );
        setVecinos((prev) => prev.filter((x) => x.id !== v.id));
    }

    function responderAspirante(a: Aspirante, aceptar: boolean) {
        // TODO: avisar al backend
        setAspirantes((prev) => prev.filter((x) => x.id !== a.id));
        if (aceptar) {
            setVecinos((prev) => [
                ...prev,
                { id: a.id, nombre: a.nombre, usuario: a.usuario, depto: a.depto, alCorriente: true },
            ]);
        }
    }

    function cambiarEstadoReporte(idReporte: number, estado: EstadoReporte) {
        // TODO: guardar en el backend
        setReportes((prev) => prev.map((r) => (r.id === idReporte ? { ...r, estado } : r)));
    }

    function handleConfirmar() {
        if (confirmar?.tipo === "eliminar") eliminarArticulo(confirmar.articulo);
        if (confirmar?.tipo === "expulsar") expulsar(confirmar.vecino);
        setConfirmar(null);
    }

    // - Datos derivados

    const texto = busqueda.trim().toLowerCase();

    const detalle = articulos.find((a) => a.id === detalleId);
    const visibles = articulos.filter((a) => a.nombre.toLowerCase().includes(texto));
    const mios = visibles.filter((a) => a.duenio === YO);
    const deOtros = visibles.filter((a) => a.duenio !== YO);

    const vecinosVisibles = vecinos.filter((v) => `${v.nombre} ${v.usuario}`.toLowerCase().includes(texto));

    const enCurso = (articuloId: number) =>
        prestamos.some((p) => p.articuloId === articuloId && p.estado === "en_curso");

    const claseItem = (activo: boolean) =>
        `${ITEM} cursor-pointer ${activo ? "text-white" : "text-white/40 hover:text-white/80"}`;

    const enNotificaciones = seccion === "notificaciones";

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#e9eef3] font-sans text-black">
            <header className="flex h-[100px] shrink-0 items-center gap-4 bg-[#1e4a73] px-4 text-white md:px-6">
                <Link href="/admin_yipshare/principal_page" aria-label="Volver a mis condominios">
                    <Image
                        src="/img/logo_yipshare_icono.png"
                        alt="YipShare"
                        width={190}
                        height={56}
                        priority
                        className="h-14 w-auto object-contain"
                    />
                </Link>

                <div className="ml-2 min-w-0 md:ml-14">
                    <h1 className="m-0 truncate text-2xl font-bold md:text-3xl">Hola, {NOMBRE_USUARIO}</h1>
                    <p className="m-0 truncate text-sm font-semibold text-[#78b0ea]">{condominio.nombre}</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Agregar artículo"
                            onClick={() => setModal("nuevo")}
                            className={ICONO_HEADER}
                        >
                            <Icon name="plus" size={28} />
                        </button>

                        <button
                            type="button"
                            aria-label="Notificaciones"
                            onClick={abrirNotificaciones}
                            className={ICONO_HEADER}
                        >
                            <Icon name="bell" size={28} />
                        </button>

                        <button
                            type="button"
                            aria-label="Perfil"
                            onClick={() => setPerfil(true)}
                            className={ICONO_HEADER}
                        >
                            <Icon name="user" size={30} />
                        </button>
                    </div>

                    {seccion === "inicio" && !detalle && (
                        <div className="relative hidden sm:block">
                            <input
                                aria-label={pestana === "articulos" ? "Buscar artículo" : "Buscar vecino"}
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder={pestana === "articulos" ? "Buscar artículo..." : "Buscar vecino..."}
                                className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:bg-white/20 lg:w-80"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <Icon name="search" size={18} />
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                {!enNotificaciones && (
                    <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-[#1e4a73] px-1 pt-8 md:w-56 md:px-3">
                        <button
                            type="button"
                            onClick={() => irA("inicio")}
                            aria-current={seccion === "inicio" ? "page" : undefined}
                            className={claseItem(seccion === "inicio")}
                        >
                            <Icon name="house" size={26} />
                            <span className="hidden md:inline">Inicio</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => irA("solicitudes")}
                            aria-current={seccion === "solicitudes" ? "page" : undefined}
                            className={`${claseItem(seccion === "solicitudes")} relative`}
                        >
                            <Icon name="bell" size={26} />
                            <span className="hidden md:inline">Solicitudes</span>
                            {aspirantes.length > 0 && (
                                <span
                                    aria-label={`${aspirantes.length} solicitudes pendientes`}
                                    className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white md:right-3 md:top-3"
                                >
                                    {aspirantes.length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => irA("prestamos")}
                            aria-current={seccion === "prestamos" ? "page" : undefined}
                            className={claseItem(seccion === "prestamos")}
                        >
                            <Icon name="calendar" size={26} />
                            <span className="hidden md:inline">Préstamos</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => irA("reportes")}
                            aria-current={seccion === "reportes" ? "page" : undefined}
                            className={claseItem(seccion === "reportes")}
                        >
                            <Icon name="alert" size={26} />
                            <span className="hidden md:inline">Reportes</span>
                        </button>

                        <button type="button" onClick={() => setPerfil(true)} className={claseItem(false)}>
                            <Icon name="user" size={26} />
                            <span className="hidden md:inline">Perfil</span>
                        </button>

                        <button type="button" onClick={() => setSalir(true)} className={claseItem(false)}>
                            <Icon name="logout" size={26} />
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>
                    </aside>
                )}

                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {seccion === "notificaciones" ? (
                        <>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    aria-label="Volver"
                                    onClick={() => setSeccion(previa)}
                                    className="cursor-pointer rounded-full p-1 text-black transition hover:bg-white"
                                >
                                    <Icon name="arrow" size={24} />
                                </button>
                                <h2 className="m-0 text-base font-bold">Notificaciones</h2>
                            </div>

                            <p className="mt-24 text-center text-xl font-bold text-[#78b0ea]">
                                No tienes notificaciones por el momento
                            </p>
                        </>
                    ) : seccion === "solicitudes" ? (
                        <SolicitudesVista aspirantes={aspirantes} onResponder={responderAspirante} />
                    ) : seccion === "prestamos" ? (
                        <PrestamosVista
                            prestamos={prestamos}
                            usuario={YO}
                            onResponderAction={responder}
                            onCodigoAction={registrarCodigo}
                        />
                    ) : seccion === "reportes" ? (
                        <ReportesVista reportes={reportes} onCambiarEstado={cambiarEstadoReporte} />
                    ) : detalle ? (
                        <Ficha
                            key={detalle.id}
                            a={detalle}
                            onVolver={() => setDetalleId(null)}
                            onSolicitar={detalle.duenio !== YO ? (tiempo) => solicitar(detalle, tiempo) : undefined}
                            onEliminar={() => setConfirmar({ tipo: "eliminar", articulo: detalle })}
                            eliminarBloqueado={enCurso(detalle.id)}
                        />
                    ) : (
                        <>
                            <div className="flex justify-center gap-6">
                                {(["articulos", "vecinos"] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        aria-pressed={pestana === p}
                                        onClick={() => cambiarPestana(p)}
                                        className={`w-32 cursor-pointer rounded-xl border px-4 py-1.5 text-sm font-bold transition ${
                                            pestana === p
                                                ? "border-[#1e4a73] bg-[#1e4a73] text-white"
                                                : "border-slate-400 bg-[#d3d6da] text-slate-500 hover:bg-[#c5c9ce]"
                                        }`}
                                    >
                                        {p === "articulos" ? "Artículos" : "Vecinos"}
                                    </button>
                                ))}
                            </div>

                            {pestana === "vecinos" ? (
                                <div className="mt-6">
                                    <VecinosVista
                                        vecinos={vecinosVisibles}
                                        onPermiso={alternarPermiso}
                                        onExpulsar={(v) => setConfirmar({ tipo: "expulsar", vecino: v })}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="m-0 mt-4 text-base font-bold">Mis Artículos</h2>

                                    {mios.length === 0 && (
                                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        {mios.map((a) => (
                                            <Tarjeta
                                                key={a.id}
                                                a={a}
                                                onVer={() => setDetalleId(a.id)}
                                                onEditar={() => setModal(a)}
                                            />
                                        ))}

                                        <button
                                            type="button"
                                            aria-label="Agregar artículo"
                                            onClick={() => setModal("nuevo")}
                                            className="ml-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#1e4a73] text-white shadow-md hover:bg-[#2a6aa8]"
                                        >
                                            <Icon name="plus" size={26} />
                                        </button>
                                    </div>

                                    <h2 className="m-0 mt-10 text-base font-bold">Artículos Disponibles</h2>

                                    {deOtros.length === 0 && (
                                        <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-4">
                                        {deOtros.map((a) => (
                                            <Tarjeta key={a.id} a={a} onVer={() => setDetalleId(a.id)} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </main>
            </div>

            {perfil && (
                <PerfilHabitanteModal
                    perfil={datosPerfil}
                    onActualizarAction={(datos: DatosPerfil) => {
                        // TODO: guardar `datos` en el backend
                        setDatosPerfil({ ...datosPerfil, ...datos });
                        setPerfil(false);
                    }}
                    onEliminarAction={() => {
                        // TODO: borrar la cuenta en el backend
                        router.replace("/login");
                    }}
                    onCloseAction={() => setPerfil(false)}
                />
            )}

            {modal && (
                <ArticuloModal
                    key={modal === "nuevo" ? "nuevo" : modal.id}
                    articulo={modal === "nuevo" ? null : modal}
                    onGuardarAction={guardar}
                    onCancelarAction={() => setModal(null)}
                />
            )}

            {confirmar && (
                <ConfirmDialog
                    titulo={confirmar.tipo === "eliminar" ? "¿Eliminar publicación?" : "¿Expulsar vecino?"}
                    mensaje={
                        confirmar.tipo === "eliminar"
                            ? `Se eliminará «${confirmar.articulo.nombre}» de ${confirmar.articulo.duenio} y se cancelarán sus solicitudes pendientes.`
                            : `${confirmar.vecino.nombre} saldrá del condominio y se eliminarán sus artículos y préstamos pendientes.`
                    }
                    onConfirmarAction={handleConfirmar}
                    onCancelarAction={() => setConfirmar(null)}
                />
            )}

            {salir && (
                <ConfirmDialog
                    titulo="¿Estás seguro?"
                    mensaje="Se cerrará tu sesión."
                    onConfirmarAction={() => router.replace("/login")}
                    onCancelarAction={() => setSalir(false)}
                />
            )}
        </div>
    );
}