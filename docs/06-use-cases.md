# 6. Use Cases

## UC-01: Login
- **Aktor primar:** Admin/Profesor/TA/Student
- **Preconditions:** Përdoruesi ekziston dhe është aktiv.
- **Main Flow:**
  1. Përdoruesi hap faqen e login.
  2. Shkruan kredencialet.
  3. Sistemi verifikon kredencialet.
  4. Sistemi kthen JWT token dhe rolin.
  5. Përdoruesi ridrejtohet në dashboard sipas rolit.
- **Alternative Flows:**
  - A1: Kredenciale të gabuara → shfaqet mesazh gabimi.
  - A2: User i çaktivizuar → qasja refuzohet.
- **Postconditions:** Përdoruesi është i autentikuar dhe ka sesion aktiv.

## UC-02: Admin krijon semestër dhe lëndë + grupe
- **Aktor primar:** Admin
- **Preconditions:** Admin është i autentikuar.
- **Main Flow:**
  1. Admin krijon semestër.
  2. Admin krijon lëndë të re dhe e lidh me semestrin.
  3. Admin krijon grupe/sections për lëndën (për organizim).
- **Postconditions:** Semestri/lënda/grupet ekzistojnë dhe janë aktive.

## UC-03: Admin cakton staf dhe regjistron studentë në lëndë
- **Aktor primar:** Admin
- **Preconditions:** Lënda ekziston.
- **Main Flow:**
  1. Admin zgjedh lëndën.
  2. Admin cakton profesor/TA në lëndë.
  3. Admin regjistron studentët (manual ose listë).
  4. Sistemi ruan enrollment-et.
- **Alternative Flows:**
  - A1: Studenti është i çaktivizuar → nuk lejohet enrollment.
- **Postconditions:** Studentët e enrolled e shohin lëndën/provimet.

## UC-04: Profesor/TA krijon pyetje në bankë
- **Aktor primar:** Profesor (ose TA me leje)
- **Preconditions:** Aktori është i caktuar në lëndë.
- **Main Flow:**
  1. Hap “Question Bank”.
  2. Zgjedh tipin (MCQ/Text/Code).
  3. Plotëson përmbajtjen dhe pikët.
  4. Për MCQ: shton alternativa dhe shënon të saktën.
  5. Për Code: shton test cases (public/hidden).
  6. Sistemi e ruan pyetjen në bankë.
- **Postconditions:** Pyetja është e disponueshme për gjenerim provimi.

## UC-05: Profesor krijon/gjeneron provim dhe e planifikon
- **Aktor primar:** Profesor
- **Preconditions:** Ekziston bankë pyetjesh dhe studentë të enrolled.
- **Main Flow:**
  1. Profesori krijon provim (emër + lëndë).
  2. Zgjedh pyetjet manualisht ose gjeneron nga banka.
  3. Vendos start/end time.
  4. Sistemi e ruan provimin si Draft/Scheduled.
- **Postconditions:** Provimi është gati për publikim.

## UC-06: Profesor publikon provimin (snapshot)
- **Aktor primar:** Profesor
- **Preconditions:** Provimi ka pyetje dhe orar.
- **Main Flow:**
  1. Profesori klik “Publish/Activate”.
  2. Sistemi krijon snapshot të pyetjeve (immutability).
  3. Sistemi e vendos provimin në status “Active” kur vjen koha.
- **Alternative Flows:**
  - A1: Provimi pa pyetje → publikimi refuzohet.
- **Postconditions:** Provimi është i publikuar dhe i pandryshueshëm.

## UC-07: Student start exam (IP + PIN/QR)
- **Aktor primar:** Student
- **Preconditions:** Studenti është enrolled; provimi është brenda orarit; kontrolli i aksesit është valid.
- **Main Flow:**
  1. Studenti hap provimin dhe klikon “Start”.
  2. Studenti vendos PIN ose skanon QR (token).
  3. Sistemi kontrollon IP whitelist + PIN/QR + statusin e studentit.
  4. Sistemi krijon Attempt për studentin (vetëm 1 attempt).
  5. Fillon timer-i.
- **Alternative Flows:**
  - A1: Jashtë orarit → bllokohet.
  - A2: PIN i gabuar/expired → bllokohet.
  - A3: IP jashtë whitelist → bllokohet.
  - A4: Studenti ka already attempt → bllokohet.
- **Postconditions:** Attempt aktiv dhe student në Exam Arena.

## UC-08: Student përgjigjet dhe auto-save
- **Aktor primar:** Student
- **Preconditions:** Attempt aktiv.
- **Main Flow:**
  1. Studenti përgjigjet në pyetje.
  2. Sistemi bën auto-save periodik (p.sh. çdo 30 sekonda).
  3. Në ndërrim pyetjeje, sistemi ruan draft-in.
- **Alternative Flows:**
  - A1: Internet bie → UI tenton retry; draft ruhet kur rikthehet lidhja.
- **Postconditions:** Draft përgjigje të ruajtura.

## UC-09: Student final submit (lock attempt)
- **Aktor primar:** Student
- **Preconditions:** Attempt aktiv, brenda kohës.
- **Main Flow:**
  1. Studenti klikon “Submit final”.
  2. Sistemi e bllokon attempt-in (nuk lejon ndryshime).
  3. Sistemi nis procesin e vlerësimit.
- **Alternative Flows:**
  - A1: Koha mbaron → sistemi auto-submit.
- **Postconditions:** Attempt në status “Submitted”.

## UC-10: Auto-grading (MCQ + Code) dhe manual grading (Text) + publish results
- **Aktor primar:** System (auto-grading), Profesor/TA (manual), Profesor (publish)
- **Preconditions:** Attempt është Submitted.
- **Main Flow:**
  1. Sistemi llogarit pikët e MCQ.
  2. Sistemi dërgon Code në Judge0 me test cases.
  3. Sistemi ruan rezultatet e Code si pass/fail për studentin (dhe score për profesorin).
  4. Profesor/TA vlerëson Text dhe (nëse duhet) bën override për Code.
  5. Profesori publikon rezultatet.
  6. Studentët shohin rezultatet në dashboard.
- **Alternative Flows:**
  - A1: Judge0 timeout/failure → Code shënohet “Pending/Failed” dhe kërkon retrigger/override.
- **Postconditions:** Rezultatet janë të publikuara dhe të dukshme për studentët.