import api from "./api";

export async function listTerms() {
  const response = await api.get("/api/Terms");
  return response.data;
}

feature/agnesa-admin-academic-structure
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
 main
  return response.data;
}

export async function deactivateCourse(courseId) {
 feature/agnesa-admin-academic-structure
  const response = await api.post(`/api/Courses/${courseId}/deactivate`);

  const response = await api.post(`/api/courses/${courseId}/deactivate`);
 main
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

 feature/agnesa-admin-academic-structure

export async function updateOffering(offeringId, payload) {
  const response = await api.put(`/api/course-offerings/${offeringId}`, payload);
  return response.data;
}

 main
export async function publishOffering(offeringId) {
  const response = await api.post(`/api/course-offerings/${offeringId}/publish`);
  return response.data;
}

export async function closeOffering(offeringId) {
  const response = await api.post(`/api/course-offerings/${offeringId}/close`);
  return response.data;
}
 feature/agnesa-admin-academic-structure


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
 main
