import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LoopIcon from '@mui/icons-material/Loop'
import GradingIcon from '@mui/icons-material/Grading'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'

interface Props { documents: RETDocument[]; user: AppUser; onNavigate?: (p: any) => void }

const fmt = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const VPDashboardPage: React.FC<Props> = ({ documents, user, onNavigate }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)

  const counts = {
    total:    documents.length,
    pending:  documents.filter((d) => d.status === 'Pending').length,
    review:   documents.filter((d) => d.status === 'Under Review').length,
    approved: documents.filter((d) => d.status === 'Approved').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
    revision: documents.filter((d) => d.status === 'Request For Revision').length,
  }

  const needsAction = documents.filter((d) => d.status === 'Pending' || d.status === 'Under Review')
  const recentDecisions = documents
    .filter((d) => d.status === 'Approved' || d.status === 'Rejected' || d.status === 'Request For Revision')
    .sort((a, b) => {
      const da = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0)
      const db2 = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0)
      return db2.getTime() - da.getTime()
    }).slice(0, 4)

  const typeBreakdown = ['Research', 'Extension', 'Technology', 'Financial', 'Proposal', 'Administrative', 'MOA', 'Other']
    .map((type) => ({ type, count: documents.filter((d) => d.type === type).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <Box>
      <Paper sx={{
        bgcolor: '#0f1e2e', p: '20px 28px', mb: 3,
        background: 'linear-gradient(135deg, #0f1e2e 60%, #221418 100%)',
        border: '1px solid #1e2a38', borderRadius: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'rgba(245,168,0,0.6)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{user.displayName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', mt: 0.3 }}>Vice President for Research, Extension & Technology</Typography>
        </Box>
        {counts.pending > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ px: 2, py: 1, bgcolor: '#1e2a10', border: '1px solid rgba(255,167,38,0.3)', borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#ffa726', fontWeight: 700 }}>
                🔔 {counts.pending} document{counts.pending > 1 ? 's' : ''} awaiting your review
              </Typography>
            </Box>
            {onNavigate && (
              <Button variant="contained" endIcon={<GradingIcon />} onClick={() => onNavigate('review')}
                sx={{ fontSize: '0.72rem', bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, px: 2 }}>
                Review Now
              </Button>
            )}
          </Box>
        )}
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Documents', value: counts.total, color: '#f0e8d0' },
          { label: 'Needs Review', value: counts.pending + counts.review, color: '#ffa726' },
          { label: 'Approved', value: counts.approved, color: '#66bb6a' },
          { label: 'Rejected', value: counts.rejected, color: '#ef5350' },
          { label: 'For Revision', value: counts.revision, color: '#4fc3f7' },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2.4} key={s.label}>
            <Paper sx={{ p: '16px 20px', bgcolor: '#0f1e2e', borderRadius: 2, borderLeft: `3px solid ${s.color}50` }}>
              <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.8 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '18px 24px', borderBottom: '1px solid #1e2a38', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Pending Action Queue</Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Documents awaiting your decision</Typography>
              </Box>
              {onNavigate && (
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => onNavigate('review')}
                  sx={{ fontSize: '0.65rem', color: '#c9952a', textTransform: 'none' }}>
                  All Documents
                </Button>
              )}
            </Box>
            {needsAction.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#66bb6a', fontSize: '0.82rem', fontWeight: 600 }}>✓ All caught up!</Typography>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.75rem', mt: 0.5 }}>No documents currently awaiting review.</Typography>
              </Box>
            ) : needsAction.slice(0, 5).map((doc, i) => (
              <Box key={doc.id} sx={{
                px: 3, py: 2,
                borderBottom: i < Math.min(needsAction.length, 5) - 1 ? '1px solid #162230' : 'none',
                display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { bgcolor: '#121e2d' }, cursor: 'pointer',
              }} onClick={() => setSelected(doc)}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, color: '#f0e8d0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 0.4 }}>
                    <Typography sx={{ fontSize: '0.62rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId}</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>·</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>{doc.submittedBy}</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>·</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8' }}>{fmt(doc.createdAt)}</Typography>
                  </Box>
                </Box>
                <StatusChip status={doc.status} />
                <Button variant="contained" size="small"
                  sx={{ fontSize: '0.6rem', py: 0.4, px: 1.2, bgcolor: '#7B1C2E', '&:hover': { bgcolor: '#a8283f' }, flexShrink: 0 }}>
                  Review
                </Button>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ bgcolor: '#0f1e2e', p: '20px 24px', borderRadius: 2, mb: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 0.4 }}>Document Types</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mb: 2.5, fontFamily: "'IBM Plex Mono',monospace" }}>Top categories received</Typography>
            {typeBreakdown.length === 0 ? (
              <Typography sx={{ color: '#8fa3b8', fontSize: '0.78rem' }}>No documents yet.</Typography>
            ) : typeBreakdown.map((t) => (
              <Box key={t.type} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#8fa3b8', width: 110, flexShrink: 0 }}>{t.type}</Typography>
                <Box sx={{ flex: 1, height: 6, bgcolor: '#162030', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${counts.total > 0 ? (t.count / counts.total) * 100 : 0}%`, bgcolor: '#c9952a', borderRadius: 3 }} />
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, width: 24, textAlign: 'right' }}>{t.count}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ bgcolor: '#0f1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '18px 24px', borderBottom: '1px solid #1e2a38' }}>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Recent Decisions</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#8fa3b8', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Your latest actions</Typography>
            </Box>
            {recentDecisions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#8fa3b8', fontSize: '0.78rem' }}>No decisions yet.</Typography>
              </Box>
            ) : recentDecisions.map((doc, i) => (
              <Box key={doc.id} sx={{
                px: 3, py: 1.8,
                borderBottom: i < recentDecisions.length - 1 ? '1px solid #162030' : 'none',
                display: 'flex', alignItems: 'center', gap: 1.5,
                '&:hover': { bgcolor: '#121e2d' }, cursor: 'pointer',
              }} onClick={() => setSelected(doc)}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#f0e8d0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{doc.title}</Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8', mt: 0.3, fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId}</Typography>
                </Box>
                <StatusChip status={doc.status} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
    </Box>
  )
}
