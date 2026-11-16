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

export const useUser = () => useContext(UserContext);

function OnPageChange({ run }) {
  const pathname = usePathname();
  useEffect(() => run(), [pathname, run]);
  return null;
}

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
