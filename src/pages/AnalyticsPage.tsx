import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import LinearProgress from '@mui/material/LinearProgress'
import type { RETDocument } from '../types'
import { StatusChip } from '../components/StatusChip'

interface Props { documents: RETDocument[] }

const COLORS = ['#c9952a','#1565c0','#2e7d32','#b36b00','#7b1fa2','#c62828','#00796b','#e65100']

const BarChart: React.FC<{ data: Record<string,number>; colors?: string[] }> = ({ data, colors = COLORS }) => {
  const entries = Object.entries(data)
  const maxVal  = Math.max(...entries.map(([,v]) => v), 1)
  if (entries.length === 0) return <Typography sx={{ color: '#8B7A6B', fontSize: '0.78rem', textAlign: 'center', py: 3 }}>No data yet.</Typography>
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {entries.map(([key, val], i) => (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#6B4050', width: 130, flexShrink: 0, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key}</Typography>
          <Box sx={{ flex: 1, height: 10, bgcolor: 'rgba(123,28,46,0.06)', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${(val / maxVal) * 100}%`, bgcolor: colors[i % colors.length], borderRadius: 1, transition: 'width 0.8s ease' }} />
          </Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.7rem', color: colors[i % colors.length], width: 24, textAlign: 'right' }}>{val}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export const AnalyticsPage: React.FC<Props> = ({ documents }) => {
  const a = useMemo(() => {
    const total = documents.length
    const byStatus: Record<string,number> = {}
    const byType:   Record<string,number> = {}
    const byStaff:  Record<string,number> = {}

    documents.forEach((d) => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1
      if (d.type) byType[d.type] = (byType[d.type] || 0) + 1
      if (d.submittedBy) byStaff[d.submittedBy] = (byStaff[d.submittedBy] || 0) + 1
    })

    const approvalRate  = total ? Math.round(((byStatus['Approved'] || 0) / total) * 100) : 0
    const rejectionRate = total ? Math.round(((byStatus['Rejected'] || 0) / total) * 100) : 0

    return { total, byStatus, byType, byStaff, approvalRate, rejectionRate }
  }, [documents])

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.4 }}>OVPRET</Typography>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0A0E' }}>Document Analytics</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#6B4050', mt: 0.3 }}>Real-time analytics generated from the document database.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {[
          { label: 'Total Documents', value: a.total, color: '#1C0A0E', sub: 'All time' },
          { label: 'Approval Rate', value: `${a.approvalRate}%`, color: '#2e7d32', sub: 'Of all submissions' },
          { label: 'Pending Review', value: a.byStatus['Pending'] || 0, color: '#b36b00', sub: 'Awaiting VP decision' },
        ].map((s) => (
          <Grid item xs={6} sm={4} key={s.label}>
            <Paper sx={{ p: '18px 22px', bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', color: '#6B4050', textTransform: 'uppercase', mb: 0.7 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#8B7A6B', mt: 0.4 }}>{s.sub}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', p: 0 }}>
            <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
              <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>By Approval Status</Typography>
            </Box>
            <Box sx={{ p: 3 }}><BarChart data={a.byStatus} colors={['#b36b00','#7b1fa2','#2e7d32','#c62828','#1565c0']} /></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', p: 0 }}>
            <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
              <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>By Document Type</Typography>
            </Box>
            <Box sx={{ p: 3 }}><BarChart data={a.byType} /></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', p: 0 }}>
            <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
              <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>By Staff Member</Typography>
            </Box>
            <Box sx={{ p: 3 }}><BarChart data={a.byStaff} colors={['#1565c0','#7b1fa2','#b36b00','#2e7d32','#c9952a']} /></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#fff', p: 0 }}>
            <Box sx={{ p: '16px 24px 12px', borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
              <Typography sx={{ fontWeight: 600, color: '#1C0A0E', fontSize: '0.88rem' }}>Status Summary</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Share</TableCell>
                  <TableCell sx={{ width: 100 }}>Bar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(a.byStatus).map(([status, count]) => {
                  const pct = a.total ? Math.round((count / a.total) * 100) : 0
                  return (
                    <TableRow key={status}>
                      <TableCell><StatusChip status={status as any} /></TableCell>
                      <TableCell align="right"><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.78rem', color: '#c9952a' }}>{count}</Typography></TableCell>
                      <TableCell align="right"><Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: '#8B7A6B' }}>{pct}%</Typography></TableCell>
                      <TableCell><LinearProgress variant="determinate" value={pct} sx={{ height: 4, borderRadius: 2 }} /></TableCell>
                    </TableRow>
                  )
                })}
                {Object.keys(a.byStatus).length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: '#8B7A6B', fontSize: '0.8rem' }}>No data yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
