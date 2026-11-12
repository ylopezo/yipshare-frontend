"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
    hasStoredSession,
    markSession,
    getProfile,
    forgetSession,
    homePage,
    subscribeSession,
} from "@/lib/session";
import { LoadingScreen } from "./LoadingScreen";

const noTokenOnServer = () => false;

// Páginas públicas (inicio, login, registro, términos): con sesión válida te manda a tu página.
// Mientras hay token, globals.css oculta la página y aquí se muestra la carga, así no se ve ni un instante antes del salto.
export function GuestOnly({ children }) {
    const router = useRouter();
    const hasToken = useSyncExternalStore(subscribeSession, hasStoredSession, noTokenOnServer);
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        const verify = () => {
            markSession(hasStoredSession());
            if (!hasStoredSession()) return;
            getProfile().then(({ status, data }) => {
                if (!isCurrent) return;
                if (status === 200) {
                    router.replace(homePage(data.user.role));
                } else if (status === 0 || status >= 500) {
                    markSession(false);
                    setOffline(true);
                } else {
                    forgetSession();
                }
            });
        };

        const onPageShow = (e) => {
            if (e.persisted) verify();
        };

        verify();
        window.addEventListener("pageshow", onPageShow);
        return () => {
            isCurrent = false;
            window.removeEventListener("pageshow", onPageShow);
        };
    }, [router]);

    return (
        <>
            {hasToken && !offline && <LoadingScreen />}
            <div data-public className="contents">
                {children}
            </div>
        </>
    );
}
