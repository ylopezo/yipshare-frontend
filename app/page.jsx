import Link from "next/link";
import { GuestOnly } from "@/components/GuestOnly";
import Image from "next/image";

const STEPS = [
    {
        img: "/img/lavadora.png",
        title: "Publica",
        text: "Sube lo que no usas a diario para que tus vecinos lo puedan pedir.",
    },
    {
        img: "/img/martillo2.png",
        title: "Pide prestado",
        text: "Solicita un artículo a un vecino por los días que lo necesites.",
    },
    {
        img: "/img/tijeras2.png",
        title: "Devuelve y califica",
        text: "Confirma la entrega y la devolución con un código y califica al vecino.",
    },
];

export default function Home() {
    return (
        <GuestOnly>
            <div className="flex min-h-dvh flex-col bg-linear-to-b from-degradado-inicio to-degradado-fin pb-8 font-sans">
                <div className="flex flex-1 flex-col text-white">
                    <header className="bg-azul/80">
                        <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
                            <div className="flex items-center gap-6 md:gap-8">
                                <Image src="/img/logo_yipshare_icono.png" alt="Logo de YipShare" width={155} height={135} priority className="h-9 w-auto" />

                                <Link
                                    href="/terms_conditions"
                                    className="hidden text-sm font-semibold text-white hover:underline md:block"
                                >
                                    Términos y Condiciones
                                </Link>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="w-32 rounded-full bg-azul-claro py-1 text-center text-sm font-bold text-white transition hover:bg-[#3b86cc]"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register_account"
                                    className="w-32 rounded-full bg-white py-1 text-center text-sm font-bold text-azul transition hover:bg-sky-200"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
                        <h1 className="m-0 text-4xl font-bold md:text-6xl">Bienvenido a YipShare</h1>
                        <p className="mt-2 text-xl font-semibold md:text-2xl">
                            El valor está en el uso no en la posesión
                        </p>

                        <Link
                            href="/login"
                            className="mt-10 rounded-lg bg-oscuro px-16 py-2 text-xl text-white hover:bg-oscuro-hover"
                        >
                            ¡Empezar!
                        </Link>
                    </main>
                </div>

                <section className="mx-4 max-w-5xl rounded-3xl bg-white px-6 py-8 text-center shadow-xl md:mx-auto md:px-10">
                    <h2 className="m-0 text-3xl font-bold text-azul">¿Cómo funciona?</h2>

                    <ol className="m-0 mt-6 grid list-none gap-6 p-0 md:grid-cols-3">
                        {STEPS.map((p, i) => (
                            <li key={p.title}>
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-azul">
                                    <Image src={p.img} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
                                </div>
                                <h3 className="m-0 mt-4 text-lg font-bold text-azul">
                                    {i + 1}. {p.title}
                                </h3>
                                <p className="mb-0 mt-2 text-sm text-slate-600">{p.text}</p>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </GuestOnly>
    );
}
