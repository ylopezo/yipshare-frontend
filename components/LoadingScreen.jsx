"use client";

import Image from "next/image";

export function LoadingScreen() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/40"
        >
            <Image
                src="/img/logo_yipshare_icono.png"
                alt=""
                width={155}
                height={135}
                priority
                className="h-24 w-auto animate-spin object-contain motion-reduce:animate-pulse"
            />
            <span className="sr-only">Cargando…</span>
        </div>
    );
}
