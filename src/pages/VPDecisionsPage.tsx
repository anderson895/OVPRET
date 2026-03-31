import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LoopIcon from '@mui/icons-material/Loop'
import LockIcon from '@mui/icons-material/Lock'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'

interface Props { documents: RETDocument[]; user: AppUser }

const fmt = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const FILTERS = ['All', 'Approved', 'Rejected', 'Request For Revision']

export const VPDecisionsPage: React.FC<Props> = ({ documents, user }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const decided = documents.filter((d) =>
    d.status === 'Approved' || d.status === 'Rejected' || d.status === 'Request For Revision'
  )

  const filtered = decided.filter((d) => {
    const matchSearch = !search ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.retId?.toLowerCase().includes(search.toLowerCase()) ||
      d.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
      d.department?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || d.status === statusFilter
    return matchSearch && matchStatus
  }).sort((a, b) => {
    const da = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0)
    const db = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0)
    return db.getTime() - da.getTime()
  })

  const counts = {
    approved: decided.filter((d) => d.status === 'Approved').length,
    rejected: decided.filter((d) => d.status === 'Rejected').length,
    revision: decided.filter((d) => d.status === 'Request For Revision').length,
  }

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>OVPRET</Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0A0E' }}>My Decisions</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#6B4050', mt: 0.3 }}>Documents you have approved, rejected, or sent for revision.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Approved', value: counts.approved, color: '#2e7d32', icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} /> },
          { label: 'Rejected', value: counts.rejected, color: '#c62828', icon: <CancelOutlinedIcon sx={{ fontSize: 20 }} /> },
          { label: 'For Revision', value: counts.revision, color: '#1565c0', icon: <LoopIcon sx={{ fontSize: 20 }} /> },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Paper sx={{ p: '18px 22px', bgcolor: '#fff', borderRadius: 2, borderLeft: `3px solid ${s.color}40`, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: s.color, opacity: 0.75 }}>{s.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#6B4050', textTransform: 'uppercase', mt: 0.5 }}>{s.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 2.5, p: '12px 18px', bgcolor: '#F9F6F1', border: '1px solid rgba(123,28,46,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LockIcon sx={{ fontSize: 16, color: '#c9952a', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.72rem', color: '#6B4050', fontWeight: 500 }}>
          Decided documents are <strong>view-only</strong>. Status can no longer be changed once a final decision has been made.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
        <TextField placeholder="Search by title, RET ID, staff name…" size="small" value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#8B7A6B' }} /></InputAdornment> }}
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 160, fontSize: '0.78rem' }}>
          {FILTERS.map((f) => <MenuItem key={f} value={f} sx={{ fontSize: '0.78rem' }}>{f}</MenuItem>)}
        </Select>
      </Box>

      <Paper sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>Decision Records</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</Typography>
          </Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: '#8B7A6B', fontSize: '0.82rem' }}>{decided.length === 0 ? 'No decisions made yet.' : 'No records match your search.'}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RET ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Date Decided</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: '#c9952a' }}>{doc.retId}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 500, fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050' }}>{doc.submittedBy}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.68rem', color: '#8B7A6B' }}>{fmt(doc.updatedAt)}</Typography></TableCell>
                    <TableCell>
                      {doc.feedback ? (
                        <Typography sx={{ fontSize: '0.72rem', color: '#6B4050', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.feedback}</Typography>
                      ) : (
                        <Typography sx={{ fontSize: '0.68rem', color: '#8B7A6B', fontStyle: 'italic' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => setSelected(doc)}
                        sx={{ fontSize: '0.63rem', py: 0.4, px: 1.2, borderColor: 'rgba(123,28,46,0.2)', color: '#7B1C2E', '&:hover': { borderColor: '#7B1C2E' } }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} viewOnly />
    </Box>
  )
}
