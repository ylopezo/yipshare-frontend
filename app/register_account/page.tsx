"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

type Campo = "apellidoPaterno" | "apellidoMaterno" | "nombres" | "usuario" | "contrasena";
type Datos = Record<Campo, string>;
type Errores = Partial<Record<Campo, string>>;

const MENSAJES_ERROR: Record<Campo, string> = {
    apellidoPaterno: "Ingresa tu apellido paterno.",
    apellidoMaterno: "Ingresa tu apellido materno.",
    nombres: "Ingresa tu nombre o nombres.",
    usuario: "Ingresa un nombre de usuario.",
    contrasena: "Ingresa una contraseña.",
};

const CAMPOS_NOMBRE: { name: Campo; placeholder: string; autoComplete: string }[] = [
    { name: "apellidoPaterno", placeholder: "Apellido Paterno", autoComplete: "family-name" },
    { name: "apellidoMaterno", placeholder: "Apellido materno", autoComplete: "additional-name" },
    { name: "nombres", placeholder: "Nombre(s)", autoComplete: "given-name" },
];

const CLASE_INPUT =
    "w-full rounded-lg border border-slate-600 bg-[#eeeeee] py-2 pr-3 text-lg text-slate-700 placeholder:text-slate-500 focus:outline-2 focus:outline-[#2a6aa8]";

export default function RegistroPage() {
    const [datos, setDatos] = useState<Datos>({
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        usuario: "",
        contrasena: "",
    });

    const [errores, setErrores] = useState<Errores>({});
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setDatos((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const nuevosErrores: Errores = {};

        (Object.keys(datos) as Campo[]).forEach((campo) => {
            if (!datos[campo].trim()) {
                nuevosErrores[campo] = MENSAJES_ERROR[campo];
            }
        });

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            setMensajeExito("");
            return;
        }

        setMensajeExito("Registro correcto.");
    }

    return (
        <div className="grid min-h-screen font-sans text-[#1e2b45] md:grid-cols-2">
            <aside
                aria-hidden="true"
                className="hidden items-center justify-center bg-cover bg-center md:flex"
                style={{
                    backgroundImage:
                        "url('/img/img.png'), linear-gradient(to bottom, #1e4a73, #2f78b8)",
                }}
            >
                <Link href="/">
                    <img
                        src="/img/logo_yipshare_icono.png"
                        alt=""
                        className="h-44 w-auto"
                    />
                </Link>
            </aside>

            <main className="relative flex flex-col items-center justify-center bg-white px-6 py-10">
                <Link
                    href="/"
                    aria-label="YipShare - inicio"
                    className="mb-4 md:hidden"
                >
                    <img
                        src="/img/logo_yipshare_icono.png"
                        alt="Logo de YipShare"
                        className="h-24 w-auto rounded-xl bg-[#1e4a73] p-2"
                    />
                </Link>

                <form
                    id="form-registro"
                    noValidate
                    onSubmit={handleSubmit}
                    className="w-full max-w-md"
                >
                    <h1 className="m-0 text-center text-3xl font-black uppercase tracking-wide">
                        Registrarse
                    </h1>

                    <div className="mt-8">
                        {CAMPOS_NOMBRE.map(({ name, placeholder, autoComplete }) => (
                            <div
                                key={name}
                                className="mb-1"
                            >
                                <label
                                    htmlFor={name}
                                    className="sr-only"
                                >
                                    {placeholder}
                                </label>

                                <input
                                    type="text"
                                    id={name}
                                    name={name}
                                    placeholder={placeholder}
                                    required
                                    autoComplete={autoComplete}
                                    value={datos[name]}
                                    onChange={handleChange}
                                    className={`${CLASE_INPUT} pl-5`}
                                />

                                <span className="mt-1 block min-h-5 text-sm text-red-600">
                                    {errores[name]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Usuario */}
                    <div className="mt-6">
                        <label
                            htmlFor="usuario"
                            className="sr-only"
                        >
                            Usuario
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
                                id="usuario"
                                name="usuario"
                                placeholder="Usuario"
                                required
                                autoComplete="username"
                                value={datos.usuario}
                                onChange={handleChange}
                                className={`${CLASE_INPUT} pl-11`}
                            />
                        </div>

                        <span className="mt-1 block min-h-5 text-sm text-red-600">
                            {errores.usuario}
                        </span>
                    </div>

                    {/* Contraseña */}
                    <div className="mt-2">
                        <label
                            htmlFor="contrasena"
                            className="sr-only"
                        >
                            Contraseña
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
                                <rect x="4" y="11" width="16" height="10" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>

                            <input
                                type={mostrarContrasena ? "text" : "password"}
                                id="contrasena"
                                name="contrasena"
                                placeholder="Contraseña"
                                required
                                autoComplete="new-password"
                                value={datos.contrasena}
                                onChange={handleChange}
                                className={`${CLASE_INPUT} pl-11 pr-11`}
                            />

                            <button
                                type="button"
                                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                                aria-pressed={mostrarContrasena}
                                onClick={() => setMostrarContrasena((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-[#2a6aa8]"
                            >
                                {mostrarContrasena ? (
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M2 12s3.6-7 10-7c2 0 3.8.7 5.3 1.7M22 12s-3.6 7-10 7c-2 0-3.8-.7-5.3-1.7" />
                                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                                        <path d="M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <span className="mt-1 block min-h-5 text-sm text-red-600">
                            {errores.contrasena}
                        </span>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            className="w-3/4 cursor-pointer rounded-lg bg-[#1e2b45] py-2 text-white shadow-md transition hover:bg-[#2f4268]"
                        >
                            Registrarse
                        </button>
                    </div>

                    <p className="mt-2 min-h-5 text-center text-sm font-semibold text-green-700">
                        {mensajeExito}
                    </p>

                    <p className="mt-6 text-center text-xs text-slate-600">
                        ¿Ya tienes cuenta?
                        <Link
                            href="/login"
                            className="ml-1 font-bold text-[#2a6aa8] hover:underline"
                        >
                            Iniciar Sesión
                        </Link>
                    </p>
                </form>

                <a
                    href="#"
                    className="absolute bottom-2 right-3 text-[10px] text-slate-500 hover:underline"
                >
                    Admin
                </a>
            </main>
        </div>
    );
}