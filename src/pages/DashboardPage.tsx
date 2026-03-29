import React, { useState } from 'react'
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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EmailIcon from '@mui/icons-material/Email'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { SubmitDocumentModal } from '../components/SubmitDocumentModal'
import { DocumentDetailModal } from '../components/DocumentDetailModal'

interface Props { documents: RETDocument[]; user: AppUser }

const STATUSES = ['All','Pending','Under Review','Approved','Rejected','Request For Revision']

const fmtDate = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const StatCard: React.FC<{ label: string; value: number | string; color?: string; sub?: string }> = ({ label, value, color, sub }) => (
  <Paper sx={{ p: '18px 22px', bgcolor: '#1a2e45' }}>
    <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.8 }}>{label}</Typography>
    <Typography sx={{ fontSize: '1.9rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: color || '#f5f0e8', lineHeight: 1 }}>{value}</Typography>
    {sub && <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.4 }}>{sub}</Typography>}
  </Paper>
)

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <Box onClick={onClick} sx={{ px: 1.5, py: 0.4, borderRadius: 0.8, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', borderColor: active ? '#c9952a' : 'rgba(201,149,42,0.2)', color: active ? '#c9952a' : '#8fa3b8', bgcolor: active ? 'rgba(201,149,42,0.08)' : 'transparent', '&:hover': { borderColor: '#c9952a', color: '#c9952a' } }}>
    {label}
  </Box>
)

export const DashboardPage: React.FC<Props> = ({ documents, user }) => {
  const [showSubmit, setShowSubmit] = useState(false)
  const [selected, setSelected]   = useState<RETDocument | null>(null)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('All')
  const [snack, setSnack]         = useState({ open: false, msg: '' })

  const isStaff = user.role === 'staff'
  const isVP    = user.role === 'vp'
  const isAdmin = user.role === 'admin'

  // Scope: staff sees only own docs; admin & VP see all
  const scopedDocs = isStaff ? documents.filter((d) => d.submittedByEmail === user.email) : documents

  const filtered = scopedDocs.filter((d) => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.retId?.toLowerCase().includes(search.toLowerCase()) || d.department?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === 'All' || d.status === filter
    return matchSearch && matchStatus
  })

  const counts = {
    total:    scopedDocs.length,
    pending:  scopedDocs.filter((d) => d.status === 'Pending').length,
    approved: scopedDocs.filter((d) => d.status === 'Approved').length,
    revision: scopedDocs.filter((d) => d.status === 'Request For Revision').length,
  }

  return (
    <Box>
      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={3}><StatCard label="Total Documents" value={counts.total} sub={isStaff ? 'My submissions' : 'All RET documents'} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Pending Approval" value={counts.pending} color="#ffa726" sub="Awaiting VP decision" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Approved" value={counts.approved} color="#66bb6a" sub="Successfully processed" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="For Revision" value={counts.revision} color="#4fc3f7" sub="Needs resubmission" /></Grid>
      </Grid>

      <Paper sx={{ bgcolor: '#1a2e45' }}>
        {/* Header */}
        <Box sx={{ p: '18px 24px', borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>RET Document Tracker</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
              {isStaff ? 'Your submitted documents' : 'All submitted RET documents'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isStaff && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.7rem' }}>
                Submit Document
              </Button>
            )}
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search title, RET ID, department..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#8fa3b8' }} /></InputAdornment>, sx: { fontSize: '0.78rem', minWidth: 260 } }}
          />
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => <FilterChip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)}
          </Box>
        </Box>

        {/* Table */}
        {filtered.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5, fontSize: '0.9rem' }}>No documents found</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>
              {isStaff ? 'Click "Submit Document" to submit your first RET document.' : 'No documents match the current filters.'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RET ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Department</TableCell>
                  {!isStaff && <TableCell>Submitted By</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Notified</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 500, fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.type}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    {!isStaff && <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.submittedBy}</Typography></TableCell>}
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        {doc.emailSentToVP && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><EmailIcon sx={{ fontSize: 11, color: '#66bb6a' }} /><Typography sx={{ fontSize: '0.58rem', color: '#66bb6a', fontFamily: "'IBM Plex Mono',monospace" }}>VP</Typography></Box>}
                        {doc.emailSentToStaff && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><EmailIcon sx={{ fontSize: 11, color: '#4fc3f7' }} /><Typography sx={{ fontSize: '0.58rem', color: '#4fc3f7', fontFamily: "'IBM Plex Mono',monospace" }}>Staff</Typography></Box>}
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>{fmtDate(doc.createdAt)}</Typography></TableCell>
                    <TableCell><Button variant="outlined" size="small" onClick={() => setSelected(doc)} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.2 }}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <SubmitDocumentModal open={showSubmit} onClose={() => setShowSubmit(false)} onSuccess={(id) => { setShowSubmit(false); setSnack({ open: true, msg: `Document submitted! RET ID: ${id}. VP has been notified via email.` }) }} user={user} />
      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
      <Snackbar open={snack.open} autoHideDuration={7000} onClose={() => setSnack({ open: false, msg: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  )
}
