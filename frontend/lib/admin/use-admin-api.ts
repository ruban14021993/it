import { useCallback } from "react";
import { useAuth } from "@/lib/admin/auth-context";

const getApiBase = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function useAdminApi() {
  const { token, logout } = useAuth();

  const adminFetch = useCallback(async <T>(
    path: string,
    options?: RequestInit
  ): Promise<T> => {
    if (!token) throw new ApiError("Not authenticated", 401);

    const API_BASE = getApiBase();
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    
    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options?.headers || {}),
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      logout();
      throw new ApiError("Session expired", 401);
    }

    if (!res.ok) {
      const errorText = await res.text();
      let detail = `API error ${res.status}`;
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.detail) {
           detail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {}
      throw new ApiError(detail, res.status);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }, [token, logout]);

  return { adminFetch };
}

