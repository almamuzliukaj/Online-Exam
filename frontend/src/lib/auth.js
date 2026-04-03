import { apiFetch } from "./api";

const TOKEN_KEY = "token";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === "true";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email, password) {
  if (USE_MOCK) {
    if (!email || !password) throw new Error("Invalid credentials");

    const role =
      email.toLowerCase().includes("admin") ? "Admin" :
      email.toLowerCase().includes("prof") ? "Professor" :
      "Student";

    const fakeToken = `mock.${btoa(email)}.${btoa(role)}`;
    setToken(fakeToken);
    return fakeToken;
  }

  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data?.token || data?.accessToken || data?.jwt;
  if (!token) throw new Error("Login succeeded but token was not returned by API.");

  setToken(token);
  return token;
}

export async function me() {
  if (USE_MOCK) {
    const token = getToken();
    if (!token) throw new Error("No token");

    const parts = token.split(".");
    const email = parts[1] ? atob(parts[1]) : "unknown@example.com";
    const role = parts[2] ? atob(parts[2]) : "Student";
    return { email, role };
  }

  const token = getToken();
  if (!token) throw new Error("No token");

  return apiFetch("/auth/me", { token });
}

export function logout() {
  clearToken();
}