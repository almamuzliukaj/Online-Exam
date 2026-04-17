# 18. Detailed Six-Week Team Allocation

## Week 1
### Person 1
- Implement admin user creation cleanup and bulk import endpoint.
- Define CSV import structure for students, professors, and assistants.
- Write acceptance criteria for invalid email, duplicate email, and temporary password cases.

### Person 2
- Design ERD for term, course, course offering, enrollment, and carry-over access.
- Prepare initial department course list grouped by year and semester.
- Define professor unlock rule for unfinished previous-semester exams.

### Person 3
- Translate shared UI to English.
- Standardize exam pages and role-neutral layout.
- Draft dashboard navigation for admin, professor, assistant, and student.

## Week 2
### Person 1
- Build admin endpoints for managing active/inactive staff and students.
- Start admin user management page in frontend.
- Add list, filter, and status actions for users.

### Person 2
- Implement course, offering, and enrollment entities.
- Add role-aware listing of offerings by year and semester.
- Define current semester and carry-over visibility API rules.

### Person 3
- Build dashboard shells for all four roles.
- Create reusable cards, tables, filters, and empty states.
- Connect admin dashboard to user and offering data.

## Week 3
### Person 1
- Add audit-friendly user import reporting and retry flow.
- Prepare import UX for large student batches.
- Add validation messages and downloadable import result summary.

### Person 2
- Implement course-based question bank models and APIs.
- Add difficulty levels and question metadata.
- Define permission rules for professor versus assistant authoring.

### Person 3
- Build question bank frontend per course offering.
- Add question create/edit/list screens in English.
- Add filters by type, difficulty, and course.

## Week 4
### Person 1
- Build admin controls for term activation and publishing readiness.
- Add assignment workflows for professor and assistant per offering.
- Add safeguard checks before staff deactivation.

### Person 2
- Implement exam builder logic for manual and random assembly.
- Add question-selection rules by type and difficulty.
- Add preview and replacement workflow before publish.

### Person 3
- Build exam creation wizard and publish UI.
- Add question preview, replacement, and exam summary screens.
- Add QR generation display and access-state indicators.

## Week 5
### Person 1
- Build admin/student support actions for account issues and enrollment corrections.
- Add result export and support-oriented admin views.
- Prepare support playbook for locked exams and unlock requests.

### Person 2
- Implement exam attempt, submission, and grading pipeline.
- Add MCQ auto-grading and manual grading hooks.
- Implement carry-over eligibility checks at exam-open time.

### Person 3
- Build student exam-taking flow, timer, and submission UX.
- Build grade view and downloadable result page.
- Build professor/assistant grading screens and review states.

## Week 6
### Person 1
- Finalize admin monitoring, operational controls, and demo data management.
- Document deployment and backup procedures.
- Prepare final presentation notes for admin capabilities.

### Person 2
- Implement proctoring event logging and monitoring backend.
- Add live session status and suspicious event capture.
- Harden permission boundaries across roles.

### Person 3
- Build live monitoring UI and violation indicators.
- Polish all role dashboards for demo readiness.
- Finalize responsive behavior and presentation quality.

## Balance note
- Person 1 owns operational complexity and admin-heavy workflows.
- Person 2 owns domain and backend complexity.
- Person 3 owns UX, integration, and presentation complexity.

The workload remains balanced because each track contains architecture decisions, implementation work, and acceptance responsibility.
