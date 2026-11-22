"use client";

import Link from "next/link";
import { Field } from "@/components/Field";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCountryCallingCode } from "libphonenumber-js";
import { DIAL_CODES, digitsOnly, isPhoneValid } from "@/lib/data";
import { apiRequest } from "@/lib/session";

const ERROR_MESSAGES = {
    paternalSurname: "Ingresa tu apellido paterno.",
    maternalSurname: "Ingresa tu apellido materno.",
    givenNames: "Ingresa tu nombre o nombres.",
    email: "Ingresa tu correo electrónico.",
    phone: "Ingresa un teléfono de 10 dígitos.",
    user: "Ingresa un nombre de usuario.",
    password: "Ingresa una contraseña.",
};

const LETTERS_ONLY = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const VALID_USERNAME = /^[a-zA-Z0-9_-]{3,50}$/;
const VALID_PASSWORD = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[!-~]{8,255}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BACKEND_FIELD = {
    name: "givenNames",
    paternalSurname: "paternalSurname",
    maternalSurname: "maternalSurname",
    email: "email",
    phoneNumber: "phone",
    username: "user",
    password: "password",
};

const TEXT_FIELDS = [
    {
        name: "paternalSurname",
        placeholder: "Apellido Paterno",
        autoComplete: "family-name",
    },
    {
        name: "maternalSurname",
        placeholder: "Apellido materno",
        autoComplete: "additional-name",
    },
    { name: "givenNames", placeholder: "Nombre(s)", autoComplete: "given-name" },
    {
        name: "email",
        placeholder: "Correo electrónico",
        autoComplete: "email",
        type: "email",
    },
];

const ROUTE_AFTER_REGISTER = "/login";

const INPUT_CLASS =
    "w-full rounded-lg border border-slate-600 bg-gris py-2 pr-3 text-lg text-slate-700 placeholder:text-slate-500 outline-none focus:border-slate-900";

