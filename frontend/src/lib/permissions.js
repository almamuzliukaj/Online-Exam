export function canManageExams(role) {
  return role === "Admin" || role === "Professor";
}