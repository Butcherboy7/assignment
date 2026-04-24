import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Logout callback set by AppNavigator
let _logoutCallback = null;
export const setLogoutCallback = (fn) => {
  _logoutCallback = fn;
};

// ── Request interceptor: attach JWT ─────────────────────────────────────────
apiInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // If we can't read the token, proceed without it
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: global 401 handler ────────────────────────────────
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(["token", "user"]);
      } catch {
        // Ignore cleanup error
      }
      if (_logoutCallback) _logoutCallback();
    }
    return Promise.reject(error);
  }
);

// ── Helper: extract user-friendly error message ──────────────────────────────
export const getErrorMessage = (error) => {
  if (!error.response) return "Network error. Check your connection.";
  const status = error.response.status;
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "Not found.";
  return error.response?.data?.message || "Something went wrong.";
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login: (email, password) =>
    apiInstance.post("/auth/login", { email, password }),
  signup: (name, email, password, role) =>
    apiInstance.post("/auth/signup", { name, email, password, role }),
  getMe: () => apiInstance.get("/auth/me"),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasks = {
  getAll: () => apiInstance.get("/tasks"),
  getOne: (id) => apiInstance.get(`/tasks/${id}`),
  create: (data) => apiInstance.post("/tasks", data),
  update: (id, data) => apiInstance.put(`/tasks/${id}`, data),
  remove: (id) => apiInstance.delete(`/tasks/${id}`),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = {
  getAll: () => apiInstance.get("/users"),
  getOne: (id) => apiInstance.get(`/users/${id}`),
};

export default apiInstance;
