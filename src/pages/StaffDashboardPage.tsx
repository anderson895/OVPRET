import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import LoopIcon from '@mui/icons-material/Loop'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import type { RETDocument, AppUser } from '../types'
import { StatusChip } from '../components/StatusChip'
import { DocumentDetailModal } from '../components/DocumentDetailModal'

interface Props { documents: RETDocument[]; user: AppUser; onNavigate?: (p: any) => void }

const fmtTime = (ts: any) => {
  if (!ts) return '—'
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_COLOR: Record<string, string> = {
  'Pending': '#b36b00',
  'Under Review': '#7b1fa2',
  'Approved': '#2e7d32',
  'Rejected': '#c62828',
  'Request For Revision': '#1565c0',
}

export const StaffDashboardPage: React.FC<Props> = ({ documents, user, onNavigate }) => {
  const [selected, setSelected] = useState<RETDocument | null>(null)

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
    .slice(0, 8)

  const pendingRevision = myDocs.filter((d) => d.status === 'Request For Revision')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper sx={{
        bgcolor: '#7B1C2E', p: '22px 28px', mb: 3,
        background: 'linear-gradient(135deg, #7B1C2E 55%, #5a1420 100%)',
        border: '1px solid rgba(123,28,46,0.3)', borderRadius: 2,
      }}>
        <Box>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', color: 'rgba(245,168,0,0.7)', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", mb: 0.5 }}>
            {greeting}
          </Typography>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', mb: 0.3 }}>
            {user.displayName}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            {user.department || 'Staff Member'} · OVPRET Document Tracking System
          </Typography>
        </Box>

        {pendingRevision.length > 0 && (
          <Box sx={{ mt: 2.5, p: '10px 16px', bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <NotificationsActiveIcon sx={{ fontSize: 18, color: '#4fc3f7', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>
              Action required: {pendingRevision.length} document{pendingRevision.length > 1 ? 's' : ''} sent back for revision. Please review and resubmit.
            </Typography>
            {onNavigate && (
              <Button size="small" onClick={() => onNavigate('submit')}
                sx={{ ml: 'auto', fontSize: '0.63rem', color: '#FFD04D', flexShrink: 0, textTransform: 'none' }}>
                View Now
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Submitted', value: counts.total,    color: '#1C0A0E', icon: <HistoryEduIcon sx={{ fontSize: 18 }} /> },
          { label: 'Pending',         value: counts.pending,  color: '#b36b00', icon: <PendingIcon sx={{ fontSize: 18 }} /> },
          { label: 'Under Review',    value: counts.review,   color: '#7b1fa2', icon: <LoopIcon sx={{ fontSize: 18 }} /> },
          { label: 'Approved',        value: counts.approved, color: '#2e7d32', icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: 'For Revision',    value: counts.revision, color: '#1565c0', icon: <LoopIcon sx={{ fontSize: 18 }} /> },
          { label: 'Rejected',        value: counts.rejected, color: '#c62828', icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} /> },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={2} key={s.label}>
            <Paper sx={{
              p: '14px 16px', bgcolor: '#fff', borderRadius: 2,
              borderBottom: `2px solid ${s.color}30`,
              transition: 'transform 0.15s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}>
              <Box sx={{ color: s.color, mb: 0.8, opacity: 0.7 }}>{s.icon}</Box>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.56rem', color: '#6B4050', textTransform: 'uppercase', letterSpacing: '1.2px', mt: 0.6, fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity - Full Width */}
      <Paper sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '18px 24px', borderBottom: '1px solid rgba(123,28,46,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '0.88rem' }}>Recent Activity</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#6B4050', mt: 0.2, fontFamily: "'IBM Plex Mono',monospace" }}>Latest updates on your documents</Typography>
          </Box>
        </Box>

        {activityFeed.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#6B4050', fontSize: '0.82rem', mb: 2 }}>No activity yet. Submit your first document!</Typography>
            {onNavigate && <Button variant="outlined" size="small" onClick={() => onNavigate('submit')} sx={{ fontSize: '0.7rem' }}>Submit Document</Button>}
          </Box>
        ) : (
          <Box sx={{ px: 3, py: 2.5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 4, top: 12, bottom: 12, width: 2, bgcolor: 'rgba(123,28,46,0.08)', borderRadius: 1 }} />
              {activityFeed.map((doc, idx) => {
                const statusColor = STATUS_COLOR[doc.status] || '#6B4050'
                return (
                  <Box
                    key={doc.id}
                    onClick={() => setSelected(doc)}
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: idx < activityFeed.length - 1 ? 2.5 : 0, cursor: 'pointer', '&:hover .doc-title': { color: '#7B1C2E' } }}
                  >
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%', bgcolor: statusColor,
                      flexShrink: 0, mt: 0.6, zIndex: 1,
                      boxShadow: `0 0 6px ${statusColor}30`,
                    }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3, flexWrap: 'wrap' }}>
                        <Typography className="doc-title" sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0, transition: 'color 0.15s' }}>
                          {doc.title}
                        </Typography>
                        <StatusChip status={doc.status} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#c9952a', fontFamily: "'IBM Plex Mono',monospace" }}>{doc.retId}</Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#8B7A6B' }}>·</Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#8B7A6B' }}>{fmtTime(doc.updatedAt || doc.createdAt)}</Typography>
                        {doc.feedback && (
                          <>
                            <Typography sx={{ fontSize: '0.6rem', color: '#8B7A6B' }}>·</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: '#8B7A6B', fontStyle: 'italic', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

      <DocumentDetailModal document={selected} open={!!selected} onClose={() => setSelected(null)} onUpdate={() => setSelected(null)} user={user} />
    </Box>
  )
}
