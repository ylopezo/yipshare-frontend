"use client";

import Image from "next/image";
import { cerrarSesion } from "@/lib/sesion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArticuloModal } from "@/components/ArticuloModal";
import { ArticuloFicha, ArticuloTarjeta } from "@/components/ArticuloVista";
import { Icon } from "@/components/Icon";
import { ConfirmDialog } from "@/components/Modal";
import { PrestamosVista } from "@/components/PrestamoVista";
import { ReportarVista } from "@/components/ReportarVista";
import { PerfilHabitanteModal } from "@/components/PerfilHabitanteModal";
import { avanzar, promedio } from "@/lib/prestamos";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES, UNIDOS_INICIALES } from "@/lib/datosHabitante";

const YO = "mi_usuario";

const PERFIL_EJEMPLO = {
    apellidoPaterno: "Pérez",
    apellidoMaterno: "López",
    nombres: "Juan Carlos",
    edificio: "Edificio 2",
    departamento: "Departamento 14",
    lada: "MX",
    telefono: "5512345678",
    calificacion: 4.2,
};

const ITEM = "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide";
const ICONO_HEADER = "cursor-pointer rounded-full p-1 text-white hover:bg-white/10";

export default function InicioPage() {
    const { id } = useParams();
    const router = useRouter();

    const [articulos, setArticulos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [perfil, setPerfil] = useState(false);
    const [salir, setSalir] = useState(false);
    const [datosPerfil, setDatosPerfil] = useState(PERFIL_EJEMPLO);
    const [modal, setModal] = useState(null);
    const [detalleId, setDetalleId] = useState(null);
    const [seccion, setSeccion] = useState("inicio");
    const [prestamos, setPrestamos] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    // TODO: cargar del backend los reportes del condominio
    const [reportes, setReportes] = useState([]);
    const recibidas = calificaciones.filter((c) => c.para === YO);
    const miCalificacion = promedio(recibidas);

    const condominio = [...REGISTRADOS_INICIALES, ...UNIDOS_INICIALES].find((c) => String(c.id) === id);

    if (!condominio) {
        return (
            <main className="p-10">
                <p>No se encontró el condominio.</p>

                <Link href="/habitante_yipshare/principal_page" className="font-bold text-azul-claro hover:underline">
                    Volver
                </Link>
            </main>
        );
    }

    function guardar(datos) {
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

    function cambiarEstado(idArticulo, estado) {
        setArticulos((prev) => prev.map((a) => (a.id === idArticulo ? { ...a, estado } : a)));
    }

    function solicitar(a, tiempo) {
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

    function responder(p, aceptar) {
        // TODO: enviar la respuesta al backend
        setPrestamos((prev) =>
            prev.map((x) => (x.id === p.id ? { ...x, estado: aceptar ? "aceptado" : "rechazado" } : x)),
        );
        if (!aceptar) cambiarEstado(p.articuloId, "disponible");
    }

    function registrarCodigo(p) {
        // TODO: validar el código en el backend
        const nuevo = avanzar(p, Date.now());

        setPrestamos((prev) => prev.map((x) => (x.id === p.id ? nuevo : x)));
        cambiarEstado(p.articuloId, nuevo.estado === "en_curso" ? "no_disponible" : "disponible");
    }

    function reportar(datos) {
        // TODO: enviar el reporte al backend para que lo revise el administrador del condominio
        setReportes((prev) => [
            ...prev,
            {
                id: crypto.getRandomValues(new Uint32Array(1))[0],
                involucrado: datos.involucrado,
                reporto: YO,
                detalles: datos.detalles,
                estado: "pendiente",
            },
        ]);
    }

    const detalle = articulos.find((a) => a.id === detalleId);

    const visibles = articulos.filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const mios = visibles.filter((a) => a.duenio === YO);
    const deOtros = visibles.filter((a) => a.duenio !== YO);

    const secciones = [
        { id: "inicio", label: "Inicio", icon: "house" },
        { id: "prestamos", label: "Préstamos", icon: "calendar" },
        { id: "reportes", label: "Reportes", icon: "alert" },
    ];

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-fondo font-sans text-black">
            <header className="flex h-25 shrink-0 items-center gap-4 bg-azul px-4 text-white md:px-6">
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

                    <p className="m-0 truncate text-sm font-semibold text-celeste">{condominio.nombre}</p>
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

                        <button type="button" aria-label="Notificaciones" className={ICONO_HEADER}>
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
                <aside className="flex w-16 shrink-0 flex-col space-y-3 bg-azul px-1 pt-8 md:w-56 md:px-3">
                    {secciones.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setSeccion(id);
                                setDetalleId(null);
                            }}
                            aria-current={seccion === id ? "page" : undefined}
                            className={`${ITEM} cursor-pointer ${seccion === id ? "text-white" : "text-white/40 hover:text-white/80"}`}
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
                            reportes={reportes}
                            calificaciones={calificaciones}
                            onCalificarAction={(c) => {
                                // TODO: guardar la calificación en el backend
                                setCalificaciones((prev) => [...prev, c]);
                            }}
                        />
                    ) : seccion === "reportes" ? (
                        <ReportarVista prestamos={prestamos} usuario={YO} onEnviarAction={reportar} />
                    ) : detalle ? (
                        <ArticuloFicha
                            key={detalle.id}
                            a={detalle}
                            onVolverAction={() => setDetalleId(null)}
                            onSolicitarAction={
                                detalle.duenio !== YO ? (tiempo) => solicitar(detalle, tiempo) : undefined
                            }
                        />
                    ) : (
                        <>
                            <h2 className="m-0 text-base font-bold">Mis Artículos</h2>

                            {mios.length === 0 && <p className="mb-0 mt-3 text-sm text-slate-500">No hay artículos.</p>}

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
                                    className="ml-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-azul text-white shadow-md hover:bg-azul-claro"
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
                </main>
            </div>

            {perfil && (
                <PerfilHabitanteModal
                    perfil={{ ...datosPerfil, calificacion: miCalificacion }}
                    recibidas={recibidas}
                    onActualizarAction={(datos) => {
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
                    onConfirmarAction={async () => {
                        await cerrarSesion();
                        router.replace("/login");
                    }}
                    onCancelarAction={() => setSalir(false)}
                />
            )}
        </div>
    );
}
