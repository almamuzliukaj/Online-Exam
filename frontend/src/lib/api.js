const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  // Helpful message during dev
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set. Add it to frontend/.env");
}

export async function apiFetch(path, { token, ...options } = {}) {
  const url =
    path.startsWith("http")
      ? path
      : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  // Handle non-JSON responses safely
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}