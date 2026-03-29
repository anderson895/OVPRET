import type { RETDocument, TransactionLog, DocStatus } from '../types';

function ts(daysAgo = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export let mockDocuments: RETDocument[] = [
  {
    id: 'doc1',
    retId: 'RET-A1B2C3',
    title: 'Q1 Budget Request FY 2024',
    type: 'Financial',
    department: 'Finance Office',
    remarks: 'Urgent — needed for Q1 operations.',
    fileUrl: null,
    fileName: null,
    status: 'Approved',
    submittedBy: 'Maria Santos',
    submittedByEmail: 'maria@ovpret.edu.ph',
    feedback: 'Budget approved as submitted. Proceed with disbursement.',
    history: [
      { action: 'Submitted', by: 'Maria Santos', at: ts(20), note: 'Urgent — needed for Q1 operations.' },
      { action: 'Under Review', by: 'OVPRET Vice President', at: ts(18), note: '' },
      { action: 'Approved', by: 'OVPRET Vice President', at: ts(15), note: 'Budget approved as submitted. Proceed with disbursement.' },
    ],
    createdAt: ts(20),
    updatedAt: ts(15),
  },
  {
    id: 'doc2',
    retId: 'RET-D4E5F6',
    title: 'Research Grant Proposal — AI in Agriculture',
    type: 'Research',
    department: 'Research & Development Office',
    remarks: 'Submission for DOST-PCHRD grant cycle.',
    fileUrl: null,
    fileName: null,
    status: 'Under Review',
    submittedBy: 'Juan Dela Cruz',
    submittedByEmail: 'juan@ovpret.edu.ph',
    feedback: '',
    history: [
      { action: 'Submitted', by: 'Juan Dela Cruz', at: ts(10), note: 'Submission for DOST-PCHRD grant cycle.' },
      { action: 'Under Review', by: 'OVPRET Vice President', at: ts(8), note: '' },
    ],
    createdAt: ts(10),
    updatedAt: ts(8),
  },
  {
    id: 'doc3',
    retId: 'RET-G7H8I9',
    title: 'Community Extension Program Report — Barangay Dela Paz',
    type: 'Extension',
    department: 'Community Extension Services',
    remarks: '',
    fileUrl: null,
    fileName: null,
    status: 'Request For Revision',
    submittedBy: 'Ana Reyes',
    submittedByEmail: 'ana@ovpret.edu.ph',
    feedback: 'Please add complete beneficiary data and geo-tagged photos per CHED requirement.',
    history: [
      { action: 'Submitted', by: 'Ana Reyes', at: ts(12), note: '' },
      { action: 'Request For Revision', by: 'OVPRET Vice President', at: ts(9), note: 'Please add complete beneficiary data and geo-tagged photos per CHED requirement.' },
    ],
    createdAt: ts(12),
    updatedAt: ts(9),
  },
  {
    id: 'doc4',
    retId: 'RET-J1K2L3',
    title: 'Technology Transfer MOU — PhilRice Partnership',
    type: 'Technology',
    department: 'Technology Transfer & Business Development',
    remarks: 'For signature of both parties.',
    fileUrl: null,
    fileName: null,
    status: 'Pending',
    submittedBy: 'Carlos Mendoza',
    submittedByEmail: 'carlos@ovpret.edu.ph',
    feedback: '',
    history: [
      { action: 'Submitted', by: 'Carlos Mendoza', at: ts(3), note: 'For signature of both parties.' },
    ],
    createdAt: ts(3),
    updatedAt: ts(3),
  },
  {
    id: 'doc5',
    retId: 'RET-M5N6O7',
    title: 'Annual Research Output Report 2023',
    type: 'Research',
    department: 'Research & Development Office',
    remarks: 'Compiled outputs for CHED monitoring.',
    fileUrl: null,
    fileName: null,
    status: 'Rejected',
    submittedBy: 'Maria Santos',
    submittedByEmail: 'maria@ovpret.edu.ph',
    feedback: 'Incomplete — missing outputs from Engineering and Agriculture departments. Please recompile.',
    history: [
      { action: 'Submitted', by: 'Maria Santos', at: ts(30), note: 'Compiled outputs for CHED monitoring.' },
      { action: 'Rejected', by: 'OVPRET Vice President', at: ts(25), note: 'Incomplete — missing outputs from Engineering and Agriculture departments. Please recompile.' },
    ],
    createdAt: ts(30),
    updatedAt: ts(25),
  },
];

export let mockLogs: TransactionLog[] = [
  { id: 'l1', action: 'Document Submitted', docId: 'RET-A1B2C3', docTitle: 'Q1 Budget Request FY 2024', by: 'Maria Santos', role: 'Staff', at: ts(20) },
  { id: 'l2', action: 'Document Under Review', docId: 'RET-A1B2C3', docTitle: 'Q1 Budget Request FY 2024', by: 'OVPRET Vice President', role: 'Vice President', at: ts(18) },
  { id: 'l3', action: 'Document Approved', docId: 'RET-A1B2C3', docTitle: 'Q1 Budget Request FY 2024', by: 'OVPRET Vice President', role: 'Vice President', at: ts(15) },
  { id: 'l4', action: 'Document Submitted', docId: 'RET-D4E5F6', docTitle: 'Research Grant Proposal — AI in Agriculture', by: 'Juan Dela Cruz', role: 'Staff', at: ts(10) },
  { id: 'l5', action: 'Document Under Review', docId: 'RET-D4E5F6', docTitle: 'Research Grant Proposal — AI in Agriculture', by: 'OVPRET Vice President', role: 'Vice President', at: ts(8) },
  { id: 'l6', action: 'Document Submitted', docId: 'RET-G7H8I9', docTitle: 'Community Extension Program Report', by: 'Ana Reyes', role: 'Staff', at: ts(12) },
  { id: 'l7', action: 'Document Requested Revision', docId: 'RET-G7H8I9', docTitle: 'Community Extension Program Report', by: 'OVPRET Vice President', role: 'Vice President', at: ts(9) },
  { id: 'l8', action: 'Document Submitted', docId: 'RET-J1K2L3', docTitle: 'Technology Transfer MOU — PhilRice Partnership', by: 'Carlos Mendoza', role: 'Staff', at: ts(3) },
];

let docCounter = mockDocuments.length + 1;
let logCounter = mockLogs.length + 1;

export function generateRetId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'RET-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function demoAddDocument(doc: Omit<RETDocument, 'id'>): RETDocument {
  const newDoc: RETDocument = { ...doc, id: `doc_${++docCounter}` };
  mockDocuments.push(newDoc);
  return newDoc;
}

export function demoUpdateDocument(id: string, updates: Partial<RETDocument>): void {
  const idx = mockDocuments.findIndex((d) => d.id === id);
  if (idx !== -1) {
    mockDocuments[idx] = { ...mockDocuments[idx], ...updates, updatedAt: new Date() };
  }
}

export function demoAddLog(log: Omit<TransactionLog, 'id'>): void {
  mockLogs.push({ ...log, id: `l_${++logCounter}` });
}

export function demoGetDocuments(): RETDocument[] {
  return [...mockDocuments].sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const db2 = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return db2.getTime() - da.getTime();
  });
}

export function demoGetLogs(): TransactionLog[] {
  return [...mockLogs].sort((a, b) => {
    const da = a.at instanceof Date ? a.at : new Date(a.at);
    const db2 = b.at instanceof Date ? b.at : new Date(b.at);
    return db2.getTime() - da.getTime();
  });
}
