# 🏠 Marbnb – Nekilnojamojo Turto Nuomos Sistema

Moderni **Full-Stack** žiniatinklio aplikacija, skirta būsto nuomai, sukurta kaip bakalauro baigiamasis darbas. Sistema realizuoja pilną vartotojų autentifikavimo ciklą, nekilnojamojo turto skelbimų valdymą ir rezervacijų sistemą.

## 🚀 Technologinis stekas (Tech Stack)

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide-React (piktogramos).
* **Backend:** Node.js, Express.js.
* **Duomenų bazė:** SQLite (fizinis failas `database.db`).
* **Saugumas:** Bcrypt (slaptažodžių šifravimas naudojant *Salted Hashing*).



---

## 🛠️ Instaliacija ir paruošimas

Norėdami paleisti projektą savo kompiuteryje, atlikite šiuos žingsnius:

### 1. Priklausomybių įdiegimas
Atidarykite terminalą pagrindiniame projekto aplanke (`airbnb-clone`):

```bash
# Įdiegti pagrindinius projekto įrankius (pvz., concurrently)
npm install

# Įdiegti serverio (Backend) priklausomybes
cd server
npm install

# Įdiegti kliento (Frontend) priklausomybes
cd ../client
npm install
