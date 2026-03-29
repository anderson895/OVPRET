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
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'
import { EditDocumentModal } from '../components/EditDocumentModal'

interface Props { documents: RETDocument[]; user: AppUser }

const fmt = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const STATUSES = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Request For Revision']

export const MyDocumentsPage: React.FC<Props> = ({ documents, user }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)
  const [editDoc, setEditDoc] = useState<RETDocument | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const myDocs = documents.filter((d) => d.submittedByEmail === user.email)

  const filtered = myDocs.filter((d) => {
    const matchSearch = !search ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.retId?.toLowerCase().includes(search.toLowerCase()) ||
      d.department?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    total:    myDocs.length,
    pending:  myDocs.filter((d) => d.status === 'Pending').length,
    approved: myDocs.filter((d) => d.status === 'Approved').length,
    revision: myDocs.filter((d) => d.status === 'Request For Revision').length,
    rejected: myDocs.filter((d) => d.status === 'Rejected').length,
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
          My Submissions
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>Document History</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>
          Full record of all RET documents you have submitted, with current status and VP feedback.
        </Typography>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: counts.total, color: '#f0e8d0' },
          { label: 'Pending', value: counts.pending, color: '#ffa726' },
          { label: 'Approved', value: counts.approved, color: '#66bb6a' },
          { label: 'For Revision', value: counts.revision, color: '#4fc3f7' },
          { label: 'Rejected', value: counts.rejected, color: '#ef5350' },
        ].map((s) => (
          <Grid item xs={6} sm={2.4} key={s.label}>
            <Paper sx={{ p: '14px 16px', bgcolor: '#0f1e2e', borderRadius: 2 }}>
              <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.6 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '16px 24px', borderBottom: '1px solid #1e2a38', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search title, RET ID, department…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#8fa3b8' }} /></InputAdornment>,
              sx: { fontSize: '0.78rem', minWidth: 260 },
            }}
          />
          <Select
            size="small" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ fontSize: '0.78rem', minWidth: 160, color: '#f0e8d0',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#243040' },
              '& .MuiSvgIcon-root': { color: '#8fa3b8' },
            }}
          >
            {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>)}
          </Select>
          <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', ml: 'auto', fontFamily: "'IBM Plex Mono',monospace" }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>No documents found</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>Try adjusting your search or filter.</Typography>
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
                  <TableCell>Status</TableCell>
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>VP Feedback</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelected(doc)}>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#f0e8d0', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.type}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.67rem', color: '#8fa3b8' }}>{fmt(doc.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      {doc.feedback
                        ? <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.feedback}</Typography>
                        : <Typography sx={{ fontSize: '0.68rem', color: 'rgba(143,163,184,0.35)', fontStyle: 'italic' }}>No feedback yet</Typography>}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.8 }}>
                        <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setSelected(doc) }} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.2 }}>View</Button>
                        <Button variant="outlined" size="small" startIcon={<EditIcon sx={{ fontSize: '0.7rem !important' }} />} onClick={(e) => { e.stopPropagation(); setEditDoc(doc) }} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.2, borderColor: 'rgba(245,168,0,0.3)', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' } }}>Edit</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
      <EditDocumentModal document={editDoc} open={!!editDoc} onClose={() => setEditDoc(null)} onSuccess={() => setEditDoc(null)} user={user} />
    </Box>
  )
}
