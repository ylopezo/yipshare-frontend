"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
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
            className="m-0 flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-10 font-sans text-oscuro"
            style={{
                backgroundImage: "url('/img/fondo.webp'), linear-gradient(to bottom, #1e4a73, #2f78b8)",
            }}
        >
            <Link href="/" aria-label="YipShare - inicio" className="mb-4">
                <img src="/img/logo_yipshare_icono.png" alt="Logo de YipShare" className="h-28 w-auto md:h-35" />
            </Link>

            <form
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
                        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-500">
                            <Icon name="user" size={20} />
                        </span>

                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            placeholder="Usuario"
                            required
                            autoComplete="username"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-gris py-2 pl-11 pr-3 text-lg placeholder:text-slate-500 outline-none focus:border-slate-900"
                        />
                    </div>

                    <span id="error-usuario" className="mt-1 block min-h-5 text-sm text-azul">
                        {errorUsuario}
                    </span>
                </div>

                <div className="mt-2">
                    <label htmlFor="contrasena" className="sr-only">
                        Contraseña
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-500">
                            <Icon name="lock" size={20} />
                        </span>

                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            id="contrasena"
                            name="contrasena"
                            placeholder="Contraseña"
                            required
                            autoComplete="current-password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-gris py-2 pl-11 pr-11 text-lg text-slate-700 outline-none focus:border-slate-900"
                        />

                        <button
                            type="button"
                            aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                            aria-pressed={mostrarContrasena}
                            onClick={() => setMostrarContrasena((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-azul-claro"
                        >
                            {mostrarContrasena ? <Icon name="eyeOff" size={20} /> : <Icon name="eye" size={20} />}
                        </button>
                    </div>

                    <span id="error-contrasena" className="mt-1 block min-h-5 text-sm text-azul">
                        {errorContrasena}
                    </span>
                </div>

                <div className="mt-2 flex justify-center">
                    <button
                        type="submit"
                        className="w-3/4 cursor-pointer rounded-lg bg-oscuro py-2 text-white shadow-md transition hover:bg-oscuro-hover"
                    >
                        Entrar
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-slate-600">
                    ¿No tienes cuenta?
                    <Link href="/register_account" className="ml-1 font-bold text-azul-claro hover:underline">
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
