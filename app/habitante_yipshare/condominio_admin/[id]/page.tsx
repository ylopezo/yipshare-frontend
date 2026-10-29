"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArticuloModal, type Articulo, type Datos, type Estado, type Tiempo } from "@/components/ArticuloModal";
import { ArticuloFicha, ArticuloTarjeta } from "@/components/ArticuloVista";
import { Icon, type IconName } from "@/components/Icon";
import { Cargando, useCargando } from "@/components/Cargando";
import { ConfirmDialog } from "@/components/Modal";
import { PerfilHabitanteModal, type DatosPerfil, type PerfilUsuario } from "@/components/PerfilHabitanteModal";
import { PrestamosVista } from "@/components/PrestamoVista";
import { ReportesVista, type EstadoReporte, type Reporte } from "@/components/ReportesVista";
import { SolicitudesVista, type Aspirante } from "@/components/SolicitudesVista";
import { TodosPrestamosVista } from "@/components/TodosPrestamosVista";
import { VecinosVista, type Vecino } from "@/components/VecinosVista";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES } from "@/lib/datosHabitante";
import { avanzar, promedio, type Calificacion, type EstadoPrestamo, type Prestamo } from "@/lib/prestamos";

const YO = "mi_usuario";

type Seccion = "inicio" | "solicitudes" | "prestamos" | "todos" | "reportes" | "notificaciones";
type Pestana = "articulos" | "vecinos";

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
    { id: 5, articuloId: -5, nombre: "Carpa", imagen: null, duenio: "vecino_ana", prestatario: "vecino_luis", tiempo: "1 día", estado: "en_curso", fin: Date.parse("2026-01-10T12:00:00") },
    { id: 6, articuloId: -6, nombre: "Bicicleta", imagen: null, duenio: "vecino_marta", prestatario: "vecino_ana", tiempo: "2 días", estado: "finalizado", fin: Date.parse("2026-01-05T12:00:00") },
];

const CALIFICACIONES_EJEMPLO: Calificacion[] = [
    { prestamoId: 90, de: "vecino_ana", para: YO, estrellas: 5, comentario: "Muy puntual y el artículo llegó en perfecto estado." },
    { prestamoId: 91, de: "vecino_luis", para: YO, estrellas: 4, comentario: "" },
];

const SECCIONES: { id: Exclude<Seccion, "notificaciones">; label: string; icon: IconName }[] = [
    { id: "inicio", label: "Inicio", icon: "house" },
    { id: "solicitudes", label: "Solicitudes", icon: "bell" },
    { id: "prestamos", label: "Préstamos", icon: "calendar" },
    { id: "todos", label: "Todos los préstamos", icon: "file" },
    { id: "reportes", label: "Reportes", icon: "alert" },
];

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide [&>svg]:shrink-0";
const ICONO_HEADER = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

// -Página

export default function CondominioAdminPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { cargando, conCarga } = useCargando();

    const [articulos, setArticulos] = useState<Articulo[]>(ARTICULOS_EJEMPLO);
    const [prestamos, setPrestamos] = useState<Prestamo[]>(PRESTAMOS_EJEMPLO);
    const [vecinos, setVecinos] = useState<Vecino[]>(VECINOS_EJEMPLO);
    const [aspirantes, setAspirantes] = useState<Aspirante[]>(ASPIRANTES_EJEMPLO);
    const [reportes, setReportes] = useState<Reporte[]>(REPORTES_EJEMPLO);
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>(CALIFICACIONES_EJEMPLO);
    const recibidas = calificaciones.filter((c) => c.para === YO);
    const miCalificacion = promedio(recibidas);

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
                    calificacion: miCalificacion,
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

    function calificar(c: Calificacion) {
        // TODO: guardar la calificación en el backend
        setCalificaciones((prev) => [...prev, c]);
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

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#e9eef3] font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-[#1e4a73] px-4 text-white md:px-6">
                <Link href="/habitante_yipshare/principal_page" aria-label="Volver a mis condominios">
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
                {seccion !== "notificaciones" && (
                    <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-[#1e4a73] px-1 pt-8 md:w-56 md:px-3">
                        {SECCIONES.map(({ id, label, icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => irA(id)}
                                aria-current={seccion === id ? "page" : undefined}
                                className={`${claseItem(seccion === id)} relative`}
                            >
                                <Icon name={icon} size={26} />
                                <span className="hidden md:inline">{label}</span>
                                {id === "solicitudes" && aspirantes.length > 0 && (
                                    <span
                                        aria-label={`${aspirantes.length} solicitudes pendientes`}
                                        className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white md:right-3 md:top-3"
                                    >
                                        {aspirantes.length}
                                    </span>
                                )}
                            </button>
                        ))}

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
                        <SolicitudesVista aspirantes={aspirantes} onResponderAction={conCarga(responderAspirante)} />
                    ) : seccion === "prestamos" ? (
                        <PrestamosVista
                            prestamos={prestamos}
                            usuario={YO}
                            onResponderAction={conCarga(responder)}
                            onCodigoAction={(p) => conCarga(registrarCodigo)(p)}
                            reportes={reportes}
                            onCalificarAction={conCarga(calificar)}
                        />
                    ) : seccion === "todos" ? (
                        <TodosPrestamosVista prestamos={prestamos} />
                    ) : seccion === "reportes" ? (
                        <ReportesVista reportes={reportes} onCambiarEstadoAction={conCarga(cambiarEstadoReporte)} />
                    ) : detalle ? (
                        <ArticuloFicha
                            key={detalle.id}
                            a={detalle}
                            onVolverAction={() => setDetalleId(null)}
                            onSolicitarAction={detalle.duenio !== YO ? (tiempo) => conCarga(solicitar)(detalle, tiempo) : undefined}
                            onEliminarAction={() => setConfirmar({ tipo: "eliminar", articulo: detalle })}
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
                                        onPermisoAction={conCarga(alternarPermiso)}
                                        onExpulsarAction={(v) => setConfirmar({ tipo: "expulsar", vecino: v })}
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
                                            <ArticuloTarjeta
                                                key={a.id}
                                                a={a}
                                                onVerAction={() => setDetalleId(a.id)}
                                                onEditarAction={() => setModal(a)}
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
                                            <ArticuloTarjeta key={a.id} a={a} onVerAction={() => setDetalleId(a.id)} />
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
                    perfil={{ ...datosPerfil, calificacion: miCalificacion }}
                    recibidas={recibidas}
                    onActualizarAction={conCarga((datos: DatosPerfil) => {
                        // TODO: guardar `datos` en el backend
                        setDatosPerfil({ ...datosPerfil, ...datos });
                        setPerfil(false);
                    })}
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
                    onGuardarAction={conCarga(guardar)}
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
                    onConfirmarAction={conCarga(handleConfirmar)}
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

            {cargando && <Cargando />}
        </div>
    );
}
