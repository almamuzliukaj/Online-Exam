import api from "./api";

// FUNKSIONI NDIHMES PER LOCALSTORAGE (Qe te punoje gjithçka ketu brenda)
const getLocalDb = () => JSON.parse(localStorage.getItem("mock_exams_v1") || '{"exams":[],"questionsByExamId":{}}');
const saveLocalDb = (db) => localStorage.setItem("mock_exams_v1", JSON.stringify(db));

// EXAMS API
export async function listExams() {
  try {
    const res = await api.get("/Exams");
    return res.data;
  } catch {
    return getLocalDb().exams;
  }
}

export async function createExam(payload) {
  try {
    const res = await api.post("/Exams", payload);
    return res.data;
  } catch {
    const db = getLocalDb();
    const newExam = { id: `exam_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    db.exams.push(newExam);
    saveLocalDb(db);
    return newExam;
  }
}

export async function getExam(examId) {
  try {
    const res = await api.get(`/Exams/${examId}`);
    return res.data;
  } catch {
    return getLocalDb().exams.find(e => e.id === examId) || { title: "Provim i përkohshëm" };
  }
}

// QUESTIONS API - KETU ESHTE ZGJIDHJA PER ERRORIN TEND
export async function listQuestions(examId) {
  try {
    const res = await api.get(`/Exams/${examId}/questions`);
    return res.data;
  } catch {
    const db = getLocalDb();
    return db.questionsByExamId[examId] || [];
  }
}

export async function addQuestion(examId, payload) {
  try {
    // Tentojme Backend-in
    const res = await api.post(`/Exams/${examId}/questions`, payload);
    return res.data;
  } catch (error) {
    // NESE DESHTON (Ketu po te jep error ty), E RUAJME NE LOCALSTORAGE
    console.warn("Backend OFF, duke ruajtur pyetjen ne Browser...");
    const db = getLocalDb();
    if (!db.questionsByExamId[examId]) db.questionsByExamId[examId] = [];
    
    const newQuestion = { 
      id: `q_${Date.now()}`, 
      ...payload, 
      createdAt: new Date().toISOString() 
    };
    
    db.questionsByExamId[examId].push(newQuestion);
    saveLocalDb(db);
    return newQuestion;
  }
}