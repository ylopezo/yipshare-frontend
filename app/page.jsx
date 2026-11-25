import Link from "next/link";
import { GuestOnly } from "@/components/GuestOnly";
import Image from "next/image";
import { YipBackground } from "@/components/YipBackground";

export default function Home() {
    return (
        <GuestOnly>
            <div className="relative flex min-h-dvh flex-col overflow-hidden bg-azul font-sans text-white">
                <YipBackground />

                <div className="relative flex flex-1 flex-col">
                    <header>
                        <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
                            <Image
                                src="/img/logo_yipshare_icono.png"
                                alt="Logo de YipShare"
                                width={155}
                                height={135}
                                priority
                                className="h-9 w-auto"
                            />

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/terms_conditions"
                                    className="mr-3 hidden text-sm font-semibold text-white hover:underline md:block"
                                >
                                    Términos y Condiciones
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-32 rounded-md bg-azul-claro py-1 text-center text-sm font-bold text-white transition hover:bg-[#3b86cc]"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register_account"
                                    className="w-32 rounded-md bg-white py-1 text-center text-sm font-bold text-azul transition hover:bg-sky-200"
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
                            Empezar
                        </Link>
                    </main>
                </div>
            </div>
        </GuestOnly>
    );
}
