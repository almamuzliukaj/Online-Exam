import api from "./api";

export async function listTerms() {
  const response = await api.get("/api/Terms");
  return response.data;
}

export async function createTerm(payload) {
  const response = await api.post("/api/Terms", payload);
  return response.data;
}

export async function publishTerm(termId) {
  const response = await api.post(`/api/Terms/${termId}/publish`);
  return response.data;
}

export async function closeTerm(termId) {
  const response = await api.post(`/api/Terms/${termId}/close`);
  return response.data;
}

export async function listCourses() {
  const response = await api.get("/api/Courses");
  return response.data;
}

export async function createCourse(payload) {
  const response = await api.post("/api/Courses", payload);
  return response.data;
}

export async function deactivateCourse(courseId) {
  const response = await api.post(`/api/Courses/${courseId}/deactivate`);
  return response.data;
}

export async function listOfferings(filters = {}) {
  const response = await api.get("/api/course-offerings", { params: filters });
  return response.data;
}

export async function createOffering(payload) {
  const response = await api.post("/api/course-offerings", payload);
  return response.data;
}

export async function publishOffering(offeringId) {
  const response = await api.post(`/api/course-offerings/${offeringId}/publish`);
  return response.data;
}

export async function closeOffering(offeringId) {
  const response = await api.post(`/api/course-offerings/${offeringId}/close`);
  return response.data;
}
