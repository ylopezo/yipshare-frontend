"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/session";
import { ConfirmDialog } from "./Modal";

export function LogoSessionMenu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  async function handleConfirm() {
    setConfirming(false);
    await signOut();
    router.replace("/login");
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-label="Menú de sesión"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="cursor-pointer rounded-lg transition hover:opacity-80"
        >
          <Image
            src="/img/logo_yipshare_icono.png"
            alt="YipShare"
            width={190}
            height={56}
            priority
            className="h-14 w-auto object-contain"
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute left-0 top-full z-60 mt-2 w-full overflow-hidden rounded bg-white text-left shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setConfirming(true);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm font-bold text-[#2a5a88] hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {confirming && (
        <ConfirmDialog
          title="¿Estás seguro?"
          message="Se cerrará tu sesión."
          onConfirmAction={handleConfirm}
          onCancelAction={() => setConfirming(false)}
        />
      )}
    </>
  );
}
