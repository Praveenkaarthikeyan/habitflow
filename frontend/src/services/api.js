import { loadPref, savePref, removePref } from "./preferences.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "token";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details || [];
  }
}

export const getToken = () => loadPref(TOKEN_KEY, null);
export const setToken = (t) => savePref(TOKEN_KEY, t);
export const clearToken = () => removePref(TOKEN_KEY);

// AuthContext registers a function here so an expired token logs the user out everywhere.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  let json = null;
  try { json = await res.json(); } catch { /* empty or non-JSON response */ }

  if (!res.ok) {
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized();
    throw new ApiError(json?.message || "Something went wrong.", res.status, json?.details);
  }
  return json;
}

export const authApi = {
  register: (data) => request("/auth/register", { method: "POST", body: data }),
  login: (data) => request("/auth/login", { method: "POST", body: data }),
  me: () => request("/auth/me", { auth: true }),
};

export const blogApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/blogs${qs ? `?${qs}` : ""}`);
  },
  create: (data) => request("/blogs", { method: "POST", body: data, auth: true }),
  update: (id, data) => request(`/blogs/${id}`, { method: "PUT", body: data, auth: true }),
  remove: (id) => request(`/blogs/${id}`, { method: "DELETE", auth: true }),
};