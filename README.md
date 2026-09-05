# WebAuthn Demo

A simple university project demonstrating how passwordless authentication works using **WebAuthn** and secure session cookies.

## Features

* **Passwordless Login:** Uses WebAuthn (Touch ID, Face ID, or security keys) instead of traditional passwords.
* **Phishing Protection:** Uses `rpID` domain binding to ensure credentials only work on the official site.
* **Session Management:** Uses HTTP-only cookies and backend middleware to keep users logged in.

## Layout

This is an npm workspaces monorepo:

* `client` — Vite + React UI
* `server` — Express API, sessions, notes

## Local development

1. Copy env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install from the repo root:

```bash
npm install
```

3. Start Postgres, then run migrations and both apps:

```bash
npm run migrate:up
npm run dev
```

The UI is at `http://localhost:5174`. Vite proxies API calls to `http://localhost:5000`.

## Docker (app + database)

```bash
docker compose up --build
```

Open `http://localhost:8080`. The app image serves the built frontend and API from one origin; Postgres runs beside it.
