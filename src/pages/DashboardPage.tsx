import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import type { RETDocument, AppUser } from '../types';
import { StatusChip } from '../components/StatusChip';
import { SubmitDocumentModal } from '../components/SubmitDocumentModal';
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

const StatCard: React.FC<{ label: string; value: number | string; color?: string; sub?: string }> = ({ label, value, color, sub }) => (
  <Paper sx={{ p: '20px 24px', bgcolor: '#1a2e45' }}>
    <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 1 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: color || '#f5f0e8', lineHeight: 1 }}>
      {value}
    </Typography>
    {sub && <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8', mt: 0.5 }}>{sub}</Typography>}
  </Paper>
);

export const DashboardPage: React.FC<Props> = ({ documents, user, onRefresh }) => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<RETDocument | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [snack, setSnack] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const isVP = user.role === 'vp';

  // Staff sees only their own docs; VP and admin see all
  const myDocs = isVP ? documents : documents.filter((d) => d.submittedByEmail === user.email);

  const filtered = myDocs.filter((d) => {
    const matchSearch =
      !search ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.retId?.toLowerCase().includes(search.toLowerCase()) ||
      d.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: myDocs.length,
    pending: myDocs.filter((d) => d.status === 'Pending').length,
    approved: myDocs.filter((d) => d.status === 'Approved').length,
    revision: myDocs.filter((d) => d.status === 'Request For Revision').length,
    review: myDocs.filter((d) => d.status === 'Under Review').length,
  };

  const handleSubmitSuccess = (retId: string) => {
    setShowSubmit(false);
    onRefresh();
    setSnack({ open: true, message: `Document submitted successfully. RET ID: ${retId}` });
  };

  return (
    <Box>
      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={3}><StatCard label="Total Documents" value={counts.total} sub="All RET Documents" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Pending Approval" value={counts.pending} color="#ffa726" sub="Awaiting VP review" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Approved" value={counts.approved} color="#66bb6a" sub="Processed documents" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="For Revision" value={counts.revision} color="#4fc3f7" sub="Needs resubmission" /></Grid>
      </Grid>

      {/* Table Card */}
      <Paper sx={{ bgcolor: '#1a2e45' }}>
        {/* Header */}
        <Box sx={{ p: '20px 24px 16px', borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>RET Document Tracker</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.3, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
              Process 1.0 Submit + 2.0 Track
            </Typography>
          </Box>
          {!isVP && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.72rem' }}>
              Submit Document
            </Button>
          )}
        </Box>

        {/* Filters */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search title, RET ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#8fa3b8' }} /></InputAdornment>,
              sx: { fontSize: '0.8rem', minWidth: 280 },
            }}
          />
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
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
                  '&:hover': { borderColor: '#c9952a', color: '#c9952a' },
                }}
              >
                {s}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Table */}
        {filtered.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5, fontSize: '0.9rem' }}>No documents found</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem' }}>
              {!isVP ? 'Click "Submit Document" to get started.' : 'No documents match the selected filters.'}
            </Typography>
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
                  {isVP && <TableCell>Submitted By</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
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
                      <Typography sx={{ fontWeight: 500, fontSize: '0.82rem', color: '#f5f0e8', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8' }}>{doc.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.department}
                      </Typography>
                    </TableCell>
                    {isVP && (
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8' }}>{doc.submittedBy}</Typography>
                      </TableCell>
                    )}
                    <TableCell><StatusChip status={doc.status} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.68rem', color: '#8fa3b8' }}>
                        {formatDateShort(doc.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedDoc(doc)}
                        sx={{ fontSize: '0.65rem', py: 0.4, px: 1.5 }}
                      >
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

      {/* Modals */}
      <SubmitDocumentModal
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        onSuccess={handleSubmitSuccess}
        user={user}
      />
      <DocumentDetailModal
        document={selectedDoc}
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onUpdate={() => { setSelectedDoc(null); onRefresh(); }}
        user={user}
      />

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};
