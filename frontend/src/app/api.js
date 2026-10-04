// app/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

/* ── Token helpers ─────────────────────────────────────────── */
export const tokenStorage = {
  getAccess:   ()    => localStorage.getItem("accessToken"),
  getRefresh:  ()    => localStorage.getItem("refreshToken"),
  setTokens:   (a,r) => { localStorage.setItem("accessToken", a); localStorage.setItem("refreshToken", r); },
  clear:       ()    => { localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); },
};

/* ── Auto-attach Bearer token to every request ──────────────── */
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Auto-refresh on 401, then unwrap response.data ──────────
   Both success and error paths live in ONE interceptor now,
   since having two separate .use() calls made the error path
   messy (the second .use() would never see errors from the first).
────────────────────────────────────────────────────────────── */
function formatApiError(error) {
  const data = error.response?.data;
  if (!data || typeof data !== "object") return;

  const formatDetail = (field, message) => {
    if (typeof message !== "string" || !message.trim()) return null;
    if (!field) return message.trim();

    const label = String(field)
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      .replace(/[._]/g, " ");
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}: ${message.trim()}`;
  };

  const details = Array.isArray(data.errors)
    ? data.errors.map((item) => {
        if (typeof item === "string") return item.trim();
        if (!item || typeof item !== "object") return null;
        return formatDetail(item.field, item.message || item.defaultMessage);
      })
    : data.errors && typeof data.errors === "object"
      ? Object.entries(data.errors).flatMap(([field, messages]) =>
          (Array.isArray(messages) ? messages : [messages])
            .map((message) => formatDetail(field, message))
        )
      : [];

  const message = details.filter(Boolean).join("; ")
    || (typeof data.message === "string" ? data.message.trim() : "");

  if (message) error.message = message;
}

let isRefreshing = false;
let refreshQueue = []; // holds { resolve, reject } for requests waiting on an in-flight refresh

api.interceptors.response.use(
  (response) => response.data, // unwrap on success, same as before

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    const isLoginCall = originalRequest?.url?.includes("/auth/login");

    // Only attempt recovery for 401s, on requests we haven't already retried,
    // and never for login or refresh calls.
    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall && !isLoginCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // A refresh is already in flight — wait for it instead of firing another.
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const data = await authApi.refresh(); // reuses your existing authApi.refresh()
        refreshQueue.forEach(({ resolve }) => resolve(data.accessToken));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest); // retry the original failed request
      } catch (refreshError) {
        refreshQueue.forEach(({ reject }) => reject(refreshError));
        refreshQueue = [];
        tokenStorage.clear(); // only clear everything if refresh ITSELF failed
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    formatApiError(error);
    return Promise.reject(error);
  }
);

/* ── Auth API ──────────────────────────────────────────────── */
export const authApi = {
  register: (payload) => api.post("/auth/register", payload),

  login: async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  refresh: async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) throw new Error("No refresh token");
    const data = await api.post("/auth/refresh", { refreshToken });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },
};

/* ── User API ──────────────────────────────────────────────── */
export const userApi = {
  getMe: () => api.get("/users/me"),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: () => api.get("/users"),
  updateUser: (id, payload) => api.patch(`/users/${id}`, payload),
  changePassword: (id, payload) => api.patch(`/users/${id}/change-password`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

/* ── Doctor API ────────────────────────────────────────────── */
export const doctorApi = {
  getAll: () => api.get("/doctors"),
  getMe: () => api.get("/doctors/me"),
  getById: (id) => api.get(`/doctors/${id}`),
  register: (payload) => api.post("/doctors/register", payload),
  update: (id, payload) => api.patch(`/doctors/${id}`, payload),
};

/* ── Appointment API ───────────────────────────────────────── */
export const appointmentApi = {
  book: (payload) => api.post("/appointment", payload),
  getById: (id) => api.get(`/appointment/${id}`),
  getByPatient: (patientId) => api.get(`/appointment/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointment/doctor/${doctorId}`),
  update: (id, payload) => api.patch(`/appointment/${id}/appointment`, payload),
  updateStatus: (id, status) => api.patch(`/appointment/${id}/status`, { status }),
  cancel: (id) => api.patch(`/appointment/${id}/cancel`),
  delete: (id) => api.delete(`/appointment/${id}`),
};

/* ── Schedule API (doctor off-days / overrides) ────────────── */
export const scheduleApi = {
  getOverrides: (doctorId) => api.get(`/doctors/${doctorId}/overrides`),
  createOverride: (doctorId, payload) => api.post(`/doctors/${doctorId}/overrides`, payload),
  deleteOverride: (doctorId, overrideId) => api.delete(`/doctors/${doctorId}/overrides/${overrideId}`),
  getSlots: (doctorId, date) => api.get(`/doctors/${doctorId}/slots`, { params: { date } }),
};

export default api;