import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import type { RETDocument, TransactionLog } from '../types'
import { StatusChip } from '../components/StatusChip'

interface Props { documents: RETDocument[]; logs: TransactionLog[] }

const fmt = (ts: any): string => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
const fmtShort = (ts: any): string => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const actionColor = (a: string): string => {
  if (a.includes('Approved'))  return '#2e7d32'
  if (a.includes('Rejected'))  return '#c62828'
  if (a.includes('Submitted')) return '#c9952a'
  if (a.includes('Revision'))  return '#1565c0'
  if (a.includes('Review'))    return '#7b1fa2'
  return '#6B4050'
}

export const LogsPage: React.FC<Props> = ({ documents, logs }) => {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>OVPRET</Typography>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0A0E' }}>Transaction Logs & History</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#6B4050', mt: 0.3 }}>Immutable audit trail of all document actions.</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(123,28,46,0.1)', mb: 3, minHeight: 36 }}>
        <Tab label={`Transaction Logs (${logs.length})`} sx={{ minHeight: 36, fontSize: '0.68rem' }} />
        <Tab label={`Document History (${documents.length})`} sx={{ minHeight: 36, fontSize: '0.68rem' }} />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ bgcolor: '#fff' }}>
          <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>System Audit Log</Typography>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#8B7A6B' }}>{logs.length} entries</Typography>
          </Box>
          {logs.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}><Typography sx={{ color: '#8B7A6B', fontSize: '0.8rem' }}>No logs yet.</Typography></Box>
          ) : (
            logs.map((log, i) => (
              <Box key={log.id} sx={{ display: 'flex', gap: 2.5, px: 3, py: 1.5, borderBottom: i < logs.length - 1 ? '1px solid rgba(123,28,46,0.06)' : 'none', '&:hover': { bgcolor: 'rgba(123,28,46,0.02)' } }}>
                <Box sx={{ width: 155, flexShrink: 0 }}>
                  <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#8B7A6B', lineHeight: 1.5 }}>{fmt(log.at)}</Typography>
                </Box>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: actionColor(log.action), flexShrink: 0, mt: 0.7 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C0A0E' }}>{log.action}</Typography>
                    <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#c9952a' }}>{log.docId}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#6B4050', mt: 0.2 }}>{log.docTitle}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#c9952a' }}>{log.by}</Typography>
                    <Chip label={log.role} size="small" sx={{ height: 16, fontSize: '0.55rem', fontFamily: "'IBM Plex Mono',monospace", bgcolor: 'rgba(123,28,46,0.06)', color: '#6B4050', border: '1px solid rgba(123,28,46,0.12)', '& .MuiChip-label': { px: 0.8 } }} />
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ bgcolor: '#fff' }}>
          <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
            <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>RET Document History</Typography>
          </Box>
          {documents.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}><Typography sx={{ color: '#8B7A6B', fontSize: '0.8rem' }}>No documents submitted yet.</Typography></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>RET ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Submitted By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500, fontSize: '0.78rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography></TableCell>
                      <TableCell><StatusChip status={doc.status} /></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#6B4050' }}>{doc.type}</Typography></TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{doc.submittedBy}</Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: '#8B7A6B', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.submittedByEmail}</Typography>
                      </TableCell>
                      <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8B7A6B' }}>{fmtShort(doc.createdAt)}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8B7A6B' }}>{fmtShort(doc.updatedAt)}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  )
}
