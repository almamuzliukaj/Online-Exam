# 5. User Stories

> Shënim: Këto user stories janë të fokusuara në MVP dhe respektojnë rregullat:
> - Provimet mbahen të gjithë bashkë (grupet janë vetëm për organizim).
> - Vetëm 1 attempt (pa resit).
> - Rezultatet shihen vetëm pasi profesori i publikon.
> - Code: student mund të provojë disa herë, por ruhet vetëm final submission.
> - Student sheh vetëm pass/fail për test cases (pa detaje).
> - Manual override për Code lejohet nga Profesor/TA.

## 5.1 Admin

**US-ADM-01**: Si Admin dua të krijoj semestra që të organizohet viti akademik.  
- Acceptance Criteria:
  - Mund të krijoj/listoj/ndryshoj semestra.
  - Semestri nuk fshihet fizikisht (soft delete/disable).

**US-ADM-02**: Si Admin dua të krijoj lëndë për secilin semestër që të menaxhohen provimet sipas planprogramit.  
- Acceptance Criteria:
  - Lënda lidhet me një semestër.
  - Lënda ka emër, kod (opsionale) dhe status aktiv/joaktiv.

**US-ADM-03**: Si Admin dua të krijoj grupe/sections për lëndët që të pasqyrohet organizimi i ligjëratave/ushtrimeve.  
- Acceptance Criteria:
  - Grupi lidhet me lëndën.
  - Provimi mbetet i përbashkët për të gjithë studentët e lëndës.

**US-ADM-04**: Si Admin dua të krijoj dhe çaktivizoj llogari përdoruesish (Student/Profesor/TA) që të kontrollohet qasja.  
- Acceptance Criteria:
  - Admin mund të krijojë user dhe t’i caktojë rol.
  - Admin mund të çaktivizojë user (pa fshirë të dhëna historike).

**US-ADM-05**: Si Admin dua t’i caktoj profesorët dhe asistentët në një lëndë që të menaxhohet përgjegjësia akademike.  
- Acceptance Criteria:
  - Një lëndë mund të ketë 1+ profesorë/TA.
  - Vetëm Admin mund të bëjë assign/unassign.

**US-ADM-06**: Si Admin dua të regjistroj studentët në lëndë që vetëm studentët e regjistruar të mund ta marrin provimin.  
- Acceptance Criteria:
  - Studentët e pa-regjistruar nuk e shohin provimin.
  - Regjistrimi mund të jetë i bazuar në listë (CSV/Manual) (opsionale).

**US-ADM-07**: Si Admin dua të shoh listën e studentëve të regjistruar në një lëndë/grup që të verifikoj pjesëmarrjen.  
- Acceptance Criteria:
  - Shfaqen studentët sipas lëndës dhe (opsionale) grupit.
  - Mund të hiqen/shtohen regjistrime.

**US-ADM-08**: Si Admin dua të shoh një audit minimal të veprimeve kritike që të kem gjurmueshmëri.  
- Acceptance Criteria:
  - Ruhet kush e publikoi provimin / kush publikoi rezultatet (minimum).

## 5.2 Profesor

**US-PROF-01**: Si Profesor dua të krijoj pyetje MCQ që të vlerësoj teorinë në mënyrë të shpejtë.  
- Acceptance Criteria:
  - MCQ ka tekst, alternativa, dhe një përgjigje të saktë.
  - Përcaktohen pikët.

**US-PROF-02**: Si Profesor dua të krijoj pyetje Text që të vlerësoj shpjegimin me fjalët e studentit.  
- Acceptance Criteria:
  - Pyetja Text ka tekst dhe pikë maksimale.
  - Përgjigjet ruhen për vlerësim manual.

