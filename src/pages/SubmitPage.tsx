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
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { SubmitDocumentModal } from '../components/SubmitDocumentModal'
import { DocumentDetailModal } from '../components/DocumentDetailModal'
import { EditDocumentModal } from '../components/EditDocumentModal'

interface Props {
  documents: RETDocument[]
  user: AppUser
}

const formatDateShort = (ts: any): string => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const STATUSES = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Request For Revision']

export const SubmitPage: React.FC<Props> = ({ documents, user }) => {
  const [showSubmit, setShowSubmit] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<RETDocument | null>(null)
  const [editDoc, setEditDoc] = useState<RETDocument | null>(null)
  const [snack, setSnack] = useState<{ open: boolean; retId: string }>({ open: false, retId: '' })
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
    review:   myDocs.filter((d) => d.status === 'Under Review').length,
  }

  const handleSubmitSuccess = (retId: string) => {
    setShowSubmit(false)
    setSnack({ open: true, retId })
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
            OVPRET
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0A0E' }}>Submit Documents</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#6B4050', mt: 0.3 }}>
            Submit and manage your RET documents.
          </Typography>
        </Box>
        <Button
          variant="contained" color="secondary" startIcon={<AddIcon />}
          onClick={() => setShowSubmit(true)}
          sx={{ fontSize: '0.78rem', px: 3, py: 1.2 }}
        >
          New Document Submission
        </Button>
      </Box>

      {/* Stats row - same as dashboard */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: counts.total, color: '#1C0A0E' },
          { label: 'Pending', value: counts.pending, color: '#b36b00' },
          { label: 'Under Review', value: counts.review, color: '#7b1fa2' },
          { label: 'Approved', value: counts.approved, color: '#2e7d32' },
          { label: 'For Revision', value: counts.revision, color: '#1565c0' },
          { label: 'Rejected', value: counts.rejected, color: '#c62828' },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2} key={s.label}>
            <Paper sx={{ p: '12px 16px', bgcolor: '#fff', borderRadius: 2, borderLeft: `3px solid ${s.color}40` }}>
              <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '1.5px', color: '#6B4050', textTransform: 'uppercase', mb: 0.6 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Documents Table with search/filter */}
      <Paper sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '16px 24px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search title, RET ID, office…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#8B7A6B' }} /></InputAdornment>,
              sx: { fontSize: '0.78rem', minWidth: 260 },
            }}
          />
          <Select
            size="small" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ fontSize: '0.78rem', minWidth: 160 }}
          >
            {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>)}
          </Select>
          <Typography sx={{ fontSize: '0.68rem', color: '#8B7A6B', ml: 'auto', fontFamily: "'IBM Plex Mono',monospace" }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 36, color: 'rgba(123,28,46,0.15)', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', mb: 1 }}>
              {myDocs.length === 0 ? 'No documents submitted yet' : 'No documents match your filter'}
            </Typography>
            <Typography sx={{ color: '#6B4050', fontSize: '0.82rem', mb: 3 }}>
              {myDocs.length === 0 ? 'Click "New Document Submission" to submit your first RET document.' : 'Try adjusting your search or filter.'}
            </Typography>
            {myDocs.length === 0 && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.72rem' }}>
                Submit First Document
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['RET ID', 'Title', 'Type', 'Office', 'Status', 'Date Submitted', 'VP Feedback', 'Action'].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedDoc(doc)}>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#1C0A0E', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.73rem', color: '#6B4050' }}>{doc.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.73rem', color: '#6B4050', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography>
                    </TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.66rem', color: '#8B7A6B' }}>
                        {formatDateShort(doc.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {doc.feedback ? (
                        <Typography sx={{ fontSize: '0.7rem', color: '#6B4050', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.feedback}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: '0.66rem', color: '#8B7A6B', fontStyle: 'italic' }}>Awaiting…</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.8 }} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outlined" size="small"
                          onClick={() => setSelectedDoc(doc)}
                          sx={{ fontSize: '0.63rem', py: 0.4, px: 1.5, borderColor: 'rgba(123,28,46,0.2)', color: '#7B1C2E', '&:hover': { borderColor: '#7B1C2E', bgcolor: 'rgba(123,28,46,0.04)' } }}
                        >
                          Track
                        </Button>
                        <Button
                          variant="outlined" size="small" startIcon={<EditIcon sx={{ fontSize: '0.7rem !important' }} />}
                          onClick={() => setEditDoc(doc)}
                          sx={{ fontSize: '0.63rem', py: 0.4, px: 1.2, borderColor: 'rgba(123,28,46,0.2)', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: 'rgba(245,168,0,0.04)' } }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <SubmitDocumentModal open={showSubmit} onClose={() => setShowSubmit(false)} onSuccess={handleSubmitSuccess} user={user} />
      <DocumentDetailModal document={selectedDoc} open={!!selectedDoc} onClose={() => setSelectedDoc(null)} onUpdate={() => setSelectedDoc(null)} user={user} />
      <EditDocumentModal document={editDoc} open={!!editDoc} onClose={() => setEditDoc(null)} onSuccess={() => setEditDoc(null)} user={user} />

      <Snackbar open={snack.open} autoHideDuration={7000} onClose={() => setSnack({ open: false, retId: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>
          Document submitted! RET ID: <strong>{snack.retId}</strong>
        </Alert>
      </Snackbar>
    </Box>
  )
}
