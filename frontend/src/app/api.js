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

/* ── Unwrap response.data for every call site ───────────────── */
api.interceptors.response.use((response) => response.data);

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