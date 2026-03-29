# OVPRET Web-Based Document Tracking System v2.0

> React + TypeScript · Firebase Firestore · Cloudinary · Brevo Email

---

## User Roles

| Role | Count | Access |
|------|-------|--------|
| **Admin** | 1 | Create/manage staff accounts, view all documents, view analytics & logs |
| **Staff** | Many (created by Admin) | Submit own documents, track own documents, view analytics |
| **VP** | 1 | Review all documents, approve / reject / request revision, view logs |

---

## Brevo Email Notifications

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Staff submits a document | VP | "New Document for Review" with document details |
| VP approves | Staff who submitted | "Document Approved" with VP feedback |
| VP rejects | Staff who submitted | "Document Rejected" with VP feedback |
| VP requests revision | Staff who submitted | "Request For Revision" with VP feedback |

---

## Quick Start (Demo Mode)

```bash
unzip ovpret-dts-v2.zip
cd ovpret-v2
npm install
npm run dev
```

Open http://localhost:5173 and use the quick login buttons:
- **Admin** — manage staff accounts (`Manage Staff` sidebar)
- **Staff (Maria / Juan)** — submit documents
- **VP** — review and decide on documents

> Brevo emails are logged to the browser **console** in demo mode.

---

## Production Setup

### 1. Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login
```

Create a project at [console.firebase.google.com](https://console.firebase.google.com), then:
- Enable **Authentication → Email/Password**
- Enable **Firestore Database**

Copy your web config to `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

Deploy Firestore rules:
```bash
firebase use --add
firebase deploy --only firestore
```

**Create admin, staff, and VP accounts manually in Firebase Console → Authentication**, then add their profiles to Firestore `users` collection:

```json
// users/{uid}
{
  "email": "admin@yourdomain.com",
  "displayName": "System Admin",
  "role": "admin",
  "department": "OVPRET Admin Office",
  "isActive": true,
  "createdAt": "<timestamp>",
  "createdBy": "system"
}
```

Roles: `admin` | `staff` | `vp`

### 2. Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Settings → Upload → Add Upload Preset → set **Unsigned**
3. Add to `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### 3. Brevo (Email Notifications)

1. Create account at [app.brevo.com](https://app.brevo.com)
2. Settings → API Keys → Generate
3. Add to `.env`:

```env
VITE_BREVO_API_KEY=xkeysib-...
VITE_BREVO_SENDER_EMAIL=noreply@yourdomain.com
VITE_BREVO_SENDER_NAME=OVPRET Document System

# VP email — receives submission notifications
VITE_VP_EMAIL=vp@yourdomain.com
VITE_VP_NAME=OVPRET Vice President
```

> **Security note:** The Brevo API key is exposed on the client side. For production, move the `notifyVPNewDocument` and `notifyStaffDecision` calls to a Firebase Cloud Function or a backend API route to keep the key secure.

### 4. Enable Production Mode

```env
VITE_DEMO_MODE=false
```

### 5. Build & Deploy

```bash
npm run build
firebase deploy
```

---

## Project Structure

```
ovpret-v2/
├── src/
│   ├── components/
│   │   ├── Layout.tsx                  ← Sidebar + topbar
│   │   ├── StatusChip.tsx              ← Color-coded status badges
│   │   ├── SubmitDocumentModal.tsx     ← Process 1.0 + Cloudinary upload
│   │   └── DocumentDetailModal.tsx    ← Process 2.0/3.0/4.0 + VP actions + Brevo trigger
│   ├── pages/
│   │   ├── LoginPage.tsx               ← Auth (role-based, quick login in demo)
│   │   ├── DashboardPage.tsx           ← Document list (scoped by role)
│   │   ├── ReviewPage.tsx              ← VP review queue
│   │   ├── AnalyticsPage.tsx           ← Process 5.0 analytics
│   │   ├── LogsPage.tsx                ← Audit logs + document history
│   │   └── AdminStaffPage.tsx          ← Admin: create/manage staff accounts
│   ├── hooks/
│   │   └── useAuth.ts                  ← Shared auth state
│   ├── services/
│   │   ├── firebase.ts                 ← Firebase init
│   │   ├── brevo.ts                    ← Brevo email templates & send logic
│   │   ├── cloudinary.ts               ← File upload
│   │   ├── auth.ts                     ← Login/logout
│   │   ├── documents.ts                ← Firestore CRUD + Brevo triggers
│   │   └── demo.ts                     ← Mock data for demo mode
│   ├── theme/index.ts                  ← MUI dark navy/gold theme
│   ├── types/index.ts                  ← TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── firestore.rules                     ← Role-based security rules
├── firestore.indexes.json
├── firebase.json
├── .env.example
└── README.md
```

---

## Document Status Flow

```
Staff Submits
     │
     ▼
  [Pending] ──────────────────── VP notified via Brevo
     │
     ▼ (VP marks)
 [Under Review]
     │
     ├──► [Approved]             Staff notified via Brevo
     ├──► [Rejected]             Staff notified via Brevo
     └──► [Request For Revision] Staff notified via Brevo
                │
                └──► Staff revises & resubmits
```

---

## Firestore Schema

### `users/{uid}`
| Field | Type | Description |
|-------|------|-------------|
| email | string | User email |
| displayName | string | Full name |
| role | string | `admin` \| `staff` \| `vp` |
| department | string | Department/office |
| isActive | boolean | Account active status |
| createdAt | timestamp | Account creation |
| createdBy | string | Admin email who created |

### `documents/{id}`
| Field | Type | Description |
|-------|------|-------------|
| retId | string | Auto-generated RET ID |
| title | string | Document title |
| type | string | Document type |
| department | string | Submitting office |
| status | string | Current approval status |
| submittedByUid | string | Submitter's Firebase UID |
| submittedBy | string | Submitter display name |
| submittedByEmail | string | Submitter email |
| feedback | string | VP feedback/comments |
| history | array | Timestamped status events |
| fileUrl | string? | Cloudinary file URL |
| emailSentToVP | boolean | Brevo VP notification sent |
| emailSentToStaff | boolean | Brevo staff notification sent |

### `logs/{id}`
| Field | Type | Description |
|-------|------|-------------|
| action | string | Human-readable action |
| docId | string | Related RET ID |
| by | string | Actor display name |
| role | string | Actor role |
| at | timestamp | Action timestamp |
