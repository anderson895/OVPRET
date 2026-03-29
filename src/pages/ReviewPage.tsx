import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import type { RETDocument, AppUser } from '../types';
import { StatusChip } from '../components/StatusChip';
import { DocumentDetailModal } from '../components/DocumentDetailModal';

interface Props {
  documents: RETDocument[];
  user: AppUser;
  onRefresh: () => void;
}

const STATUSES = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Request For Revision'];

const formatDateShort = (ts: any): string => {
  if (!ts) return '—';
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

const StatCard: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => (
  <Paper sx={{ p: '16px 20px', bgcolor: '#1a2e45' }}>
    <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.8 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: color || '#f5f0e8', lineHeight: 1 }}>
      {value}
    </Typography>
  </Paper>
);

export const ReviewPage: React.FC<Props> = ({ documents, user, onRefresh }) => {
  const [selectedDoc, setSelectedDoc] = useState<RETDocument | null>(null);
  const [statusFilter, setStatusFilter] = useState('Pending');

  const counts = {
    pending: documents.filter((d) => d.status === 'Pending').length,
    review: documents.filter((d) => d.status === 'Under Review').length,
    approved: documents.filter((d) => d.status === 'Approved').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
    revision: documents.filter((d) => d.status === 'Request For Revision').length,
  };

  const filtered = documents.filter((d) => statusFilter === 'All' || d.status === statusFilter);

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Pending" value={counts.pending} color="#ffa726" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Under Review" value={counts.review} color="#ce93d8" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Approved" value={counts.approved} color="#66bb6a" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="Rejected" value={counts.rejected} color="#ef5350" /></Grid>
        <Grid item xs={6} sm={4} md={2.4}><StatCard label="For Revision" value={counts.revision} color="#4fc3f7" /></Grid>
      </Grid>

      <Paper sx={{ bgcolor: '#1a2e45' }}>
        {/* Header */}
        <Box sx={{ p: '20px 24px 16px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Review & Process Documents</Typography>
          <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.3, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
            Process 3.0 Review Document + Process 4.0 Process Document
          </Typography>
        </Box>

        {/* Status Filter */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {STATUSES.map((s) => (
            <Box
              key={s}
              onClick={() => setStatusFilter(s)}
              sx={{
                px: 1.5, py: 0.4,
                borderRadius: 0.8,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: '1px solid',
                transition: 'all 0.15s',
                borderColor: statusFilter === s ? '#c9952a' : 'rgba(201,149,42,0.2)',
                color: statusFilter === s ? '#c9952a' : '#8fa3b8',
                bgcolor: statusFilter === s ? 'rgba(201,149,42,0.08)' : 'transparent',
              }}
            >
              {s}
              {(s === 'Pending' && counts.pending > 0) && (
                <Box component="span" sx={{ ml: 0.8, bgcolor: '#ffa726', color: '#0d1b2a', borderRadius: 0.5, px: 0.6, py: 0.1, fontSize: '0.58rem', fontWeight: 800 }}>
                  {counts.pending}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Table */}
        {filtered.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>No documents in this status</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem' }}>All documents have been processed.</Typography>
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
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: '#c9952a' }}>
                        {doc.retId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.82rem', color: '#f5f0e8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8' }}>{doc.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8' }}>{doc.submittedBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.department}
                      </Typography>
                    </TableCell>
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.68rem', color: '#8fa3b8' }}>
                        {formatDateShort(doc.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={doc.status === 'Pending' || doc.status === 'Under Review' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setSelectedDoc(doc)}
                        sx={{ fontSize: '0.65rem', py: 0.4, px: 1.5 }}
                      >
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

      <DocumentDetailModal
        document={selectedDoc}
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onUpdate={() => { setSelectedDoc(null); onRefresh(); }}
        user={user}
      />
    </Box>
  );
};
