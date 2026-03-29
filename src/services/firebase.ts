import { initializeApp, getApps, deleteApp, type FirebaseApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, getDocs, doc,
  updateDoc, onSnapshot, query, orderBy, serverTimestamp,
  getDoc, where, setDoc, deleteDoc,
} from 'firebase/firestore'
import {
  getAuth, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile,
  updatePassword, EmailAuthProvider, reauthenticateWithCredential,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp
let db: ReturnType<typeof getFirestore>
let auth: ReturnType<typeof getAuth>

export function initFirebase() {
  if (getApps().length === 0) {
    app  = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db   = getFirestore(app)
  auth = getAuth(app)
}

/**
 * Creates a Firebase Auth user using a temporary secondary app instance.
 * The primary app's auth state (admin session) is never touched.
 * Returns the new user's UID.
 */
export async function createAuthUserSafely(email: string, password: string): Promise<string> {
  const tmpName = `tmp-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, tmpName)
  const secondaryAuth = getAuth(secondaryApp)
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    return cred.user.uid
  } finally {
    // Always clean up — sign out then delete the temporary app
    await signOut(secondaryAuth).catch(() => {})
    await deleteApp(secondaryApp).catch(() => {})
  }
}

export {
  db, auth,
  collection, addDoc, getDocs, doc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp, getDoc, where, setDoc, deleteDoc,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
  updatePassword, EmailAuthProvider, reauthenticateWithCredential,
}
