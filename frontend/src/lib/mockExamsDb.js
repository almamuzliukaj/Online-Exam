const LS_KEY = "mock_exams_v1";

function nowIso() {
  return new Date().toISOString();
}

function rid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function readDb() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { exams: [], questionsByExamId: {} };
    const parsed = JSON.parse(raw);
    return {
      exams: Array.isArray(parsed?.exams) ? parsed.exams : [],
      questionsByExamId:
        parsed?.questionsByExamId && typeof parsed.questionsByExamId === "object"
          ? parsed.questionsByExamId
          : {},
    };
  } catch {
    return { exams: [], questionsByExamId: {} };
  }
}

function writeDb(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export function mockListExams() {
  const db = readDb();
  // newest first
  return [...db.exams].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function mockCreateExam(payload) {
  const db = readDb();

  const exam = {
    id: rid("exam"),
    title: payload?.title ?? payload?.name ?? "(untitled)",
    description: payload?.description ?? null,
    createdAt: nowIso(),
  };

  db.exams.push(exam);
  if (!db.questionsByExamId[exam.id]) db.questionsByExamId[exam.id] = [];
  writeDb(db);

  return exam;
}

export function mockGetExam(examId) {
  const db = readDb();
  const exam = db.exams.find((e) => e.id === examId);
  if (!exam) {
    const err = new Error("Exam not found");
    err.status = 404;
    throw err;
  }
  return exam;
}

export function mockListQuestions(examId) {
  const db = readDb();
  return Array.isArray(db.questionsByExamId[examId]) ? db.questionsByExamId[examId] : [];
}

export function mockAddQuestion(examId, payload) {
  const db = readDb();
  const exam = db.exams.find((e) => e.id === examId);
  if (!exam) {
    const err = new Error("Exam not found");
    err.status = 404;
    throw err;
  }

  const q = {
    id: rid("q"),
    text: payload?.text ?? "",
    type: payload?.type ?? "Theory",
    points: typeof payload?.points === "number" ? payload.points : 0,
    createdAt: nowIso(),
  };

  if (!Array.isArray(db.questionsByExamId[examId])) db.questionsByExamId[examId] = [];
  db.questionsByExamId[examId].push(q);
  writeDb(db);

  return q;
}

export function mockResetExamsDb() {
  localStorage.removeItem("mock_exams_v1");
}