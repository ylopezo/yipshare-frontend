"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  hasStoredSession,
  getProfile,
  forgetSession,
  homePage,
} from "@/lib/session";
import { LoadingScreen } from "./LoadingScreen";

const UserContext = createContext(null);

// { nombre, usuario, rol } del que inició sesión; null mientras se verifica
export const useUser = () => useContext(UserContext);

// Aislado en su propio Suspense: con cacheComponents, usePathname suspende en rutas con [id] y no debe bloquear la página
function OnPageChange({ run }) {
  const pathname = usePathname();
  useEffect(() => run(), [pathname, run]);
  return null;
}

// Verifica el token con el backend al entrar, en cada cambio de página y al volver con "atrás" desde la caché del navegador.
// Sin sesión válida → al login con el motivo; con sesión de otro rol → a su propia página.
// shortcut: solo protege la vista; la seguridad real es el 401/403 de cada ruta del backend.
export function RequireSession({ role, children }) {
  const router = useRouter();
  const [access, setAccess] = useState("loading");
  const [user, setUser] = useState(null);

  const verify = useCallback(() => {
    let isCurrent = true;
    getProfile().then(({ status, data }) => {
      if (!isCurrent) return;
      if (status !== 200) {
        const offline = status === 0 || status >= 500;
        const reason = offline
          ? "offline"
          : hasStoredSession()
            ? "expired"
            : "required";
        if (!offline) forgetSession();
        router.replace(`/login?session=${reason}`);
        return;
      }
      if (role && data.user.role !== role) {
        setAccess("loading");
        router.replace(homePage(data.user.role));
        return;
      }
      setUser(data.user);
      setAccess("allowed");
    });
    return () => {
      isCurrent = false;
    };
  }, [role, router]);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) verify();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [verify]);

  // Siempre se renderiza children (Next necesita el segmento para la navegación instantánea); queda oculto hasta confirmar la sesión.
  // Sin token, globals.css oculta data-private al instante, aunque React aún no haya verificado.
  return (
    <UserContext.Provider value={user}>
      <Suspense fallback={null}>
        <OnPageChange run={verify} />
      </Suspense>
      {access === "loading" && <LoadingScreen />}
      <div data-private hidden={access !== "allowed"} className="contents">
        {children}
      </div>
    </UserContext.Provider>
  );
}
