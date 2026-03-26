# 4. Kërkesat Jo-Funksionale (NFR)

## 4.1 Siguria
- **NFR-01:** Fjalëkalimet nuk ruhen në plain text; përdoret hashing + salt.
- **NFR-02:** Endpoint-et e mbrojtura kërkojnë JWT dhe autorizim sipas rolit.
- **NFR-03:** Ekzekutimi i kodit nuk bëhet në serverin e aplikacionit; kryhet vetëm në sandbox (Judge0).
- **NFR-04:** Duhet audit minimal për veprime kritike (start exam, submit, grading override, publish results).

## 4.2 Integritet akademik (anti-cheat)
- **NFR-05:** Sistemi duhet të mbështesë mekanizma për kufizim të aksesit në provim (IP whitelist + PIN/QR + device binding).
- **NFR-06:** Sistemi duhet të regjistrojë shkelje bazike (focus lost) dhe t’i shfaqë për profesorin.

## 4.3 Performanca dhe shkallëzueshmëria
- **NFR-07:** Sistemi duhet të përballojë ngarkesë të lartë gjatë provimit (shumë studentë njëkohësisht).
- **NFR-08:** Integrimi me Judge0 duhet të trajtojë timeouts/retries dhe të mos bllokojë requestet kryesore.

## 4.4 Besueshmëria (Reliability)
- **NFR-09:** Auto-save duhet të minimizojë humbjen e të dhënave (p.sh. çdo 30 sekonda + në ndërrim pyetjeje).
- **NFR-10:** Në rast dështimi të Judge0, submission-i ruhet me status të qartë (Pending/Failed) dhe trajtohet pa humbur të dhëna.

## 4.5 Mirëmbajtja (Maintainability)
- **NFR-11:** Kodi i backend-it duhet të jetë i ndarë në shtresa (Controllers/Services/Data/DTOs).
- **NFR-12:** Përdorim i branch/PR workflow dhe commits të rregullta me mesazhe domethënëse.

## 4.6 Përdorshmëria (Usability)
- **NFR-13:** UI duhet të jetë e qartë, responsive dhe e përshtatshme për provime (one-at-a-time, timer i dukshëm).
- **NFR-14:** Gabimet/validimet duhet të shfaqen me mesazhe të kuptueshme.

## 4.7 Deploy/Portabilitet
- **NFR-15:** Sistemi duhet të ekzekutohet përmes Docker Compose (`docker-compose up`) në ambient lokal dhe server.