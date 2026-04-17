# 13. Project Status and Gap Analysis

## Current implementation snapshot
- Backend already includes JWT authentication, role-based authorization, user creation, exam CRUD, question CRUD, terms, courses, and course offerings.
- Frontend already includes login, protected routes, dashboard, exam list, exam creation, exam details, and question creation flow.
- Documentation already covers architecture, scope, requirements, API overview, and MVP planning.

## What is working today
- Login flow with JWT token issuance.
- Admin-only user creation endpoint.
- Admin management of terms and course offerings.
- Professor and assistant access to their own course offerings.
- Basic exam and question management screens.

## Partial or risky areas
- Authentication was inconsistent because seeded demo users were plaintext while newly created users were hashed.
- Exams are not yet fully tied to faculty structure such as department, year, semester, offering, professor-assistant ownership, and student eligibility.
- Frontend is only partially professional and not yet role-specific.
- Security/proctoring exists only in documentation, not in implementation.

## Missing core modules
- Student enrollment per active semester and per carried-over course.
- Course assignment lifecycle: assign professor, assign assistant, deactivate staff, preserve history.
- Admin bulk import for students and staff with validation and feedback.
- Admin-only onboarding UX in frontend.
- Question bank per course with unlimited questions and difficulty tagging.
- Question types for MCQ, text, and code with language restriction to C# and SQL.
- Exam generator from question bank with random/manual mix and difficulty rules.
- Student exam attempt lifecycle, QR entry, timer, submission, results export, and retake/unlock rules.
- Assistant-specific permissions and professor visibility into assistant-created exam grades without taking over full exam editing.
- Live proctoring events, focus tracking, copy attempt logs, and screenshot abuse handling.

## Recommended business rules
- No public signup. Every account is created or imported by the admin.
- Each course offering belongs to one term, one semester number, one year of study, one professor, and optionally one assistant.
- A professor can see grades for assistant-owned exams inside the same assigned course offering, but cannot edit assistant exams unless explicitly granted.
- Students see only active courses from their current semester and unfinished carry-over courses explicitly unlocked by professor/admin.
- Staff should be deactivated instead of hard-deleted once historical exams or grades exist.

## Immediate priorities
1. Stabilize onboarding and user management.
2. Model enrollments, course assignments, and semester visibility rules.
3. Build role-specific dashboards in English.
4. Build question bank and exam generation flow.
5. Build student exam session and grading pipeline.
