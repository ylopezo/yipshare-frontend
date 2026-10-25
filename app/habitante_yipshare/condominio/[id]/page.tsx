"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ESTADOS, ArticuloModal, type Articulo, type Datos, type Estado } from "@/components/ArticuloModal";
import { Icon, type IconName } from "@/components/Icon";
import { ConfirmDialog } from "@/components/Modal";
import { PerfilHabitanteModal, type DatosPerfil, type PerfilUsuario } from "@/components/PerfilHabitanteModal";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES, UNIDOS_INICIALES } from "@/lib/datosHabitante";

const YO = "mi_usuario";


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
                     onEditar,
                 }: {
    a: Articulo;
    onEditar?: () => void;
}) {
    return (
        <div className="flex w-48 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="h-28 shrink-0 bg-[#e4e4e4]">
                {a.imagen && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={a.imagen}
                        alt={a.nombre}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${COLOR[a.estado]}`}>
                    {ESTADOS[a.estado]}
                </span>

                <p className="m-0 mt-1 break-words text-lg font-bold text-[#1e4a73]">
                    {a.nombre}
                </p>

                <p className="m-0 text-[10px] text-slate-500">
                    {a.duenio}
                </p>

                {onEditar && (
                    <button
                        type="button"
                        onClick={onEditar}
                        className="mt-auto cursor-pointer self-center pt-3 text-[11px] font-semibold text-[#5aa0e8] hover:underline"
                    >
                        Editar Artículo
                    </button>
                )}
            </div>
        </div>
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

    const visibles = articulos.filter((a) =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const mios = visibles.filter((a) => a.duenio === YO);
    const deOtros = visibles.filter((a) => a.duenio !== YO);

    const menu: { label: string; icon: IconName }[] = [
        { label: "Préstamos", icon: "calendar" },
        { label: "Reportes", icon: "alert" },
    ];

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#e9eef3] font-sans
        text-black">
            <header className="flex h-[100px] shrink-0 items-center gap-4 bg-[#1e4a73]
            px-4 text-white md:px-6">
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
                            onChange={(e) => setBusqueda(e.target.value)}
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
                    <div
                        className={`${ITEM} text-white`}
                        aria-current="page"
                    >
                        <Icon name="house" size={26} />
                        <span className="hidden md:inline">Inicio</span>
                    </div>

                    {menu.map(({ label, icon }) => (
                        <button
                            key={label}
                            type="button"
                            disabled
                            className={`${ITEM} cursor-not-allowed text-white/40`}
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
                            />
                        ))}
                    </div>
                </main>
            </div>

            {perfil && (
                <PerfilHabitanteModal
                    perfil={datosPerfil}
                    onActualizarAction={(datos: DatosPerfil) => {
                        setDatosPerfil({ ...datosPerfil, ...datos });
                        setPerfil(false);
                    }}
                    onEliminarAction={() => {
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