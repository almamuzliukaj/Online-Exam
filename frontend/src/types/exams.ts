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
  type?: "MCQ" | "Text" | "CSharp" | "SQL";
  difficulty?: "Easy" | "Medium" | "Hard";
  answerLanguage?: "CSharp" | "SQL";
  testCaseCount?: number;
  points?: number;
};
