# Online Exam System

Online Exam System is a faculty-focused web application for managing question banks, exam publishing, role-based access, and secure student assessment workflows.

## Current stack
- Backend: ASP.NET Core Web API with Entity Framework Core and PostgreSQL
- Frontend: React + Vite
- Auth: JWT with role-based authorization
- Roles: Admin, Professor, Assistant, Student

## Current project status
The repository already includes a functional backend foundation, a working React frontend shell, and a detailed documentation base in `docs/`.

Implemented today:
- login and protected routes
- admin user creation
- admin bulk user import endpoint
- terms, courses, and course offerings foundation
- exam CRUD and question CRUD foundation
- English cleanup for the main shared frontend pages

## Core academic rules
- No public signup. All users are created by the admin.
- Admin manages semesters, courses, professors, assistants, and student onboarding.
- Professors and assistants work inside assigned course offerings.
- Students should only see exams for eligible courses in their active semester plus approved carry-over courses.
- Results should be visible only after publication.

## Repository structure
```text
backend/                 ASP.NET Core API
frontend/                React application
docs/                    Project documentation, planning, and analysis
docker-compose.yml       Local infrastructure
README.md                Project overview
```

## Run the backend
```bash
cd backend/OnlineExam.Api
dotnet restore
dotnet run
```

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```

## Important documents
- [docs/13-project-status-gap-analysis.md](docs/13-project-status-gap-analysis.md)
- [docs/14-delivery-plan-6-weeks.md](docs/14-delivery-plan-6-weeks.md)
- [docs/15-week-1-team-split.md](docs/15-week-1-team-split.md)
- [docs/16-notion-workspace-guide.md](docs/16-notion-workspace-guide.md)
- [docs/17-chatgpt-prompts.md](docs/17-chatgpt-prompts.md)
- [docs/18-six-week-team-allocation.md](docs/18-six-week-team-allocation.md)

## Immediate next milestones
1. Add enrollments and carry-over course visibility rules.
2. Build admin onboarding UI.
3. Build course-based question bank with difficulty levels.
4. Build exam generator and publishing workflow.
5. Build student attempt, grading, and security monitoring flow.

## Team
- Agnesa
- Albiona
- Alma
