# 7. Modeli i të Dhënave (Konceptual)

## 7.1 Entitetet kryesore
- Users (Role: Admin/Professor/TA/Student)
- Semesters
- Courses
- Groups/Sections
- Enrollments
- Questions (Type: MCQ/Text/Code)
- MCQ Options
- Code TestCases
- Exams
- ExamQuestions (snapshot)
- Attempts
- Submissions (MCQ/Text/Code)
- Results/Grades
- AuditLogs (opsionale, minimal)

## 7.2 Relacionet (me tekst)
- Semester 1..* Courses
- Course 1..* Questions
- Course *..* Staff (Professor/TA)
- Course *..* Students (Enrollments)
- Exam 1..* ExamQuestions
- Exam 1..* Attempts
- Attempt 1..* Submissions