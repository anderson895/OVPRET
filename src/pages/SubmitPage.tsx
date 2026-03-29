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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import type { RETDocument, AppUser } from '../types';
import { StatusChip } from '../components/StatusChip';
import { SubmitDocumentModal } from '../components/SubmitDocumentModal';
import { DocumentDetailModal } from '../components/DocumentDetailModal';

interface Props {
  documents: RETDocument[];
  user: AppUser;
  
}

const formatDateShort = (ts: any): string => {
  if (!ts) return '—';
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const SubmitPage: React.FC<Props> = ({ documents, user }) => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<RETDocument | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; retId: string }>({ open: false, retId: '' });

  const myDocs = documents.filter((d) => d.submittedByEmail === user.email);

  const counts = {
    total: myDocs.length,
    pending: myDocs.filter((d) => d.status === 'Pending').length,
    approved: myDocs.filter((d) => d.status === 'Approved').length,
    revision: myDocs.filter((d) => d.status === 'Request For Revision').length,
  };

  const handleSubmitSuccess = (retId: string) => {
    setShowSubmit(false);
    
    setSnack({ open: true, retId });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
            Process 1.0
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Submit RET Document</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', mt: 0.3 }}>
            Submit documents for OVPRET Vice President approval.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.72rem' }}>
          New Document
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'My Documents', value: counts.total, color: '#f5f0e8' },
          { label: 'Pending Approval', value: counts.pending, color: '#ffa726' },
          { label: 'Approved', value: counts.approved, color: '#66bb6a' },
          { label: 'For Revision', value: counts.revision, color: '#4fc3f7' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper sx={{ p: '16px 20px', bgcolor: '#1a2e45' }}>
              <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.8 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>
                {s.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* My Documents Table */}
      <Paper sx={{ bgcolor: '#1a2e45' }}>
        <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>My Submitted Documents</Typography>
          <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
            Track the status of your RET documents
          </Typography>
        </Box>

        {myDocs.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>No documents submitted yet</Typography>
            <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem', mb: 3 }}>
              Click "New Document" to submit your first RET document for approval.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.72rem' }}>
              Submit First Document
            </Button>
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
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: '#c9952a' }}>
                        {doc.retId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#f5f0e8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>{doc.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                      {doc.feedback ? (
                        <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.feedback}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: '0.68rem', color: 'rgba(143,163,184,0.4)', fontStyle: 'italic' }}>No feedback yet</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => setSelectedDoc(doc)} sx={{ fontSize: '0.65rem', py: 0.4, px: 1.5 }}>
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <SubmitDocumentModal open={showSubmit} onClose={() => setShowSubmit(false)} onSuccess={handleSubmitSuccess} user={user} />
      <DocumentDetailModal document={selectedDoc} open={!!selectedDoc} onClose={() => setSelectedDoc(null)} onUpdate={() => { setSelectedDoc(null);  }} user={user} />

      <Snackbar open={snack.open} autoHideDuration={7000} onClose={() => setSnack({ open: false, retId: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>
          Document submitted successfully! RET ID: <strong>{snack.retId}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
};
