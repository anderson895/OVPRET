import type { RETDocument, TransactionLog, StaffAccount, AppUser } from '../types'

function daysAgo(n: number): Date { const d = new Date(); d.setDate(d.getDate() - n); return d }

// ── Demo users ───────────────────────────────────────────────
export const DEMO_USERS: Record<string, AppUser> = {
  'admin@ovpret.edu.ph':  { uid: 'uid_admin', email: 'admin@ovpret.edu.ph',  displayName: 'System Admin',           role: 'admin', department: 'OVPRET Admin Office' },
  'staff1@ovpret.edu.ph': { uid: 'uid_s1',    email: 'staff1@ovpret.edu.ph', displayName: 'Maria Santos',           role: 'staff', department: 'Research & Development Office' },
  'staff2@ovpret.edu.ph': { uid: 'uid_s2',    email: 'staff2@ovpret.edu.ph', displayName: 'Juan Dela Cruz',         role: 'staff', department: 'Community Extension Services' },
  'staff3@ovpret.edu.ph': { uid: 'uid_s3',    email: 'staff3@ovpret.edu.ph', displayName: 'Ana Reyes',              role: 'staff', department: 'Technology Transfer Office' },
  'vp@ovpret.edu.ph':     { uid: 'uid_vp',    email: 'vp@ovpret.edu.ph',     displayName: 'OVPRET Vice President',  role: 'vp' },
}

// ── Demo staff accounts (managed by admin) ───────────────────
export let DEMO_STAFF: StaffAccount[] = [
  { uid: 'uid_s1', email: 'staff1@ovpret.edu.ph', displayName: 'Maria Santos',   department: 'Research & Development Office',       isActive: true, createdAt: daysAgo(60), createdBy: 'admin@ovpret.edu.ph' },
  { uid: 'uid_s2', email: 'staff2@ovpret.edu.ph', displayName: 'Juan Dela Cruz', department: 'Community Extension Services',          isActive: true, createdAt: daysAgo(45), createdBy: 'admin@ovpret.edu.ph' },
  { uid: 'uid_s3', email: 'staff3@ovpret.edu.ph', displayName: 'Ana Reyes',      department: 'Technology Transfer Office',            isActive: false, createdAt: daysAgo(30), createdBy: 'admin@ovpret.edu.ph' },
]

// ── Demo documents ───────────────────────────────────────────
export let DEMO_DOCS: RETDocument[] = [
  {
    id: 'doc1', retId: 'RET-A1B2C3', title: 'Q1 Budget Request FY 2024',
    type: 'Financial', department: 'Finance Office',
    remarks: 'Urgent — needed for Q1 operations.',
    fileUrl: null, fileName: null,
    status: 'Approved',
    submittedBy: 'Maria Santos', submittedByEmail: 'staff1@ovpret.edu.ph', submittedByUid: 'uid_s1',
    feedback: 'Budget approved as submitted. Proceed with disbursement.',
    history: [
      { action: 'Submitted',    by: 'Maria Santos',          byEmail: 'staff1@ovpret.edu.ph', at: daysAgo(20), note: 'Urgent — needed for Q1 operations.' },
      { action: 'Under Review', by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     at: daysAgo(18), note: '' },
      { action: 'Approved',     by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     at: daysAgo(15), note: 'Budget approved as submitted. Proceed with disbursement.' },
    ],
    createdAt: daysAgo(20), updatedAt: daysAgo(15), emailSentToVP: true, emailSentToStaff: true,
  },
  {
    id: 'doc2', retId: 'RET-D4E5F6', title: 'Research Grant Proposal — AI in Agriculture',
    type: 'Research', department: 'Research & Development Office',
    remarks: 'Submission for DOST-PCHRD grant cycle.',
    fileUrl: null, fileName: null,
    status: 'Under Review',
    submittedBy: 'Juan Dela Cruz', submittedByEmail: 'staff2@ovpret.edu.ph', submittedByUid: 'uid_s2',
    feedback: '',
    history: [
      { action: 'Submitted',    by: 'Juan Dela Cruz',        byEmail: 'staff2@ovpret.edu.ph', at: daysAgo(10), note: 'Submission for DOST-PCHRD grant cycle.' },
      { action: 'Under Review', by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     at: daysAgo(8),  note: '' },
    ],
    createdAt: daysAgo(10), updatedAt: daysAgo(8), emailSentToVP: true, emailSentToStaff: false,
  },
  {
    id: 'doc3', retId: 'RET-G7H8I9', title: 'Community Extension Program Report — Barangay Dela Paz',
    type: 'Extension', department: 'Community Extension Services',
    remarks: '',
    fileUrl: null, fileName: null,
    status: 'Request For Revision',
    submittedBy: 'Ana Reyes', submittedByEmail: 'staff3@ovpret.edu.ph', submittedByUid: 'uid_s3',
    feedback: 'Please add complete beneficiary data and geo-tagged photos per CHED requirement.',
    history: [
      { action: 'Submitted',            by: 'Ana Reyes',              byEmail: 'staff3@ovpret.edu.ph', at: daysAgo(12), note: '' },
      { action: 'Request For Revision', by: 'OVPRET Vice President',  byEmail: 'vp@ovpret.edu.ph',     at: daysAgo(9),  note: 'Please add complete beneficiary data and geo-tagged photos per CHED requirement.' },
    ],
    createdAt: daysAgo(12), updatedAt: daysAgo(9), emailSentToVP: true, emailSentToStaff: true,
  },
  {
    id: 'doc4', retId: 'RET-J1K2L3', title: 'Technology Transfer MOU — PhilRice Partnership',
    type: 'Technology', department: 'Technology Transfer Office',
    remarks: 'For signature of both parties.',
    fileUrl: null, fileName: null,
    status: 'Pending',
    submittedBy: 'Maria Santos', submittedByEmail: 'staff1@ovpret.edu.ph', submittedByUid: 'uid_s1',
    feedback: '',
    history: [
      { action: 'Submitted', by: 'Maria Santos', byEmail: 'staff1@ovpret.edu.ph', at: daysAgo(3), note: 'For signature of both parties.' },
    ],
    createdAt: daysAgo(3), updatedAt: daysAgo(3), emailSentToVP: true, emailSentToStaff: false,
  },
  {
    id: 'doc5', retId: 'RET-M5N6O7', title: 'Annual Research Output Report 2023',
    type: 'Research', department: 'Research & Development Office',
    remarks: 'Compiled outputs for CHED monitoring.',
    fileUrl: null, fileName: null,
    status: 'Rejected',
    submittedBy: 'Juan Dela Cruz', submittedByEmail: 'staff2@ovpret.edu.ph', submittedByUid: 'uid_s2',
    feedback: 'Incomplete — missing outputs from Engineering and Agriculture departments. Please recompile.',
    history: [
      { action: 'Submitted', by: 'Juan Dela Cruz',        byEmail: 'staff2@ovpret.edu.ph', at: daysAgo(30), note: 'Compiled outputs for CHED monitoring.' },
      { action: 'Rejected',  by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     at: daysAgo(25), note: 'Incomplete — missing outputs from Engineering and Agriculture departments.' },
    ],
    createdAt: daysAgo(30), updatedAt: daysAgo(25), emailSentToVP: true, emailSentToStaff: true,
  },
]

