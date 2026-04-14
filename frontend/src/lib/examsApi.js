import api from "./api";

const USE_MOCK_EXAMS = import.meta.env.VITE_USE_MOCK_EXAMS === "true";

async function getMockDb() {
  const mod = await import("./mockExamsDb");
  return mod;
}

// List all exams
export async function listExams() {
  if (USE_MOCK_EXAMS) {
    console.warn("[examsApi] Using MOCK exams DB (VITE_USE_MOCK_EXAMS=true).");
    const { mockListExams } = await getMockDb();
    return mockListExams();
  }

  const response = await api.get("/api/Exams");
  return response.data;
}

// Create a new exam
export async function createExam(payload) {
  if (USE_MOCK_EXAMS) {
    console.warn("[examsApi] Using MOCK exams DB (VITE_USE_MOCK_EXAMS=true).");
    const { mockCreateExam } = await getMockDb();
    return mockCreateExam(payload);
  }

  const response = await api.post("/api/Exams", payload);
  return response.data;
}

// Get a single exam by ID
export async function getExam(examId) {
  if (USE_MOCK_EXAMS) {
    console.warn("[examsApi] Using MOCK exams DB (VITE_USE_MOCK_EXAMS=true).");
    const { mockGetExam } = await getMockDb();
    return mockGetExam(examId);
  }

  const response = await api.get(`/api/Exams/${examId}`);
  return response.data;
}

// List questions for an exam
export async function listQuestions(examId) {
  if (USE_MOCK_EXAMS) {
    console.warn("[examsApi] Using MOCK exams DB (VITE_USE_MOCK_EXAMS=true).");
    const { mockListQuestions } = await getMockDb();
    return mockListQuestions(examId);
  }

  const response = await api.get(`/api/Exams/${examId}/questions`);
  return response.data;
}

// Add a question to an exam
export async function addQuestion(examId, payload) {
  if (USE_MOCK_EXAMS) {
    console.warn("[examsApi] Using MOCK exams DB (VITE_USE_MOCK_EXAMS=true).");
    const { mockAddQuestion } = await getMockDb();
    return mockAddQuestion(examId, payload);
  }

  const response = await api.post(`/api/Exams/${examId}/questions`, payload);
  return response.data;
}