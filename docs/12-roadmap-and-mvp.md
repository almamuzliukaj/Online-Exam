# 12. Roadmap 12-javor (6 Sprint-e) dhe MVP

## 12.1 Qëllimi
Të realizohet një MVP funksional brenda 12 javëve, me fokus në stabilitet, siguri bazë dhe funksionalitetet kryesore të provimeve.

## 12.2 Sprint 1 (Java 1–2): Themelet
- Setup repo + workflow (PR/branches)
- DB model bazë (Users/Roles, Semesters, Courses, Groups, Enrollments)
- Auth (JWT) + RBAC
- Skeleton UI (login + routing bazike)

## 12.3 Sprint 2 (Java 3–4): Banka e Pyetjeve
- CRUD Questions për MCQ/Text/Code
- MCQ Options + correct answer
- Code: Test cases (public/hidden)
- Validime + error handling

## 12.4 Sprint 3 (Java 5–6): Provimet (Generation + Scheduling)
- Krijim provimi + start/end time
- Gjenerim provimi nga banka sipas rregullave
- Snapshot/immutability e pyetjeve në provim
- Statuset bazë (Draft/Scheduled/Active/Closed)

## 12.5 Sprint 4 (Java 7–8): Exam Arena + Submissions
- Exam Arena one-at-a-time
- Timer server-side
- Auto-save (30s + on change)
- Final submit + lock attempt (1 attempt)

## 12.6 Sprint 5 (Java 9–10): Auto-grading (MCQ + Code C#)
- MCQ auto-grading
- Judge0 integrim për C#
- Student view: vetëm pass/fail
- Ruhet vetëm final submission (i fundit)

## 12.7 Sprint 6 (Java 11–12): Manual grading + Results + Security + Deployment
- Manual grading për Text
- Manual override për Code
- Publish results (vetëm kur profesori vendos)
- Proctoring MVP: IP whitelist + PIN/QR + focus tracking + watermark
- Docker-compose + dokumentim final për demo

## 12.8 Kritere të MVP (Definition of Done)
- Funksionalitetet kryesore punojnë end-to-end (Admin → Profesor → Student).
- Pa build artifacts në repo (`bin/`, `obj/`, `.vs/`).
- Dokumentimi i plotë në `docs/`.
- Demo flow i qartë për prezantim.