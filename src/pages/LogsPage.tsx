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
import EmailIcon from '@mui/icons-material/Email'
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
  if (a.includes('Approved'))  return '#66bb6a'
  if (a.includes('Rejected'))  return '#ef5350'
  if (a.includes('Submitted')) return '#c9952a'
  if (a.includes('Revision'))  return '#4fc3f7'
  if (a.includes('Review'))    return '#ce93d8'
  return '#8fa3b8'
}

export const LogsPage: React.FC<Props> = ({ documents, logs }) => {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>Document Database</Typography>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Transaction Logs & History</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>Immutable audit trail of all document actions including Brevo email notifications.</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(201,149,42,0.2)', mb: 3, minHeight: 36 }}>
        <Tab label={`Transaction Logs (${logs.length})`} sx={{ minHeight: 36, fontSize: '0.68rem' }} />
        <Tab label={`Document History (${documents.length})`} sx={{ minHeight: 36, fontSize: '0.68rem' }} />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ bgcolor: '#1a2e45' }}>
          <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>System Audit Log</Typography>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#8fa3b8' }}>{logs.length} entries</Typography>
          </Box>
          {logs.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}><Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>No logs yet.</Typography></Box>
          ) : (
            logs.map((log, i) => (
              <Box key={log.id} sx={{ display: 'flex', gap: 2.5, px: 3, py: 1.5, borderBottom: i < logs.length - 1 ? '1px solid rgba(201,149,42,0.06)' : 'none', '&:hover': { bgcolor: 'rgba(201,149,42,0.03)' } }}>
                <Box sx={{ width: 155, flexShrink: 0 }}>
                  <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#8fa3b8', lineHeight: 1.5 }}>{fmt(log.at)}</Typography>
                </Box>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: actionColor(log.action), flexShrink: 0, mt: 0.7 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{log.action}</Typography>
                    <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#c9952a' }}>{log.docId}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', mt: 0.2 }}>{log.docTitle}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#c9952a' }}>{log.by}</Typography>
                    <Chip label={log.role} size="small" sx={{ height: 16, fontSize: '0.55rem', fontFamily: "'IBM Plex Mono',monospace", bgcolor: 'rgba(201,149,42,0.08)', color: '#8fa3b8', border: '1px solid rgba(201,149,42,0.2)', '& .MuiChip-label': { px: 0.8 } }} />
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ bgcolor: '#1a2e45' }}>
          <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>RET Document History</Typography>
          </Box>
          {documents.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}><Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>No documents submitted yet.</Typography></Box>
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
                    <TableCell>Email Notifs</TableCell>
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
                      <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8' }}>{doc.type}</Typography></TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{doc.submittedBy}</Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.submittedByEmail}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <EmailIcon sx={{ fontSize: 11, color: doc.emailSentToVP ? '#66bb6a' : '#555' }} />
                            <Typography sx={{ fontSize: '0.6rem', color: doc.emailSentToVP ? '#66bb6a' : '#555', fontFamily: "'IBM Plex Mono',monospace" }}>VP</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <EmailIcon sx={{ fontSize: 11, color: doc.emailSentToStaff ? '#4fc3f7' : '#555' }} />
                            <Typography sx={{ fontSize: '0.6rem', color: doc.emailSentToStaff ? '#4fc3f7' : '#555', fontFamily: "'IBM Plex Mono',monospace" }}>Staff</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>{fmtShort(doc.createdAt)}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>{fmtShort(doc.updatedAt)}</Typography></TableCell>
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
