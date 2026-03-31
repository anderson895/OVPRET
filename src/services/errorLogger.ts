// ── Error Logging & Handling Service ──────────────────────────
// Required: error logging and error handling throughout the system

import { db, collection, addDoc, serverTimestamp } from './firebase'

export interface ErrorLog {
  id?: string
  message: string
  stack?: string
  component?: string
  action?: string
  userId?: string
  userEmail?: string
  userRole?: string
  timestamp?: any
  severity: 'error' | 'warning' | 'info'
  metadata?: Record<string, any>
}

// ── In-memory error buffer (for UI display) ──────────────────
const ERROR_BUFFER_MAX = 50
const errorBuffer: ErrorLog[] = []
const listeners: Set<(errors: ErrorLog[]) => void> = new Set()

function notifyListeners() {
  listeners.forEach((cb) => cb([...errorBuffer]))
}

export function subscribeErrors(cb: (errors: ErrorLog[]) => void): () => void {
  listeners.add(cb)
  cb([...errorBuffer])
  return () => listeners.delete(cb)
}

// ── Core logging function ────────────────────────────────────
export async function logError(params: {
  message: string
  error?: any
  component?: string
  action?: string
  userId?: string
  userEmail?: string
  userRole?: string
  severity?: 'error' | 'warning' | 'info'
  metadata?: Record<string, any>
}): Promise<void> {
  const entry: ErrorLog = {
    message: params.message,
    stack: params.error?.stack || params.error?.toString() || undefined,
    component: params.component,
    action: params.action,
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: params.userRole,
    severity: params.severity || 'error',
    metadata: params.metadata,
    timestamp: new Date(),
  }

  // Console output
  const tag = `[${entry.severity.toUpperCase()}]`
  const ctx = entry.component ? ` [${entry.component}]` : ''
  if (entry.severity === 'error') {
    console.error(`${tag}${ctx} ${entry.message}`, params.error || '')
  } else if (entry.severity === 'warning') {
    console.warn(`${tag}${ctx} ${entry.message}`, params.error || '')
  } else {
    console.info(`${tag}${ctx} ${entry.message}`)
  }

  // Push to in-memory buffer
  errorBuffer.unshift(entry)
  if (errorBuffer.length > ERROR_BUFFER_MAX) errorBuffer.pop()
  notifyListeners()

  // Persist to Firestore (best-effort — don't throw on failure)
  try {
    await addDoc(collection(db, 'error_logs'), {
      ...entry,
      stack: entry.stack || null,
      timestamp: serverTimestamp(),
    })
  } catch (firestoreErr) {
    console.error('[ErrorLogger] Failed to persist error to Firestore:', firestoreErr)
  }
}

// ── Convenience wrappers ─────────────────────────────────────
export function logWarning(message: string, opts?: Partial<Omit<Parameters<typeof logError>[0], 'message' | 'severity'>>) {
  return logError({ ...opts, message, severity: 'warning' })
}

export function logInfo(message: string, opts?: Partial<Omit<Parameters<typeof logError>[0], 'message' | 'severity'>>) {
  return logError({ ...opts, message, severity: 'info' })
}

// ── Safe async wrapper with error handling ───────────────────
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: { component: string; action: string; userId?: string; userEmail?: string; userRole?: string }
): Promise<T> {
  try {
    return await fn()
  } catch (err: any) {
    await logError({
      message: err?.message || 'An unexpected error occurred',
      error: err,
      ...context,
    })
    throw err // Re-throw so callers can still handle it
  }
}

// ── Global window error handler ──────────────────────────────
export function initGlobalErrorHandlers(): void {
  window.addEventListener('error', (event) => {
    logError({
      message: event.message || 'Uncaught error',
      error: event.error,
      component: 'Global',
      action: 'uncaught_error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logError({
      message: event.reason?.message || 'Unhandled promise rejection',
      error: event.reason,
      component: 'Global',
      action: 'unhandled_rejection',
    })
  })

  console.info('[ErrorLogger] Global error handlers initialized.')
}
