import type { AppUser } from '../types'
import {
  auth, db, signInWithEmailAndPassword, signOut,
  doc, getDoc, setDoc, serverTimestamp, createAuthUserSafely,
  createUserWithEmailAndPassword,
} from './firebase'

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const snap = await getDoc(doc(db, 'users', cred.user.uid))
  if (!snap.exists()) throw new Error('User profile not found. Contact your administrator.')
  const data = snap.data()
  if (data.status === 'pending')  throw new Error('Your account is pending approval. Please wait for the administrator to approve your request.')
  if (data.status === 'rejected') throw new Error('Your account registration was rejected. Contact the administrator.')
  if (!data.isActive)             throw new Error('Your account has been deactivated. Contact the administrator.')
  return {
    uid:         cred.user.uid,
    email:       cred.user.email!,
    displayName: data.displayName || cred.user.displayName || email,
    role:        data.role,
    department:  data.department,
  }
}

export async function registerUser(data: {
  email: string; password: string; displayName: string; department: string
}): Promise<void> {
  // FIX: Use primary auth so request.auth is not null when writing to Firestore.
  // createAuthUserSafely (secondary app) signs out immediately — primary auth stays null,
  // which causes "Missing or insufficient permissions" on the setDoc below.
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
  const uid  = cred.user.uid

  await setDoc(doc(db, 'users', uid), {
    email:       data.email,
    displayName: data.displayName,
    department:  data.department,
    role:        'staff',
    isActive:    false,
    status:      'pending',
    createdAt:   serverTimestamp(),
    createdBy:   'self-registered',
  })

  // Sign out immediately — account requires admin approval before login
  await signOut(auth)
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}
