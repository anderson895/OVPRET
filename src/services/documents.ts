import type { RETDocument, TransactionLog, DocStatus } from '../types';
import { db, auth, collection, addDoc, getDocs, doc, updateDoc, onSnapshot, serverTimestamp, query, orderBy } from './firebase';
import { demoAddDocument, demoUpdateDocument, demoAddLog, demoGetDocuments, demoGetLogs, generateRetId } from './demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

// ---- DOCUMENTS ----

export async function submitDocument(
  data: Omit<RETDocument, 'id' | 'retId' | 'status' | 'feedback' | 'history' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const retId = generateRetId();
  const docData: Omit<RETDocument, 'id'> = {
    ...data,
    retId,
    status: 'Pending',
    feedback: '',
    history: [{ action: 'Submitted', by: data.submittedBy, byEmail: data.submittedByEmail, at: new Date(), note: data.remarks }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (DEMO) {
    await new Promise((r) => setTimeout(r, 800));
    demoAddDocument(docData);
    demoAddLog({ action: 'Document Submitted', docId: retId, docTitle: data.title, by: data.submittedBy, byEmail: data.submittedByEmail, role: 'Staff', at: new Date() });
    return retId;
  }

  const ref = await addDoc(collection(db!, 'documents'), {
    ...docData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    history: [{ action: 'Submitted', by: data.submittedBy, byEmail: data.submittedByEmail, at: new Date().toISOString(), note: data.remarks }],
  });
  await addLog({ action: 'Document Submitted', docId: retId, docTitle: data.title, by: data.submittedBy, byEmail: data.submittedByEmail, role: 'Staff' });
  return retId;
}

export async function updateDocumentStatus(
  docId: string,
  retId: string,
  docTitle: string,
  status: DocStatus,
  feedback: string,
  currentHistory: any[],
  byName: string,
  byEmail: string
): Promise<void> {
  const entry = { action: `${status}`, by: byName, byEmail, at: new Date().toISOString(), note: feedback };

  if (DEMO) {
    await new Promise((r) => setTimeout(r, 700));
    const existing = currentHistory || [];
    demoUpdateDocument(docId, { status, feedback, history: [...existing, { ...entry, at: new Date() }] });
    demoAddLog({ action: `Document ${status}`, docId: retId, docTitle, by: byName, byEmail, role: 'Vice President', at: new Date() });
    return;
  }

  await updateDoc(doc(db!, 'documents', docId), {
    status,
    feedback,
    updatedAt: serverTimestamp(),
    history: [...currentHistory, entry],
  });
  await addLog({ action: `Document ${status}`, docId: retId, docTitle, by: byName, byEmail, role: 'Vice President' });
}

export function listenDocuments(callback: (docs: RETDocument[]) => void): () => void {
  if (DEMO) {
    callback(demoGetDocuments());
    return () => {};
  }
  const q = query(collection(db!, 'documents'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RETDocument));
    callback(docs);
  });
}

export function listenLogs(callback: (logs: TransactionLog[]) => void): () => void {
  if (DEMO) {
    callback(demoGetLogs());
    return () => {};
  }
  const q = query(collection(db!, 'logs'), orderBy('at', 'desc'));
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TransactionLog));
    callback(logs);
  });
}

// ---- LOGS ----

async function addLog(data: Omit<TransactionLog, 'id' | 'at'>): Promise<void> {
  if (DEMO) { demoAddLog({ ...data, at: new Date() }); return; }
  await addDoc(collection(db!, 'logs'), { ...data, at: serverTimestamp() });
}

// ---- AUTH ----

export async function loginUser(email: string, password: string, role: string): Promise<{ uid: string; email: string; displayName: string; role: string }> {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 700));
    return { uid: `demo_${Date.now()}`, email, displayName: role === 'vp' ? 'OVPRET Vice President' : 'Staff / Admin User', role };
  }
  const { signInWithEmailAndPassword, auth: fbAuth } = await import('./firebase');
  const cred = await signInWithEmailAndPassword(fbAuth!, email, password);
  // Role stored in Firestore users collection or custom claims
  return { uid: cred.user.uid, email: cred.user.email!, displayName: cred.user.displayName || email, role };
}

export async function logoutUser(): Promise<void> {
  if (DEMO) return;
  const { signOut, auth: fbAuth } = await import('./firebase');
  await signOut(fbAuth!);
}
