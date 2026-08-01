const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/* ── Token helpers ─────────────────────────────────────────── */
export const tokenStorage = {
  getAccess:   ()    => localStorage.getItem("accessToken"),
  getRefresh:  ()    => localStorage.getItem("refreshToken"),
  setTokens:   (a,r) => { localStorage.setItem("accessToken", a); localStorage.setItem("refreshToken", r); },
  clear:       ()    => { localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); },
};

/* ── Base fetch wrapper ────────────────────────────────────── */
async function request(path, options = {}) {
  const hasBody = options.body != null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

/* ── Authenticated fetch (auto-attaches Bearer token) ──────── */
async function authRequest(path, options = {}) {
  const token = tokenStorage.getAccess();
  return request(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
}

/* ── Auth API ──────────────────────────────────────────────── */
export const authApi = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  login: async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  refresh: async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) throw new Error("No refresh token");
    const data = await request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  logout: async () => {
    try {
      await authRequest("/auth/logout", { method: "POST" });
    } finally {
      tokenStorage.clear();
    }
  },
};

/* ── User API ──────────────────────────────────────────────── */
export const userApi = {
  getMe: () => authRequest("/users/me"),

  getUserById: (id) => authRequest(`/users/${id}`),

  getAllUsers: () => authRequest("/users"),   // ← add this

  updateUser: (id, payload) =>
    authRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  changePassword: (id, payload) =>
    authRequest(`/users/${id}/change-password`, { method: "PATCH", body: JSON.stringify(payload) }),

  deleteUser: (id) =>
    authRequest(`/users/${id}`, { method: "DELETE" }),
};

/* ── Doctor API ────────────────────────────────────────────── */
export const doctorApi = {
  getAll: () => authRequest("/doctors"),

  // Returns the DoctorEntity for the currently authenticated doctor user
  getMe: () => authRequest("/doctors/me"),

  getById: (id) => authRequest(`/doctors/${id}`),

  register: (payload) =>
    authRequest("/doctors/register", { method: "POST", body: JSON.stringify(payload) }),

  update: (id, payload) =>
    authRequest(`/doctors/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

/* ── Appointment API ───────────────────────────────────────── */
export const appointmentApi = {

  book: (payload) =>
    authRequest("/appointment", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (id) =>
    authRequest(`/appointment/${id}`),

  getByPatient: (patientId) =>
    authRequest(`/appointment/patient/${patientId}`),

  getByDoctor: (doctorId) =>
    authRequest(`/appointment/doctor/${doctorId}`),

  update: (id, payload) =>
    authRequest(`/appointment/${id}/appointment`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateStatus: (id, status) =>
    authRequest(`/appointment/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancel: (id) =>
    authRequest(`/appointment/${id}/cancel`, { method: "PATCH" }),

  delete: (id) =>
    authRequest(`/appointment/${id}`, { method: "DELETE" }),
};

/* ── Schedule API (doctor off-days / overrides) ────────────── */
export const scheduleApi = {
  // GET /doctors/{doctorId}/overrides
  getOverrides: (doctorId) =>
    authRequest(`/doctors/${doctorId}/overrides`),

  // POST /doctors/{doctorId}/overrides  — { date, reason? }
  createOverride: (doctorId, payload) =>
    authRequest(`/doctors/${doctorId}/overrides`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // DELETE /doctors/{doctorId}/overrides/{overrideId}
  deleteOverride: (doctorId, overrideId) =>
    authRequest(`/doctors/${doctorId}/overrides/${overrideId}`, {
      method: "DELETE",
    }),

  // GET /doctors/{doctorId}/slots?date=YYYY-MM-DD
  getSlots: (doctorId, date) =>
    authRequest(`/doctors/${doctorId}/slots?date=${date}`),
};