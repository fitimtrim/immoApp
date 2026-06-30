# ViaHome24 – Immobilien Kosovo (mit Supabase Backend)

Moderne Immobilien-Plattform für Kosovo. React 18 + Vite + React Router + Supabase.

## 🚀 Lokale Entwicklung
```bash
npm install
npm run dev
```

## 🗄️ Supabase Setup (einmalig erforderlich!)

1. Gehe zu deinem Supabase Projekt: https://supabase.com/dashboard
2. Öffne **SQL Editor** → **New Query**
3. Kopiere den Inhalt von `supabase-setup.sql` und klicke **Run**
4. Gehe zu **Authentication → Settings**
   - Für Tests: **"Confirm email"** auf OFF stellen
   - (Sonst muss jeder neue User seine Email bestätigen)

Das war's! Die App ist bereits mit deinem Supabase-Projekt verbunden
(`src/lib/supabase.js`).

## 🏗 Build
```bash
npm install
npm run build
```

## 📦 Deployment auf Hostinger (viahome24.com)
1. `npm run build` ausführen
2. `xcopy dist\* . /E /Y` (Windows) – kopiert dist/ Inhalt ins Root
3. `git add . && git commit -m "Update" && git push --force`
4. Hostinger → GIT → "Erneut bereitstellen"

## ✅ Features
- **Echtes Backend (Supabase):**
  - Registrierung & Login mit Email/Passwort
  - Benutzerprofile (Vorname, Nachname, Telefon)
  - Inserate werden in PostgreSQL-Datenbank gespeichert
  - Fotos werden in Supabase Storage hochgeladen
  - Daten bleiben erhalten – auch auf anderen Geräten!
- Immobilien-Suche mit Live-Standortsuche (OpenStreetMap)
- Filter-Sidebar (ImmoScout24-Style)
- Mehrsprachig: DE / SQ / EN
- Vollständig responsive (Mobile, Tablet, Desktop)
- iOS Zoom-Fix für Formularfelder

## 📁 Projektstruktur
```
src/
  components/     # Navbar, SearchBar, AuthModal, FilterModal, DetailModal, ListingCard, LocationSearch, Toast
  context/        # AppContext (Supabase Auth + State)
  lib/            # supabase.js (Client-Konfiguration)
  data/           # translations.js, locations.js (Sample-Daten)
  pages/          # HomePage, CreatePage, MyListingsPage, ProfilePage
supabase-setup.sql  # SQL-Skript für Datenbank-Setup
```
