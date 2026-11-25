"use client";

import Link from "next/link";
import { Field } from "@/components/Field";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { signIn, homePage } from "@/lib/session";
import Image from "next/image";
import { YipBackground } from "@/components/YipBackground";

const SESSION_NOTICES = {
    required: "Inicia sesión para continuar.",
    expired: "Tu sesión expiró o ya no es válida. Inicia sesión de nuevo.",
    offline: "No se pudo conectar con el servidor. Intenta de nuevo.",
};

const noSubscription = () => () => {};
const readReason = () => new URLSearchParams(window.location.search).get("session");
const noReasonOnServer = () => null;

export default function LoginPage() {
    const router = useRouter();

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const notice = SESSION_NOTICES[useSyncExternalStore(noSubscription, readReason, noReasonOnServer)] ?? "";
    function clearForm() {
        setUser("");
        setPassword("");
        setUserError("");
        setPasswordError("");
    }

    useEffect(() => {
        const onPageShow = (e) => {
            if (e.persisted) clearForm();
        };

        window.addEventListener("pageshow", onPageShow);
        return () => window.removeEventListener("pageshow", onPageShow);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        const userErr = user.trim() ? "" : "Ingresa tu usuario.";
        const passwordErr = password.trim() ? "" : "Ingresa tu contraseña.";

        setUserError(userErr);
        setPasswordError(passwordErr);

        if (userErr || passwordErr) return;

        const { status, data } = await signIn(user.trim(), password);
        if (status !== 200) {
            setPasswordError(data.error || "Usuario o contraseña incorrectos.");
            return;
        }

        clearForm();
        setUser("");
        setPassword("");
        router.replace(homePage(data.user?.role));
        router.refresh();
    }

    return (
        <div className="relative m-0 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-azul px-4 py-10 font-sans text-oscuro">
            <YipBackground />
            <Link href="/" aria-label="YipShare - inicio" className="relative mb-4">
                <Image
                    src="/img/logo_yipshare_icono.png"
                    alt="Logo de YipShare"
                    width={155}
                    height={135}
                    priority
                    className="h-28 w-auto md:h-35"
                />
            </Link>

            <form
                noValidate
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-[2rem] bg-white px-6 pb-4 pt-6"
            >
                <h1 className="m-0 text-center text-3xl font-semibold">Iniciar Sesión</h1>
                {notice && (
                    <p
                        role="alert"
                        className="mb-0 mt-4 text-center text-sm text-black"
                    >
                        {notice}
                    </p>
                )}
                <Field
                    className="mt-6"
                    id="user"
                    icon="user"
                    placeholder="Usuario"
                    autoComplete="username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    error={userError}
                />
                <Field
                    className="mt-2"
                    id="password"
                    icon="lock"
                    placeholder="Contraseña"
                    password
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                />

                <div className="mt-2 flex justify-center">
                    <button
                        type="submit"
                        className="w-3/4 cursor-pointer rounded-lg bg-oscuro py-2 text-white transition hover:bg-oscuro-hover"
                    >
                        Entrar
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-neutral-600">
                    ¿No tienes cuenta?
                    <Link href="/register_account" className="ml-1 font-bold text-azul-claro hover:underline">
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