**US-PROF-03**: Si Profesor dua të krijoj pyetje Code (C#) me test cases që të vlerësoj aftësitë praktike.  
- Acceptance Criteria:
  - Pyetja ka statement dhe “starter code” (opsionale).
  - Ka test cases dhe pikë maksimale.

**US-PROF-04**: Si Profesor dua të kategorizoj pyetjet (tags/vështirësi) që të mund t’i filtroj për gjenerim provimi.  
- Acceptance Criteria:
  - Pyetja mund të ketë tags dhe vështirësi (opsionale).

**US-PROF-05**: Si Profesor dua të gjeneroj provim nga banka e pyetjeve që të kursej kohë në përgatitje.  
- Acceptance Criteria:
  - Mund të zgjedh numrin e pyetjeve dhe përzierjen e tipeve.
  - Provimi krijohet si draft.

**US-PROF-06**: Si Profesor dua të përzgjedh manualisht pyetje në provim që të kontrolloj përmbajtjen.  
- Acceptance Criteria:
  - Mund të shtoj/heq pyetje nga provimi para publikimit.

**US-PROF-07**: Si Profesor dua ta planifikoj provimin me start/end time që të mbahet në orarin e duhur.  
- Acceptance Criteria:
  - Provimi ka start dhe end.
  - Studentët s’mund ta fillojnë jashtë orarit.

**US-PROF-08**: Si Profesor dua që provimi i publikuar të ruhet si snapshot (immutability) që të mos ndryshojë përmbajtja.  
- Acceptance Criteria:
  - Ndryshimet në bankën e pyetjeve nuk ndikojnë provimin e publikuar.

**US-PROF-09**: Si Profesor dua të shoh submissions dhe progres gjatë provimit që të monitoroj situatën (opsionale MVP).  
- Acceptance Criteria:
  - Shfaqen attempt-et aktive dhe statuset bazë.

**US-PROF-10**: Si Profesor dua të vlerësoj manualisht pyetjet Text që të jap notë të drejtë.  
- Acceptance Criteria:
  - Mund të vendos pikë për secilën përgjigje Text.
  - Ruhet kush e bëri vlerësimin.

**US-PROF-11**: Si Profesor dua të bëj manual override për pikët e Code kur ka arsye të justifikuar.  
- Acceptance Criteria:
  - Mund të ndryshoj score-n e Code submissions.
  - Ruhet arsye (koment) (opsionale) dhe audit.

**US-PROF-12**: Si Profesor dua të publikoj rezultatet vetëm kur unë vendos që studentët t’i shohin.  
- Acceptance Criteria:
  - Para publish: studentët s’shohin rezultate.
  - Pas publish: studentët shohin rezultatet.

**US-PROF-13**: Si Profesor dua të eksportoj rezultatet (CSV) për arkivim (opsionale).  
- Acceptance Criteria:
  - Mund të shkarkohet listë me emër, ID, pikë, status.

## 5.3 TA (Asistent)

**US-TA-01**: Si TA dua të kem qasje në bankën e pyetjeve të lëndës që të ndihmoj profesorin.  
- Acceptance Criteria:
  - Qasja kufizohet vetëm në lëndët ku TA është i caktuar.

**US-TA-02**: Si TA dua të krijoj pyetje (nëse kam leje) që të kontribuoj në bankën e pyetjeve.  
- Acceptance Criteria:
  - TA mund të shtojë MCQ/Text/Code sipas rolit/permission.

**US-TA-03**: Si TA dua të vlerësoj pyetjet Text që të shpejtojmë procesin e korrigjimit.  
- Acceptance Criteria:
  - TA mund të vendos pikë për Text.
  - Profesori mund të bëjë review/ndryshim (opsionale).

**US-TA-04**: Si TA dua të bëj manual override për Code (nëse më lejohet) për raste të veçanta.  
- Acceptance Criteria:
  - Override lejohet vetëm nëse policy e lëndës e lejon.

**US-TA-05**: Si TA dua të shoh incidentet e proctoring (focus lost events) që të informoj profesorin.  
- Acceptance Criteria:
  - Shfaqen eventet sipas studentit dhe kohës.

## 5.4 Student

**US-STU-01**: Si Student dua të shoh listën e provimeve për lëndët ku jam i regjistruar që të planifikoj pjesëmarrjen.  
- Acceptance Criteria:
  - Shfaqen vetëm provimet e lëndëve ku jam enrolled.

**US-STU-02**: Si Student dua të filloj provimin vetëm brenda orarit (start/end) që procesi të jetë i drejtë.  
- Acceptance Criteria:
  - Jashtë orarit “Start” është i bllokuar.

**US-STU-03**: Si Student dua që provimi të shfaqet one-at-a-time që të fokusohem në një pyetje.  
- Acceptance Criteria:
  - UI shfaq një pyetje; navigimi ruan përgjigjen.

**US-STU-04**: Si Student dua auto-save që të mos humb përgjigjet nëse më bie interneti.  
- Acceptance Criteria:
  - Përgjigjet ruhen automatikisht (p.sh. çdo 30 sekonda).

**US-STU-05**: Si Student dua të shkruaj kod në editor të integruar (Monaco) që të kem eksperiencë të mirë gjatë provimit.  
- Acceptance Criteria:
  - Editor ka syntax highlighting për C#.

**US-STU-06**: Si Student dua të provoj disa herë zgjidhjen e kodit gjatë provimit që të arrij në zgjidhjen finale.  
- Acceptance Criteria:
  - Lejohen disa runs/submits gjatë provimit.

**US-STU-07**: Si Student dua që të ruhet vetëm përgjigja ime e fundit për Code që të merret si final answer.  
- Acceptance Criteria:
  - Sistemi e shënon dorëzimin e fundit si final.

**US-STU-08**: Si Student dua të shoh vetëm pass/fail për test cases që të mos zbuloj testet e sistemit.  
- Acceptance Criteria:
  - UI s’shfaq input/output të test cases, vetëm status.

**US-STU-09**: Si Student dua të dorëzoj provimin final dhe të bllokohet attempt-i që të mos ketë ndryshime pas deadline.  
- Acceptance Criteria:
  - Pas submit, përgjigjet nuk ndryshohen.

**US-STU-10**: Si Student dua t’i shoh rezultatet vetëm kur profesori i publikon që të ruhet kontrolli i procesit.  
- Acceptance Criteria:
  - Para publish: shfaqet “Pending”.
  - Pas publish: shfaqet nota/pikët.