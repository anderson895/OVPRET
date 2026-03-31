import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LoopIcon from '@mui/icons-material/Loop'
import GradingIcon from '@mui/icons-material/Grading'
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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const counts = {
    total:    documents.length,
    pending:  documents.filter((d) => d.status === 'Pending').length,
    review:   documents.filter((d) => d.status === 'Under Review').length,
    approved: documents.filter((d) => d.status === 'Approved').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
    revision: documents.filter((d) => d.status === 'Request For Revision').length,
  }

  const recentDecisions = documents
    .filter((d) => d.status === 'Approved' || d.status === 'Rejected' || d.status === 'Request For Revision')
    .sort((a, b) => {
      const da = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0)
      const db2 = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0)
      return db2.getTime() - da.getTime()
    }).slice(0, 6)

  const typeBreakdown = ['Accomplishment Report', 'Request for Incentives', 'Request for Training / Research Activities', 'Financial', 'Proposals', 'Memorandums', 'Endorsements', 'Research', 'Extension', 'Technology', 'Administrative', 'MOA', 'Other']
    .map((type) => ({ type, count: documents.filter((d) => d.type === type).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper sx={{
        bgcolor: '#7B1C2E', p: '20px 28px', mb: 3,
        background: 'linear-gradient(135deg, #7B1C2E 60%, #5a1420 100%)',
        border: '1px solid rgba(123,28,46,0.3)', borderRadius: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'rgba(245,168,0,0.7)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", mb: 0.5 }}>
            {greeting}
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{user.displayName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', mt: 0.3 }}>Vice President for Research, Extension & Technology</Typography>
        </Box>
        {counts.pending > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#FFD04D', fontWeight: 700 }}>
                {counts.pending} document{counts.pending > 1 ? 's' : ''} awaiting your review
              </Typography>
            </Box>
            {onNavigate && (
              <Button variant="contained" endIcon={<GradingIcon />} onClick={() => onNavigate('review')}
                sx={{ fontSize: '0.72rem', bgcolor: '#F5A800', color: '#1a0800', '&:hover': { bgcolor: '#FFD04D' }, px: 2 }}>
                Review Now
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Stats - "Pending" instead of "Needs Review" */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Documents', value: counts.total, color: '#1C0A0E' },
          { label: 'Pending', value: counts.pending, color: '#b36b00' },
          { label: 'Under Review', value: counts.review, color: '#7b1fa2' },
          { label: 'Approved', value: counts.approved, color: '#2e7d32' },
          { label: 'Rejected', value: counts.rejected, color: '#c62828' },
          { label: 'For Revision', value: counts.revision, color: '#1565c0' },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2} key={s.label}>
            <Paper sx={{ p: '16px 20px', bgcolor: '#fff', borderRadius: 2, borderLeft: `3px solid ${s.color}40` }}>
              <Typography sx={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '2px', color: '#6B4050', textTransform: 'uppercase', mb: 0.8 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Document Types */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', p: '20px 24px', borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '0.88rem', mb: 0.4 }}>Document Types</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mb: 2.5, fontFamily: "'IBM Plex Mono',monospace" }}>Top categories received</Typography>
            {typeBreakdown.length === 0 ? (
              <Typography sx={{ color: '#8B7A6B', fontSize: '0.78rem' }}>No documents yet.</Typography>
            ) : typeBreakdown.map((t) => (
              <Box key={t.type} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#6B4050', width: 160, flexShrink: 0 }}>{t.type}</Typography>
                <Box sx={{ flex: 1, height: 6, bgcolor: 'rgba(123,28,46,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${counts.total > 0 ? (t.count / counts.total) * 100 : 0}%`, bgcolor: '#c9952a', borderRadius: 3 }} />
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, width: 24, textAlign: 'right' }}>{t.count}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Decisions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: '18px 24px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
              <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '0.88rem' }}>Recent Decisions</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Your latest actions</Typography>
            </Box>
            {recentDecisions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#8B7A6B', fontSize: '0.78rem' }}>No decisions yet.</Typography>
              </Box>
            ) : recentDecisions.map((doc, i) => (
              <Box key={doc.id} sx={{
                px: 3, py: 1.8,
                borderBottom: i < recentDecisions.length - 1 ? '1px solid rgba(123,28,46,0.06)' : 'none',
                display: 'flex', alignItems: 'center', gap: 1.5,
                '&:hover': { bgcolor: 'rgba(123,28,46,0.02)' }, cursor: 'pointer',
              }} onClick={() => setSelected(doc)}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#1C0A0E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{doc.title}</Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#8B7A6B', mt: 0.3, fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId} · {fmt(doc.updatedAt)}</Typography>
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
