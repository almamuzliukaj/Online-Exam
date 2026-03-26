# 10. UI Pages (Faqet e sistemit)

## 10.1 Admin Pages

### 10.1.1 Login
- Qëllimi: Autentikim i Admin.
- Funksione: login, logout.

### 10.1.2 Dashboard
- Qëllimi: Përmbledhje e sistemit.
- Funksione: statistikë bazë (opsionale), navigim te menaxhimet.

### 10.1.3 Semesters
- Qëllimi: Menaxhim i semestreve.
- Funksione: create/edit/disable, list.

### 10.1.4 Courses
- Qëllimi: Menaxhim i lëndëve.
- Funksione: create/edit/disable, lidhje me semestër.

### 10.1.5 Groups / Sections
- Qëllimi: Organizim i grupeve të ligjëratave/ushtrimeve.
- Funksione: create/edit/disable group per course.

### 10.1.6 Users
- Qëllimi: Menaxhim i përdoruesve.
- Funksione: create user, assign role, disable user.

### 10.1.7 Staff Assignment
- Qëllimi: Caktimi i Profesorëve/TA në lëndë.
- Funksione: assign/unassign, list staff per course.

### 10.1.8 Enrollments
- Qëllimi: Regjistrimi i studentëve në lëndë/grup.
- Funksione: add/remove enrollments, import list (opsionale).

## 10.2 Professor/TA Pages

### 10.2.1 Dashboard
- Qëllimi: Përmbledhje e lëndëve dhe provimeve.
- Funksione: shfaq provime aktive/të planifikuara, qasje te grading.

### 10.2.2 Question Bank
- Qëllimi: Menaxhim i bankës së pyetjeve.
- Funksione: list/filter, create/edit question, tags (opsionale).

### 10.2.3 Create/Edit Question (MCQ/Text/Code)
- Qëllimi: Krijim i pyetjeve.
- Funksione:
  - MCQ: alternativa + correct answer
  - Text: pikë + model answer (opsionale)
  - Code: statement + test cases + starter code (opsionale)

### 10.2.4 Exams (Create/Generate/Schedule)
- Qëllimi: Krijimi dhe planifikimi i provimeve.
- Funksione: create exam, add questions, generate, start/end time, publish.

### 10.2.5 Live Monitoring (Proctoring events) (MVP basic)
- Qëllimi: Shikimi i focus-lost events dhe incidentet bazë.
- Funksione: list events per student + timestamps.

### 10.2.6 Grading
- Qëllimi: Vlerësimi i përgjigjeve.
- Funksione:
  - manual grade për Text
  - shikim i auto-grade për MCQ/Code
  - manual override për Code (me arsye opsionale)

### 10.2.7 Results
- Qëllimi: Menaxhim i rezultateve.
- Funksione: view results, publish/unpublish (workflow), export CSV (opsionale).

## 10.3 Student Pages

### 10.3.1 Dashboard
- Qëllimi: Shfaqja e lëndëve dhe provimeve.
- Funksione: list exams, status (scheduled/active/closed), entry to exam.

### 10.3.2 Start Exam (PIN/QR)
- Qëllimi: Fillimi i attempt-it me kontroll aksesesh.
- Funksione: PIN input / QR token validation, start attempt.

### 10.3.3 Take Exam (Exam Arena)
- Qëllimi: Plotësimi i provimit.
- Funksione:
  - one-at-a-time question view
  - timer
  - autosave
  - Monaco editor për Code (C#)
  - navigation next/previous (sipas rregullave)

### 10.3.4 Submission Confirmation
- Qëllimi: Konfirmimi i dorëzimit.
- Funksione: shfaq status “Submitted”, nuk lejon edit.

### 10.3.5 Results
- Qëllimi: Shfaqja e rezultateve.
- Funksione:
  - para publish: “Pending”
  - pas publish: shfaq pikët/rezultatin final
  - për Code: student sheh vetëm pass/fail (pa test case detaje)