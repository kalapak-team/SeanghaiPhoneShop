import {
  FALLBACK_SETTINGS,
  type Address,
  type AddressInput,
  type AuthUser,
  type HomeData,
  type PageResponse,
  type ProductCard,
  type ProductDetail,
  type Settings
} from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("sg_token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  home: () => request<HomeData>("/home"),
  settings: () => request<Settings>("/settings"),
  stores: () => request<import("./types").Store[]>("/stores"),
  products: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    return request<PageResponse<ProductCard>>(`/products?${query.toString()}`);
  },
  product: (slug: string) => request<ProductDetail>(`/products/${slug}`),
  checkout: (payload: unknown) => request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: unknown) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: unknown) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  myOrders: () => request("/orders"),
  updateProfile: (payload: { name: string; phone: string }) =>
    request<AuthUser>("/account/profile", { method: "PUT", body: JSON.stringify(payload) }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request<void>("/account/password", { method: "PUT", body: JSON.stringify(payload) }),
  addresses: () => request<Address[]>("/account/addresses"),
  createAddress: (payload: AddressInput) =>
    request<Address>("/account/addresses", { method: "POST", body: JSON.stringify(payload) }),
  updateAddress: (id: number, payload: AddressInput) =>
    request<Address>(`/account/addresses/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteAddress: (id: number) => request<void>(`/account/addresses/${id}`, { method: "DELETE" })
};

export async function safeHome(): Promise<HomeData | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

export async function safeSettings(): Promise<Settings> {
  try {
    return await api.settings();
  } catch {
    return FALLBACK_SETTINGS;
  }
}
