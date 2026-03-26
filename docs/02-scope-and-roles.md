# 2. Scope dhe Rolet

## 2.1 Çfarë përfshin sistemi (Scope)
Sistemi OnlineExam përfshin:
- Autentikim dhe autorizim sipas roleve (Admin, Profesor, Asistent/TA, Student).
- Menaxhim akademik: semestra, lëndë, grupe (sections), regjistrime (enrollment), dhe caktim i stafit në lëndë.
- Bankë pyetjesh për lëndë (MCQ, Text, Code).
- Krijim/gjenerim i provimeve dhe planifikim me start/end time.
- Ndërfaqe “Exam Arena” për studentin (one-at-a-time, timer, auto-save).
- Vlerësim:
  - MCQ: automatik
  - Code (C#): automatik përmes Judge0 + test cases
  - Text: manual (Professor/TA)
- Rezultate dhe publikim i kontrolluar i rezultateve nga profesori.

## 2.2 Jashtë scope për MVP (Future work)
- Mbështetje për gjuhë të tjera programimi përveç C#.
- Proctoring i avancuar (p.sh. webcam monitoring).
- Vlerësim NLP/AI për pyetje teorike (si modul opsional).
- Ekzekutim i SQL si pjesë e detyrueshme (opsional sipas kohës).

## 2.3 Rolet (RBAC)

### 2.3.1 Admin
- Krijon/menaxhon semestra dhe lëndë.
- Menaxhon grupe (sections) për lëndë (për organizim).
- Krijon/çaktivizon përdorues dhe cakton rolet.
- Cakton profesorë/TA në lëndë.
- Regjistron studentët në lëndë/grupe.

### 2.3.2 Profesor
- Menaxhon bankën e pyetjeve për lëndët e veta.
- Krijon/gjeneron provime, i planifikon dhe i publikon.
- Monitoron incidentet bazë gjatë provimit (focus lost, etj.).
- Vlerëson pyetjet Text (ose delegon).
- Publikon rezultatet.
- Mund të bëjë manual override për pikët e Code kur është e nevojshme.

### 2.3.3 Asistent (TA)
- Sipas autorizimit: krijon pyetje, ndihmon në menaxhim të lëndës.
- Vlerëson pyetje Text dhe ndihmon në publikimin/raportimin e rezultateve.

### 2.3.4 Student
- Shikon lëndët dhe provimet ku është i regjistruar.
- Fillon provimin vetëm brenda orarit dhe me kontrollet e aksesit.
- Jep përgjigje MCQ/Text/Code, me auto-save gjatë provimit.
- Sheh rezultatet vetëm pasi profesori i publikon.

## 2.4 Rregulla akademike (kufizime operative)
- Ligjëratat/ushtrimet mund të jenë të ndara në grupe, por **provimi mbahet i përbashkët**.
- Lejohet vetëm **1 attempt** për student (nuk lejohet resit).
- Rezultatet bëhen të dukshme për studentët vetëm pas **publish** nga profesori.
- Për Code:
  - studenti mund të provojë disa herë gjatë provimit,
  - ruhet vetëm **zgjidhja finale** (submisioni i fundit),
  - studenti sheh vetëm **pass/fail** (pa detaje test cases).