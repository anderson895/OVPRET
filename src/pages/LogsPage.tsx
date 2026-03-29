import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import type { RETDocument, TransactionLog } from '../types';
import { StatusChip } from '../components/StatusChip';

interface Props {
  documents: RETDocument[];
  logs: TransactionLog[];
}

const formatDate = (ts: any): string => {
  if (!ts) return '—';
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatDateShort = (ts: any): string => {
  if (!ts) return '—';
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

const actionColor = (action: string): string => {
  if (action.includes('Approved')) return '#66bb6a';
  if (action.includes('Rejected')) return '#ef5350';
  if (action.includes('Submitted')) return '#c9952a';
  if (action.includes('Revision')) return '#4fc3f7';
  if (action.includes('Review')) return '#ce93d8';
  return '#8fa3b8';
};

export const LogsPage: React.FC<Props> = ({ documents, logs }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
          Document Database
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Transaction Logs & History</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', mt: 0.3 }}>
          Immutable audit trail of all document actions in the system.
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(201,149,42,0.2)', mb: 3, minHeight: 38 }}>
        <Tab label={`Transaction Logs (${logs.length})`} sx={{ minHeight: 38, fontSize: '0.7rem' }} />
        <Tab label={`Document History (${documents.length})`} sx={{ minHeight: 38, fontSize: '0.7rem' }} />
      </Tabs>

      {/* Tab 1: Transaction Logs */}
      {tab === 0 && (
        <Paper sx={{ bgcolor: '#1a2e45' }}>
          <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>System Audit Log</Typography>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8' }}>
              {logs.length} entries &mdash; sorted newest first
            </Typography>
          </Box>

          {logs.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem' }}>No transaction logs yet.</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 0 }}>
              {logs.map((log, i) => (
                <Box
                  key={log.id}
                  sx={{
                    display: 'flex',
                    gap: 2.5,
                    px: 3,
                    py: 1.5,
                    borderBottom: i < logs.length - 1 ? '1px solid rgba(201,149,42,0.06)' : 'none',
                    transition: 'background 0.1s',
                    '&:hover': { bgcolor: 'rgba(201,149,42,0.03)' },
                  }}
                >
                  {/* Time */}
                  <Box sx={{ width: 150, flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8', lineHeight: 1.4 }}>
                      {formatDate(log.at)}
                    </Typography>
                  </Box>

                  {/* Dot */}
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: actionColor(log.action), flexShrink: 0, mt: 0.6 }} />

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{log.action}</Typography>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#c9952a' }}>{log.docId}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.2 }}>
                      {log.docTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: '#c9952a' }}>{log.by}</Typography>
                      <Chip
                        label={log.role}
                        size="small"
                        sx={{ height: 16, fontSize: '0.55rem', fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '0.5px', bgcolor: 'rgba(201,149,42,0.1)', color: '#8fa3b8', border: '1px solid rgba(201,149,42,0.2)', '& .MuiChip-label': { px: 0.8 } }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* Tab 2: Document History */}
      {tab === 1 && (
        <Paper sx={{ bgcolor: '#1a2e45' }}>
          <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>RET Document History</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2 }}>All submitted RET documents and their current status</Typography>
          </Box>

          {documents.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem' }}>No documents submitted yet.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>RET ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Submitted By</TableCell>
                    <TableCell>Date Submitted</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: '#c9952a' }}>
                          {doc.retId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#f5f0e8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.title}
                        </Typography>
                      </TableCell>
                      <TableCell><StatusChip status={doc.status} /></TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.type}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.submittedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.68rem', color: '#8fa3b8' }}>
                          {formatDateShort(doc.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.68rem', color: '#8fa3b8' }}>
                          {formatDateShort(doc.updatedAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};
