"use client";

import { useSyncExternalStore, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { saveSession, clearSession } from "@/lib/auth";
import type { Session } from "@/types";

const SESSION_KEY = "iptv_session";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

export function useAuth(requireAuth = false) {
  const router = useRouter();

  // Returns the raw JSON string — primitive comparison avoids infinite loops
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = useMemo<Session | null>(
    () => (raw ? (JSON.parse(raw) as Session) : null),
    [raw]
  );

  const isAuthenticated = raw !== null;

  // Redirect if required and not authenticated (in useEffect, not during render)
  useEffect(() => {
    if (requireAuth && !raw) {
      router.push("/activate-device");
    }
  }, [requireAuth, raw, router]);

  const login = useCallback(
    (data: Session) => {
      saveSession(data);
      // Dispatch storage event so other components update
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    window.dispatchEvent(new Event("storage"));
    router.push("/activate-device");
  }, [router]);

  return { session, isLoading: false, isAuthenticated, login, logout };
}
