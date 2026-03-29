# OVPRET Web-Based Document Tracking System

A production-grade web application for tracking RET (Research, Extension, and Technology) documents through an approval workflow managed by the OVPRET Vice President.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| UI Library | Material UI (MUI) v5 |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| File Storage | Cloudinary |
| Routing | React Router v6 |

---

## DFD Processes Implemented

| Process | Description | Location |
|---------|-------------|----------|
| 1.0 | Submit Document | `SubmitPage.tsx`, `SubmitDocumentModal.tsx` |
| 2.0 | Track Document | `DashboardPage.tsx`, `DocumentDetailModal.tsx` |
| 3.0 | Review Document | `ReviewPage.tsx`, `DocumentDetailModal.tsx` (VP Action tab) |
| 4.0 | Process Document | `DocumentDetailModal.tsx` (Approve/Reject/Revise) |
| 5.0 | Generate Analytics | `AnalyticsPage.tsx` |
| — | Document Database | Firebase Firestore `documents` collection |
| — | Transaction Logs | Firebase Firestore `logs` collection, `LogsPage.tsx` |

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see below).

### 3. Run in Demo Mode (no Firebase needed)

The app ships with `VITE_DEMO_MODE=true` — just run:

```bash
npm run dev
```

Login with any email + password. Choose **Staff/Admin** or **Vice President** role.

### 4. Run in Production Mode

Set `VITE_DEMO_MODE=false` in `.env` and configure Firebase + Cloudinary.

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (e.g., `ovpret-dts`)
3. Enable **Authentication** → Email/Password sign-in
4. Enable **Firestore Database** (start in test mode)
5. Copy your web app config to `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=ovpret-dts.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ovpret-dts
VITE_FIREBASE_STORAGE_BUCKET=ovpret-dts.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

6. Deploy Firestore rules:

```bash
npm install -g firebase-tools
firebase login
firebase use --add  # select your project
firebase deploy --only firestore:rules
```

---

## Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload → Add Upload Preset**
3. Set preset to **Unsigned** mode
4. Copy your credentials to `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

---

## User Roles

| Role | Access |
|------|--------|
| **Staff** | Submit documents, track own documents, view analytics, view logs |
| **Admin** | Same as Staff + view all documents |
| **Vice President** | Review all documents, approve/reject/request revision, view analytics, view logs |

---

## Project Structure

```
ovpret-dts/
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Sidebar + topbar shell
│   │   ├── StatusChip.tsx          # Document status badge
│   │   ├── SubmitDocumentModal.tsx # Process 1.0 — submit form
│   │   └── DocumentDetailModal.tsx # Process 2.0/3.0/4.0 — view + VP actions
│   ├── pages/
│   │   ├── LoginPage.tsx           # Authentication
│   │   ├── DashboardPage.tsx       # Overview + document list
│   │   ├── SubmitPage.tsx          # Staff document submission
│   │   ├── ReviewPage.tsx          # VP review queue (Process 3.0 + 4.0)
│   │   ├── AnalyticsPage.tsx       # Process 5.0 — charts + stats
│   │   └── LogsPage.tsx            # Transaction logs + history
│   ├── hooks/
│   │   ├── useAuth.ts              # Authentication state
│   │   └── useDocuments.ts         # Document data subscription
│   ├── services/
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── cloudinary.ts           # File upload service
│   │   ├── documents.ts            # Firestore CRUD operations
│   │   └── demo.ts                 # Mock data for demo mode
│   ├── theme/
│   │   └── index.ts                # MUI theme (navy/gold)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Root component + routing
│   └── main.tsx                    # Entry point
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Firestore composite indexes
├── firebase.json                   # Firebase hosting config
├── .env.example                    # Environment template
├── .env                            # Your local environment (gitignored)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

---

## Document Status Flow

```
Submitted
    └── Pending
          ├── Under Review
          │     ├── Approved
          │     ├── Rejected
          │     └── Request For Revision → (resubmit)
          ├── Approved
          └── Rejected
```

---

## Firestore Collections

### `documents`
| Field | Type | Description |
|-------|------|-------------|
| retId | string | Auto-generated RET ID (e.g., RET-A1B2C3) |
| title | string | Document title |
| type | string | Document type (Research, Extension, etc.) |
| department | string | Submitting department/office |
| remarks | string | Submitter's notes |
| fileUrl | string? | Cloudinary file URL |
| fileName | string? | Original filename |
| status | string | Current document status |
| submittedBy | string | Submitter's display name |
| submittedByEmail | string | Submitter's email |
| feedback | string | VP feedback/comments |
| history | array | Array of status change events |
| createdAt | timestamp | Submission timestamp |
| updatedAt | timestamp | Last update timestamp |

### `logs`
| Field | Type | Description |
|-------|------|-------------|
| action | string | Action description |
| docId | string | RET ID of the document |
| docTitle | string | Document title |
| by | string | User who performed the action |
| byEmail | string | User's email |
| role | string | User's role |
| at | timestamp | Action timestamp |
