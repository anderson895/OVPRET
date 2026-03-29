import type { AppUser } from '../types'
import {
  auth, db, signInWithEmailAndPassword, signOut,
  doc, getDoc,
} from './firebase'

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  // Fetch role + profile from Firestore users collection
  const snap = await getDoc(doc(db, 'users', cred.user.uid))
  if (!snap.exists()) throw new Error('User profile not found. Contact your administrator.')
  const data = snap.data()
  if (!data.isActive) throw new Error('Your account has been deactivated. Contact the administrator.')
  return {
    uid:         cred.user.uid,
    email:       cred.user.email!,
    displayName: data.displayName || cred.user.displayName || email,
    role:        data.role,
    department:  data.department,
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}