export default function RegisterPage() {
    const router = useRouter();

    const [data, setData] = useState({
        paternalSurname: "",
        maternalSurname: "",
        givenNames: "",
        email: "",
        dialCode: "MX",
        phone: "",
        user: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [sending, setSending] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: name === "phone" ? digitsOnly(value) : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setGeneralError("");

        const newErrors = {};

        Object.keys(data).forEach((field) => {
            if (!data[field].trim()) {
                newErrors[field] = ERROR_MESSAGES[field];
            }
        });

        if (!isPhoneValid(data.phone)) {
            newErrors.phone = ERROR_MESSAGES.phone;
        }

        for (const field of ["givenNames", "paternalSurname", "maternalSurname"]) {
            if (!newErrors[field] && !LETTERS_ONLY.test(data[field])) {
                newErrors[field] = "Usa solo letras y espacios.";
            }
        }
        if (!newErrors.email && !VALID_EMAIL.test(data.email.trim())) {
            newErrors.email = "Ingresa un correo válido.";
        }
        if (!newErrors.user && !VALID_USERNAME.test(data.user)) {
            newErrors.user = "De 3 a 50 caracteres: letras, números, guion o guion bajo.";
        }
        if (!newErrors.password && !VALID_PASSWORD.test(data.password)) {
            newErrors.password = "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setSending(true);
        const { status, data: response } = await apiRequest("POST", "/api/auth/register", {
            name: data.givenNames.trim(),
            paternalSurname: data.paternalSurname.trim(),
            maternalSurname: data.maternalSurname.trim(),
            email: data.email.trim(),
            phoneNumber: `+${getCountryCallingCode(data.dialCode)}${data.phone}`,
            username: data.user,
            password: data.password,
        });
        setSending(false);

        if (status === 201) {
            router.replace(ROUTE_AFTER_REGISTER);
            return;
        }

        if (status === 409) {
            const message = response.message ?? "";
            if (message.includes("username")) setErrors({ user: "Ese usuario ya está registrado." });
            else if (message.includes("email")) setErrors({ email: "Ese correo ya está registrado." });
            else if (message.includes("phone")) setErrors({ phone: "Ese teléfono ya está registrado." });
            else setGeneralError("Esa cuenta ya existe.");
            return;
        }

        const fields = Object.keys(response.errors?.fieldErrors ?? {});
        if (status === 400 && fields.length > 0) {
            setErrors(Object.fromEntries(fields.map((c) => [BACKEND_FIELD[c] ?? c, "Revisa este campo."])));
            return;
        }

        setGeneralError(response.error || "No se pudo crear la cuenta. Intenta de nuevo.");
    }

    return (
        <div className="grid min-h-dvh font-sans text-oscuro md:grid-cols-2">
            <aside
                aria-hidden="true"
                className="hidden items-center justify-center bg-cover bg-center md:flex"
                suppressHydrationWarning
                style={{
                    backgroundImage: "url('/img/fondo.webp'), linear-gradient(to bottom, #1e4a73, #2f78b8)",
                }}
            >
                <Link href="/" tabIndex={-1}>
                    <img src="/img/logo_yipshare_icono.png" alt="" className="h-44 w-auto" />
                </Link>
            </aside>

            <main className="relative flex flex-col items-center justify-center bg-white px-6 py-10">
                <Link href="/" aria-label="YipShare - inicio" className="mb-4 md:hidden">
                    <img
                        src="/img/logo_yipshare_icono.png"
                        alt="Logo de YipShare"
                        className="h-24 w-auto rounded-xl bg-azul p-2"
                    />
                </Link>

                <form noValidate onSubmit={handleSubmit} className="w-full max-w-md">
                    <h1 className="m-0 text-center text-3xl font-black uppercase tracking-wide">Registrarse</h1>

                    <div className="mt-8">
                        {TEXT_FIELDS.map(({ name, placeholder, autoComplete, type = "text" }) => (
                            <div key={name} className="mb-1">
                                <label htmlFor={name} className="sr-only">
                                    {placeholder}
                                </label>

                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    placeholder={placeholder}
                                    required
                                    autoComplete={autoComplete}
                                    value={data[name]}
                                    onChange={handleChange}
                                    className={`${INPUT_CLASS} pl-5`}
                                />

                                <span className="mt-1 block min-h-5 text-sm text-azul">{errors[name]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-1">
                        <label htmlFor="phone" className="sr-only">
                            Teléfono
                        </label>

                        <div className="flex gap-2">
                            <label htmlFor="dialCode" className="sr-only">
                                Lada
                            </label>
                            <select
                                id="dialCode"
                                name="dialCode"
                                autoComplete="tel-country-code"
                                value={data.dialCode}
                                onChange={handleChange}
                                className={`${INPUT_CLASS.replace("w-full ", "")} w-44 shrink-0 cursor-pointer pl-3`}
                            >
                                {DIAL_CODES.map((l) => (
                                    <option key={l.value} value={l.value}>
                                        {l.text}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Teléfono (10 dígitos)"
                                required
                                inputMode="numeric"
                                autoComplete="tel-national"
                                maxLength={10}
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby="telefono-error"
                                value={data.phone}
                                onChange={handleChange}
                                className={`${INPUT_CLASS} min-w-0 flex-1 pl-5`}
                            />
                        </div>

                        <span id="telefono-error" className="mt-1 block min-h-5 text-sm text-azul">
                            {errors.phone}
                        </span>
                    </div>

                    <Field
                        className="mt-6"
                        id="user"
                        icon="user"
                        placeholder="Usuario"
                        autoComplete="username"
                        value={data.user}
                        onChange={handleChange}
                        error={errors.user}
                    />
                    <Field
                        className="mt-2"
                        id="password"
                        icon="lock"
                        placeholder="Contraseña"
                        password
                        autoComplete="new-password"
                        value={data.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    {generalError && (
                        <p role="alert" className="mb-0 mt-2 text-center text-sm text-azul">
                            {generalError}
                        </p>
                    )}

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-3/4 cursor-pointer rounded-lg bg-oscuro py-2 text-white shadow-md transition hover:bg-oscuro-hover disabled:cursor-wait disabled:opacity-60"
                        >
                            {sending ? "Creando cuenta..." : "Registrarse"}
                        </button>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-600">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="ml-1 font-bold text-azul-claro hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
}
