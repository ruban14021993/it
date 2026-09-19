const getApiBase = () => {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { tags?: string[]; revalidate?: number }
): Promise<T> {
  const { tags, revalidate, ...fetchOptions } = options || {};

  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/v1/public${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }

  return res.json() as Promise<T>;
}

export async function adminFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
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

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Admin API error ${res.status}: ${error}`);
  }

  return res.json() as Promise<T>;
}
