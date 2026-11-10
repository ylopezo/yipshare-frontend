"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { iniciarSesion, paginaDeInicio } from "@/lib/sesion";

export default function LoginPage() {
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const [errorUsuario, setErrorUsuario] = useState("");
    const [errorContrasena, setErrorContrasena] = useState("");
    function limpiarFormulario() {
        setUsuario("");
        setContrasena("");
        setMostrarContrasena(false);
        setErrorUsuario("");
        setErrorContrasena("");
    }


    useEffect(() => {
        const alMostrarPagina = (e) => {
            if (e.persisted) limpiarFormulario();
        };

        window.addEventListener("pageshow", alMostrarPagina);
        return () => window.removeEventListener("pageshow", alMostrarPagina);
    }, []);

    // Manda usuario y contraseña; si son correctos el servidor responde con Set-Cookie y el navegador la guarda
    async function manejarEnvio(e) {
        e.preventDefault();

        const errUsuario = usuario.trim() ? "" : "Ingresa tu usuario.";
        const errContrasena = contrasena.trim() ? "" : "Ingresa tu contraseña.";

        setErrorUsuario(errUsuario);
        setErrorContrasena(errContrasena);

        if (errUsuario || errContrasena) return;

        const { status, datos } = await iniciarSesion(usuario.trim(), contrasena);
        if (status !== 200) {
            // 401: usuario o contraseña incorrectos; 0: no hay servidor
            setErrorContrasena(datos.error || "Usuario o contraseña incorrectos.");
            return;
        }

        limpiarFormulario();
        router.push(paginaDeInicio(datos.usuario?.rol));
    }

    return (
        <div
            className="m-0 flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-10 font-sans text-[#1e2b45]"
            style={{
                backgroundImage: "url('/img/fondo.webp'), linear-gradient(to bottom, #1e4a73, #2f78b8)",
            }}
        >
            <Link href="/" aria-label="YipShare - inicio" className="mb-4">
                <img src="/img/logo_yipshare_icono.png" alt="Logo de YipShare" className="h-28 w-auto md:h-35" />
            </Link>

            <form
                id="form-login"
                noValidate
                onSubmit={manejarEnvio}
                className="w-full max-w-md rounded-3xl bg-white px-8 pb-4 pt-6 shadow-xl"
            >
                <h1 className="m-0 text-center text-3xl font-black uppercase tracking-wide">Iniciar Sesión</h1>

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
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-[#eeeeee] py-2 pl-11 pr-3 text-lg placeholder:text-slate-500 outline-none focus:border-slate-900"
                        />
                    </div>

                    <span id="error-usuario" className="mt-1 block min-h-5 text-sm text-red-600">
                        {errorUsuario}
                    </span>
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
                            autoComplete="current-password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-[#eeeeee] py-2 pl-11 pr-11 text-lg text-slate-700 outline-none focus:border-slate-900"
                        />

                        <button
                            type="button"
                            id="toggle-contrasena"
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

                    <span id="error-contrasena" className="mt-1 block min-h-5 text-sm text-red-600">
                        {errorContrasena}
                    </span>
                </div>

                <div className="mt-2 flex justify-center">
                    <button
                        type="submit"
                        id="boton-entrar"
                        className="w-3/4 cursor-pointer rounded-lg bg-[#1e2b45] py-2 text-white shadow-md transition hover:bg-[#2f4268]"
                    >
                        Entrar
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-slate-600">
                    ¿No tienes cuenta?
                    <Link href="/register_account" className="ml-1 font-bold text-[#2a6aa8] hover:underline">
                        Regístrate
                    </Link>
                </p>

                <div className="mt-6">
                    <a href="/admin_yipshare/principal_page" className="text-[10px] text-slate-500 hover:underline">
                        Admin
                    </a>
                </div>
            </form>
        </div>
    );
}
