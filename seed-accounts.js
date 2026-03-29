// ─────────────────────────────────────────────────────────────
//  OVPRET DTS — Firebase Account Seeder
//  Run once to create Auth users + Firestore profiles.
//
//  Requirements:
//    node >= 18
//    npm install firebase-admin
//
//  Usage:
//    node seed-accounts.js
// ─────────────────────────────────────────────────────────────

const admin = require('firebase-admin')
const serviceAccount = require('./1774764236790_ovpret-firebase-adminsdk-fbsvc-60484c1a83.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const auth = admin.auth()
const db   = admin.firestore()

// ── Accounts to create ────────────────────────────────────────
const accounts = [
  {
    email:       'admin@gmail.com',
    password:    'admin@gmail.com',
    displayName: 'System Admin',
    role:        'admin',
    department:  'OVPRET Admin Office',
  },
  {
    email:       'ovretvp@gmail.com',
    password:    'ovretvp@gmail.com',
    displayName: 'OVPRET Vice President',
    role:        'vp',
    department:  null,
  },
  {
    email:       'staff@gmail.com',
    password:    'staff@gmail.com',
    displayName: 'Staff User',
    role:        'staff',
    department:  'Research & Development Office',
  },
]

// ── Seed function ─────────────────────────────────────────────
async function seed() {
  console.log('Starting account seeder...\n')

  for (const account of accounts) {
    try {
      // 1. Create Firebase Auth user
      const userRecord = await auth.createUser({
        email:        account.email,
        password:     account.password,
        displayName:  account.displayName,
      })

      console.log(`✓ Auth user created: ${account.email} (uid: ${userRecord.uid})`)

      // 2. Write Firestore profile under /users/{uid}
      await db.collection('users').doc(userRecord.uid).set({
        email:       account.email,
        displayName: account.displayName,
        role:        account.role,
        department:  account.department || null,
        isActive:    true,
        createdAt:   admin.firestore.FieldValue.serverTimestamp(),
        createdBy:   'seed-script',
      })

      console.log(`✓ Firestore profile written: /users/${userRecord.uid}\n`)

    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        console.warn(`⚠ Skipped (already exists): ${account.email}\n`)
      } else {
        console.error(`✗ Error creating ${account.email}:`, err.message, '\n')
      }
    }
  }

  console.log('Done! All accounts processed.')
  process.exit(0)
}

seed()
