import api from "./api";

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

// KJO ISHTE PJESA QE MANGOI:
export function logout() {
  clearToken();
  // Kjo e dërgon përdoruesin te login dhe rifreskon faqen që të fshihen të dhënat e vjetra
  window.location.href = "/login";
}

export async function me() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      clearToken();
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
  return data;
}