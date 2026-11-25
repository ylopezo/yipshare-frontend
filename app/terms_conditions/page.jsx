"use client";

import Link from "next/link";
import Image from "next/image";
import { YipBackground } from "@/components/YipBackground";

const INDEX = [
    { id: "aceptacion", label: "Aceptación de los términos" },
    { id: "que-es", label: "Qué es YipShare" },
    { id: "cuenta", label: "Registro y cuenta" },
    { id: "publicaciones", label: "Publicación de artículos" },
    { id: "loans", label: "Préstamos y uso compartido" },
    { id: "responsabilidades", label: "Responsabilidades del usuario" },
    { id: "danos", label: "Daños, pérdidas y disputas" },
    { id: "prohibido", label: "Conductas prohibidas" },
    { id: "privacidad", label: "Privacidad y datos personales" },
    { id: "propiedad", label: "Propiedad intelectual" },
    { id: "limitacion", label: "Limitación de responsabilidad" },
    { id: "suspension", label: "Suspensión y cancelación" },
    { id: "cambios", label: "Cambios a estos términos" },
    { id: "ley", label: "Ley aplicable" },
];

export default function TermsConditionsPage() {
    return (
        <div className="relative flex min-h-dvh scroll-smooth flex-col bg-azul font-sans text-white">
            <YipBackground fixed />
            <header className="sticky top-0 z-20 bg-azul border-b border-white/20">
                <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/" aria-label="YipShare - inicio">
                            <Image
                                src="/img/logo_yipshare_icono.png"
                                alt="Logo de YipShare"
                                width={155}
                                height={135}
                                priority
                                className="h-9 w-auto"
                            />
                        </Link>

                        <ul className="m-0 hidden list-none items-center gap-8 p-0 text-sm font-semibold md:flex">
                            <li>
                                <Link href="/terms_conditions" className="text-white underline">
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-3">
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

            <main className="relative z-10 flex-1 px-4 py-10">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="mb-8 text-center">
                        <h1 className="m-0 text-3xl font-semibold md:text-5xl">
                            Términos y Condiciones
                        </h1>

                        <p className="mt-3 text-lg font-semibold">El valor está en el uso, no en la posesión</p>

                        <p className="mt-1 text-sm text-sky-100">Última actualización: octubre de 2026</p>
                    </div>

                    <article className="rounded-lg bg-white px-6 py-8 text-oscuro md:px-10">
                        <p className="m-0 text-neutral-600">
                            Bienvenido a <strong>YipShare</strong>. Al crear una cuenta o usar la plataforma aceptas los
                            Términos y Condiciones.
                        </p>

                        <nav aria-label="Índice" className="mt-6 rounded-lg border border-neutral-200 bg-[#f3f7fb] p-5">
                            <h2 className="m-0 text-sm font-semibold text-azul-claro">
                                Contenido
                            </h2>

                            <ol className="mt-3 grid list-decimal gap-x-8 gap-y-1 pl-5 text-sm sm:grid-cols-2">
                                {INDEX.map((item) => (
                                    <li key={item.id}>
                                        <a href={`#${item.id}`} className="text-azul hover:underline">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        <section id="aceptacion" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">1. Aceptación de los términos</h2>

                            <p className="m-0 text-neutral-700">
                                Al registrarte, iniciar sesión o utilizar cualquier función de YipShare, confirmas que
                                has leído, entendido y aceptado estos términos. Si no estás de acuerdo con alguna parte,
                                te pedimos que no uses la plataforma. Debes ser mayor de edad o contar con la
                                autorización de tu madre, padre o tutor legal.
                            </p>
                        </section>

                        <section id="que-es" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">2. Qué es YipShare</h2>

                            <p className="m-0 text-neutral-700">
                                YipShare es una plataforma que conecta a personas de una misma comunidad para compartir,
                                prestar y utilizar objetos (herramientas, bicicletas, libros, equipo, entre otros) en
                                lugar de comprarlos y acumularlos. Nuestra idea es simple:{" "}
                                <strong>el valor está en el uso, no en la posesión</strong>.
                            </p>

                            <p className="mb-0 mt-3 text-neutral-700">
                                YipShare actúa únicamente como intermediario que facilita el contacto entre usuarios. No
                                es propietario de los artículos publicados, no participa como parte en los acuerdos
                                entre usuarios y no garantiza que un préstamo se concrete.
                            </p>
                        </section>

                        <section id="cuenta" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">3. Registro y cuenta</h2>

                            <ul className="m-0 list-disc space-y-1 pl-6 text-neutral-700">
                                <li>
                                    Debes proporcionar información verdadera, completa y actualizada al registrarte.
                                </li>
                                <li>Eres responsable de mantener la confidencialidad de tu usuario y contraseña.</li>
                                <li>
                                    Cada persona puede tener una sola cuenta; no está permitido suplantar a otros
                                    usuarios.
                                </li>
                                <li>
                                    Debes avisarnos de inmediato si sospechas que tu cuenta fue usada sin tu permiso.
                                </li>
                            </ul>
                        </section>

                        <section id="publicaciones" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">4. Publicación de artículos</h2>

                            <p className="m-0 text-neutral-700">Al publicar un artículo declaras y aceptas que:</p>

                            <ul className="mt-2 list-disc space-y-1 pl-6 text-neutral-700">
                                <li>Eres el propietario del artículo o tienes autorización para compartirlo.</li>
                                <li>La descripción, el estado y las fotografías son reales y no engañosas.</li>
                                <li>
                                    El artículo es legal, seguro y funciona de manera adecuada para el uso indicado.
                                </li>
                                <li>
                                    No publicarás objetos prohibidos, peligrosos, robados o que infrinjan derechos de
                                    terceros.
                                </li>
                            </ul>

                            <p className="mb-0 mt-3 text-neutral-700">
                                YipShare puede retirar cualquier publicación que incumpla estos términos o que considere
                                inapropiada, sin previo aviso.
                            </p>
                        </section>

                        <section id="loans" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">5. Préstamos y uso compartido</h2>

                            <ul className="m-0 list-disc space-y-1 pl-6 text-neutral-700">
                                <li>
                                    Quien presta y quien recibe acuerdan directamente las condiciones: duración, lugar y
                                    forma de entrega y devolución, y cuidados específicos del artículo.
                                </li>
                                <li>
                                    Se recomienda revisar juntos el estado del artículo al momento de la entrega y de la
                                    devolución.
                                </li>
                                <li>
                                    El artículo debe devolverse en la fecha acordada y en las mismas condiciones en que
                                    se recibió, salvo el desgaste normal por uso.
                                </li>
                                <li>
                                    Los encuentros deben realizarse en lugares seguros. Te sugerimos preferir espacios
                                    públicos o conocidos de tu comunidad.
                                </li>
                            </ul>
                        </section>

                        <section id="responsabilidades" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">6. Responsabilidades del usuario</h2>

                            <p className="m-0 text-neutral-700">Como usuario de YipShare te comprometes a:</p>

                            <ul className="mt-2 list-disc space-y-1 pl-6 text-neutral-700">
                                <li>Tratar con respeto a los demás miembros de la comunidad.</li>
                                <li>Cuidar los artículos que recibes como si fueran tuyos.</li>
                                <li>Cumplir los acuerdos que hagas con otros usuarios.</li>
                                <li>
                                    Usar los artículos únicamente para el fin acordado y sin ponerte ni poner a otros en
                                    riesgo.
                                </li>
                                <li>Cumplir las leyes aplicables en el uso de la plataforma.</li>
                            </ul>
                        </section>

                        <section id="danos" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">7. Daños, pérdidas y disputas</h2>

                            <p className="m-0 text-neutral-700">
                                Quien recibe un artículo es responsable de repararlo o reponerlo si se daña, se pierde o
                                es robado mientras está bajo su cuidado, salvo que el daño se deba al desgaste normal o
                                a un defecto previo. Los usuarios deben intentar resolver cualquier desacuerdo de buena
                                fe y de manera directa.
                            </p>

                            <p className="mb-0 mt-3 text-neutral-700">
                                Si no logran un acuerdo, pueden escribirnos desde la página de contacto. YipShare podrá
                                orientar a las partes, pero no está obligado a resolver la disputa ni responde por su
                                resultado.
                            </p>
                        </section>

                        <section id="prohibido" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">8. Conductas prohibidas</h2>

                            <ul className="m-0 list-disc space-y-1 pl-6 text-neutral-700">
                                <li>
                                    Publicar contenido falso, ofensivo, discriminatorio o que incite a la violencia.
                                </li>
                                <li>
                                    Ofrecer armas, sustancias ilegales o cualquier objeto cuya posesión o préstamo sea
                                    ilícito.
                                </li>
                                <li>Acosar, amenazar o engañar a otros usuarios.</li>
                                <li>Usar la plataforma para fines comerciales no autorizados, spam o fraude.</li>
                                <li>
                                    Intentar acceder sin permiso a cuentas, sistemas o datos de YipShare o de otros
                                    usuarios.
                                </li>
                                <li>Copiar, modificar o alterar el funcionamiento de la plataforma.</li>
                            </ul>
                        </section>

                        <section id="privacidad" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">9. Privacidad y datos personales</h2>

                            <p className="m-0 text-neutral-700">
                                Recopilamos y tratamos tus datos personales (como nombre, correo electrónico y la
                                información de tu cuenta) únicamente para operar la plataforma, permitir el contacto
                                entre usuarios, mejorar el servicio y mantener la seguridad. No vendemos tus datos a
                                terceros.
                            </p>

                            <p className="mb-0 mt-3 text-neutral-700">
                                Puedes solicitar el acceso, la corrección o la eliminación de tus datos, así como
                                oponerte a su uso, escribiéndonos desde la página de contacto. Parte de tu información,
                                como tu nombre de usuario y tus publicaciones, será visible para otros miembros de la
                                comunidad.
                            </p>
                        </section>

                        <section id="propiedad" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">10. Propiedad intelectual</h2>

                            <p className="m-0 text-neutral-700">
                                El nombre, el logotipo, el diseño y el código de YipShare pertenecen a sus creadores y
                                no pueden usarse sin autorización. Al subir fotos o textos a la plataforma, nos otorgas
                                una licencia limitada para mostrarlos dentro de YipShare con el único fin de operar el
                                servicio. Sigues siendo dueño de tu contenido.
                            </p>
                        </section>

                        <section id="limitacion" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">
                                11. Limitación de responsabilidad
                            </h2>

                            <p className="m-0 text-neutral-700">
                                YipShare se ofrece &quot;tal cual&quot; y hacemos lo posible por mantenerlo disponible y
                                seguro, pero no garantizamos que funcione sin interrupciones ni errores. En la medida
                                permitida por la ley, YipShare no es responsable por daños, lesiones, pérdidas o
                                conflictos derivados del uso de los artículos compartidos ni de la conducta de los
                                usuarios. Cada persona asume la responsabilidad de los acuerdos que realiza.
                            </p>
                        </section>

                        <section id="suspension" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">12. Suspensión y cancelación</h2>

                            <p className="m-0 text-neutral-700">
                                Podemos suspender o cancelar tu cuenta si incumples estos términos, si pones en riesgo a
                                otros usuarios o si usas la plataforma de forma indebida. También puedes dejar de usar
                                YipShare y solicitar la eliminación de tu cuenta en cualquier momento.
                            </p>
                        </section>

                        <section id="cambios" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">13. Cambios a estos términos</h2>

                            <p className="m-0 text-neutral-700">
                                Podemos actualizar estos términos cuando sea necesario. Publicaremos la versión vigente
                                en esta página con su fecha de actualización. Si sigues usando YipShare después de un
                                cambio, entendemos que lo aceptas.
                            </p>
                        </section>

                        <section id="ley" className="scroll-mt-24">
                            <h2 className="mb-2 mt-8 text-xl font-semibold text-azul">14. Ley aplicable</h2>

                            <p className="m-0 text-neutral-700">
                                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
                                controversia, las partes se someten a la jurisdicción de los tribunales competentes de
                                la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles.
                            </p>
                        </section>

                        <div className="mt-10 flex flex-col items-center gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-between">
                            <Link
                                href="/"
                                className="rounded-lg bg-oscuro px-8 py-2 text-white no-underline transition hover:bg-oscuro-hover"
                            >
                                Volver al Inicio
                            </Link>

                            <a href="#" className="text-sm font-bold text-azul-claro hover:underline">
                                Volver arriba
                            </a>
                        </div>
                    </article>
                </div>
            </main>

            <footer className="relative z-10 px-4 py-6 text-center text-xs text-sky-100">
                © 2026 YipShare. Todos los derechos reservados.
            </footer>
        </div>
    );
}
