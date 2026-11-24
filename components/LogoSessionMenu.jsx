"use client";

import Image from "next/image";
import { useRef } from "react";

export function LogoSessionMenu() {
    const ref = useRef(null);

    return (
        <>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    aria-label="Menú de sesión"
                    aria-haspopup="menu"
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
            </div>
        </>
    );
}
