import React, { useState } from 'react'
import Box from '@mui/material/Box'
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

const fmtDate = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const ReviewPage: React.FC<Props> = ({ documents, user }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)

  // Only show documents that need action (Pending or Under Review)
  const actionable = documents.filter((d) => d.status === 'Pending' || d.status === 'Under Review')

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>OVPRET</Typography>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0A0E' }}>Review & Process Documents</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#6B4050', mt: 0.3 }}>Documents awaiting your decision. Staff will receive an email notification once a decision is made.</Typography>
      </Box>

      <Paper sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.9rem' }}>Document Review Queue</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>
              {actionable.length} document{actionable.length !== 1 ? 's' : ''} requiring action
            </Typography>
          </Box>
        </Box>

        {actionable.length === 0 ? (
          <Box sx={{ py: 9, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#2e7d32', mb: 0.5 }}>All caught up!</Typography>
            <Typography sx={{ color: '#6B4050', fontSize: '0.8rem' }}>No documents currently awaiting your review.</Typography>
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
                  <TableCell>Office</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actionable.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 500, fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050' }}>{doc.type}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#1C0A0E' }}>{doc.submittedBy}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#8B7A6B', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.submittedByEmail}</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', color: '#6B4050', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.department}</Typography></TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8B7A6B' }}>{fmtDate(doc.createdAt)}</Typography></TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" size="small" onClick={() => setSelected(doc)} sx={{ fontSize: '0.62rem', py: 0.3, px: 1.5 }}>
                        Review
                      </Button>
                    </TableCell>
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
