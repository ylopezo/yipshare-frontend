import Link from "next/link";
import { FondoVideo } from "@/components/FondoVideo";

export default function Home() {
    return (
        <div
            className="relative m-0 min-h-screen flex flex-col bg-linear-to-b
        from-[#24557f] to-[#3b8bd9] text-white font-sans"
        >
            <FondoVideo />

            <header className="relative z-10 bg-azul/80">
                <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
                    <div className="flex items-center gap-6 md:gap-8">
                        <img src="/img/logo_yipshare_icono.png" alt="Logo de YipShare" className="h-9 w-auto" />

                        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold list-none m-0 p-0">
                            <li>
                                <Link href="/terms_conditions" className="text-white no-underline hover:underline">
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="w-32 rounded-full bg-azul-claro py-1 text-center text-sm font-bold
                            text-white transition hover:bg-[#3b86cc]"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/register_account"
                            className="w-32 rounded-full bg-white py-1 text-center text-sm font-bold
                            text-azul transition hover:bg-sky-200"
                        >
                            Registrarse
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
                <h1 className="m-0 text-4xl font-bold md:text-6xl">Bienvenido a YipShare</h1>
                <p className="mt-2 text-xl font-semibold md:text-2xl">El valor está en el uso no en la posesión</p>

                <Link
                    href="/login"
                    className="mt-10 rounded-lg bg-oscuro px-16 py-2 text-xl text-white no-underline hover:bg-oscuro-hover"
                >
                    ¡Empezar!
                </Link>
            </main>
        </div>
    );
}
