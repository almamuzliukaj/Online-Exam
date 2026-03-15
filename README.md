# Online-Exam

A starter codebase for a web platform that supports secure online exams:
- **Code & SQL execution:** via Judge0 API
- **Theory grading:** planned NLP microservice (sentence-transformers)
- **Stack:** ASP.NET Core 8 Web API (C#), React frontend, PostgreSQL database
- **Containerization (planned):** Docker / docker-compose

## Current contents
- `backend/OnlineExam.Api/` — minimal ASP.NET Core Web API with `/health`
- `frontend/` — placeholder package.json ready for your chosen tooling (e.g., Vite + React)
- `.gitignore` — excludes build artifacts and temp files

## Quick start (backend)
```bash
cd backend/OnlineExam.Api
dotnet restore
dotnet run
# Visit http://localhost:5000/health (or the port shown) to see {"status":"ok"}