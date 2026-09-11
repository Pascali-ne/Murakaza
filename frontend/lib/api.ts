// Thin fetch wrapper for the Murakaza API (Render). Centralizing this
// keeps auth-header handling and error normalization in one place.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://murakaza-api.onrender.com";

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("/api/upload")) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

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

// --- Uploads ---
export const upload = {
  file: async (file: File): Promise<{ id: string; url: string; filename: string; mimeType: string; sizeBytes: number }> => {
    // Read file as base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const res = await apiFetch<{
      id: string;
      url: string;
      fullUrl?: string;
      filename: string;
      mimeType: string;
      sizeBytes: number;
    }>("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type,
        data: base64Data,
      }),
      auth: true,
    });

    return {
      ...res,
      url: resolveMediaUrl(res.url),
    };
  },

  list: async (): Promise<{ files: Array<{ id: string; url: string; filename: string; mimeType: string; sizeBytes: number; createdAt: string }> }> => {
    const res = await apiFetch<{ files: Array<{ id: string; url: string; filename: string; mimeType: string; sizeBytes: number; createdAt: string }> }>(
      "/api/upload",
      { auth: true }
    );
    return {
      files: (res.files || []).map((f) => ({
        ...f,
        url: resolveMediaUrl(f.url),
      })),
    };
  },

  remove: (id: string) =>
    apiFetch<{ message: string; id: string }>(`/api/upload/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

// --- CMS ---
export const cms = {
  listPublished: async (type?: string) => {
    const res = await apiFetch<{ items: CmsItem[] }>(`/api/cms${type ? `?type=${type}` : ""}`);
    return {
      items: (res.items || []).map((item) => ({
        ...item,
        mediaUrl: resolveMediaUrl(item.mediaUrl),
        posterUrl: resolveMediaUrl(item.posterUrl),
      })),
    };
  },
  getByKey: async (key: string) => {
    const res = await apiFetch<{ item: CmsItem }>(`/api/cms/${key}`);
    return {
      item: {
        ...res.item,
        mediaUrl: resolveMediaUrl(res.item.mediaUrl),
        posterUrl: resolveMediaUrl(res.item.posterUrl),
      },
    };
  },
  listAllAdmin: async () => {
    const res = await apiFetch<{ items: CmsItem[] }>("/api/cms/admin/all", { auth: true });
    return {
      items: (res.items || []).map((item) => ({
        ...item,
        mediaUrl: resolveMediaUrl(item.mediaUrl),
        posterUrl: resolveMediaUrl(item.posterUrl),
      })),
    };
  },
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
export interface IremboInvoiceResponse {
  payment: unknown;
  invoiceNumber: string;
  paymentUrl: string;
  merchantTxRef: string;
  amountRwf: number;
  currency: string;
}

export interface PaymentStatusResponse {
  providerRef: string;
  provider: "IREMBOPAY" | "STRIPE" | "FLUTTERWAVE" | "MOMO";
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  webhookVerified: boolean;
  amountCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentItem {
  id: string;
  userId: string;
  provider: "IREMBOPAY" | "STRIPE" | "FLUTTERWAVE" | "MOMO";
  providerRef: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  description: string | null;
  metadata: {
    customer?: {
      fullName?: string;
      phone?: string;
      email?: string;
    };
    invoiceNumber?: string;
    merchantTxRef?: string;
    webhookReceivedAt?: string;
    itemsCount?: number;
    pickupLocation?: string;
    orderStatus?: string;
    [key: string]: unknown;
  } | null;
  webhookVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminPaymentsResponse {
  payments: AdminPaymentItem[];
  summary: {
    totalCount: number;
    succeededCount: number;
    pendingCount: number;
    failedCount: number;
    verifiedCount: number;
    totalVolumeRwf: number;
  };
}

export const payments = {
  createIremboPayInvoice: async (payload: {
    amountRwf: number;
    description?: string;
    customer?: { fullName?: string; phone?: string; email?: string };
    items?: unknown[];
  }): Promise<IremboInvoiceResponse> => {
    return await apiFetch<IremboInvoiceResponse>("/api/payments/irembopay/invoice", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    });
  },

  getPaymentStatus: async (providerRef: string): Promise<PaymentStatusResponse> => {
    return await apiFetch<PaymentStatusResponse>(`/api/payments/status/${providerRef}`, {
      auth: true,
    });
  },

  listAllAdmin: async (params?: {
    status?: string;
    provider?: string;
    search?: string;
  }): Promise<AdminPaymentsResponse> => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.provider) qs.set("provider", params.provider);
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return await apiFetch<AdminPaymentsResponse>(`/api/payments/admin/all${query ? `?${query}` : ""}`, {
      auth: true,
    });
  },

  createIntent: async (payload: {
    amountCents: number;
    currency: string;
    description?: string;
    provider: "IREMBOPAY" | "STRIPE" | "FLUTTERWAVE" | "MOMO";
  }) => {
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
      const res = await apiFetch<{ total: number; supplies: CatalogItem[]; courses: CatalogItem[]; items: CatalogItem[] }>(
        `/api/catalog${qs ? `?${qs}` : ""}`
      );
      const normalize = (i: CatalogItem) => ({ ...i, image: resolveMediaUrl(i.image) });
      return {
        total: res.total,
        supplies: (res.supplies || []).map(normalize),
        courses: (res.courses || []).map(normalize),
        items: (res.items || []).map(normalize),
      };
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

      const normalize = (i: CatalogItem) => ({ ...i, image: resolveMediaUrl(i.image) });
      const normSupplies = filtered.filter((i) => i.type === "SUPPLY").map(normalize);
      const normCourses = filtered.filter((i) => i.type === "COURSE").map(normalize);
      const normItems = filtered.map(normalize);

      return {
        total: filtered.length,
        supplies: normSupplies,
        courses: normCourses,
        items: normItems,
      };
    }
  },

  getById: async (id: string) => {
    try {
      const res = await apiFetch<{ item: CatalogItem }>(`/api/catalog/${id}`);
      return { item: { ...res.item, image: resolveMediaUrl(res.item.image) } };
    } catch {
      const { CATALOG_ITEMS } = await import("./catalogData");
      const found = CATALOG_ITEMS.find((i) => i.id === id);
      if (!found) throw new Error("Catalog item not found");
      return { item: { ...found, image: resolveMediaUrl(found.image) } };
    }
  },

  create: (item: Partial<CatalogItem>) =>
    apiFetch<{ item: CatalogItem; message: string }>("/api/catalog", {
      method: "POST",
      body: JSON.stringify(item),
      auth: true,
    }),

  update: (id: string, patch: Partial<CatalogItem>) =>
    apiFetch<{ item: CatalogItem; message: string }>(`/api/catalog/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
      auth: true,
    }),

  remove: (id: string) =>
    apiFetch<{ message: string; id: string }>(`/api/catalog/${id}`, {
      method: "DELETE",
      auth: true,
    }),
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
  featuredInHero?: boolean;
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

