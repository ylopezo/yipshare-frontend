"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LADAS, soloDigitos, telefonoValido } from "@/lib/datos";

const MENSAJES_ERROR = {
    apellidoPaterno: "Ingresa tu apellido paterno.",
    apellidoMaterno: "Ingresa tu apellido materno.",
    nombres: "Ingresa tu nombre o nombres.",
    telefono: "Ingresa un teléfono de 10 dígitos.",
    usuario: "Ingresa un nombre de usuario.",
    contrasena: "Ingresa una contraseña.",
};

const CAMPOS_NOMBRE = [
    { name: "apellidoPaterno", placeholder: "Apellido Paterno", autoComplete: "family-name" },
    { name: "apellidoMaterno", placeholder: "Apellido materno", autoComplete: "additional-name" },
    { name: "nombres", placeholder: "Nombre(s)", autoComplete: "given-name" },
];

const RUTA_DESPUES_DE_REGISTRO = "/login";

const CLASE_INPUT =
    "w-full rounded-lg border border-slate-600 bg-[#eeeeee] py-2 pr-3 text-lg text-slate-700 placeholder:text-slate-500 outline-none focus:border-slate-900";

export default function RegistroPage() {
    const router = useRouter();

    const [datos, setDatos] = useState({
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        lada: "MX",
        telefono: "",
        usuario: "",
        contrasena: "",
    });

    const [errores, setErrores] = useState({});
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    function manejarCambio(e) {
        const { name, value } = e.target;
        setDatos((prev) => ({ ...prev, [name]: name === "telefono" ? soloDigitos(value) : value }));
    }

    function manejarEnvio(e) {
        e.preventDefault();

        const nuevosErrores = {};

        Object.keys(datos).forEach((campo) => {
            if (!datos[campo].trim()) {
                nuevosErrores[campo] = MENSAJES_ERROR[campo];
            }
        });

        if (!telefonoValido(datos.telefono)) {
            nuevosErrores.telefono = MENSAJES_ERROR.telefono;
        }

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        router.push(RUTA_DESPUES_DE_REGISTRO);
    }

    return (
        <div className="grid min-h-screen font-sans text-[#1e2b45] md:grid-cols-2">
            <aside
                aria-hidden="true"
                className="hidden items-center justify-center bg-cover bg-center md:flex"
                style={{
                    backgroundImage: "url('/img/fondo.webp'), linear-gradient(to bottom, #1e4a73, #2f78b8)",
                }}
            >
                <Link href="/">
                    <img src="/img/logo_yipshare_icono.png" alt="" className="h-44 w-auto" />
                </Link>
            </aside>

            <main className="relative flex flex-col items-center justify-center bg-white px-6 py-10">
                <Link href="/" aria-label="YipShare - inicio" className="mb-4 md:hidden">
                    <img
                        src="/img/logo_yipshare_icono.png"
                        alt="Logo de YipShare"
                        className="h-24 w-auto rounded-xl bg-[#1e4a73] p-2"
                    />
                </Link>

                <form id="form-registro" noValidate onSubmit={manejarEnvio} className="w-full max-w-md">
                    <h1 className="m-0 text-center text-3xl font-black uppercase tracking-wide">Registrarse</h1>

                    <div className="mt-8">
                        {CAMPOS_NOMBRE.map(({ name, placeholder, autoComplete }) => (
                            <div key={name} className="mb-1">
                                <label htmlFor={name} className="sr-only">
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
                                    onChange={manejarCambio}
                                    className={`${CLASE_INPUT} pl-5`}
                                />

                                <span className="mt-1 block min-h-5 text-sm text-red-600">{errores[name]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-1">
                        <label htmlFor="telefono" className="sr-only">
                            Teléfono
                        </label>

                        <div className="flex gap-2">
                            <label htmlFor="lada" className="sr-only">
                                Lada
                            </label>
                            <select
                                id="lada"
                                name="lada"
                                autoComplete="tel-country-code"
                                value={datos.lada}
                                onChange={manejarCambio}
                                className={`${CLASE_INPUT.replace("w-full ", "")} w-44 shrink-0 cursor-pointer pl-3`}
                            >
                                {LADAS.map((l) => (
                                    <option key={l.valor} value={l.valor}>
                                        {l.texto}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                placeholder="Teléfono (10 dígitos)"
                                required
                                inputMode="numeric"
                                autoComplete="tel-national"
                                maxLength={10}
                                aria-invalid={Boolean(errores.telefono)}
                                aria-describedby="telefono-error"
                                value={datos.telefono}
                                onChange={manejarCambio}
                                className={`${CLASE_INPUT} min-w-0 flex-1 pl-5`}
                            />
                        </div>

                        <span id="telefono-error" className="mt-1 block min-h-5 text-sm text-red-600">
                            {errores.telefono}
                        </span>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="usuario" className="sr-only">
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
                                onChange={manejarCambio}
                                className={`${CLASE_INPUT} pl-11`}
                            />
                        </div>

                        <span className="mt-1 block min-h-5 text-sm text-red-600">{errores.usuario}</span>
                    </div>

                    <div className="mt-2">
                        <label htmlFor="contrasena" className="sr-only">
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
                                onChange={manejarCambio}
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

                        <span className="mt-1 block min-h-5 text-sm text-red-600">{errores.contrasena}</span>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            className="w-3/4 cursor-pointer rounded-lg bg-[#1e2b45] py-2 text-white shadow-md transition hover:bg-[#2f4268]"
                        >
                            Registrarse
                        </button>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-600">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="ml-1 font-bold text-[#2a6aa8] hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
}
