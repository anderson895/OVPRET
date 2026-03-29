// ── User roles ──────────────────────────────────────────────
// admin  : one account, manages staff, sees everything
// staff  : many accounts (created by admin), submit own docs
// vp     : one account, reviews & decides on all documents
export type UserRole = 'admin' | 'staff' | 'vp'

export interface AppUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  department?: string
  createdAt?: any
  isActive?: boolean
}

// ── Document types ───────────────────────────────────────────
export type DocStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Request For Revision'

export type DocType =
  | 'Research'
  | 'Extension'
  | 'Technology'
  | 'Financial'
  | 'Proposal'
  | 'Administrative'
  | 'MOA'
  | 'Other'

export interface HistoryEntry {
  action: string
  by: string
  byEmail: string
  at: any          // Firestore Timestamp or Date
  note?: string
}

export interface RETDocument {
  id: string
  retId: string
  title: string
  type: string
  department: string
  remarks: string
  fileUrl: string | null
  fileName: string | null
  status: DocStatus
  submittedBy: string
  submittedByEmail: string
  submittedByUid: string
  feedback: string
  history: HistoryEntry[]
  createdAt: any
  updatedAt: any
  emailSentToVP?: boolean
  emailSentToStaff?: boolean
}

// ── Transaction log ──────────────────────────────────────────
export interface TransactionLog {
  id: string
  action: string
  docId: string
  docTitle: string
  by: string
  byEmail: string
  role: string
  at: any
  details?: string
}

// ── Staff account (managed by admin) ────────────────────────
export interface StaffAccount {
  uid: string
  email: string
  displayName: string
  department: string
  isActive: boolean
  createdAt: any
  createdBy: string
}
