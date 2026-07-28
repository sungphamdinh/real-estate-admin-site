"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "./api";

interface AuthContextValue {
  token: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "admin_access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Must run after mount, not during the initial render (e.g. via a
    // useState lazy initializer): the server has no localStorage, so
    // reading it during the first client render (before this effect
    // fires) would produce a hydration mismatch against the SSR output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(localStorage.getItem(STORAGE_KEY));
    setHydrated(true);
  }, []);

  async function login(email: string, password: string) {
    const accessToken = await apiLogin(email, password);
    localStorage.setItem(STORAGE_KEY, accessToken);
    setToken(accessToken);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  return <AuthContext.Provider value={{ token, hydrated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
