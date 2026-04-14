import api from "./api";
import {
  mockListExams,
  mockCreateExam,
  mockGetExam,
  mockListQuestions,
  mockAddQuestion,
} from "./mockExamsDb";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_EXAMS === "true";

// List all exams
export async function listExams() {
  if (USE_MOCK) return mockListExams();
  const response = await api.get("/api/Exams");
  return response.data;
}

// Create a new exam
export async function createExam(payload) {
  if (USE_MOCK) return mockCreateExam(payload);
  const response = await api.post("/api/Exams", payload);
  return response.data;
}

// Get a single exam by ID
export async function getExam(examId) {
  if (USE_MOCK) return mockGetExam(examId);
  const response = await api.get(`/api/Exams/${examId}`);
  return response.data;
}

// List questions for an exam
export async function listQuestions(examId) {
  if (USE_MOCK) return mockListQuestions(examId);
  const response = await api.get(`/api/Exams/${examId}/questions`);
  return response.data;
}

// Add a question to an exam
export async function addQuestion(examId, payload) {
  if (USE_MOCK) return mockAddQuestion(examId, payload);
  const response = await api.post(`/api/Exams/${examId}/questions`, payload);
  return response.data;
}