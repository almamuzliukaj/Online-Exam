# OnlineExam

OnlineExam is a web platform for **secure online exams** with role-based access and support for **MCQ**, **theory (text)**, and **programming (code)** questions (MVP focuses on **C# code execution via Judge0**).

This repository contains:
- **Backend**: ASP.NET Core Web API (`backend/OnlineExam.Api`)
- **Frontend**: currently a **placeholder** React project (`frontend/`)
- **Documentation**: full project docs in `docs/`

---

## Key rules (MVP)
- Exams are **common for all students in a course** (groups/sections exist only for organization).
- Students have **only 1 attempt** per exam.
- Students can see results **only after the professor publishes** them.
- For code questions:
  - students can try multiple times during the exam,
  - the system stores only the **final submission**,
  - students see only **pass/fail** for test cases (no test details),
  - authorized staff can do **manual override**.

---

## Project structure

```text
ONLINE-EXAM/
  backend/
    OnlineExam.Api/
      Program.cs
      OnlineExam.Api.csproj
      appsettings.json
      appsettings.Development.json
      Properties/
      bin/                (do not commit)
      obj/                (do not commit)

  frontend/              (Vite + React)
    src/
      components/       (Button, Card, Input, Navbar)
      lib/              (auth.js, api.js)
      pages/            (Login.jsx, Dashboard.jsx)
      routes/           (ProtectedRoute.jsx)
      App.jsx
      main.jsx
      index.css
    index.html
    package.json
    .env.example

  docs/
    00-master.md
    01-introduction.md
    02-scope-and-roles.md
    03-functional-requirements.md
    04-nonfunctional-requirements.md
    05-user-stories.md
    06-use-cases.md
    07-data-model.md
    08-system-architecture.md
    09-api-overview.md
    10-ui-pages.md
    11-security-proctoring.md
    12-roadmap-and-mvp.md

  OnlineExam.sln
  .gitignore
  README.md
```

---

## Documentation
All project documentation is in `docs/`. Start here:
- `docs/00-master.md` (Table of Contents)

---

## Prerequisites
- **.NET SDK 8.x**
- **Node.js (LTS recommended)** + **npm**
- **Git**

---

## Run backend (ASP.NET Core)
From the repository root:

```bash
cd backend/OnlineExam.Api
dotnet restore
dotnet run
```

Common local links (depending on your launch settings):
- Swagger UI: `http://localhost:5045/swagger`
- Test endpoint: `http://localhost:5045/weatherforecast`

> If the port is different on your machine, check the console output after `dotnet run` or `Properties/launchSettings.json`.

---

## Run frontend (Vite + React)

The frontend is a **Vite + React** app at `frontend/`.

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
Copy the example env file and adjust if needed:
```bash
cp .env.example .env
```

Default `.env` content:
```env
VITE_API_BASE_URL=http://localhost:5045
VITE_USE_MOCK_AUTH=true
```

### 3. Start the dev server
```bash
npm run dev
```

The app runs at **http://localhost:5173**.

### Mock mode
When `VITE_USE_MOCK_AUTH=true` (default), the frontend does **not** call the backend.
- Any non-empty email/password is accepted.
- The user role is inferred from the email:
  - Email contains `admin` → **Admin**
  - Email contains `prof` → **Professor**
  - Anything else → **Student**
- Example: `admin@test.com` / `any-password`

To connect to the real backend, set `VITE_USE_MOCK_AUTH=false` (backend must be running and CORS must allow `http://localhost:5173`).

### Build for production
```bash
npm run build
```

---

## Configuration
Backend configuration lives in:
- `backend/OnlineExam.Api/appsettings.json`
- `backend/OnlineExam.Api/appsettings.Development.json`

Typical config items (depending on implementation):
- Database connection string
- JWT settings (issuer/audience/secret)
- Judge0 base URL + API key (if integrated)

---

## Development workflow (recommended)
- Create a branch:
  - `feature/...` for features
  - `fix/...` for bug fixes
  - `docs/...` for documentation
- Open a Pull Request to `main`
- Keep commits small and descriptive

---

## Contributors
- Agnesa
- Albiona
- Alma
