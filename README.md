# Freelancer Finance App

A cross-platform financial management tool for freelancers and independent contractors.

## Features (Planned)

- Invoice creation and tracking
- Expense logging with receipt capture
- Client management
- Financial reports and tax summaries
- Cross-device access via Firebase Auth

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full technical spec, including Firebase data model, security rules, and development phases.

## Tech Stack

- **Backend:** Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Mobile:** React Native
- **Web:** React + Firebase Hosting

## Status

This project is in early scaffolding. The architecture spec is locked in [ARCHITECTURE.md](./ARCHITECTURE.md) and the deployable Firebase config (rules, indexes, emulator wiring) is in place. Application code (Auth wiring, RN shell, receipt upload UI) lands in follow-up Phase 1 issues.

## Local Development

### Prerequisites

- Node.js 20+
- Java JDK 11+ (required by the Firestore and Storage emulators)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

### Configure environment

Copy the example env file and fill it in with values from the Firebase Console (Project Settings → General → Your apps → SDK setup):

```bash
cp .env.example .env
```

`.env` is git-ignored. Never commit real credentials or service account JSON.

### Run the Firebase emulators

The repo is wired for the Auth, Firestore, Storage, Functions, and Hosting emulators. To boot them locally:

```bash
firebase emulators:start
```

The Emulator UI is served at http://127.0.0.1:4000 — use it to inspect Firestore documents, Storage objects, and Auth users while developing. Set `FIREBASE_USE_EMULATORS=true` in `.env` to point the client SDK at the local emulators instead of the live project.

### Lint security rules

The Firestore and Storage rules are the source of truth for access control (per [ARCHITECTURE.md](./ARCHITECTURE.md) §3, §4). To validate a rules change without booting the full emulator suite:

```bash
firebase deploy --only firestore:rules,storage:rules --dry-run
```
