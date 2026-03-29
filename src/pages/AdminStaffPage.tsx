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

interface Props { user: AppUser }

const fmtDate = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const DEPARTMENTS = [
  'Office of the Research Director',
  'Office of the Knowledge Technology Transfer',
  'Office of the Extension Director',
]

const CreateStaffModal: React.FC<{ open: boolean; onClose: () => void; onSuccess: () => void; adminEmail: string }> = ({ open, onClose, onSuccess, adminEmail }) => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '', department: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

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
      setError(e.message || 'Failed to create staff account.')
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#0f1e2e' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245,168,0,0.2)', pb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Create Staff Account</Typography>
          <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>New account will be active immediately</Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small" sx={{ color: '#8fa3b8' }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Full Name *" fullWidth value={form.displayName} onChange={field('displayName')} disabled={loading}
              InputLabelProps={{ shrink: true }}
              placeholder="e.g. Juan dela Cruz"
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }, '& .MuiInputBase-input::placeholder': { color: '#6a8aaa', opacity: 1 } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email Address *" type="email" fullWidth value={form.email} onChange={field('email')} disabled={loading}
              InputLabelProps={{ shrink: true }}
              placeholder="staff@ovpret.edu.ph"
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }, '& .MuiInputBase-input::placeholder': { color: '#6a8aaa', opacity: 1 } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Department *" fullWidth value={form.department} onChange={field('department')} disabled={loading}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }, '& .MuiSelect-icon': { color: '#a8bfd4' }, '& .MuiSelect-select': { color: form.department ? '#f0e8d0' : '#6a8aaa', fontSize: '0.85rem' } }}
              SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { bgcolor: '#0f1e2e', border: '1px solid rgba(245,168,0,0.25)', '& .MuiMenuItem-root': { fontSize: '0.85rem', color: '#f0e8d0', '&:hover': { bgcolor: 'rgba(245,168,0,0.1)' }, '&.Mui-selected': { bgcolor: 'rgba(245,168,0,0.15)', color: '#F5A800', '&:hover': { bgcolor: 'rgba(245,168,0,0.2)' } } } } } } }}>
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#6a8aaa', fontStyle: 'italic' }}>Select department...</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Password *" type="password" fullWidth value={form.password} onChange={field('password')} disabled={loading}
              InputLabelProps={{ shrink: true }}
              placeholder="Min. 8 characters"
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }, '& .MuiInputBase-input::placeholder': { color: '#6a8aaa', opacity: 1 } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Confirm Password *" type="password" fullWidth value={form.confirmPassword} onChange={field('confirmPassword')} disabled={loading}
              InputLabelProps={{ shrink: true }}
              placeholder="Re-enter password"
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }, '& .MuiInputBase-input::placeholder': { color: '#6a8aaa', opacity: 1 } }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(245,168,0,0.2)', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button onClick={handleCreate} disabled={loading} variant="contained" startIcon={<PersonAddIcon />} sx={{ fontSize: '0.72rem', minWidth: 160 }}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const AdminStaffPage: React.FC<Props> = ({ user }) => {
  const [staff, setStaff]         = useState<StaffAccount[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [snack, setSnack]           = useState('')
  const [toggling, setToggling]     = useState<string | null>(null)

  useEffect(() => {
    const unsub = listenStaff(setStaff)
    return unsub
  }, [])

  const activeCount   = staff.filter((s) => s.isActive).length
  const inactiveCount = staff.filter((s) => !s.isActive).length

  const handleToggle = async (s: StaffAccount) => {
    setToggling(s.uid)
    try {
      await toggleStaffStatus(s.uid, !s.isActive)
      setSnack(`${s.displayName} has been ${s.isActive ? 'deactivated' : 'activated'}.`)
    } finally { setToggling(null) }
  }

  const handleDelete = async (s: StaffAccount) => {
    if (!window.confirm(`Remove ${s.displayName}? This will deactivate their account.`)) return
    setToggling(s.uid)
    try {
      await deleteStaffAccount(s.uid)
      setSnack(`${s.displayName}'s account has been removed.`)
    } finally { setToggling(null) }
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>Admin Panel</Typography>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Staff Account Management</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>Create and manage staff accounts. Only you (Admin) can access this panel.</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setShowCreate(true)} sx={{ fontSize: '0.72rem' }}>
          Add Staff Account
        </Button>
      </Box>

      {snack && (
        <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSnack('')}>{snack}</Alert>
      )}

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: '16px 20px', bgcolor: '#0f1e2e' }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.7 }}>Total Staff</Typography>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: '#f0e8d0', lineHeight: 1 }}>{staff.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: '16px 20px', bgcolor: '#0f1e2e' }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.7 }}>Active</Typography>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: '#66bb6a', lineHeight: 1 }}>{activeCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: '16px 20px', bgcolor: '#0f1e2e' }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.7 }}>Inactive</Typography>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: '#ef5350', lineHeight: 1 }}>{inactiveCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ bgcolor: '#0f1e2e' }}>
        <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(245,168,0,0.2)' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>Staff Accounts</Typography>
          <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Manage who can log in and submit documents</Typography>
        </Box>

        {staff.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: '#8fa3b8', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>No staff accounts yet</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem', mb: 3 }}>Create the first staff account to get started.</Typography>
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setShowCreate(true)} sx={{ fontSize: '0.72rem' }}>Add First Staff</Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
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
                        <Box sx={{ width: 30, height: 30, borderRadius: '6px', bgcolor: 'rgba(245,168,0,0.15)', border: '1px solid rgba(245,168,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#c9952a' }}>{s.displayName?.[0]?.toUpperCase()}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#f0e8d0' }}>{s.displayName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#4fc3f7' }}>{s.email}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.department}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={s.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontSize: '0.6rem', height: 20, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700,
                          bgcolor: s.isActive ? 'rgba(46,125,50,0.15)' : 'rgba(183,28,28,0.15)',
                          color: s.isActive ? '#66bb6a' : '#ef5350',
                          border: `1px solid ${s.isActive ? 'rgba(46,125,50,0.3)' : 'rgba(183,28,28,0.3)'}`,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>{fmtDate(s.createdAt)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8' }}>{s.createdBy}</Typography></TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title={s.isActive ? 'Deactivate account' : 'Activate account'}>
                          <IconButton size="small" onClick={() => handleToggle(s)} disabled={toggling === s.uid}
                            sx={{ color: s.isActive ? '#ffa726' : '#66bb6a', '&:hover': { bgcolor: s.isActive ? 'rgba(255,167,38,0.1)' : 'rgba(102,187,106,0.1)' } }}>
                            {s.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove account">
                          <IconButton size="small" onClick={() => handleDelete(s)} disabled={toggling === s.uid} sx={{ color: '#ef5350', '&:hover': { bgcolor: 'rgba(239,83,80,0.1)' } }}>
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
