export type Role = "Admin" | "Professor" | "Student";

export type ExamDto = {
  id: string;
  title: string;
  description?: string | null;
  isPublished?: boolean;
};

export type QuestionDto = {
  id: string;
  examId: string;
  text: string;
  type?: "Theory" | "SQL" | "Code";
  points?: number;
};