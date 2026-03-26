# 8. Arkitektura e Sistemit

## 8.1 Komponentët
- Frontend (React + Tailwind + Monaco)
- Backend (ASP.NET Core Web API)
- Database (PostgreSQL)
- Sandbox (Judge0)
- Deployment (Docker Compose)

## 8.2 Rrjedha (Flow)
- UI -> API (JWT)
- API -> DB (EF Core)
- API -> Judge0 (submit + poll)
- API -> UI (results/status)

## 8.3 Pse Judge0
- izolim/siguri
- kontroll i resurseve
- standardizim i ekzekutimit