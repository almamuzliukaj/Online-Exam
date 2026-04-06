import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

// Existing pages (from your screenshot)
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

// Sprint 2 pages (create these files if they don’t exist yet)
import ExamsList from "../pages/exams/ExamsListPage";
import ExamCreate from "../pages/exams/ExamCreatePage";
import ExamDetails from "../pages/exams/ExamDetailsPage";
import QuestionCreate from "../pages/exams/QuestionCreatePage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Existing protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Sprint 2: Exams */}
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exams/new"
        element={
          <ProtectedRoute>
            <RoleGuard allow={["Admin", "Professor"]}>
              <ExamCreate />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/exams/:examId"
        element={
          <ProtectedRoute>
            <ExamDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exams/:examId/questions/new"
        element={
          <ProtectedRoute>
            <RoleGuard allow={["Admin", "Professor"]}>
              <QuestionCreate />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}