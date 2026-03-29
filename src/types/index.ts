export type UserRole = 'staff' | 'admin' | 'vp';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export type DocStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Request For Revision';

export type DocType =
  | 'Research'
  | 'Extension'
  | 'Technology'
  | 'Financial'
  | 'Administrative'
  | 'MOU/MOA'
  | 'Other';

export interface HistoryEntry {
  action: string;
  by: string;
  byEmail?: string;
  at: Date | any;
  note?: string;
}

export interface RETDocument {
  id: string;
  retId: string;
  title: string;
  type: DocType | string;
  department: string;
  remarks: string;
  fileUrl: string | null;
  fileName?: string | null;
  status: DocStatus;
  submittedBy: string;
  submittedByEmail: string;
  feedback: string;
  history: HistoryEntry[];
  createdAt: Date | any;
  updatedAt?: Date | any;
}

export interface TransactionLog {
  id: string;
  action: string;
  docId: string;
  docTitle: string;
  by: string;
  byEmail?: string;
  role: string;
  at: Date | any;
  details?: string;
}

export interface AnalyticsSummary {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byDepartment: Record<string, number>;
  approvalRate: number;
  avgProcessingDays?: number;
}
