import api from "./api";

// LISTA E PROVIMEVE
export async function listExams() {
  const response = await api.get("/api/Exams"); // Shtova /api/ ketu
  return response.data;
}

// KRIJIMI I PROVIMIT
export async function createExam(payload) {
  const response = await api.post("/api/Exams", payload);
  return response.data;
}

// DETAJET E PROVIMIT
export async function getExam(examId) {
  const response = await api.get(`/api/Exams/${examId}`);
  return response.data;
}

// PYETJET
export async function listQuestions(examId) {
  const response = await api.get(`/api/Exams/${examId}/questions`);
  return response.data;
}

export async function addQuestion(examId, payload) {
  const response = await api.post(`/api/Exams/${examId}/questions`, payload);
  return response.data;
}