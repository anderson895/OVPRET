import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../hooks/useAuth';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'staff' | 'vp'>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password, role);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#0d1b2a',
      p: 2,
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(201,149,42,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(79,195,247,0.03) 0%, transparent 50%)',
    }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, bgcolor: '#1a2e45', overflow: 'hidden', borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{
          p: '40px 36px 32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #243b55 0%, #1a2e45 100%)',
          borderBottom: '1px solid rgba(201,149,42,0.2)',
        }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '12px',
            bgcolor: 'rgba(201,149,42,0.12)', border: '1px solid rgba(201,149,42,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#c9952a', lineHeight: 1 }}>O</Typography>
          </Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', letterSpacing: '3px', color: '#c9952a', textTransform: 'uppercase', fontWeight: 600, mb: 1 }}>
            Office of the Vice President
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
            OVPRET Web-Based<br />Document Tracking System
          </Typography>
          {DEMO && (
            <Chip
              label="Demo Mode Active"
              size="small"
              sx={{ mt: 1.5, fontSize: '0.58rem', height: 20, bgcolor: 'rgba(201,149,42,0.15)', color: '#c9952a', border: '1px solid rgba(201,149,42,0.3)', fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}
            />
          )}
        </Box>

        {/* Body */}
        <Box sx={{ p: '32px 36px' }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.78rem' }}>{error}</Alert>}

          {/* Role Toggle */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: '#8fa3b8', textTransform: 'uppercase', mb: 1 }}>
              Sign in as
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, v) => v && setRole(v)}
              fullWidth
              size="small"
              sx={{
                border: '1px solid rgba(201,149,42,0.2)',
                borderRadius: 1.5,
                overflow: 'hidden',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: '#8fa3b8',
                  py: 1.2,
                  gap: 1,
                  '&.Mui-selected': {
                    bgcolor: '#c9952a',
                    color: '#0d1b2a',
                    '&:hover': { bgcolor: '#e8b84b' },
                  },
                },
              }}
            >
              <ToggleButton value="staff">
                <PersonIcon sx={{ fontSize: 16 }} />
                Staff / Admin
              </ToggleButton>
              <ToggleButton value="vp">
                <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                Vice President
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={DEMO ? 'any@email.com' : 'user@ovpret.edu.ph'}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
            inputProps={{ style: { fontSize: '0.85rem' } }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={DEMO ? 'any password' : 'Enter your password'}
            sx={{ mb: 3 }}
            InputLabelProps={{ sx: { fontSize: '0.82rem' } }}
            inputProps={{ style: { fontSize: '0.85rem' } }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading || !email || !password}
            sx={{ py: 1.4, fontSize: '0.8rem', letterSpacing: '1px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>

          {DEMO && (
            <Box sx={{ mt: 2.5, p: 1.5, bgcolor: 'rgba(201,149,42,0.06)', borderRadius: 1, border: '1px solid rgba(201,149,42,0.15)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', lineHeight: 1.6, fontFamily: "'IBM Plex Mono',monospace" }}>
                DEMO: Enter any email + password to login.<br />
                Use Staff/Admin to submit documents.<br />
                Use Vice President to approve/reject.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
