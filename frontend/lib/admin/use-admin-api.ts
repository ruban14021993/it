import { useAuth } from "@/lib/admin/auth-context";

const getApiBase = () => {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export function useAdminApi() {
  const { token, logout } = useAuth();

  async function adminFetch<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    if (!token) throw new Error("Not authenticated");

    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/api/v1/admin${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      logout();
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`API error ${res.status}: ${error}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return { adminFetch };
}
