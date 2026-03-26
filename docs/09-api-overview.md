# 9. API Overview (High-level)

## 9.1 Auth
- POST /auth/login
- GET /me

## 9.2 Admin
- /semesters, /courses, /groups
- /users (create/disable)
- /courses/{id}/staff
- /courses/{id}/enrollments

## 9.3 Questions
- /courses/{id}/questions
- /questions/{id}/options
- /questions/{id}/testcases

## 9.4 Exams
- /courses/{id}/exams
- /exams/{id}/publish
- /exams/{id}/start
- /attempts/{id}/autosave
- /attempts/{id}/submit

## 9.5 Results/Grading
- /exams/{id}/results
- /submissions/{id}/grade (text/manual override)
- /results/publish