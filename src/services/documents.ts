import type { RETDocument, TransactionLog, StaffAccount, DocStatus } from '../types'
import {
  db, collection, addDoc, doc, updateDoc,
  onSnapshot, query, orderBy, where, serverTimestamp, setDoc,
  createAuthUserSafely,
} from './firebase'
import { notifyVPNewDocument, notifyStaffDecision } from './brevo'

// ── Helpers ──────────────────────────────────────────────────
function makeId() {
  let id = 'RET-'
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let i = 0; i < 6; i++) id += c[Math.floor(Math.random() * c.length)]
  return id
}

async function addLog(data: Omit<TransactionLog, 'id' | 'at'>): Promise<void> {
  await addDoc(collection(db, 'logs'), { ...data, at: serverTimestamp() })
}

// ── Real-time listeners ───────────────────────────────────────
export function listenDocuments(
  cb: (docs: RETDocument[]) => void,
  opts?: { role?: string; uid?: string }
): () => void {
  // Staff can only read their own documents — enforced both here and in Firestore rules
  const q = opts?.role === 'staff' && opts?.uid
    ? query(collection(db, 'documents'), where('submittedByUid', '==', opts.uid), orderBy('createdAt', 'desc'))
    : query(collection(db, 'documents'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RETDocument))))
}

export function listenLogs(cb: (logs: TransactionLog[]) => void): () => void {
  const q = query(collection(db, 'logs'), orderBy('at', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TransactionLog))))
}

export function listenStaff(cb: (staff: StaffAccount[]) => void): () => void {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(
    snap.docs
      .map((d) => ({ uid: d.id, ...d.data() } as StaffAccount))
      .filter((u: any) => u.role === 'staff')
  ))
}

// ── Admin: approve pending staff account ──────────────────────
export async function approveStaffAccount(uid: string, adminEmail: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    isActive: true,
    status: 'approved',
    approvedBy: adminEmail,
    approvedAt: serverTimestamp(),
  })
}

// ── Admin: reject pending staff account ───────────────────────
export async function rejectStaffAccount(uid: string, adminEmail: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    isActive: false,
    status: 'rejected',
    rejectedBy: adminEmail,
    rejectedAt: serverTimestamp(),
  })
}

// ── Document submission (Process 1.0) ─────────────────────────
export async function submitDocument(data: {
  title: string; type: string; department: string; remarks: string
  fileUrl: string | null; fileName: string | null
  submittedBy: string; submittedByEmail: string; submittedByUid: string
}): Promise<string> {
  const retId = makeId()
  const histEntry = { action: 'Submitted', by: data.submittedBy, byEmail: data.submittedByEmail, at: new Date().toISOString(), note: data.remarks }

  const docData: Omit<RETDocument, 'id'> = {
    ...data, retId,
    status: 'Pending',
    feedback: '',
    history: [{ ...histEntry, at: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
    emailSentToVP: false,
    emailSentToStaff: false,
  }

  const ref = await addDoc(collection(db, 'documents'), {
    ...docData, history: [histEntry],
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  const docId = ref.id

  await addLog({ action: 'Document Submitted', docId: retId, docTitle: data.title, by: data.submittedBy, byEmail: data.submittedByEmail, role: 'Staff' })

  // Send Brevo email to VP
  try {
    await notifyVPNewDocument({
      retId, docTitle: data.title, docType: data.type,
      department: data.department, submittedBy: data.submittedBy,
      submittedByEmail: data.submittedByEmail, remarks: data.remarks,
      appUrl: window.location.origin,
    })
  } catch (e) { console.error('[BREVO] VP notify failed:', e) }

  return retId
}

// ── Document decision (Process 4.0) ───────────────────────────
export async function updateDocumentStatus(params: {
  docId: string; retId: string; docTitle: string
  status: DocStatus; feedback: string
  currentHistory: any[]
  vpName: string; vpEmail: string
  staffName: string; staffEmail: string
}): Promise<void> {
  const { docId, retId, docTitle, status, feedback, currentHistory, vpName, vpEmail, staffName, staffEmail } = params
  const entry = { action: status, by: vpName, byEmail: vpEmail, at: new Date().toISOString(), note: feedback }

  await updateDoc(doc(db, 'documents', docId), {
    status, feedback,
    history: [...currentHistory, entry],
    updatedAt: serverTimestamp(),
    emailSentToStaff: true,
  })

  await addLog({ action: `Document ${status}`, docId: retId, docTitle, by: vpName, byEmail: vpEmail, role: 'Vice President' })

  // Send Brevo email to staff
  if (['Approved', 'Rejected', 'Request For Revision'].includes(status)) {
    try {
      await notifyStaffDecision({
        retId, docTitle, status, feedback,
        staffName, staffEmail,
        decidedByName: vpName,
        appUrl: window.location.origin,
      })
    } catch (e) { console.error('[BREVO] Staff notify failed:', e) }
  }
}

// ── Admin: create staff account ───────────────────────────────
export async function createStaffAccount(data: {
  email: string; password: string; displayName: string
  department: string; adminEmail: string
}): Promise<void> {
  // Create Auth user via secondary app — primary admin session is preserved
  const uid = await createAuthUserSafely(data.email, data.password)
  // Write Firestore profile as admin (primary auth still intact)
  await setDoc(doc(db, 'users', uid), {
    email: data.email, displayName: data.displayName,
    department: data.department, role: 'staff',
    isActive: true, createdAt: serverTimestamp(), createdBy: data.adminEmail,
  })
}

// ── Admin: toggle staff active/inactive ───────────────────────
export async function toggleStaffStatus(uid: string, isActive: boolean): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { isActive })
}

// ── Admin: delete staff account ───────────────────────────────
export async function deleteStaffAccount(uid: string): Promise<void> {
  // Note: Deleting Firebase Auth user requires Admin SDK (Cloud Function).
  // Here we just deactivate in Firestore.
  await updateDoc(doc(db, 'users', uid), { isActive: false })
}

// ── Document edit by staff ────────────────────────────────────
export async function editDocument(params: {
  docId: string; retId: string; docTitle: string
  title: string; type: string; department: string; remarks: string
  fileUrl: string | null; fileName: string | null
  staffName: string; staffEmail: string
  currentHistory: any[]
}): Promise<void> {
  const { docId, retId, docTitle, title, type, department, remarks, fileUrl, fileName, staffName, staffEmail, currentHistory } = params
  const entry = { action: 'Edited', by: staffName, byEmail: staffEmail, at: new Date().toISOString(), note: 'Document details updated by staff.' }

  await updateDoc(doc(db, 'documents', docId), {
    title, type, department, remarks,
    ...(fileUrl !== undefined && fileUrl !== null ? { fileUrl, fileName } : {}),
    history: [...currentHistory, entry],
    updatedAt: serverTimestamp(),
    status: 'Pending',
    feedback: '',
  })

  await addLog({ action: 'Document Edited', docId: retId, docTitle: title, by: staffName, byEmail: staffEmail, role: 'Staff' })
}