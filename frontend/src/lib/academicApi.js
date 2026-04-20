import api from "./api";

export async function listTerms() {
  const response = await api.get("/api/Terms");
  return response.data;
}

export async function listCourses() {
  const response = await api.get("/api/courses");
  return response.data;
}

export async function createCourse(payload) {
  const response = await api.post("/api/courses", payload);
  return response.data;
}

export async function updateCourse(courseId, payload) {
  const response = await api.put(`/api/courses/${courseId}`, payload);
  return response.data;
}

export async function deactivateCourse(courseId) {
  const response = await api.post(`/api/courses/${courseId}/deactivate`);
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

export async function updateOffering(offeringId, payload) {
  const response = await api.put(`/api/course-offerings/${offeringId}`, payload);
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

export async function listOfferingStaff(offeringId) {
  const response = await api.get(`/api/course-offerings/${offeringId}/staff`);
  return response.data;
}

export async function assignOfferingStaff(offeringId, payload) {
  const response = await api.post(`/api/course-offerings/${offeringId}/staff`, payload);
  return response.data;
}

export async function revokeOfferingStaff(offeringId, assignmentId) {
  const response = await api.post(`/api/course-offerings/${offeringId}/staff/${assignmentId}/revoke`);
  return response.data;
}
