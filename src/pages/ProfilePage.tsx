import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import BadgeIcon from '@mui/icons-material/Badge'
import EmailIcon from '@mui/icons-material/Email'
import BusinessIcon from '@mui/icons-material/Business'
import type { AppUser } from '../types'
import { auth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from '../services/firebase'

interface Props { user: AppUser }

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
    <Box sx={{ p: 1, bgcolor: '#1a2535', borderRadius: '8px', color: '#F5A800', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{title}</Typography>
      <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', mt: 0.2 }}>{subtitle}</Typography>
    </Box>
  </Box>
)

export const ProfilePage: React.FC<Props> = ({ user }) => {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const roleLabel = { admin: 'Administrator', staff: 'Staff Member', vp: 'Vice President' }[user.role]
  const roleColor = { admin: '#ce93d8', staff: '#4fc3f7', vp: '#F5A800' }[user.role]

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { setPwMsg({ type: 'error', text: 'Please fill in all password fields.' }); return }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return }
    setPwLoading(true); setPwMsg(null)
    try {
      const firebaseUser = auth.currentUser
      if (!firebaseUser || !firebaseUser.email) throw new Error('Not authenticated.')
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPw)
      await reauthenticateWithCredential(firebaseUser, credential)
      await updatePassword(firebaseUser, newPw)
      setPwMsg({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (e: any) {
      const msg = e.code === 'auth/wrong-password' ? 'Current password is incorrect.' : e.message || 'Failed to update password.'
      setPwMsg({ type: 'error', text: msg })
    } finally { setPwLoading(false) }
  }

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
          Account Settings
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>Profile & Security</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>View your account information and update your security settings.</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ bgcolor: '#0f1e2e', p: '24px', borderRadius: 2, height: '100%' }}>
            <SectionHeader icon={<PersonIcon fontSize="small" />} title="Profile Information" subtitle="Your account details" />

            {/* Avatar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, mb: 3, bgcolor: '#090f1a', borderRadius: 2 }}>
              <Avatar sx={{
                width: 80, height: 80, bgcolor: '#7B1C2E',
                fontSize: '2rem', fontWeight: 800, mb: 1.5,
                border: '3px solid rgba(245,168,0,0.3)',
                boxShadow: '0 4px 20px #1e1218',
              }}>
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{user.displayName}</Typography>
              <Box sx={{ px: 1.5, py: 0.4, borderRadius: '4px', bgcolor: `${roleColor}20`, border: `1px solid ${roleColor}40`, mt: 0.8 }}>
                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: roleColor, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {roleLabel}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#1e2a38', mb: 2.5 }} />

            {/* Info rows */}
            {[
              { icon: <BadgeIcon sx={{ fontSize: 16 }} />, label: 'Full Name', value: user.displayName },
              { icon: <EmailIcon sx={{ fontSize: 16 }} />, label: 'Email Address', value: user.email },
              ...(user.department ? [{ icon: <BusinessIcon sx={{ fontSize: 16 }} />, label: 'Department', value: user.department }] : []),
            ].map((row) => (
              <Box key={row.label} sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-start' }}>
                <Box sx={{ color: '#c9952a', mt: 0.2 }}>{row.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', color: '#8fa3b8', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", mb: 0.4 }}>
                    {row.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#f0e8d0', fontWeight: 500 }}>{row.value}</Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ borderColor: '#1e2a38', my: 2 }} />
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(143,163,184,0.5)', fontStyle: 'italic', lineHeight: 1.6 }}>
              Profile information is managed by the system administrator. Contact admin to update your name or department.
            </Typography>
          </Paper>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ bgcolor: '#0f1e2e', p: '24px', borderRadius: 2 }}>
            {pwLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
            <SectionHeader icon={<LockIcon fontSize="small" />} title="Change Password" subtitle="Update your login credentials" />

            {pwMsg && (
              <Alert severity={pwMsg.type} sx={{ mb: 3, fontSize: '0.78rem' }}
                onClose={() => setPwMsg(null)}>
                {pwMsg.text}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(245,168,0,0.7)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", mb: 0.8 }}>
                  Current Password
                </Typography>
                <TextField
                  type="password" fullWidth value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  disabled={pwLoading} placeholder="Enter your current password"
                  size="small"
                  InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                  inputProps={{ style: { fontSize: '0.88rem', color: '#f0e8d0' } }}
                />
              </Box>

              <Divider sx={{ borderColor: '#1a2535' }} />

              <Box>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(245,168,0,0.7)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", mb: 0.8 }}>
                  New Password
                </Typography>
                <TextField
                  type="password" fullWidth value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  disabled={pwLoading} placeholder="At least 6 characters"
                  size="small"
                  inputProps={{ style: { fontSize: '0.88rem', color: '#f0e8d0' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(245,168,0,0.7)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", mb: 0.8 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  type="password" fullWidth value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  disabled={pwLoading} placeholder="Re-enter new password"
                  size="small"
                  inputProps={{ style: { fontSize: '0.88rem', color: '#f0e8d0' } }}
                />
              </Box>

              <Box sx={{ pt: 1 }}>
                <Button
                  variant="contained" onClick={handleChangePassword}
                  disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                  sx={{ fontSize: '0.75rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, px: 3, py: 1 }}
                >
                  Update Password
                </Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#1a2535', my: 3 }} />

            <Box sx={{ p: 2, bgcolor: '#141f2a', borderRadius: 1.5, border: '1px solid #1a2535' }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#c9952a', mb: 0.8, letterSpacing: '0.5px' }}>
                Password Requirements
              </Typography>
              {['Minimum 6 characters', 'Must match confirmation field', 'Current password required for verification'].map((req) => (
                <Box key={req} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#c9952a', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8' }}>{req}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
