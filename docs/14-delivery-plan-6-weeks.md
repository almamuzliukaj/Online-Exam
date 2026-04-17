# 14. Six-Week Delivery Plan

## Sprint 1 - Foundation and Admin Operations
### Goal
Stabilize the project foundation so future work is built on reliable auth, onboarding, and shared standards.

### Weekly focus
- Week 1: auth consistency, admin-only registration rules, bulk import contract, English UI baseline, documentation refresh.

### Acceptance criteria
- Admin can create or import users.
- No public signup exists in UX or API plan.
- Shared frontend pages are in English.
- Team has one agreed delivery structure in Notion.

- Fix authentication consistency.
- Remove any public signup path.
- Add admin-only user import and registration workflow.
- Standardize English UI for shared screens.
- Finalize department structure: 3 academic years, 6 semesters, 34 courses.

## Sprint 2 - Academic Structure and Role Dashboards
### Goal
Represent the real faculty workflow in data and navigation.

### Weekly focus
- Week 2: terms, course catalog, offerings, professor-assistant assignments, student enrollment rules, dashboard skeletons.

### Acceptance criteria
- Offerings are grouped by year and semester.
- Students can be mapped to current and carry-over courses.
- Each role has a clear dashboard entry point.

- Course catalog management by year and semester.
- Course offering assignment to professor and assistant.
- Student semester enrollment and carry-over subject support.
- Admin, professor, assistant, and student dashboard foundations.

## Sprint 3 - Question Bank
### Goal
Build reusable course-based question authoring.

### Weekly focus
- Week 3: create question bank entities, APIs, and UI for MCQ, text, C#, and SQL questions with difficulty tags.

### Acceptance criteria
- Professors can create unlimited questions per assigned course.
- Assistants can create questions only for allowed offerings.
- Questions can be filtered by course, type, and difficulty.

- Course-based question bank.
- Unlimited question creation.
- Difficulty levels.
- MCQ, text, C# code, and SQL question types.
- Filtering and search by type, difficulty, and course.

## Sprint 4 - Exam Assembly and Publishing
### Goal
Turn question banks into real exams.

### Weekly focus
- Week 4: manual builder, random generator, preview flow, publish workflow, QR entry preparation.

### Acceptance criteria
- Professor can create a manual exam.
- Professor can generate a random exam from question rules.
- Selected questions can be reviewed and swapped before publish.

- Manual exam builder.
- Random exam generator by difficulty and question count.
- Preview and manual replacement before publish.
- QR code generation and exam access rules.

## Sprint 5 - Student Attempt and Grading
### Goal
Enable end-to-end exam participation and evaluation.

### Weekly focus
- Week 5: student exam entry, timer, autosave, submission, grading pipeline, result export.

### Acceptance criteria
- Eligible students can open and submit exams.
- MCQ grading works automatically.
- Manual grading flow exists for text-based responses.
- Students can download published results.

- Student exam entry.
- Timer and autosave.
- C# and SQL answer submission flow.
- MCQ auto-grading and text/manual grading foundation.
- Result export for student download.

## Sprint 6 - Security, Monitoring, and Hardening
### Goal
Make the project presentable as a serious faculty-grade solution.

### Weekly focus
- Week 6: proctoring events, monitoring, violation logs, QA, demo polish, final documentation.

### Acceptance criteria
- Active exam monitoring shows connected students.
- Focus loss and suspicious events are logged.
- Demo scenarios are ready for admin, professor, assistant, and student.

- Focus loss tracking.
- Copy/select blocking where feasible.
- Attempt auto-close after absence threshold.
- Live monitoring of active students in exam.
- Violation logs and alerts.
- Final QA and demo preparation.
