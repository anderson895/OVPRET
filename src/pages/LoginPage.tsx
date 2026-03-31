import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from '@mui/material/MenuItem'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useAuth } from '../hooks/useAuth'
import { registerUser } from '../services/auth'

const TAGLINE = 'A reliable platform that connects offices and personnel to streamline document tracking — featuring secure logging, status monitoring, and real-time updates for efficient and transparent document management.'

const OFFICES = [
  'Office of the Research Director',
  'Office of the Knowledge and Technology Transfer',
  'Office of the Extension Director',
]

const BrandPanel: React.FC = () => (
  <Box sx={{
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 420,
    flexShrink: 0,
    bgcolor: '#7B1C2E',
    p: 6,
    position: 'relative',
    overflow: 'hidden',
    '&::after': { content: '""', position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', border: '40px solid #162230' },
    '&::before': { content: '""', position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: '50%', border: '35px solid #162030' },
  }}>
    <Box sx={{ width: 140, height: 140, borderRadius: '50%', border: '3px solid rgba(245,168,0,0.5)', overflow: 'hidden', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', mb: 4, position: 'relative', zIndex: 1 }}>
      <img src="/logo.png" alt="MSU Logo" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
    </Box>
    <Typography sx={{ color: '#F5A800', fontSize: '0.62rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", mb: 1, position: 'relative', zIndex: 1, textAlign: 'center' }}>
      Marinduque State University
    </Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', fontWeight: 800, textAlign: 'center', lineHeight: 1.35, position: 'relative', zIndex: 1, mb: 1 }}>
      Office of the Vice President<br />for Research, Extension<br />& Technology
    </Typography>
    <Box sx={{ width: 40, height: 2, bgcolor: '#F5A800', borderRadius: 1, my: 2.5, position: 'relative', zIndex: 1 }} />
    <Typography sx={{ color: 'rgba(245,168,0,0.7)', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, position: 'relative', zIndex: 1, textAlign: 'center' }}>
      Web-Based Document Tracking System
    </Typography>
    <Box sx={{ width: 40, height: 2, bgcolor: 'rgba(245,168,0,0.3)', borderRadius: 1, my: 2.5, position: 'relative', zIndex: 1 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', lineHeight: 1.7, textAlign: 'center', position: 'relative', zIndex: 1 }}>
      {TAGLINE}
    </Typography>
  </Box>
)

// ── Login Form ────────────────────────────────────────────────
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleLogin = () => { if (email && password) login(email, password) }

  return (
    <Box>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C0A0E', mb: 0.5, letterSpacing: '-0.5px' }}>Welcome back</Typography>
      <Typography sx={{ fontSize: '0.82rem', color: '#6B4050', mb: 3.5 }}>Sign in to your OVPRET DTS account</Typography>

      {error && <Alert severity="error" sx={{ mb: 2.5, fontSize: '0.78rem' }}>{error}</Alert>}

      <TextField label="Email Address" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} disabled={loading} placeholder="user@msu.edu.ph" sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />
      <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} disabled={loading} placeholder="Enter your password" sx={{ mb: 3.5 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />

      <Button fullWidth variant="contained" color="secondary" onClick={handleLogin} disabled={loading || !email || !password} sx={{ py: 1.5, fontSize: '0.85rem', letterSpacing: '1.5px', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' } }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  )
}

// ── Register Form ─────────────────────────────────────────────
const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({ displayName: '', email: '', department: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const field = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleRegister = async () => {
    if (!form.displayName || !form.email || !form.department || !form.password || !form.confirmPassword) {
      setError('All fields are required.'); return
    }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    try {
      await registerUser({ email: form.email, password: form.password, displayName: form.displayName, department: form.department })
      setSuccess(true)
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: '#2e7d32', mb: 2 }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0A0E', mb: 1 }}>Request Submitted!</Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#6B4050', lineHeight: 1.7 }}>
          Your account request has been sent to the administrator for approval.
          You will be able to log in once your account is approved.
        </Typography>
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(46,125,50,0.06)', border: '1px solid rgba(46,125,50,0.2)', borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#2e7d32', fontFamily: "'IBM Plex Mono',monospace" }}>
            Please wait for admin approval before signing in.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C0A0E', mb: 0.5, letterSpacing: '-0.5px' }}>Request Access</Typography>
      <Typography sx={{ fontSize: '0.82rem', color: '#6B4050', mb: 3.5 }}>Fill in your details — admin will approve your account</Typography>

      {error && <Alert severity="error" sx={{ mb: 2.5, fontSize: '0.78rem' }}>{error}</Alert>}

      <TextField label="Full Name *" fullWidth value={form.displayName} onChange={field('displayName')} disabled={loading} placeholder="e.g. Juan dela Cruz" sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />
      <TextField label="Email Address *" type="email" fullWidth value={form.email} onChange={field('email')} disabled={loading} placeholder="staff@ovpret.edu.ph" sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />
      <TextField select label="Office *" fullWidth value={form.department} onChange={field('department')} disabled={loading} sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} SelectProps={{ displayEmpty: true }}>
        <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#8B7A6B', fontStyle: 'italic' }}>Select your office...</MenuItem>
        {OFFICES.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.85rem' }}>{o}</MenuItem>)}
      </TextField>
      <TextField label="Password *" type="password" fullWidth value={form.password} onChange={field('password')} disabled={loading} placeholder="Min. 8 characters" sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />
      <TextField label="Confirm Password *" type="password" fullWidth value={form.confirmPassword} onChange={field('confirmPassword')} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} disabled={loading} placeholder="Re-enter your password" sx={{ mb: 3.5 }} InputLabelProps={{ sx: { fontSize: '0.85rem' } }} inputProps={{ style: { fontSize: '0.9rem', color: '#1C0A0E' } }} />

      <Button fullWidth variant="contained" color="secondary" onClick={handleRegister} disabled={loading} sx={{ py: 1.5, fontSize: '0.85rem', letterSpacing: '1.5px', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' } }}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </Box>
  )
}

// ── Main LoginPage ─────────────────────────────────────────────
export const LoginPage: React.FC = () => {
  const [tab, setTab] = useState(0)
  const { loading } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F7F5F2' }}>
      <BrandPanel />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: { xs: '28px 24px', md: '40px' }, borderRadius: 3, border: '1px solid rgba(123,28,46,0.12)', boxShadow: '0 4px 24px rgba(123,28,46,0.08)', position: 'relative', overflow: 'hidden', bgcolor: '#fff' }}>
          {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid rgba(123,28,46,0.2)', overflow: 'hidden', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="MSU" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            </Box>
          </Box>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3.5, borderBottom: '1px solid rgba(123,28,46,0.1)', minHeight: 38 }}>
            <Tab label="Sign In" sx={{ minHeight: 38, fontSize: '0.72rem' }} />
            <Tab label="Request Access" sx={{ minHeight: 38, fontSize: '0.72rem' }} />
          </Tabs>

          {tab === 0 && <LoginForm />}
          {tab === 1 && <RegisterForm />}

          <Divider sx={{ my: 3 }} />
          <Typography sx={{ textAlign: 'center', fontSize: '0.72rem', color: '#6B4050' }}>
            {tab === 0 ? 'No account yet? Click "Request Access" to register.' : 'Already have an account? Click "Sign In" to log in.'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}