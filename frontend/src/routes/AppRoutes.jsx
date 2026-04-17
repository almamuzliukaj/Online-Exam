import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ExamsListPage from "../pages/exams/ExamsListPage";
import ExamCreatePage from "../pages/exams/ExamCreatePage";
import ExamDetailsPage from "../pages/exams/ExamDetailsPage";
import QuestionCreatePage from "../pages/exams/QuestionCreatePage";
import AdminUsersPage from "../pages/AdminUsersPage"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Faqet e mbrojtura */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exams" element={<ExamsListPage />} />
        <Route path="/exams/:examId" element={<ExamDetailsPage />} />
        
        {/* Role-based: Vetëm Admin DHE Professor */}
        <Route element={<RoleGuard allow={["Admin", "Professor"]} />}>
          <Route path="/exams/new" element={<ExamCreatePage />} />
          <Route path="/exams/:examId/questions/new" element={<QuestionCreatePage />} />
        </Route>

        {/* TEST PERKOHESISHT: E kemi nxjerre jashte RoleGuard per te pare nese punon */}
        <Route path="/admin/users" element={<AdminUsersPage />} />

      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}