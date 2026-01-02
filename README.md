# 🏠 Marbnb – Nekilnojamojo Turto Nuomos Sistema

Šis projektas yra **Full-Stack** žiniatinklio aplikacija, skirta nekilnojamojo turto nuomai. Tai yra bakalauro baigiamasis darbas, kuriame realizuotas pilnas vartotojų autentifikavimo ciklas, būstų valdymas ir rezervacijų sistema.

---

## 💻 0. Pasiruošimas: Kaip paruošti naują kompiuterį?

Jei naudojate visiškai naują kompiuterį, jame greičiausiai nėra įdiegtų įrankių kodo vykdymui. Sekite šiuos žingsnius:

### 1. Įdiekite Node.js ir NPM
`npm` (Node Package Manager) yra įrankis, kuris atsisiunčia visas projektui reikalingas bibliotekas.
1. Eikite į oficialią svetainę [nodejs.org](https://nodejs.org/).
2. Atsisiųskite ir įdiekite **LTS (Long Term Support)** versiją.
3. Įdiegus, patikrinkite ar veikia terminale įvedę:
   * `node -v`
   * `npm -v`

### 2. Kodo redaktorius
Rekomenduojama naudoti **Visual Studio Code (VS Code)**. Atsisiųskite iš [code.visualstudio.com](https://code.visualstudio.com/).

---

## 🚀 Technologinis stekas (Tech Stack)

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide-React (piktogramos).
* **Backend:** Node.js, Express.js.
* **Duomenų bazė:** SQLite (fizinis failas `database.db`).
* **Saugumas:** Bcrypt (slaptažodžių šifravimas naudojant *Salted Hashing*).

---

## 🛠️ Instaliacija ir paruošimas

Atlikite šiuos žingsnius projekto paleidimui:

### 1. Priklausomybių įdiegimas
Atidarykite terminalą pagrindiniame projekto aplanke (`airbnb-clone`):

```bash
# Įdiegti pagrindinius projekto valdymo įrankius
npm install

# Įdiegti serverio (Backend) bibliotekas
cd server
npm install

# Įdiegti kliento (Frontend) bibliotekas
cd ../client
npm install
