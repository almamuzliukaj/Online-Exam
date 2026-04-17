export function canManageExams(role) {
  return role === "Admin" || role === "Professor";
}

export function isAdmin(role) {
  return role === "Admin";
}
