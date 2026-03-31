import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LinearProgress from '@mui/material/LinearProgress'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import type { StaffAccount, AppUser } from '../types'
import { listenStaff, createStaffAccount, toggleStaffStatus, deleteStaffAccount } from '../services/documents'
import { logError } from '../services/errorLogger'

interface Props { user: AppUser }

const fmtDate = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const OFFICES = [
  'Office of the Research Director',
  'Office of the Knowledge Technology Transfer',
  'Office of the Extension Director',
]

const CreateStaffModal: React.FC<{ open: boolean; onClose: () => void; onSuccess: () => void; adminEmail: string }> = ({ open, onClose, onSuccess, adminEmail }) => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '', department: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const field = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleClose = () => {
    if (loading) return
    setForm({ email: '', password: '', confirmPassword: '', displayName: '', department: '' })
    setError(''); onClose()
  }

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.displayName || !form.department) { setError('All fields are required.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    try {
      await createStaffAccount({ email: form.email, password: form.password, displayName: form.displayName, department: form.department, adminEmail })
      handleClose(); onSuccess()
    } catch (e: any) {
      const msg = e.message || 'Failed to create staff account.'
      setError(msg)
      logError({ message: msg, error: e, component: 'CreateStaffModal', action: 'create_staff', userEmail: adminEmail, userRole: 'admin' })
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(123,28,46,0.1)', pb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '0.95rem' }}>Create Staff Account</Typography>
          <Typography sx={{ fontSize: '0.62rem', color: '#8B7A6B', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>New account will be active immediately</Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small" sx={{ color: '#8B7A6B' }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Full Name *" fullWidth value={form.displayName} onChange={field('displayName')} disabled={loading} placeholder="e.g. Juan dela Cruz" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email Address *" type="email" fullWidth value={form.email} onChange={field('email')} disabled={loading} placeholder="staff@ovpret.edu.ph" />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Office *" fullWidth value={form.department} onChange={field('department')} disabled={loading} SelectProps={{ displayEmpty: true }}>
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#8B7A6B', fontStyle: 'italic' }}>Select office...</MenuItem>
              {OFFICES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Password *" type="password" fullWidth value={form.password} onChange={field('password')} disabled={loading} placeholder="Min. 8 characters" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Confirm Password *" type="password" fullWidth value={form.confirmPassword} onChange={field('confirmPassword')} disabled={loading} placeholder="Re-enter password" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(123,28,46,0.1)', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button onClick={handleCreate} disabled={loading} variant="contained" color="secondary" startIcon={<PersonAddIcon />} sx={{ fontSize: '0.72rem', minWidth: 160 }}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const AdminStaffPage: React.FC<Props> = ({ user }) => {
  const [staff, setStaff] = useState<StaffAccount[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [snack, setSnack] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    const unsub = listenStaff(setStaff)
    return unsub
  }, [])

  const activeCount = staff.filter((s) => s.isActive).length
  const inactiveCount = staff.filter((s) => !s.isActive).length

  const handleToggle = async (s: StaffAccount) => {
    setToggling(s.uid)
    try {
      await toggleStaffStatus(s.uid, !s.isActive)
      setSnack(`${s.displayName} has been ${s.isActive ? 'deactivated' : 'activated'}.`)
    } catch (e: any) {
      logError({ message: e.message, error: e, component: 'AdminStaffPage', action: 'toggle_staff', userEmail: user.email, userRole: 'admin' })
    } finally { setToggling(null) }
  }

  const handleDelete = async (s: StaffAccount) => {
    if (!window.confirm(`Remove ${s.displayName}? This will deactivate their account.`)) return
    setToggling(s.uid)
    try {
      await deleteStaffAccount(s.uid)
      setSnack(`${s.displayName}'s account has been removed.`)
    } catch (e: any) {
      logError({ message: e.message, error: e, component: 'AdminStaffPage', action: 'delete_staff', userEmail: user.email, userRole: 'admin' })
    } finally { setToggling(null) }
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>OVPRET</Typography>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0A0E' }}>Staff Account Management</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6B4050', mt: 0.3 }}>Create and manage staff accounts.</Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<PersonAddIcon />} onClick={() => setShowCreate(true)} sx={{ fontSize: '0.72rem' }}>
          Add Staff Account
        </Button>
      </Box>

      {snack && <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSnack('')}>{snack}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Staff', value: staff.length, color: '#1C0A0E' },
          { label: 'Active', value: activeCount, color: '#2e7d32' },
          { label: 'Inactive', value: inactiveCount, color: '#c62828' },
        ].map((s) => (
          <Grid item xs={6} sm={4} key={s.label}>
            <Paper sx={{ p: '16px 20px', bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#6B4050', textTransform: 'uppercase', mb: 0.7 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ bgcolor: '#fff' }}>
        <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
          <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>Staff Accounts</Typography>
          <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Manage who can log in and submit documents</Typography>
        </Box>

        {staff.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: '#8B7A6B', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', mb: 0.5 }}>No staff accounts yet</Typography>
            <Typography sx={{ color: '#6B4050', fontSize: '0.8rem', mb: 3 }}>Create the first staff account to get started.</Typography>
            <Button variant="contained" color="secondary" startIcon={<PersonAddIcon />} onClick={() => setShowCreate(true)} sx={{ fontSize: '0.72rem' }}>Add First Staff</Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((s) => (
                  <TableRow key={s.uid} sx={{ opacity: toggling === s.uid ? 0.5 : 1 }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{ width: 30, height: 30, borderRadius: '6px', bgcolor: '#F9F6F1', border: '1px solid rgba(123,28,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#7B1C2E' }}>{s.displayName?.[0]?.toUpperCase()}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 500 }}>{s.displayName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#1565c0' }}>{s.email}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#6B4050', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.department}</Typography></TableCell>
                    <TableCell>
                      <Chip label={s.isActive ? 'Active' : 'Inactive'} size="small"
                        sx={{ fontSize: '0.6rem', height: 20, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700,
                          bgcolor: s.isActive ? 'rgba(46,125,50,0.08)' : 'rgba(198,40,40,0.08)',
                          color: s.isActive ? '#2e7d32' : '#c62828',
                          border: `1px solid ${s.isActive ? 'rgba(46,125,50,0.25)' : 'rgba(198,40,40,0.25)'}`,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8B7A6B' }}>{fmtDate(s.createdAt)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.7rem', color: '#6B4050' }}>{s.createdBy}</Typography></TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title={s.isActive ? 'Deactivate account' : 'Activate account'}>
                          <IconButton size="small" onClick={() => handleToggle(s)} disabled={toggling === s.uid}
                            sx={{ color: s.isActive ? '#b36b00' : '#2e7d32' }}>
                            {s.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove account">
                          <IconButton size="small" onClick={() => handleDelete(s)} disabled={toggling === s.uid} sx={{ color: '#c62828' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <CreateStaffModal open={showCreate} onClose={() => setShowCreate(false)} onSuccess={() => setSnack('Staff account created successfully.')} adminEmail={user.email} />
    </Box>
  )
}
