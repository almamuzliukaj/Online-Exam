import api from "./api";
import { normalizeRole } from "./permissions";

const TOKEN_KEY = "token";
const USER_KEY = "currentUser";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveUser(user) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  const normalized = {
    ...user,
    role: normalizeRole(user.role),
  };

  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
}

export function clearSession() {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function logout(options = {}) {
  const { redirect = true } = options;
  clearSession();

  if (redirect) {
    window.location.href = "/login";
  }
}

export async function me() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await api.get("/auth/me");
    const profile = response.data
      ? {
          ...response.data,
          role: normalizeRole(response.data.role),
        }
      : null;

    saveUser(profile);
    return profile;
  } catch (error) {
    if (error.response?.status === 401) {
      clearSession();
    }
    return null;
  }
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  const data = response.data;

  if (data.token) {
    saveToken(data.token);
  }

  if (data) {
    saveUser({
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    });
  }

  return data;
}
