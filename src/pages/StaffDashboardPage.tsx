import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import LoopIcon from '@mui/icons-material/Loop'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'
import { SubmitDocumentModal } from '../components/SubmitDocumentModal'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface Props { documents: RETDocument[]; user: AppUser; onNavigate?: (p: any) => void }

const fmt = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const StaffDashboardPage: React.FC<Props> = ({ documents, user, onNavigate }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)
  const [snack, setSnack] = useState({ open: false, msg: '' })

  const myDocs = documents.filter((d) => d.submittedByEmail === user.email)
  const counts = {
    total:    myDocs.length,
    pending:  myDocs.filter((d) => d.status === 'Pending').length,
    approved: myDocs.filter((d) => d.status === 'Approved').length,
    rejected: myDocs.filter((d) => d.status === 'Rejected').length,
    revision: myDocs.filter((d) => d.status === 'Request For Revision').length,
    review:   myDocs.filter((d) => d.status === 'Under Review').length,
  }

  const recentDocs = [...myDocs].sort((a, b) => {
    const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const db2 = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return db2.getTime() - da.getTime()
  }).slice(0, 5)

  const pendingRevision = myDocs.filter((d) => d.status === 'Request For Revision')

  return (
    <Box>
      {/* Welcome banner */}
      <Paper sx={{
        bgcolor: '#0f1e2e', p: '20px 28px', mb: 3,
        background: 'linear-gradient(135deg, #0f1e2e 60%, rgba(123,28,46,0.25) 100%)',
        border: '1px solid rgba(245,168,0,0.15)', borderRadius: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'rgba(245,168,0,0.6)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            {user.displayName}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>
            {user.department || 'Staff Member'} · OVPRET DTS
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<UploadFileIcon />}
          onClick={() => setShowSubmit(true)}
          sx={{ fontSize: '0.75rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, px: 2.5, py: 1.2 }}
        >
          Submit New Document
        </Button>
      </Paper>

      {/* Status overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Submitted', value: counts.total, color: '#f0e8d0', icon: <UploadFileIcon sx={{ fontSize: 20 }} /> },
          { label: 'Pending Approval', value: counts.pending, color: '#ffa726', icon: <PendingIcon sx={{ fontSize: 20 }} /> },
          { label: 'Under Review', value: counts.review, color: '#ce93d8', icon: <LoopIcon sx={{ fontSize: 20 }} /> },
          { label: 'Approved', value: counts.approved, color: '#66bb6a', icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} /> },
          { label: 'For Revision', value: counts.revision, color: '#4fc3f7', icon: <LoopIcon sx={{ fontSize: 20 }} /> },
          { label: 'Rejected', value: counts.rejected, color: '#ef5350', icon: <CancelOutlinedIcon sx={{ fontSize: 20 }} /> },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2} key={s.label}>
            <Paper sx={{ p: '14px 16px', bgcolor: '#0f1e2e', borderRadius: 2, borderTop: `2px solid ${s.color}30` }}>
              <Box sx={{ color: s.color, mb: 0.8, opacity: 0.7 }}>{s.icon}</Box>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.58rem', color: '#8fa3b8', textTransform: 'uppercase', letterSpacing: '1px', mt: 0.6, fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Progress overview */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ bgcolor: '#0f1e2e', p: '20px 24px', borderRadius: 2, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 0.4 }}>Document Progress</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mb: 2.5, fontFamily: "'IBM Plex Mono',monospace" }}>
              My submission status breakdown
            </Typography>
            {counts.total === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem' }}>No documents submitted yet.</Typography>
              </Box>
            ) : (
              [
                { label: 'Approved', count: counts.approved, color: '#66bb6a' },
                { label: 'Under Review', count: counts.review, color: '#ce93d8' },
                { label: 'Pending', count: counts.pending, color: '#ffa726' },
                { label: 'For Revision', count: counts.revision, color: '#4fc3f7' },
                { label: 'Rejected', count: counts.rejected, color: '#ef5350' },
              ].map((row) => (
                <Box key={row.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', fontWeight: 600 }}>{row.label}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: row.color, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>
                      {row.count} / {counts.total}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={counts.total > 0 ? (row.count / counts.total) * 100 : 0}
                    sx={{
                      height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': { bgcolor: row.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              ))
            )}
            {pendingRevision.length > 0 && (
              <>
                <Divider sx={{ borderColor: 'rgba(245,168,0,0.15)', my: 2.5 }} />
                <Box sx={{ p: 1.5, bgcolor: 'rgba(79,195,247,0.08)', border: '1px solid rgba(79,195,247,0.2)', borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#4fc3f7', mb: 0.5 }}>
                    ⚠ Action Required
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8' }}>
                    You have {pendingRevision.length} document{pendingRevision.length > 1 ? 's' : ''} requesting revision. Please review and resubmit.
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Recent documents */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '18px 24px', borderBottom: '1px solid rgba(245,168,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Recent Submissions</Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Latest 5 documents</Typography>
              </Box>
              {onNavigate && (
                <Button
                  size="small" endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate('my-documents')}
                  sx={{ fontSize: '0.65rem', color: '#c9952a', textTransform: 'none' }}
                >
                  View All
                </Button>
              )}
            </Box>
            {recentDocs.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem', mb: 2 }}>No documents submitted yet.</Typography>
                <Button variant="outlined" size="small" onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.7rem' }}>Submit First Document</Button>
              </Box>
            ) : (
              recentDocs.map((doc, i) => (
                <Box key={doc.id} sx={{
                  px: 3, py: 2,
                  borderBottom: i < recentDocs.length - 1 ? '1px solid rgba(245,168,0,0.08)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, cursor: 'pointer',
                }} onClick={() => setSelected(doc)}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, color: '#f0e8d0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 0.4 }}>
                      <Typography sx={{ fontSize: '0.62rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId}</Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>·</Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>{fmt(doc.createdAt)}</Typography>
                    </Box>
                  </Box>
                  <StatusChip status={doc.status} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      <SubmitDocumentModal open={showSubmit} onClose={() => setShowSubmit(false)}
        onSuccess={(id) => { setShowSubmit(false); setSnack({ open: true, msg: `Submitted! RET ID: ${id}` }) }} user={user} />
      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack({ open: false, msg: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontSize: '0.78rem' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  )
}
