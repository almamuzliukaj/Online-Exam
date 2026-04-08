import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function ProtectedRoute() {
  const token = getToken();

  // Nëse nuk ka token, dërgoje te login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nëse ka token, lejoje të shohë faqen (Outlet)
  return <Outlet />;
}