export let DEMO_LOGS: TransactionLog[] = [
  { id: 'l1', action: 'Document Submitted',     docId: 'RET-A1B2C3', docTitle: 'Q1 Budget Request FY 2024',              by: 'Maria Santos',          byEmail: 'staff1@ovpret.edu.ph', role: 'Staff',         at: daysAgo(20) },
  { id: 'l2', action: 'Document Approved',      docId: 'RET-A1B2C3', docTitle: 'Q1 Budget Request FY 2024',              by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     role: 'Vice President', at: daysAgo(15) },
  { id: 'l3', action: 'Document Submitted',     docId: 'RET-D4E5F6', docTitle: 'Research Grant Proposal',                by: 'Juan Dela Cruz',        byEmail: 'staff2@ovpret.edu.ph', role: 'Staff',         at: daysAgo(10) },
  { id: 'l4', action: 'Document Submitted',     docId: 'RET-G7H8I9', docTitle: 'Community Extension Program Report',     by: 'Ana Reyes',             byEmail: 'staff3@ovpret.edu.ph', role: 'Staff',         at: daysAgo(12) },
  { id: 'l5', action: 'Request For Revision',   docId: 'RET-G7H8I9', docTitle: 'Community Extension Program Report',     by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     role: 'Vice President', at: daysAgo(9)  },
  { id: 'l6', action: 'Document Submitted',     docId: 'RET-J1K2L3', docTitle: 'Technology Transfer MOU',                by: 'Maria Santos',          byEmail: 'staff1@ovpret.edu.ph', role: 'Staff',         at: daysAgo(3)  },
  { id: 'l7', action: 'Document Submitted',     docId: 'RET-M5N6O7', docTitle: 'Annual Research Output Report 2023',     by: 'Juan Dela Cruz',        byEmail: 'staff2@ovpret.edu.ph', role: 'Staff',         at: daysAgo(30) },
  { id: 'l8', action: 'Document Rejected',      docId: 'RET-M5N6O7', docTitle: 'Annual Research Output Report 2023',     by: 'OVPRET Vice President', byEmail: 'vp@ovpret.edu.ph',     role: 'Vice President', at: daysAgo(25) },
]

let _dc = DEMO_DOCS.length + 1
let _lc = DEMO_LOGS.length + 1

export function genRetId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'RET-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export function demoAddDoc(d: Omit<RETDocument, 'id'>): RETDocument {
  const doc = { ...d, id: `doc_${++_dc}` }
  DEMO_DOCS.unshift(doc)
  return doc
}

export function demoUpdateDoc(id: string, patch: Partial<RETDocument>): void {
  const i = DEMO_DOCS.findIndex((d) => d.id === id)
  if (i !== -1) DEMO_DOCS[i] = { ...DEMO_DOCS[i], ...patch, updatedAt: new Date() }
}

export function demoAddLog(l: Omit<TransactionLog, 'id'>): void {
  DEMO_LOGS.unshift({ ...l, id: `l_${++_lc}` })
}

export function demoGetDocs(): RETDocument[] { return [...DEMO_DOCS] }
export function demoGetLogs(): TransactionLog[] { return [...DEMO_LOGS] }
export function demoGetStaff(): StaffAccount[] { return [...DEMO_STAFF] }

export function demoAddStaff(s: StaffAccount): void { DEMO_STAFF.unshift(s) }
export function demoUpdateStaff(uid: string, patch: Partial<StaffAccount>): void {
  const i = DEMO_STAFF.findIndex((s) => s.uid === uid)
  if (i !== -1) DEMO_STAFF[i] = { ...DEMO_STAFF[i], ...patch }
}
export function demoDeleteStaff(uid: string): void {
  DEMO_STAFF = DEMO_STAFF.filter((s) => s.uid !== uid)
}
