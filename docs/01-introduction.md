# 1. Hyrje

## 1.1 Qëllimi i projektit
OnlineExam është një platformë web e dizajnuar për të modernizuar procesin e provimeve në departament, duke zëvendësuar vlerësimin tradicional në letër me një mjedis digjital të kontrolluar. Sistemi mbështet provime me tri lloje pyetjesh: **MCQ (me alternativa)**, **pyetje me shkrim (Text)** dhe **pyetje me ekzekutim të kodit (Code)**. Në kuadër të MVP, pyetjet e kodit mbështeten vetëm për **C#**, për të garantuar stabilitet dhe realizim brenda afatit semestral.

## 1.2 Përkufizimi i problemit
Procesi aktual i vlerësimit përballet me disa sfida kryesore:
- Shkrimi i kodit në letër nuk e mat aftësinë reale të studentit për të programuar, testuar dhe korrigjuar zgjidhje.
- Vlerësimi manual i një numri të madh të skriptave dhe përgjigjeve teorike kërkon kohë të konsiderueshme dhe rrit rrezikun e mospërputhjeve në pikëzim.
- Mungesa e një banke të centralizuar të pyetjeve bën që historiku akademik dhe materialet të humbin me ndryshimin e stafit.
- Siguria dhe integriteti akademik janë më të vështira për t’u kontrolluar pa mekanizma digjitalë (audit, randomizim, kontroll aksesesh).

## 1.3 Arsyeja pse është zgjedhur ky projekt
Ky projekt është zgjedhur sepse adreson një nevojë reale departamentale: vlerësim më objektiv, më të shpejtë dhe më të standardizuar. Përmes automatizimit të pjesës së vlerësimit (MCQ dhe Code), ruajtjes së bankës së pyetjeve si aset institucional dhe mekanizmave bazë të sigurisë, OnlineExam synon të sjellë përmirësim të prekshëm në cilësinë dhe efikasitetin e procesit të provimeve.

## 1.4 Objektivat kryesore
- Vlerësim më objektiv përmes auto-grading (MCQ + Code).
- Reduktim i kohës së korrigjimit dhe administrimit të provimeve.
- Ruajtja e bankës së pyetjeve dhe historikut si aset institucional.
- Përmirësim i integritetit akademik përmes kontrollit të aksesit dhe auditimit të sjelljeve gjatë provimit.

## 1.5 Kufizimet (MVP)
- Code questions: vetëm C#.
- Studentët shohin vetëm rezultat **pass/fail** për test cases (jo detaje).
- SQL/NLP/AI konsiderohen “future work” dhe jo pjesë e MVP nëse koha nuk e lejon.