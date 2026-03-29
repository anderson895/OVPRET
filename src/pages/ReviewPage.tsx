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

const StatCard: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => (
  <Paper sx={{ p: '14px 20px', bgcolor: '#0f1e2e' }}>
    <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.6 }}>{label}</Typography>
    <Typography sx={{ fontSize: '1.7rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: color || '#f0e8d0', lineHeight: 1 }}>{value}</Typography>
  </Paper>
)

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void; badge?: number }> = ({ label, active, onClick, badge }) => (
  <Box onClick={onClick} sx={{ px: 1.5, py: 0.4, borderRadius: 0.8, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', borderColor: active ? '#c9952a' : '#243040', color: active ? '#c9952a' : '#8fa3b8', bgcolor: active ? '#162230' : 'transparent', display: 'flex', alignItems: 'center', gap: 0.8 }}>
    {label}
    {badge != null && badge > 0 && (
      <Box sx={{ bgcolor: '#ffa726', color: '#0f1e2e', borderRadius: 0.5, px: 0.6, py: 0.1, fontSize: '0.55rem', fontWeight: 800, lineHeight: 1.4 }}>{badge}</Box>
    )}
  </Box>
)

export const ReviewPage: React.FC<Props> = ({ documents, user }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)
  const [filter, setFilter]     = useState('Pending')

  const counts = {
    pending:  documents.filter((d) => d.status === 'Pending').length,
    review:   documents.filter((d) => d.status === 'Under Review').length,
    approved: documents.filter((d) => d.status === 'Approved').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
    revision: documents.filter((d) => d.status === 'Request For Revision').length,
  }

  const filtered = filter === 'All' ? documents : documents.filter((d) => d.status === filter)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>Process 3.0 + 4.0</Typography>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Review & Process Documents</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>Staff will receive a Brevo email notification once a decision is made.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Pending"     value={counts.pending}  color="#ffa726" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Under Review" value={counts.review}   color="#ce93d8" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Approved"    value={counts.approved} color="#66bb6a" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Rejected"    value={counts.rejected} color="#ef5350" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="For Revision" value={counts.revision} color="#4fc3f7" /></Grid>
      </Grid>

      <Paper sx={{ bgcolor: '#0f1e2e' }}>
        <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid #243040' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Document Review Queue</Typography>
        </Box>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #243040', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {STATUSES.map((s) => <FilterChip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} badge={s === 'Pending' ? counts.pending : undefined} />)}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>No documents in this status</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>All caught up.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RET ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
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
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#f0e8d0' }}>{doc.submittedBy}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.submittedByEmail}</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>{fmtDate(doc.createdAt)}</Typography></TableCell>
                    <TableCell>
                      <Button variant={doc.status === 'Pending' || doc.status === 'Under Review' ? 'contained' : 'outlined'} size="small" onClick={() => setSelected(doc)} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.2 }}>
                        {doc.status === 'Pending' || doc.status === 'Under Review' ? 'Review' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user}  />
    </Box>
  )
}
