import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditNoteIcon from '@mui/icons-material/EditNote'
import VisibilityIcon from '@mui/icons-material/Visibility'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from './StatusChip'
import { updateDocumentStatus } from '../services/documents'
import { logError } from '../services/errorLogger'

interface Props {
  document: RETDocument | null; open: boolean
  onClose: () => void; onUpdate: () => void; user: AppUser
  viewOnly?: boolean
}

const STATUS_PROGRESS: Record<string, number> = {
  'Pending': 15, 'Under Review': 45, 'Request For Revision': 65, 'Approved': 100, 'Rejected': 100,
}

const fmt = (ts: any): string => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box>
    <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', color: '#6B4050', textTransform: 'uppercase', mb: 0.5 }}>{label}</Typography>
    <Box sx={{ fontSize: '0.82rem', color: '#1C0A0E' }}>{value}</Box>
  </Box>
)

export const DocumentDetailModal: React.FC<Props> = ({ document: doc, open, onClose, onUpdate, user, viewOnly = false }) => {
  const [tab, setTab] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!doc) return null

  const isVP  = user.role === 'vp'
  const isDecided = doc.status === 'Approved' || doc.status === 'Rejected'
  const canAct = isVP && !isDecided && !viewOnly
  const progress = STATUS_PROGRESS[doc.status] || 20

  const handleAction = async (status: string) => {
    if (!feedback.trim() && status !== 'Under Review' && status !== 'Approved') {
      setMsg({ type: 'error', text: 'Please provide feedback before rejecting or requesting revision.' })
      return
    }
    setLoading(true); setMsg(null)
    try {
      await updateDocumentStatus({
        docId: doc.id, retId: doc.retId, docTitle: doc.title,
        status: status as any, feedback,
        currentHistory: doc.history || [],
        vpName: user.displayName, vpEmail: user.email,
        staffName: doc.submittedBy, staffEmail: doc.submittedByEmail,
      })
      setMsg({ type: 'success', text: `Document ${status}. Staff notified via email.` })
      setFeedback('')
      setTimeout(() => { onUpdate() }, 1500)
    } catch (e: any) {
      const errMsg = e.message || 'Action failed.'
      setMsg({ type: 'error', text: errMsg })
      logError({ message: errMsg, error: e, component: 'DocumentDetailModal', action: `document_${status}`, userId: user.uid, userEmail: user.email, userRole: user.role })
    } finally { setLoading(false) }
  }

  const barColor = doc.status === 'Rejected' ? '#c62828' : doc.status === 'Approved' ? '#2e7d32' : '#c9952a'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: '90vh', bgcolor: '#fff', backgroundImage: 'none' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(123,28,46,0.1)', bgcolor: '#fff' }}>
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '1rem', lineHeight: 1.3, mb: 0.5 }}>{doc.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: '#c9952a', letterSpacing: '1px' }}>{doc.retId}</Typography>
            <StatusChip status={doc.status} />
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8B7A6B', mt: -0.5 }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      {/* Progress bar */}
      <Box sx={{ px: 3, pt: 2, bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '0.6rem', color: '#6B4050', fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>PROCESSING STATUS</Typography>
          <Typography sx={{ fontSize: '0.6rem', color: barColor, fontFamily: "'IBM Plex Mono',monospace" }}>{progress}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 4, '& .MuiLinearProgress-bar': { bgcolor: barColor } }} />
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, pt: 1.5, bgcolor: '#fff' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(123,28,46,0.1)', minHeight: 36 }}>
          <Tab label="Details" sx={{ minHeight: 36, fontSize: '0.67rem' }} />
          <Tab label="Tracking History" sx={{ minHeight: 36, fontSize: '0.67rem' }} />
          {canAct && <Tab label="VP Action" sx={{ minHeight: 36, fontSize: '0.67rem', color: '#7B1C2E !important' }} />}
        </Tabs>
      </Box>

      {/* Lock banner for view-only */}
      {isVP && viewOnly && (
        <Box sx={{ mx: 3, mt: 2, p: '10px 16px', bgcolor: doc.status === 'Approved' ? 'rgba(46,125,50,0.06)' : 'rgba(198,40,40,0.06)', border: `1px solid ${doc.status === 'Approved' ? 'rgba(46,125,50,0.2)' : 'rgba(198,40,40,0.2)'}`, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: doc.status === 'Approved' ? '#2e7d32' : doc.status === 'Rejected' ? '#c62828' : '#1565c0' }}>
            Document {doc.status} — View Only
          </Typography>
        </Box>
      )}

      <DialogContent sx={{ pt: 2.5, bgcolor: '#fff' }}>
        {/* DETAILS */}
        {tab === 0 && (
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><InfoRow label="Document Type" value={doc.type} /></Grid>
            <Grid item xs={12} sm={6}><InfoRow label="Office" value={doc.department} /></Grid>
            <Grid item xs={12} sm={6}><InfoRow label="Submitted By" value={doc.submittedBy} /></Grid>
            <Grid item xs={12} sm={6}><InfoRow label="Email" value={<Typography sx={{ fontSize: '0.82rem', color: '#1565c0' }}>{doc.submittedByEmail}</Typography>} /></Grid>
            <Grid item xs={12} sm={6}><InfoRow label="Date Submitted" value={<Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.75rem' }}>{fmt(doc.createdAt)}</Typography>} /></Grid>
            <Grid item xs={12} sm={6}><InfoRow label="Last Updated"  value={<Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.75rem' }}>{fmt(doc.updatedAt)}</Typography>} /></Grid>
            {doc.remarks && (
              <Grid item xs={12}><InfoRow label="Remarks" value={<Box sx={{ mt: 0.5, p: 1.5, bgcolor: '#F9F6F1', borderRadius: 1, borderLeft: '2px solid rgba(123,28,46,0.3)', fontSize: '0.82rem' }}>{doc.remarks}</Box>} /></Grid>
            )}
            {doc.feedback && (
              <Grid item xs={12}><InfoRow label="VP Feedback" value={<Box sx={{ mt: 0.5, p: 1.5, bgcolor: '#F9F6F1', borderRadius: 1, borderLeft: '2px solid #c9952a', fontSize: '0.82rem' }}>{doc.feedback}</Box>} /></Grid>
            )}
            {doc.fileUrl && (
              <Grid item xs={12}>
                <InfoRow label="Attached File" value={
                  <Button variant="outlined" size="small" endIcon={<OpenInNewIcon fontSize="small" />} href={doc.fileUrl} target="_blank" rel="noreferrer" sx={{ mt: 0.5, fontSize: '0.7rem', borderColor: 'rgba(123,28,46,0.2)', color: '#7B1C2E' }}>
                    {doc.fileName || 'View / Download'}
                  </Button>
                } />
              </Grid>
            )}
          </Grid>
        )}

        {/* TRACKING HISTORY */}
        {tab === 1 && (
          <Box sx={{ bgcolor: '#fff' }}>
            {(!doc.history || doc.history.length === 0) ? (
              <Typography sx={{ color: '#8B7A6B', fontSize: '0.82rem', textAlign: 'center', py: 4 }}>No history recorded.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                {doc.history.map((h: any, i: number) => {
                  const isLast = i === doc.history.length - 1
                  const dotColor = h.action === 'Approved' ? '#2e7d32' : h.action === 'Rejected' ? '#c62828' : h.action === 'Submitted' ? '#c9952a' : h.action === 'Edited' ? '#7b1fa2' : '#1565c0'
                  return (
                    <Box key={i} sx={{ display: 'flex', gap: 2, position: 'relative', bgcolor: '#fff' }}>
                      {!isLast && <Box sx={{ position: 'absolute', left: 13, top: 28, width: '1px', bottom: 0, bgcolor: 'rgba(123,28,46,0.1)', zIndex: 0 }} />}
                      <Box sx={{ width: 27, height: 27, borderRadius: '50%', bgcolor: `${dotColor}15`, border: `1px solid ${dotColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.3, zIndex: 1 }}>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: dotColor }}>{i + 1}</Typography>
                      </Box>
                      <Box sx={{ flex: 1, pb: 3 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C0A0E' }}>{h.action}</Typography>
                        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#8B7A6B', mt: 0.2 }}>
                          {h.by} — {fmt(h.at)}
                        </Typography>
                        {h.note && <Box sx={{ mt: 0.8, p: 1.2, bgcolor: '#F9F6F1', borderRadius: 1, fontSize: '0.78rem', color: '#6B4050' }}>{h.note}</Box>}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        )}

        {/* VP ACTION */}
        {tab === 2 && canAct && (
          <Box>
            {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

            <TextField
              label="Feedback / Comments"
              fullWidth multiline minRows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
              placeholder="Enter your feedback. Required for Reject and Request Revision."
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 2.5 }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: '#6B4050', textTransform: 'uppercase', mb: 2 }}>Select Decision</Typography>

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="outlined" startIcon={<VisibilityIcon />} onClick={() => handleAction('Under Review')} disabled={loading}
                  sx={{ fontSize: '0.72rem', borderColor: 'rgba(123,31,162,0.3)', color: '#7b1fa2', '&:hover': { bgcolor: 'rgba(123,31,162,0.05)', borderColor: '#7b1fa2' } }}>
                  Mark Under Review
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" startIcon={<CheckCircleIcon />} onClick={() => handleAction('Approved')} disabled={loading}
                  sx={{ fontSize: '0.72rem', bgcolor: '#2e7d32', color: '#fff', '&:hover': { bgcolor: '#388e3c' } }}>
                  Approve
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="outlined" startIcon={<EditNoteIcon />} onClick={() => handleAction('Request For Revision')} disabled={loading}
                  sx={{ fontSize: '0.72rem', borderColor: 'rgba(21,101,192,0.3)', color: '#1565c0', '&:hover': { bgcolor: 'rgba(21,101,192,0.05)', borderColor: '#1565c0' } }}>
                  Request Revision
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="outlined" startIcon={<CancelIcon />} onClick={() => handleAction('Rejected')} disabled={loading}
                  sx={{ fontSize: '0.72rem', borderColor: 'rgba(198,40,40,0.3)', color: '#c62828', '&:hover': { bgcolor: 'rgba(198,40,40,0.05)', borderColor: '#c62828' } }}>
                  Reject
                </Button>
              </Grid>
            </Grid>
            {loading && <LinearProgress sx={{ mt: 2 }} />}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, borderTop: '1px solid rgba(123,28,46,0.1)', bgcolor: '#fff' }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontSize: '0.72rem' }}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}