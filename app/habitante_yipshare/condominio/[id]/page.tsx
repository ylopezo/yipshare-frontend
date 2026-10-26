"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ESTADOS, ArticuloModal, type Articulo, type Datos, type Estado, type Tiempo } from "@/components/ArticuloModal";
import { Icon, type IconName } from "@/components/Icon";
import { ConfirmDialog } from "@/components/Modal";
import { PrestamosVista } from "@/components/PrestamoVista";
import { ReportarVista, type DatosReporte } from "@/components/ReportarVista";
import { PerfilHabitanteModal, type DatosPerfil, type PerfilUsuario } from "@/components/PerfilHabitanteModal";
import { avanzar, type Prestamo } from "@/lib/prestamos";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES, UNIDOS_INICIALES } from "@/lib/datosHabitante";

const YO = "mi_usuario";

type Seccion = "inicio" | "prestamos" | "reportes";

const PERFIL_EJEMPLO: PerfilUsuario = {
    apellidoPaterno: "Pérez",
    apellidoMaterno: "López",
    nombres: "Juan Carlos",
    edificio: "Edificio 2",
    departamento: "Departamento 14",
    calificacion: 4.2,
};

const COLOR: Record<Estado, string> = {
    disponible: "bg-[#b9f0c8] text-green-900",
    pendiente: "bg-[#fde9a8] text-amber-900",
    no_disponible: "bg-[#f6b5b5] text-red-900",
};

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide";
const ICONO_HEADER = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

