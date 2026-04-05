# Bobba-appen — Veiledning for Camilla

---

## 📱 Appens adresse

**https://gipshane.github.io/Bobba/hjem-appen.html**

---

## 📲 Installer som app på mobilen

### iPhone (Safari)
1. Åpne adressen over i **Safari** (ikke Chrome — det er viktig!)
2. Trykk på **Del-knappen** — firkanten med pil opp, nederst i midten av skjermen
3. Rull ned og trykk **«Legg til på hjemskjerm»**
4. Trykk **«Legg til»**

Den grønne kule-ikonet dukker nå opp på hjemskjermen, akkurat som en vanlig app.

### Android (Chrome)
1. Åpne adressen i **Chrome**
2. Trykk **⋮** øverst til høyre
3. Trykk **«Legg til på startskjermen»**
4. Bekreft med **«Legg til»**

---

## 🔄 Oppdatere appen etter endringer

Når Claude har gjort endringer i filene på PC-en:

1. Åpne **GitHub Desktop**
2. Du skal se endrede filer listet opp til venstre
3. Skriv en kort beskrivelse i **«Summary»**-feltet nederst til venstre (f.eks. «La til nytt rom»)
4. Klikk **«Commit to main»**
5. Klikk **«Push origin»** (den blå knappen øverst)

Vent 1–2 minutter, så er appen på mobilen oppdatert automatisk.

---

## 🏠 Legge til et nytt rom

Bobbas rom er bygget for å støtte flere rom. Slik legger du til ett:

### 1. Tegn lagene i Procreate
- Samme størrelse som stua: **1200 × 1624 px**, RGBA (gjennomsiktig bakgrunn)
- Eksporter hvert lag som PNG med nummer i filnavnet, f.eks. `Bobbarom2-1.png`, `Bobbarom2-2.png` osv.
- Legg filene i en ny mappe inne i prosjektmappa, f.eks. `bobba_rom_soverom/Nypngs/`

### 2. Si ifra til Claude
Fortell Claude:
- Hva rommet heter (f.eks. «Soverom»)
- Hvilke lag som er med (hva de heter, hvilke som er gratis, priser på de andre)
- Hvilke lag som hører sammen (bundle) eller krever andre lag

Claude legger til rommet i koden — du trenger ikke gjøre noe teknisk selv.

### 3. Last opp og publiser
Følg «Oppdatere appen»-instruksjonene over (GitHub Desktop → Commit → Push).

---

## 📁 Filstruktur

| Fil/mappe | Hva det er |
|-----------|------------|
| `hjem-appen.html` | Hele appen — all kode ligger her |
| `sw.js` | Gjør at appen fungerer offline og som PWA |
| `manifest.json` | App-navn, ikon og farger for mobil |
| `icon.svg` | Det grønne kule-ikonet |
| `index.html` | Videresender til hjem-appen.html — ikke rediger |
| `bobba_rom_stue/Nypngs/` | De 52 PNG-lagene for stua |
| `VEILEDNING.md` | Denne filen |

---

## 🔗 Nyttige lenker

- **Appen:** https://gipshane.github.io/Bobba/hjem-appen.html
- **GitHub-prosjektet:** https://github.com/Gipshane/Bobba
- **GitHub Desktop:** https://desktop.github.com

---

*Laget med kjærlighet for Camilla og Bobba 🌿*
