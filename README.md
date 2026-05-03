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

This project is in the architecture/specification phase. No code implementation has begun yet. See [ARCHITECTURE.md](./ARCHITECTURE.md) before starting development.

## Local checks

Run the same checks CI runs on every PR (Node 20 LTS):

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --watchAll=false
```

CI (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, and `test` on every pull request and on pushes to `main`.