function Tarjeta({
                     a,
                     onVer,
                     onEditar,
                 }: {
    a: Articulo;
    onVer: () => void;
    onEditar?: () => void;
}) {
    return (
        <div className="flex w-48 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            <button
                type="button"
                onClick={onVer}
                className="flex flex-1 cursor-pointer flex-col text-left hover:bg-slate-50"
            >
                <div className="h-28 w-full shrink-0 bg-[#e4e4e4]">
                    {a.imagen && (
                        <img
                            src={a.imagen}
                            alt={a.nombre}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col px-3 pb-3 pt-2">
                    <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${COLOR[a.estado]}`}>
                        {ESTADOS[a.estado]}
                    </span>

                    <p className="m-0 mt-1 break-words text-lg font-bold text-[#1e4a73]">
                        {a.nombre}
                    </p>

                    <p className="m-0 text-[10px] text-slate-500">
                        {a.duenio}
                    </p>
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
               }: {
    a: Articulo;
    onVolver: () => void;
    onSolicitar?: (tiempo: Tiempo) => void;
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
                    {a.imagen && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={a.imagen}
                            alt={a.nombre}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <span className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold ${COLOR[a.estado]}`}>
                    {ESTADOS[a.estado]}
                </span>

                <h2 className="m-0 mt-2 break-words text-lg font-bold uppercase text-[#1e4a73]">
                    {a.nombre}
                </h2>
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
                <div className="mx-auto mt-6 flex w-full max-w-xs flex-col gap-3">
                    <select
                        aria-label="Tiempo de préstamo"
                        value={tiempo}
                        onChange={(e) => setTiempo(e.target.value as Tiempo)}
                        className="w-full cursor-pointer rounded-full border border-slate-500 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1e4a73]"
                    >
                        {a.tiempos.map((t) => (
                            <option key={t} value={t}>
                                Préstamo por {t}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        disabled={a.estado !== "disponible"}
                        onClick={() => onSolicitar(tiempo)}
                        className="w-full cursor-pointer rounded-full bg-[#1e4a73] py-2 text-base font-bold text-white hover:bg-[#2a6aa8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Solicitar Artículo
                    </button>
                </div>
            )}
        </>
    );
}

export default function InicioPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [perfil, setPerfil] = useState(false);
    const [salir, setSalir] = useState(false);
    const [datosPerfil, setDatosPerfil] = useState(PERFIL_EJEMPLO);
    const [modal, setModal] = useState<Articulo | "nuevo" | null>(null);
    const [detalleId, setDetalleId] = useState<number | null>(null);
    const [seccion, setSeccion] = useState<Seccion>("inicio");
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

    const condominio = [...REGISTRADOS_INICIALES, ...UNIDOS_INICIALES].find(
        (c) => String(c.id) === id
    );

    if (!condominio) {
        return (
            <main className="p-10">
                <p>No se encontró el condominio.</p>

                <Link
                    href="/habitante_yipshare/principal_page"
                    className="font-bold text-[#2a6aa8] hover:underline"
                >
                    Volver
                </Link>
            </main>
        );
    }

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

            setArticulos((prev) =>
                prev.map((a) => (a.id === editado ? { ...a, ...datos } : a))
            );
        }

        setModal(null);
    }

    function cambiarEstado(idArticulo: number, estado: Estado) {
        setArticulos((prev) => prev.map((a) => (a.id === idArticulo ? { ...a, estado } : a)));
    }

    function solicitar(a: Articulo, tiempo: Tiempo) {
        // TODO: enviar la solicitud al backend
        const randomId = crypto.getRandomValues(new Uint32Array(1))[0];

        setPrestamos((prev) => [
            ...prev,
            {
                id: randomId,
                articuloId: a.id,
                nombre: a.nombre,
                imagen: a.imagen,
                duenio: a.duenio,
                prestatario: YO,
                tiempo,
                estado: "pendiente",
                fin: null,
            },
        ]);
        cambiarEstado(a.id, "pendiente");
        setDetalleId(null);
        setSeccion("prestamos");
    }

    function responder(p: Prestamo, aceptar: boolean) {
        // TODO: enviar la respuesta al backend
        setPrestamos((prev) =>
            prev.map((x) => (x.id === p.id ? { ...x, estado: aceptar ? "aceptado" : "rechazado" } : x))
        );
        if (!aceptar) cambiarEstado(p.articuloId, "disponible");
    }

    function registrarCodigo(p: Prestamo) {
        // TODO: validar el código en el backend
        const nuevo = avanzar(p, Date.now());

        setPrestamos((prev) => prev.map((x) => (x.id === p.id ? nuevo : x)));
        cambiarEstado(p.articuloId, nuevo.estado === "en_curso" ? "no_disponible" : "disponible");
    }

    function reportar(datos: DatosReporte) {
        // TODO: enviar el reporte al backend para que lo revise el administrador del condominio
        void datos;
    }

    const detalle = articulos.find((a) => a.id === detalleId);

    const visibles = articulos.filter((a) =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const mios = visibles.filter((a) => a.duenio === YO);
    const deOtros = visibles.filter((a) => a.duenio !== YO);

    const secciones: { id: Seccion; label: string; icon: IconName }[] = [
        { id: "inicio", label: "Inicio", icon: "house" },
        { id: "prestamos", label: "Préstamos", icon: "calendar" },
        { id: "reportes", label: "Reportes", icon: "alert" },
    ];

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#e9eef3] font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-[#1e4a73] px-4 text-white md:px-6">
                <Link
                    href="/habitante_yipshare/principal_page"
                    aria-label="Volver a mis condominios"
                >
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
                    <h1 className="m-0 truncate text-2xl font-bold md:text-3xl">
                        Hola, {NOMBRE_USUARIO}
                    </h1>

                    <p className="m-0 truncate text-sm font-semibold text-[#78b0ea]">
                        {condominio.nombre}
                    </p>
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

                    <div className="relative hidden sm:block">
                        <input
                            aria-label="Buscar artículo"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setDetalleId(null);
                            }}
                            placeholder="Buscar artículo..."
                            className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:bg-white/20 lg:w-80"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <Icon name="search" size={18} />
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-[#1e4a73] px-1 pt-8 md:w-56 md:px-3">
                    {secciones.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setSeccion(id);
                                setDetalleId(null);
                            }}
                            aria-current={seccion === id ? "page" : undefined}
                            className={`${ITEM} cursor-pointer ${
                                seccion === id ? "text-white" : "text-white/40 hover:text-white/80"
                            }`}
                        >
                            <Icon name={icon} size={26} />
                            <span className="hidden md:inline">{label}</span>
                        </button>
                    ))}


                    <button
                        type="button"
                        onClick={() => setPerfil(true)}
                        className={`${ITEM} cursor-pointer text-white/40 hover:text-white/80`}
                    >
                        <Icon name="user" size={26} />
                        <span className="hidden md:inline">Perfil</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSalir(true)}
                        className={`${ITEM} cursor-pointer text-white/40 hover:text-white/80`}
                    >
                        <Icon name="logout" size={26} />
                        <span className="hidden md:inline">Cerrar sesión</span>
                    </button>
                </aside>

                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
                    {seccion === "prestamos" ? (
                        <PrestamosVista
                            prestamos={prestamos}
                            usuario={YO}
                            onResponderAction={responder}
                            onCodigoAction={registrarCodigo}
                        />
                    ) : seccion === "reportes" ? (
                        <ReportarVista prestamos={prestamos} usuario={YO} onEnviarAction={reportar} />
                    ) : detalle ? (
                        <Ficha
                            a={detalle}
                            onVolver={() => setDetalleId(null)}
                            onSolicitar={detalle.duenio !== YO ? (tiempo) => solicitar(detalle, tiempo) : undefined}
                        />
                    ) : (
                        <>
                            <h2 className="m-0 text-base font-bold">Mis Artículos</h2>

                            {mios.length === 0 && (
                                <p className="mb-0 mt-3 text-sm text-slate-500">
                                    No hay artículos.
                                </p>
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

                            <h2 className="m-0 mt-10 text-base font-bold">
                                Artículos Disponibles
                            </h2>

                            {deOtros.length === 0 && (
                                <p className="mb-0 mt-3 text-sm text-slate-500">
                                    No hay artículos.
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-4">
                                {deOtros.map((a) => (
                                    <Tarjeta
                                        key={a.id}
                                        a={a}
                                        onVer={() => setDetalleId(a.id)}
                                    />
                                ))}
                            </div>
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