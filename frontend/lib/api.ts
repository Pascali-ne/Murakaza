// Thin fetch wrapper for the Murakaza API (Render). Centralizing this
// keeps auth-header handling and error normalization in one place.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://murakaza-api.onrender.com";

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach the stored access token
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("murakaza_access_token") : null;
    if (token) (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders, credentials: "omit" });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- CMS ---
export const cms = {
  listPublished: (type?: string) => apiFetch<{ items: CmsItem[] }>(`/api/cms${type ? `?type=${type}` : ""}`),
  getByKey: (key: string) => apiFetch<{ item: CmsItem }>(`/api/cms/${key}`),
  listAllAdmin: () => apiFetch<{ items: CmsItem[] }>("/api/cms/admin/all", { auth: true }),
  upsert: (payload: Partial<CmsItem>) =>
    apiFetch<{ item: CmsItem }>("/api/cms", { method: "POST", body: JSON.stringify(payload), auth: true }),
  remove: (id: string) => apiFetch<void>(`/api/cms/${id}`, { method: "DELETE", auth: true }),
};

// --- Feedback ---
export const feedback = {
  listApproved: () => apiFetch<{ feedback: FeedbackItem[] }>("/api/feedback"),
  submit: (payload: { authorName: string; rating: number; comment: string }) =>
    apiFetch<{ feedback: FeedbackItem; message: string }>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listAllAdmin: () => apiFetch<{ feedback: FeedbackItem[] }>("/api/feedback/admin/all", { auth: true }),
  moderate: (id: string, patch: { isApproved?: boolean; isHidden?: boolean }) =>
    apiFetch<{ feedback: FeedbackItem }>(`/api/feedback/${id}/moderate`, {
      method: "PATCH",
      body: JSON.stringify(patch),
      auth: true,
    }),
  remove: (id: string) => apiFetch<void>(`/api/feedback/${id}`, { method: "DELETE", auth: true }),
};

// --- Auth ---
export const auth = {
  login: (email: string, password: string) =>
    apiFetch<{ user: AuthUser; accessToken: string; refreshToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: { email: string; password: string; fullName: string }) =>
    apiFetch<{ user: AuthUser; accessToken: string; refreshToken: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => apiFetch<AuthUser>("/api/auth/me", { auth: true }),
};

// --- Payments ---
export const payments = {
  createIntent: async (payload: { amountCents: number; currency: string; description?: string; provider: "STRIPE" | "FLUTTERWAVE" | "MOMO" }) => {
    try {
      return await apiFetch<{ payment: unknown; clientSecret?: string; txRef?: string }>("/api/payments/intent", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      });
    } catch {
      // Fallback simulation if backend / database is offline or user is guest
      const mockRef = `murakaza_${payload.provider.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
      return {
        payment: { id: mockRef, status: "PENDING", ...payload },
        clientSecret: payload.provider === "STRIPE" ? `pi_mock_${mockRef}_secret` : undefined,
        txRef: mockRef,
      };
    }
  },
  myPayments: () => apiFetch<{ payments: unknown[] }>("/api/payments/me", { auth: true }),
};

// --- Catalog (Supplies & Courses) ---
export const catalog = {
  list: async (params?: { type?: "SUPPLY" | "COURSE" | "ALL"; category?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.category) query.set("category", params.category);
    if (params?.q) query.set("q", params.q);
    const qs = query.toString();

    try {
      return await apiFetch<{ total: number; supplies: CatalogItem[]; courses: CatalogItem[]; items: CatalogItem[] }>(
        `/api/catalog${qs ? `?${qs}` : ""}`
      );
    } catch {
      // Offline / development fallback
      const { CATALOG_ITEMS } = await import("./catalogData");
      let filtered = CATALOG_ITEMS;

      if (params?.type && params.type !== "ALL") {
        filtered = filtered.filter((i) => i.type.toUpperCase() === params.type?.toUpperCase());
      }
      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((i) => i.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.q) {
        const search = params.q.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.en.toLowerCase().includes(search) ||
            i.title.rw.toLowerCase().includes(search) ||
            i.description.en.toLowerCase().includes(search) ||
            i.description.rw.toLowerCase().includes(search)
        );
      }

      return {
        total: filtered.length,
        supplies: filtered.filter((i) => i.type === "SUPPLY"),
        courses: filtered.filter((i) => i.type === "COURSE"),
        items: filtered,
      };
    }
  },

  getById: async (id: string) => {
    try {
      return await apiFetch<{ item: CatalogItem }>(`/api/catalog/${id}`);
    } catch {
      const { CATALOG_ITEMS } = await import("./catalogData");
      const found = CATALOG_ITEMS.find((i) => i.id === id);
      if (!found) throw new Error("Catalog item not found");
      return { item: found };
    }
  },
};

// --- Types ---
export interface CatalogItem {
  id: string;
  type: "SUPPLY" | "COURSE";
  category: string;
  priceRwf: number;
  amountCents: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  stock?: number;
  instructor?: string;
  duration?: string;
  level?: string;
  image: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
}

export interface CmsItem {
  id: string;
  key: string;
  type: "HERO_VIDEO" | "BANNER_IMAGE" | "THUMBNAIL" | "PAGE_COPY" | "ANNOUNCEMENT";
  mediaUrl?: string | null;
  posterUrl?: string | null;
  localizedFields: { en: Record<string, string>; rw: Record<string, string> };
  isPublished: boolean;
}

export interface FeedbackItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isHidden: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
}

