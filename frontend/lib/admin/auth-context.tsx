"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      // Verify token is still valid
      fetch(`${API_BASE}/api/v1/admin/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setUser(data);
          else logout();
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [logout]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/v1/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");

    const { access_token } = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", access_token);
    }
    setToken(access_token);

    const meRes = await fetch(`${API_BASE}/api/v1/admin/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const me = await meRes.json();
    setUser(me);
    router.push("/admin");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
