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
import SearchIcon from '@mui/icons-material/Search'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'

interface Props { documents: RETDocument[]; user: AppUser }

const STATUSES = ['All','Pending','Under Review','Approved','Rejected','Request For Revision']

const fmtDate = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <Box onClick={onClick} sx={{ px: 1.5, py: 0.4, borderRadius: 0.8, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', borderColor: active ? '#7B1C2E' : 'rgba(123,28,46,0.2)', color: active ? '#7B1C2E' : '#6B4050', bgcolor: active ? 'rgba(123,28,46,0.06)' : 'transparent', '&:hover': { borderColor: '#7B1C2E', color: '#7B1C2E' } }}>
    {label}
  </Box>
)

export const DashboardPage: React.FC<Props> = ({ documents, user }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')

  const isStaff = user.role === 'staff'

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
        {[
          { label: 'Total Documents', value: counts.total, color: '#1C0A0E', sub: 'All RET documents' },
          { label: 'Pending Approval', value: counts.pending, color: '#b36b00', sub: 'Awaiting VP decision' },
          { label: 'Approved', value: counts.approved, color: '#2e7d32', sub: 'Successfully processed' },
          { label: 'For Revision', value: counts.revision, color: '#1565c0', sub: 'Needs resubmission' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper sx={{ p: '18px 22px', bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#6B4050', textTransform: 'uppercase', mb: 0.8 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.9rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#8B7A6B', mt: 0.4 }}>{s.sub}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ bgcolor: '#fff' }}>
        {/* Header */}
        <Box sx={{ p: '18px 24px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.9rem' }}>RET Document Tracker</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
              All submitted RET documents
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(123,28,46,0.08)', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search title, RET ID, office..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#8B7A6B' }} /></InputAdornment>, sx: { fontSize: '0.78rem', minWidth: 260 } }}
          />
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => <FilterChip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)}
          </Box>
        </Box>

        {/* Table - removed Notified/Email column */}
        {filtered.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', mb: 0.5, fontSize: '0.9rem' }}>No documents found</Typography>
            <Typography sx={{ color: '#6B4050', fontSize: '0.8rem' }}>No documents match the current filters.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RET ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 500, fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050' }}>{doc.type}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050' }}>{doc.submittedBy}</Typography></TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8B7A6B' }}>{fmtDate(doc.createdAt)}</Typography></TableCell>
                    <TableCell><Button variant="outlined" size="small" onClick={() => setSelected(doc)} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.2, borderColor: 'rgba(123,28,46,0.2)', color: '#7B1C2E' }}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
    </Box>
  )
}
