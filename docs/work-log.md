# Work Log (Agnesa14)

## 2026-04-03
- Set up local development environment on Windows.
- Added Docker Compose PostgreSQL for local development (onlineexam-postgres).
- Verified DB connectivity with psql SELECT 1.
- Verified backend API runs locally (http://localhost:5045) and Swagger route.
- Added frontend env example (VITE_API_BASE_URL) and acceptance checklist for MVP login.

## 2026-04-20
- Completed Albiona Sprint 2 frontend track for academic catalog operations.
- Added admin routes and sidebar navigation for course catalog and course offerings.
- Implemented course catalog UI with create, filter, edit, and deactivate flows wired to `/api/courses`.
- Implemented course offering UI with filters, creation, update, publish/close actions, and staff assignment history wired to `/api/course-offerings` and `/api/course-offerings/{id}/staff`.
- Reused live user directory data to assign active professors and assistants instead of hardcoded staff lists.
- Extended Albiona Sprint 3 with `CSharp` and `SQL` question authoring support.
- Added backend question validation for supported answer languages and test case requirements.
- Added frontend authoring UI for C# and SQL starter code plus hidden/public test case setup.
