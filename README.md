# AboSync Frontend - Angular Anwendung

Das Frontend von AboSync wurde mit **Angular** entwickelt und dient als Benutzeroberfläche zur Verwaltung von Abonnements. Es interagiert mit dem Django-Backend über REST-APIs und bietet eine intuitive Benutzererfahrung.

## Funktionen
- **Benutzerregistrierung und Login** mit JWT-Authentifizierung
- **Verwaltung von Abonnements** (Hinzufügen, Bearbeiten, Löschen)
- **Integration mit Stripe** zur Zahlungsabwicklung
- **Automatische Erinnerungen** an bevorstehende Zahlungen
- **Bild-Upload** für Abonnements
- **Session-Handling** mit einem `sessionexpire.interceptor`
- **AuthGuard** für geschützte Routen

## Installation
### Voraussetzungen
- Node.js & npm
- Angular CLI

### Setup
```sh
# Repository klonen
git clone https://github.com/Sh3rlock1337/AboSyncFrontend.git
cd src

# Abhängigkeiten installieren
npm install

# Anwendung starten
ng serve --open
```

## Projektstruktur
```
frontend/
│-- src/
│   ├── app/
│   │   ├── components/        # UI-Komponenten (z. B. Dashboard, Login, Register)
│   │   ├── services/          # Services für API-Kommunikation (auth.service.ts, image.service.ts)
│   │   ├── guards/            # Authentifizierungs-Guards (auth.guard.ts)
│   │   ├── interceptors/      # Interceptor für Session-Handling (sessionexpire.interceptor.ts)
│   │   ├── models/            # Typdefinitionen (z. B. kategoriesItem.ts)
│   │   ├── app-routing.module.ts  # Routen der Anwendung
│   │   ├── app.module.ts      # Hauptmodul
│   │   ├── main.ts            # Einstiegspunkt
```

## Wichtige Dateien
- **`app-routing.module.ts`** - Definiert die Routen der Anwendung
- **`auth.guard.ts`** - Schützt private Routen vor unautorisierten Zugriffen
- **`auth.service.ts`** - Handhabt die Authentifizierung
- **`sessionexpire.interceptor.ts`** - Überwacht abgelaufene Sessions
- **`image.service.ts`** - Ermöglicht das Hochladen von Bildern

## API-Kommunikation
Das Frontend kommuniziert mit dem Django-Backend über REST-API-Endpunkte, die in `auth.service.ts` und anderen Services definiert sind. Beispielsweise:

- `POST /api/login/` - Anmeldung
- `POST /api/register/` - Registrierung
- `GET /api/abolist/` - Abonnementliste abrufen
- `POST /api/abopost/` - Neues Abonnement erstellen

## Authentifizierung
Die Authentifizierung erfolgt über **JWT-Tokens**, die nach erfolgreichem Login gespeichert und für weitere Anfragen genutzt werden.

## Lizenz
Dieses Projekt steht unter der **MIT-Lizenz**.


