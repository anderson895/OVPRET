import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import { useAuth } from '../hooks/useAuth'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleLogin = () => { if (email && password) login(email, password) }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0d1b2a', p: 2, backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(201,149,42,0.04) 0%, transparent 60%)' }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, bgcolor: '#1a2e45', overflow: 'hidden', borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ p: '36px 36px 28px', textAlign: 'center', background: 'linear-gradient(135deg, #243b55 0%, #1a2e45 100%)', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '10px', bgcolor: 'rgba(201,149,42,0.12)', border: '1px solid rgba(201,149,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#c9952a', lineHeight: 1 }}>O</Typography>
          </Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', color: '#c9952a', textTransform: 'uppercase', fontWeight: 600, mb: 1 }}>
            Office of the Vice President
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
            OVPRET Web-Based<br />Document Tracking System
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: '28px 36px 32px' }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.78rem' }}>{error}</Alert>}

          <TextField label="Email Address" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} disabled={loading} placeholder="user@ovpret.edu.ph" sx={{ mb: 2 }} InputLabelProps={{ sx: { fontSize: '0.82rem' } }} inputProps={{ style: { fontSize: '0.85rem' } }} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} disabled={loading} placeholder="Enter your password" sx={{ mb: 3 }} InputLabelProps={{ sx: { fontSize: '0.82rem' } }} inputProps={{ style: { fontSize: '0.85rem' } }} />

          <Button fullWidth variant="contained" onClick={handleLogin} disabled={loading || !email || !password} sx={{ py: 1.4, fontSize: '0.8rem', letterSpacing: '1px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
