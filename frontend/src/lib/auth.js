import { apiFetch } from "./api";

const TOKEN_KEY = "token";

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
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Adjust here if backend uses a different property name
  const token = data?.token || data?.accessToken || data?.jwt;

  if (!token) {
    throw new Error("Login succeeded but token was not returned by API.");
  }

  setToken(token);
  return token;
}

export async function me() {
  const token = getToken();
  if (!token) throw new Error("No token");

  return apiFetch("/auth/me", { token });
}

export function logout() {
  clearToken();
}