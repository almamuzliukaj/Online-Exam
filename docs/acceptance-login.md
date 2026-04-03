# Acceptance - Login (MVP)

## Prerequisites
- Docker Desktop running
- Postgres started via docker compose

## Checklist
- [ ] Run DB: docker compose up -d
- [ ] Verify DB: docker ps shows onlineexam-postgres is Up
- [ ] API runs: dotnet run in ackend/OnlineExam.Api (listens on http://localhost:5045)
- [ ] Swagger reachable: http://localhost:5045/swagger
- [ ] POST /auth/login returns JWT token
- [ ] GET /auth/me returns current user when Bearer token is provided
- [ ] Admin-only endpoint denies non-admin and allows admin
- [ ] Frontend login stores token and loads dashboard
