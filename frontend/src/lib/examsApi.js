import { apiFetch } from "./api";
import { getToken } from "./auth";
import {
  mockAddQuestion,
  mockCreateExam,
  mockGetExam,
  mockListExams,
  mockListQuestions,
} from "./mockExamsDb";

const ENV_MOCK =
  String(import.meta.env.VITE_USE_MOCK_EXAMS || "").toLowerCase() === "true";

function tokenOrThrow() {
  const token = getToken();
  if (!token) throw new Error("No token");
  return token;
}

function is404(e) {
  if (e?.status === 404) return true;
  const msg = String(e?.message || "");
  return msg.includes("404") || msg.toLowerCase().includes("not found");
}

async function withFallback(realFn, mockFn) {
  // If ENV says mock -> always mock
  if (ENV_MOCK) return mockFn();

  try {
    return await realFn();
  } catch (e) {
    // If backend not ready (404) -> fallback to mock
    if (is404(e)) return mockFn();
    throw e;
  }
}

// Exams
export function listExams() {
  return withFallback(
    () => apiFetch("/exams", { token: tokenOrThrow() }),
    () => mockListExams()
  );
}

export function createExam(payload) {
  return withFallback(
    () =>
      apiFetch("/exams", {
        method: "POST",
        token: tokenOrThrow(),
        body: JSON.stringify(payload),
      }),
    () => mockCreateExam(payload)
  );
}

export function getExam(examId) {
  return withFallback(
    () => apiFetch(`/exams/${examId}`, { token: tokenOrThrow() }),
    () => mockGetExam(examId)
  );
}

// Questions
export function listQuestions(examId) {
  return withFallback(
    () => apiFetch(`/exams/${examId}/questions`, { token: tokenOrThrow() }),
    () => mockListQuestions(examId)
  );
}

export function addQuestion(examId, payload) {
  return withFallback(
    () =>
      apiFetch(`/exams/${examId}/questions`, {
        method: "POST",
        token: tokenOrThrow(),
        body: JSON.stringify(payload),
      }),
    () => mockAddQuestion(examId, payload)
  );
}