"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CondominioCard } from "@/components/CondominioCard";
import { CrearCondominioModal, type DatosCrear } from "@/components/CrearCondominioModal";
import { Icon } from "@/components/Icon";
import { UnirseCondominioModal, type DatosUnirse } from "@/components/UnirseCondominioModal";
import { NOMBRE_USUARIO, REGISTRADOS_INICIALES, UNIDOS_INICIALES, type CondominioUsuario } from "@/lib/datosHabitante";

type Modal = "unirse" | "crear" | null;

function Seccion({ titulo, vacio, children }: { titulo: string; vacio: boolean; children: React.ReactNode }) {
    return <section className="mb-8"><h2 className="m-0 text-base font-bold">{titulo}</h2>{vacio ? <p className="mt-4 text-sm text-slate-500">Sin condominios por ahora.</p> : <div className="mt-4 flex flex-wrap gap-4">{children}</div>}</section>;
}

export default function HabitantePrincipalPage() {
    const [registrados] = useState<CondominioUsuario[]>(REGISTRADOS_INICIALES);
    const [unidos, setUnidos] = useState<CondominioUsuario[]>(UNIDOS_INICIALES);
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modal, setModal] = useState<Modal>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuAbierto) return;
        const onMouseDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false); };
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuAbierto(false); };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => { document.removeEventListener("mousedown", onMouseDown); document.removeEventListener("keydown", onKeyDown); };
    }, [menuAbierto]);

    const filtrar = useCallback((lista: CondominioUsuario[]) => {
        const texto = busqueda.trim().toLowerCase();
        return texto ? lista.filter(({ nombre, admin }) => `${nombre} ${admin}`.toLowerCase().includes(texto)) : lista;
    }, [busqueda]);
    const registradosFiltrados = useMemo(() => filtrar(registrados), [filtrar, registrados]);
    const unidosFiltrados = useMemo(() => filtrar(unidos), [filtrar, unidos]);
    const sinCondominios = registrados.length === 0 && unidos.length === 0;
    const sinResultados = !sinCondominios && registradosFiltrados.length === 0 && unidosFiltrados.length === 0;
    const abrirModal = (tipo: Exclude<Modal, null>) => { setMenuAbierto(false); setModal(tipo); };
    const handleUnirse = (datos: DatosUnirse) => {
        setUnidos((prev) => [...prev, { id: Date.now(), nombre: `Condominio ${datos.codigo}`, admin: "por_definir" }]);
        setModal(null);
    };
    const handleCrear = (datos: DatosCrear) => { void datos; setModal(null); setAviso("Tu solicitud fue enviada. El condominio aparecerá cuando sea aprobada."); };
    const botonPrincipal = "w-56 cursor-pointer rounded-lg bg-[#1f2d47] py-2 text-xs font-semibold text-white transition hover:bg-[#2c4066]";

    return <div className="flex h-screen flex-col overflow-hidden bg-[#e9eef3] font-sans text-black">
        <header className="flex h-[100px] shrink-0 items-center gap-4 bg-[#1e4a73] px-4 text-white md:px-6">
            <Image src="/img/logo_yipshare_icono.png" alt="YipShare" width={190} height={56} priority className="h-14 w-auto object-contain" />
            <h1 className="m-0 ml-2 min-w-0 truncate text-2xl font-bold md:ml-14 md:text-3xl">Hola, {NOMBRE_USUARIO}</h1>
            <div className="ml-auto flex flex-col items-end gap-2"><div className="flex items-center gap-3">
                <div ref={menuRef} className="relative"><button type="button" aria-label="Unirse o crear condominio" aria-haspopup="menu" aria-expanded={menuAbierto} onClick={() => setMenuAbierto((abierto) => !abierto)} className="cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"><Icon name="plus" size={28} /></button>
                    {menuAbierto && <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded bg-white text-left shadow-lg"><button type="button" role="menuitem" onClick={() => abrirModal("unirse")} className="block w-full cursor-pointer border-b border-slate-300 px-3 py-2 text-left text-sm font-bold text-[#2a5a88] hover:bg-slate-100">Unirse a Condominio</button><button type="button" role="menuitem" onClick={() => abrirModal("crear")} className="block w-full cursor-pointer px-3 py-2 text-left text-sm font-bold text-[#2a5a88] hover:bg-slate-100">Crear Condominio</button></div>}
                </div>
                <button type="button" aria-label="Notificaciones" className="cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"><Icon name="bell" size={28} /></button>
            </div><div className="relative hidden sm:block"><label htmlFor="buscar" className="sr-only">Buscar condominio</label><input id="buscar" type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar condominio..." className="w-72 rounded-full bg-white/10 py-1.5 pl-4 pr-10 text-sm text-white placeholder:text-white/70 outline-none transition focus:bg-white/20 lg:w-80" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"><Icon name="search" size={18} /></span></div></div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-10">
            {aviso && <div role="status" className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-[#78b0ea] bg-[#dbe7f5] px-4 py-2 text-sm text-[#1e4a73]"><span>{aviso}</span><button type="button" aria-label="Cerrar aviso" onClick={() => setAviso(null)} className="cursor-pointer rounded-full p-1 hover:bg-white/60"><Icon name="close" size={16} /></button></div>}
            {sinCondominios ? <><h2 className="m-0 text-base font-bold">Condominios Registrados</h2><h2 className="m-0 mt-6 text-base font-bold">Condominios Unidos</h2><div className="mt-12 flex flex-col items-center gap-3"><p className="m-0 text-xs font-bold text-[#78b0ea]">No hay condominios disponibles</p><button type="button" onClick={() => setModal("crear")} className={botonPrincipal}>Crear Condominio</button><button type="button" onClick={() => setModal("unirse")} className={botonPrincipal}>Unirse a Condominio</button></div></> : sinResultados ? <p className="py-10 text-center text-sm text-slate-500">No se encontraron condominios.</p> : <><Seccion titulo="Condominios Registrados" vacio={registradosFiltrados.length === 0}>{registradosFiltrados.map((condominio) => <CondominioCard key={condominio.id} condominio={condominio} rol="admin" />)}</Seccion><Seccion titulo="Condominios Unidos" vacio={unidosFiltrados.length === 0}>{unidosFiltrados.map((condominio) => <CondominioCard key={condominio.id} condominio={condominio} rol="habitante" />)}</Seccion></>}
        </main>
        {modal === "unirse" && <UnirseCondominioModal onEntrar={handleUnirse} onCancelar={() => setModal(null)} />}
        {modal === "crear" && <CrearCondominioModal onCrear={handleCrear} onCancelar={() => setModal(null)} />}
    </div>;
}
