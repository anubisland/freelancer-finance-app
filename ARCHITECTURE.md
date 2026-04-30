# Freelancer Finance App — Architecture Specification

## Overview

The Freelancer Finance App is a cross-platform financial management tool for freelancers and independent contractors. It lets users track income, manage invoices, log expenses, store receipts, and generate financial reports — with full cross-device access via authenticated accounts.

This document is the authoritative architecture reference. All development must follow this specification before implementation begins.

---

## Board Directive

Per company directive ([ANU-200](/ANU/issues/ANU-200)): every app that stores user-specific data must use **Firebase as the primary backend**, and users must be able to access their data from any device using a login. This app is fully compliant with that directive by design.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Authentication | Firebase Authentication |
| Primary Database | Cloud Firestore |
| File Storage | Firebase Storage |
| Hosting (Web) | Firebase Hosting |
| Backend Logic | Firebase Cloud Functions (Node.js) |
| Mobile (iOS/Android) | React Native + Firebase SDK |
| Web | React + Firebase Web SDK |

---

## Firebase Architecture

### 1. Firebase Authentication

All user sessions are managed by Firebase Auth. No user data is accessible without a valid session.

**Supported sign-in methods:**
- Email + Password (primary)
- Google Sign-In (OAuth)
- Apple Sign-In (iOS, required for App Store)

**Rules:**
- All Firestore and Storage access is gated on `request.auth != null`
- Users can only read and write their own data (enforced at the security rules level)
- Session tokens are handled by the Firebase SDK — no manual token management in app code

---

### 2. Cloud Firestore — Data Model

Firestore is the primary database for all user financial data. Data is scoped under each user's UID to enforce per-user isolation.

#### Top-Level Collections

```
/users/{uid}
  /invoices/{invoiceId}
  /expenses/{expenseId}
  /clients/{clientId}
  /reports/{reportId}
```

#### `users/{uid}` — User Profile

```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "currency": "string",           // e.g. "USD", "EUR"
  "taxRate": "number",            // default tax rate as decimal
  "businessName": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `users/{uid}/clients/{clientId}` — Client Records

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "notes": "string",
  "createdAt": "timestamp"
}
```

#### `users/{uid}/invoices/{invoiceId}` — Invoices

```json
{
  "clientId": "string",           // ref to clients/{clientId}
  "invoiceNumber": "string",
  "status": "draft | sent | paid | overdue | cancelled",
  "issueDate": "timestamp",
  "dueDate": "timestamp",
  "paidDate": "timestamp | null",
  "lineItems": [
    {
      "description": "string",
      "quantity": "number",
      "rate": "number",
      "amount": "number"
    }
  ],
  "subtotal": "number",
  "taxAmount": "number",
  "total": "number",
  "currency": "string",
  "notes": "string",
  "attachmentUrls": ["string"],   // refs to Firebase Storage paths
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `users/{uid}/expenses/{expenseId}` — Expenses

```json
{
  "category": "string",           // e.g. "Software", "Travel", "Office"
  "description": "string",
  "amount": "number",
  "currency": "string",
  "date": "timestamp",
  "vendor": "string",
  "taxDeductible": "boolean",
  "receiptUrls": ["string"],      // refs to Firebase Storage paths
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `users/{uid}/reports/{reportId}` — Saved Reports (Optional)

```json
{
  "type": "income | expense | profit_loss | tax_summary",
  "period": { "start": "timestamp", "end": "timestamp" },
  "generatedAt": "timestamp",
  "data": "object"               // serialized report snapshot
}
```

---

### 3. Firestore Security Rules

All Firestore access is enforced with the following rule pattern. These rules are the source of truth — no server-side enforcement should be trusted instead of them.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User profile — only the owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // All sub-collections (invoices, expenses, clients, reports)
      match /{collection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### 4. Firebase Storage — Receipt and Attachment Storage

Firebase Storage is used for file uploads: invoice PDFs, expense receipts, and any attached documents.

**Storage path structure:**
```
users/{uid}/invoices/{invoiceId}/{filename}
users/{uid}/expenses/{expenseId}/{filename}
```

**Storage Security Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**File limits:**
- Max file size: 10 MB per file
- Accepted types: PDF, PNG, JPG, HEIC
- Files are stored with the original name; collisions are handled by prefixing a timestamp

---

### 5. Firebase Cloud Functions

Server-side logic runs in Firebase Cloud Functions (Node.js 20+). These are triggered on events or via HTTPS callable functions.

**Planned functions:**

| Function | Trigger | Purpose |
|---|---|---|
| `onInvoiceStatusChange` | Firestore `onUpdate` | Send email notification when invoice is marked paid/overdue |
| `generateInvoicePDF` | HTTPS Callable | Render invoice as PDF and upload to Storage |
| `calculateTaxSummary` | HTTPS Callable | Aggregate tax data for a date range |
| `sendInvoiceEmail` | HTTPS Callable | Email an invoice PDF to a client |

Cloud Functions are not required for the initial MVP. They become active in Phase 2.

---

### 6. Firebase Hosting

The web app is deployed to Firebase Hosting with a single-page React application.

- CDN-cached static assets
- Automatic HTTPS
- Custom domain support
- Preview channels for pull request deployments

---

## Cross-Device Access

All user data is stored in Firestore under the user's UID. Signing into the same account on any device (mobile or web) immediately gives full access to all data. Firebase handles offline caching automatically via Firestore's persistence layer — users can view and edit data offline, and changes sync when connectivity is restored.

---

## Data Privacy and Security

- No user financial data is stored outside Firebase
- All data is scoped to the authenticated user's UID
- Firebase Auth tokens are short-lived and automatically refreshed
- All Firebase project access is restricted to allowlisted domains and bundle IDs
- Firestore and Storage security rules are the enforcement layer — they are version-controlled and reviewed before any rule change is deployed

---

## Development Phases

### Phase 1 — MVP (Spec Target)
- Firebase Auth (email/password + Google)
- Firestore data model (clients, invoices, expenses)
- Firebase Storage (receipt upload)
- React Native mobile app (iOS + Android)
- Basic income/expense dashboard

### Phase 2 — Enhanced Features
- Firebase Cloud Functions (PDF generation, email notifications)
- Web app (React + Firebase Hosting)
- Apple Sign-In
- Financial reports and tax summary
- Recurring invoices

### Phase 3 — Advanced
- Multi-currency support with conversion
- Offline-first sync improvements
- Export to CSV / accounting software integration

---

## Firebase Project Setup

The Firebase project must be set up with the following services enabled before development begins:

1. **Firebase Authentication** — enable Email/Password and Google providers
2. **Cloud Firestore** — create in production mode, apply security rules from this spec
3. **Firebase Storage** — create default bucket, apply security rules from this spec
4. **Firebase Hosting** — connect to the web app build output
5. **Cloud Functions** — enable only when Phase 2 begins

Environment config (API keys, project IDs) must be stored in `.env` files and never committed to the repository. Use Firebase App Check in production to prevent unauthorized API key use.

---

## Related Issues

- [ANU-200](/ANU/issues/ANU-200) — Board directive: Firebase for all user-data apps
- [ANU-201](/ANU/issues/ANU-201) — Firebase compliance audit, all projects
- [ANU-242](/ANU/issues/ANU-242) — This spec task
