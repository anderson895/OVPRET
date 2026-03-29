import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import LoopIcon from '@mui/icons-material/Loop'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'
import { SubmitDocumentModal } from '../components/SubmitDocumentModal'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface Props { documents: RETDocument[]; user: AppUser; onNavigate?: (p: any) => void }

const fmtTime = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_COLOR: Record<string, string> = {
  'Pending': '#ffa726',
  'Under Review': '#ce93d8',
  'Approved': '#66bb6a',
  'Rejected': '#ef5350',
  'Request For Revision': '#4fc3f7',
}

const TIPS = [
  'Make sure your document title clearly describes its purpose before submitting.',
  'Attach the correct file type (PDF recommended) to avoid delays in review.',
  'Check your My Documents page regularly to catch revision requests early.',
  'If your document is rejected, read the VP feedback carefully before resubmitting.',
  'Approved documents are final — keep a local copy for your records.',
  'Use descriptive remarks when submitting to help the VP understand context faster.',
  'You can track the full history of any document by clicking on it.',
]

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

  const activityFeed = [...myDocs]
    .sort((a, b) => {
      const da = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt || 0)
      const db = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt || 0)
      return db.getTime() - da.getTime()
    })
    .slice(0, 6)

  const pendingRevision = myDocs.filter((d) => d.status === 'Request For Revision')
  const tipOfDay = TIPS[new Date().getDay() % TIPS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper sx={{
        bgcolor: '#0f1e2e', p: '22px 28px', mb: 3,
        background: 'linear-gradient(135deg, #0f1e2e 55%, #261618 100%)',
        border: '1px solid #1e2a38', borderRadius: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'rgba(245,168,0,0.6)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", mb: 0.5 }}>
              {greeting}
            </Typography>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', mb: 0.3 }}>
              {user.displayName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8' }}>
              {user.department || 'Staff Member'} · OVPRET Document Tracking System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained" startIcon={<UploadFileIcon />}
              onClick={() => setShowSubmit(true)}
              sx={{ fontSize: '0.75rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, px: 2.5, py: 1.2 }}
            >
              Submit Document
            </Button>
            {onNavigate && (
              <Button
                variant="outlined" startIcon={<FolderOpenIcon />}
                onClick={() => onNavigate('my-documents')}
                sx={{ fontSize: '0.75rem', borderColor: 'rgba(245,168,0,0.4)', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' }, px: 2.5, py: 1.2 }}
              >
                My Documents
              </Button>
            )}
          </Box>
        </Box>

        {pendingRevision.length > 0 && (
          <Box sx={{ mt: 2.5, p: '10px 16px', bgcolor: '#0f2030', border: '1px solid #1a3a50', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <NotificationsActiveIcon sx={{ fontSize: 18, color: '#4fc3f7', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#4fc3f7', fontWeight: 600 }}>
              Action required: {pendingRevision.length} document{pendingRevision.length > 1 ? 's' : ''} sent back for revision. Please review and resubmit.
            </Typography>
            {onNavigate && (
              <Button size="small" onClick={() => onNavigate('my-documents')}
                sx={{ ml: 'auto', fontSize: '0.63rem', color: '#4fc3f7', flexShrink: 0, textTransform: 'none' }}>
                View Now
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Submitted', value: counts.total,    color: '#f0e8d0', icon: <HistoryEduIcon sx={{ fontSize: 18 }} /> },
          { label: 'Pending',         value: counts.pending,  color: '#ffa726', icon: <PendingIcon sx={{ fontSize: 18 }} /> },
          { label: 'Under Review',    value: counts.review,   color: '#ce93d8', icon: <LoopIcon sx={{ fontSize: 18 }} /> },
          { label: 'Approved',        value: counts.approved, color: '#66bb6a', icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: 'For Revision',    value: counts.revision, color: '#4fc3f7', icon: <LoopIcon sx={{ fontSize: 18 }} /> },
          { label: 'Rejected',        value: counts.rejected, color: '#ef5350', icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} /> },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2} key={s.label}>
            <Paper sx={{
              p: '14px 16px', bgcolor: '#0f1e2e', borderRadius: 2,
              borderBottom: `2px solid ${s.color}40`,
              transition: 'transform 0.15s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}>
              <Box sx={{ color: s.color, mb: 0.8, opacity: 0.7 }}>{s.icon}</Box>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.56rem', color: '#8fa3b8', textTransform: 'uppercase', letterSpacing: '1.2px', mt: 0.6, fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Activity Feed / Timeline */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '18px 24px', borderBottom: '1px solid #1e2a38', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Recent Activity</Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Latest updates on your documents</Typography>
              </Box>
              {onNavigate && (
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => onNavigate('my-documents')}
                  sx={{ fontSize: '0.65rem', color: '#c9952a', textTransform: 'none' }}>
                  All Documents
                </Button>
              )}
            </Box>

            {activityFeed.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.82rem', mb: 2 }}>No activity yet. Submit your first document!</Typography>
                <Button variant="outlined" size="small" onClick={() => setShowSubmit(true)} sx={{ fontSize: '0.7rem' }}>Submit Document</Button>
              </Box>
            ) : (
              <Box sx={{ px: 3, py: 2.5 }}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'absolute', left: 4, top: 12, bottom: 12, width: 2, bgcolor: '#1a2535', borderRadius: 1 }} />
                  {activityFeed.map((doc, idx) => {
                    const statusColor = STATUS_COLOR[doc.status] || '#8fa3b8'
                    return (
                      <Box
                        key={doc.id}
                        onClick={() => setSelected(doc)}
                        sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: idx < activityFeed.length - 1 ? 2.5 : 0, cursor: 'pointer', '&:hover .doc-title': { color: '#F5A800' } }}
                      >
                        <Box sx={{
                          width: 10, height: 10, borderRadius: '50%', bgcolor: statusColor,
                          flexShrink: 0, mt: 0.6, zIndex: 1,
                          boxShadow: `0 0 8px ${statusColor}50`,
                        }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3, flexWrap: 'wrap' }}>
                            <Typography className="doc-title" sx={{ fontWeight: 600, color: '#f0e8d0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0, transition: 'color 0.15s' }}>
                              {doc.title}
                            </Typography>
                            <StatusChip status={doc.status} />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '0.6rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8' }}>·</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8' }}>{fmtTime(doc.updatedAt || doc.createdAt)}</Typography>
                            {doc.feedback && (
                              <>
                                <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8' }}>·</Typography>
                                <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8', fontStyle: 'italic', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  "{doc.feedback}"
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={5}>
          {/* Quick Actions */}
          <Paper sx={{ bgcolor: '#0f1e2e', p: '20px 24px', borderRadius: 2, mb: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 0.4 }}>Quick Actions</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mb: 2.5, fontFamily: "'IBM Plex Mono',monospace" }}>Common tasks at a glance</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Button
                fullWidth variant="contained" startIcon={<UploadFileIcon />}
                onClick={() => setShowSubmit(true)}
                sx={{ justifyContent: 'flex-start', fontSize: '0.78rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, py: 1.2, px: 2 }}
              >
                Submit New Document
              </Button>
              {onNavigate && (
                <Button
                  fullWidth variant="outlined" startIcon={<FolderOpenIcon />}
                  onClick={() => onNavigate('my-documents')}
                  sx={{ justifyContent: 'flex-start', fontSize: '0.78rem', borderColor: 'rgba(245,168,0,0.3)', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' }, py: 1.2, px: 2 }}
                >
                  Manage My Documents
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.78rem', mb: 1.5 }}>Status Summary</Typography>
            {counts.total === 0 ? (
              <Typography sx={{ color: '#8fa3b8', fontSize: '0.75rem' }}>Submit a document to see your summary.</Typography>
            ) : (
              [
                { label: 'Approved',    count: counts.approved, color: '#66bb6a' },
                { label: 'Pending',     count: counts.pending,  color: '#ffa726' },
                { label: 'For Revision',count: counts.revision, color: '#4fc3f7' },
                { label: 'Rejected',    count: counts.rejected, color: '#ef5350' },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', flex: 1 }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: row.color, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>
                    {row.count}/{counts.total}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          {/* Tip of the Day */}
          <Paper sx={{ bgcolor: '#0f1e2e', p: '18px 22px', borderRadius: 2, border: '1px solid #1e2a38' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <TipsAndUpdatesIcon sx={{ fontSize: 16, color: '#F5A800' }} />
              <Typography sx={{ fontWeight: 700, color: '#F5A800', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Tip of the Day</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', lineHeight: 1.7 }}>
              {tipOfDay}
            </Typography>
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
