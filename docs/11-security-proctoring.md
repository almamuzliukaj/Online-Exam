# 11. Siguria dhe Integriteti Akademik (Proctoring)

## 11.1 Qëllimi
Qëllimi i mekanizmave të sigurisë është:
- të reduktohet mundësia që studenti të hyjë në provim nga jashtë fakultetit,
- të zvogëlohet kopjimi gjatë provimit,
- të krijohet gjurmueshmëri (audit) për incidentet.

## 11.2 Kontrolli i aksesit (mos me u kyç nga shtëpia)

### 11.2.1 IP Whitelisting
Provimi lejohet vetëm nga rrjeti i fakultetit (IP range). Ky është mekanizmi kryesor për të bllokuar qasjen nga shtëpia.

### 11.2.2 Live PIN / QR Code (hyrje në sallë)
Për të filluar provimin, studenti duhet të përdorë:
- **PIN** të gjeneruar nga profesori me afat të shkurtër (p.sh. 2–5 minuta), ose
- **QR Code** të shfaqur në sallë që hap URL me token.
Kjo e lidh fillimin e attempt-it me prezencën në sallë.

### 11.2.3 Device binding (anti-sharing)
Pasi studenti e nis attempt-in, sistemi e lidh attempt-in me pajisjen (cookie/token + fingerprint bazik). Nëse tenton të vazhdojë nga pajisje tjetër:
- bllokohet, ose
- kërkohet autorizim i profesorit.

## 11.3 Focus tracking (Tab-lock)
Nëse studenti ndërron tab/dritaren ose del nga faqja e provimit:
- sistemi regjistron “focus lost event”,
- profesori i sheh incidentet në panel.

## 11.4 Clipboard restrictions (opsionale)
Sistemi mund të kufizojë:
- copy/paste
- right-click
si masë “deterrent” (nuk është 100% e pa-anashkalueshme, por ndihmon).

## 11.5 Screenshot – çka mund dhe çka nuk mund
Në një aplikacion web standard nuk mund të bllokohet 100% screenshot (p.sh. PrintScreen, Snipping Tool, screenshot nga telefoni).  
Megjithatë, mund të implementohen masa praktike:
- **Watermark dinamik** gjatë provimit (Emër, ID, timestamp) për identifikim të burimit në rast shpërndarjeje.
- **Full-screen (opsional)**: dalja nga full-screen regjistrohet si incident.
- Kombinimi i watermark + audit + kontrolle aksesesh ul ndjeshëm riskun praktik.