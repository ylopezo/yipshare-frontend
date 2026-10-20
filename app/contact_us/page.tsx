"use client";

import Link from "next/link";
import {
    useEffect,
    useState,
    type ChangeEvent,
    type CSSProperties,
    type FormEvent,
} from "react";

type Campo = "nombre" | "correo" | "mensaje";

const patrones: Record<Campo, RegExp> = {
    nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü\s]{2,60}$/,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    mensaje: /^[\s\S]{10,500}$/,
};

const mensajes: Record<Campo, string> = {
    nombre: "Solo letras y espacios, entre 2 y 60 caracteres.",
    correo: "Ingresa un correo válido, por ejemplo: ejemplo@correo.com",
    mensaje: "El mensaje debe tener entre 10 y 500 caracteres.",
};

function validarCampo(campo: Campo, valor: string): boolean {
    return patrones[campo].test(valor.trim());
}

const CAMPOS = Object.keys(patrones) as Campo[];

type Valores = Record<Campo, string>;
type Errores = Record<Campo, string>;

const VALORES_INICIALES: Valores = { nombre: "", correo: "", mensaje: "" };
const ERRORES_INICIALES: Errores = { nombre: "", correo: "", mensaje: "" };

const IMAGENES_CASAS = [
    "/img/logo_yipshare_icono.png",
    "/img/lavadora.png",
    "/img/martillo2.png",
    "/img/tijeras2.png",
];

const CANTIDAD = 18;

type Casa = {
    id: number;
    imagen: string;
    style: CSSProperties;
};

function generarCasas(): Casa[] {
    return Array.from({ length: CANTIDAD }, (_, i) => {
        const tamano = 20 + Math.random() * 40;

        return {
            id: i,
            imagen: IMAGENES_CASAS[Math.floor(Math.random() * IMAGENES_CASAS.length)],
            style: {
                left: `${Math.random() * 100}vw`,
                width: `${tamano}px`,
                height: `${tamano}px`,
                animationDuration: `${8 + Math.random() * 10}s`,
                animationDelay: `${-Math.random() * 15}s`,
                "--op": (0.08 + Math.random() * 0.22).toFixed(2),
                "--giro": `${Math.random() * 360 - 180}deg`,
            } as CSSProperties,
        };
    });
}

function LluviaCasas() {
    const [casas, setCasas] = useState<Casa[]>([]);

    useEffect(() => {
        setCasas(generarCasas());
    }, []);

    return (
        <div
            id="lluvia-casas"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            {casas.map((c) => (
                <div key={c.id} className="casa" style={c.style}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.imagen} alt="" className="h-full w-full object-contain" />
                </div>
            ))}
        </div>
    );
}


const claseBase =
    "w-full rounded-lg py-2 pl-11 pr-3 text-lg text-slate-700 focus:outline-2 focus:outline-[#2a6aa8] border";

function claseCampo(error: string): string {
    return error
        ? `${claseBase} border-red-500 bg-red-50`
        : `${claseBase} border-slate-600 bg-[#eeeeee]`;
}

export default function ContactPage() {
    const [valores, setValores] = useState<Valores>(VALORES_INICIALES);
    const [errores, setErrores] = useState<Errores>(ERRORES_INICIALES);
    const [exito, setExito] = useState("");

    /* Equivalente a revisarCampo(): valida y actualiza el error del campo */
    function revisarCampo(campo: Campo, valor: string): boolean {
        const esValido = validarCampo(campo, valor);
        setErrores((prev) => ({ ...prev, [campo]: esValido ? "" : mensajes[campo] }));
        return esValido;
    }

    function manejarCambio(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const campo = e.target.name as Campo;
        const valor = e.target.value;

        setValores((prev) => ({ ...prev, [campo]: valor }));
        setExito("");
        revisarCampo(campo, valor);
    }

    function manejarEnvio(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let formularioValido = true;

        for (const campo of CAMPOS) {
            if (!revisarCampo(campo, valores[campo])) {
                formularioValido = false;
            }
        }

        if (formularioValido) {
            setExito("¡Mensaje enviado con éxito!");
            setValores(VALORES_INICIALES);
            setErrores(ERRORES_INICIALES);
        } else {
            setExito("");
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-linear-to-b from-[#24557f] to-[#3b8bd9] text-white font-sans">
            <LluviaCasas />

            <header className="relative z-10 bg-[#1e4a73]/80">
                <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/" aria-label="YipShare - inicio">

                            <img
                                src="/img/logo_yipshare_icono.png"
                                alt="Logo de YipShare"
                                className="h-9 w-auto"
                            />
                        </Link>

                        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold list-none m-0 p-0">
                            <li>
                                <Link href="/contact_us" className="text-white underline hover:underline">
                                    Contáctanos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms_conditions"
                                    className="text-white no-underline hover:underline"
                                >
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="w-32 rounded-full bg-[#2a6aa8] py-1 text-center text-sm font-bold text-white transition hover:bg-[#3b86cc]"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/register"
                            className="w-32 rounded-full bg-white py-1 text-center text-sm font-bold text-[#1e4a73] transition hover:bg-sky-200"
                        >
                            Registrarse
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
                <form
                    id="form-registro"
                    noValidate
                    onSubmit={manejarEnvio}
                    className="w-full max-w-md rounded-3xl bg-white px-8 py-8 text-[#1e2b45] shadow-xl"
                >
                    <h1 className="text-center text-3xl font-black uppercase tracking-wide">
                        Contáctanos
                    </h1>
                    <p className="mt-1 text-center text-sm text-slate-500">
                        Contáctanos para más información
                    </p>


                    <div className="mt-6">
                        <label htmlFor="nombre" className="sr-only">
                            Nombre
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre completo"
                                required
                                value={valores.nombre}
                                onChange={manejarCambio}
                                className={claseCampo(errores.nombre)}
                            />
                        </div>
                        <span
                            id="error-nombre"
                            className="mt-1 block min-h-5 text-sm text-red-600"
                        >
                            {errores.nombre}
                        </span>
                    </div>


                    <div className="mt-3">
                        <label htmlFor="correo" className="sr-only">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 6 9-6" />
                            </svg>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="Correo Electrónico"
                                required
                                value={valores.correo}
                                onChange={manejarCambio}
                                className={claseCampo(errores.correo)}
                            />
                        </div>
                        <span
                            id="error-correo"
                            className="mt-1 block min-h-5 text-sm text-red-600"
                        >
                            {errores.correo}
                        </span>
                    </div>

                    <div className="mt-3">
                        <label htmlFor="mensaje" className="sr-only">
                            Mensaje
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
                            </svg>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows={4}
                                placeholder="Escribe tu mensaje aquí..."
                                required
                                value={valores.mensaje}
                                onChange={manejarCambio}
                                className={`${claseCampo(errores.mensaje)} resize-none`}
                            />
                        </div>
                        <span
                            id="error-mensaje"
                            className="mt-1 block min-h-5 text-sm text-red-600"
                        >
                            {errores.mensaje}
                        </span>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            id="boton-registrar"
                            className="w-3/4 cursor-pointer rounded-lg bg-[#1e2b45] py-2 text-white shadow-md transition hover:bg-[#2f4268]"
                        >
                            Enviar Mensaje
                        </button>
                    </div>

                    <p
                        id="mensaje-exito"
                        className="mt-3 min-h-5 text-center text-sm font-semibold text-green-700"
                    >
                        {exito}
                    </p>

                    <p className="mt-4 text-center text-xs text-slate-600">
                        ¿Prefieres volver?
                        <Link href="/" className="ml-1 font-bold text-[#2a6aa8] hover:underline">
                            Volver al Inicio
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
}