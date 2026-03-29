import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EditIcon from '@mui/icons-material/Edit'
import type { RETDocument, AppUser } from '../types';
import { StatusChip } from '../components/StatusChip';
import { SubmitDocumentModal } from '../components/SubmitDocumentModal';
import { DocumentDetailModal } from '../components/DocumentDetailModal';
import { EditDocumentModal } from '../components/EditDocumentModal';

interface Props {
  documents: RETDocument[];
  user: AppUser;
}

const formatDateShort = (ts: any): string => {
  if (!ts) return '—';
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

const STEPS = [
  { step: '01', title: 'Prepare your document', desc: 'Ensure your document is complete and in PDF format before submitting.' },
  { step: '02', title: 'Fill in the details', desc: 'Provide an accurate title, document type, and department information.' },
  { step: '03', title: 'Submit for review', desc: 'Your document will be sent to the VP for review. You will be notified via email.' },
  { step: '04', title: 'Track & respond', desc: 'Monitor status in My Documents. Respond promptly to revision requests.' },
]

export const SubmitPage: React.FC<Props> = ({ documents, user }) => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<RETDocument | null>(null);
  const [editDoc, setEditDoc] = useState<RETDocument | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; retId: string }>({ open: false, retId: '' });

  const myDocs = documents.filter((d) => d.submittedByEmail === user.email);
  const pendingDocs = myDocs.filter((d) => d.status === 'Pending' || d.status === 'Under Review');
  const revisionDocs = myDocs.filter((d) => d.status === 'Request For Revision');

  const counts = {
    total: myDocs.length,
    pending: myDocs.filter((d) => d.status === 'Pending').length,
    approved: myDocs.filter((d) => d.status === 'Approved').length,
    revision: myDocs.filter((d) => d.status === 'Request For Revision').length,
    rejected: myDocs.filter((d) => d.status === 'Rejected').length,
  };

  const handleSubmitSuccess = (retId: string) => {
    setShowSubmit(false);
    setSnack({ open: true, retId });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
          Process 1.0
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>Submit RET Document</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', mt: 0.3 }}>
          Submit documents to the OVPRET Vice President for review and approval.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Submission Card + Process Steps */}
        <Grid item xs={12} md={5}>
          {/* Submit CTA Card */}
          <Paper sx={{
            bgcolor: '#0f1e2e', p: '28px 28px', borderRadius: 2, mb: 3,
            border: '1px solid #1e2a38',
            background: 'linear-gradient(160deg, #0f1e2e 60%, #1e1218 100%)',
            textAlign: 'center',
          }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#261618', border: '2px solid #243040', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <UploadFileIcon sx={{ fontSize: 26, color: '#F5A800' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem', mb: 0.8 }}>Ready to submit?</Typography>
            <Typography sx={{ fontSize: '0.73rem', color: '#8fa3b8', mb: 2.5, lineHeight: 1.65 }}>
              Click the button below to open the submission form. Make sure your document file is ready to attach.
            </Typography>
            <Button
              fullWidth variant="contained" startIcon={<AddIcon />}
              onClick={() => setShowSubmit(true)}
              sx={{ fontSize: '0.78rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, py: 1.3 }}
            >
              New Document Submission
            </Button>

            {revisionDocs.length > 0 && (
              <Box sx={{ mt: 2, p: '10px 14px', bgcolor: '#0f2030', border: '1px solid #183548', borderRadius: 1.5, textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#4fc3f7', fontWeight: 700, mb: 0.3 }}>⚠ Revision Needed</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8' }}>
                  {revisionDocs.length} document{revisionDocs.length > 1 ? 's' : ''} require{revisionDocs.length === 1 ? 's' : ''} your attention. Check the table below.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* How it works */}
          <Paper sx={{ bgcolor: '#0f1e2e', p: '20px 24px', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: '#F5A800' }} />
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>How the process works</Typography>
            </Box>
            {STEPS.map((s, i) => (
              <Box key={s.step} sx={{ display: 'flex', gap: 2, mb: i < STEPS.length - 1 ? 2 : 0 }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '6px', bgcolor: '#1b2636',
                  border: '1px solid #2a3545', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.55rem', fontWeight: 800, color: '#F5A800' }}>{s.step}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#f0e8d0', fontSize: '0.78rem', mb: 0.2 }}>{s.title}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', lineHeight: 1.6 }}>{s.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right: Documents Table */}
        <Grid item xs={12} md={7}>
          {/* Stats row */}
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            {[
              { label: 'Total', value: counts.total, color: '#f0e8d0' },
              { label: 'Pending', value: counts.pending, color: '#ffa726' },
              { label: 'Approved', value: counts.approved, color: '#66bb6a' },
              { label: 'Revision', value: counts.revision, color: '#4fc3f7' },
            ].map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Paper sx={{ p: '12px 16px', bgcolor: '#0f1e2e', borderRadius: 2, borderLeft: `3px solid ${s.color}50` }}>
                  <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '1.5px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.6 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Submissions Table */}
          <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid #1e2a38', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>My Submitted Documents</Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>
                  Track the status of your RET submissions
                </Typography>
              </Box>
              <AssignmentTurnedInIcon sx={{ fontSize: 18, color: 'rgba(245,168,0,0.35)' }} />
            </Box>

            {myDocs.length === 0 ? (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 36, color: 'rgba(143,163,184,0.25)', mb: 1.5 }} />
                <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>No documents submitted yet</Typography>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem', mb: 3 }}>
                  Use the submission form to send your first RET document for VP approval.
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
                      {['RET ID', 'Title', 'Type', 'Status', 'Date Submitted', 'VP Feedback', 'Action'].map((h) => (
                        <TableCell key={h} sx={{ color: '#8fa3b8', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', py: 1.2 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myDocs.map((doc) => (
                      <TableRow key={doc.id} sx={{ '&:hover': { bgcolor: '#121e2d' } }}>
                        <TableCell>
                          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a' }}>{doc.retId}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#f0e8d0', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.73rem', color: '#8fa3b8' }}>{doc.type}</Typography>
                        </TableCell>
                        <TableCell><StatusChip status={doc.status} /></TableCell>
                        <TableCell>
                          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.66rem', color: '#8fa3b8' }}>
                            {formatDateShort(doc.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {doc.feedback ? (
                            <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {doc.feedback}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: '0.66rem', color: 'rgba(143,163,184,0.4)', fontStyle: 'italic' }}>Awaiting…</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.8 }}>
                            <Button
                              variant="outlined" size="small"
                              onClick={() => setSelectedDoc(doc)}
                              sx={{ fontSize: '0.63rem', py: 0.4, px: 1.5, borderColor: '#2a3545', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' } }}
                            >
                              Track
                            </Button>
                            <Button
                              variant="outlined" size="small" startIcon={<EditIcon sx={{ fontSize: '0.7rem !important' }} />}
                              onClick={() => setEditDoc(doc)}
                              sx={{ fontSize: '0.63rem', py: 0.4, px: 1.2, borderColor: '#2a3545', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' } }}
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
        </Grid>
      </Grid>

      <SubmitDocumentModal open={showSubmit} onClose={() => setShowSubmit(false)} onSuccess={handleSubmitSuccess} user={user} />
      <DocumentDetailModal document={selectedDoc} open={!!selectedDoc} onClose={() => setSelectedDoc(null)} onUpdate={() => setSelectedDoc(null)} user={user} />
      <EditDocumentModal document={editDoc} open={!!editDoc} onClose={() => setEditDoc(null)} onSuccess={() => setEditDoc(null)} user={user} />

      <Snackbar open={snack.open} autoHideDuration={7000} onClose={() => setSnack({ open: false, retId: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>
          Document submitted! RET ID: <strong>{snack.retId}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
};
