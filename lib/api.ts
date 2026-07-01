import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api",
  headers: { Accept: "application/json" },
});

// Otomatis tambah Bearer token di setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika 401, hapus token dan redirect ke login (kecuali sedang di halaman login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");
      
      // Cegah infinite loop / refresh paksa jika sudah di halaman login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (d: { email: string; password: string }) =>
    api.post("/auth/login", d),
  register: (d: Record<string, string>) =>
    api.post("/auth/register", d),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/user"),
};

// ── Categories ────────────────────────────────────────────────────────────
export const categoryApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/categories", { params: p }),
  all: () => api.get("/categories/all"),
  store: (d: FormData) =>
    api.post("/categories", d, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, d: FormData) =>
    api.post(`/categories/${id}?_method=PUT`, d, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// ── Products ──────────────────────────────────────────────────────────────
export const productApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/products", { params: p }),
  get: (id: number) => api.get(`/products/${id}`),
  store: (d: FormData) =>
    api.post("/products", d, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, d: FormData) =>
    api.post(`/products/${id}?_method=PUT`, d, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// ── Suppliers ─────────────────────────────────────────────────────────────
export const supplierApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/suppliers", { params: p }),
  all: () => api.get("/suppliers/all"),
  store: (d: Record<string, unknown>) => api.post("/suppliers", d),
  update: (id: number, d: Record<string, unknown>) =>
    api.put(`/suppliers/${id}`, d),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
};

// ── Sales ─────────────────────────────────────────────────────────────────
export const saleApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/sales", { params: p }),
  get: (id: number) => api.get(`/sales/${id}`),
  store: (d: Record<string, unknown>) => api.post("/sales", d),
  pay: (id: number) => api.post(`/sales/${id}/pay`),
};

// ── Purchases ─────────────────────────────────────────────────────────────
export const purchaseApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/purchases", { params: p }),
  get: (id: number) => api.get(`/purchases/${id}`),
  store: (d: Record<string, unknown>) => api.post("/purchases", d),
  receive: (id: number) => api.post(`/purchases/${id}/receive`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get("/dashboard/stats"),
  salesChart: (p?: Record<string, unknown>) =>
    api.get("/dashboard/chart/sales", { params: p }),
  topProducts: (p?: Record<string, unknown>) =>
    api.get("/dashboard/chart/top-products", { params: p }),
};

// ── Reports ───────────────────────────────────────────────────────────────
export const reportApi = {
  sales: (p?: Record<string, unknown>) =>
    api.get("/reports/sales", { params: p }),
  exportSales: (p?: Record<string, unknown>) =>
    api.get("/reports/sales/export", {
      params: p,
      responseType: "blob",
    }),
  exportProducts: (p?: Record<string, unknown>) =>
    api.get("/reports/products/export", {
      params: p,
      responseType: "blob",
    }),
};

// ── Users ─────────────────────────────────────────────────────────────────
export const userApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/users", { params: p }),
  store: (d: Record<string, unknown>) => api.post("/users", d),
  update: (id: number, d: Record<string, unknown>) =>
    api.put(`/users/${id}`, d),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// ── Activity Logs ─────────────────────────────────────────────────────────
export const activityApi = {
  list: (p?: Record<string, unknown>) =>
    api.get("/activity-logs", { params: p }),
};

export default api;