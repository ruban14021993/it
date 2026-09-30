"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/api/v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_access_token");
    }
    setToken(null);
    setUser(null);
    if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
    if (savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      fetch(`${API_BASE}/admin/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          if (data) setUser(data);
          if (pathname === "/admin/login") {
             router.push("/admin");
          }
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      if (pathname !== "/admin/login" && pathname.startsWith("/admin")) {
        router.push("/admin/login");
      }
    }
  }, [logout, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errText = await res.text();
      let detail = "Invalid credentials";
      try {
        const errJson = JSON.parse(errText);
        detail = errJson.detail || detail;
      } catch {}
      throw new Error(detail);
    }

    const { access_token } = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_access_token", access_token);
    }
    setToken(access_token);

    const meRes = await fetch(`${API_BASE}/admin/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (meRes.ok) {
      const me = await meRes.json();
      setUser(me);
    }
    router.push("/admin");
  };

  // Do not render children until loading is complete to avoid flashes of unauthenticated content
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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


