import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import type { RETDocument } from '../types';
import { StatusChip } from '../components/StatusChip';

interface Props {
  documents: RETDocument[];
}

const BAR_COLORS = ['#c9952a', '#4fc3f7', '#66bb6a', '#ffa726', '#ce93d8', '#ef5350', '#80cbc4', '#ffb74d'];

const BarChart: React.FC<{ data: Record<string, number>; colors?: string[] }> = ({ data, colors = BAR_COLORS }) => {
  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([, v]) => v), 1);
  if (entries.length === 0) {
    return <Typography sx={{ color: '#8fa3b8', fontSize: '0.8rem', textAlign: 'center', py: 2 }}>No data available.</Typography>;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {entries.map(([key, val], i) => (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#8fa3b8', width: 130, flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {key}
          </Typography>
          <Box sx={{ flex: 1, height: 10, bgcolor: 'rgba(201,149,42,0.08)', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{
              height: '100%',
              width: `${(val / maxVal) * 100}%`,
              bgcolor: colors[i % colors.length],
              borderRadius: 1,
              transition: 'width 0.8s ease',
            }} />
          </Box>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.72rem', color: colors[i % colors.length], width: 28, textAlign: 'right' }}>
            {val}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export const AnalyticsPage: React.FC<Props> = ({ documents }) => {
  const analytics = useMemo(() => {
    const total = documents.length;
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byDept: Record<string, number> = {};

    documents.forEach((d) => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      if (d.type) byType[d.type] = (byType[d.type] || 0) + 1;
      if (d.department) {
        const deptShort = d.department.length > 30 ? d.department.slice(0, 28) + '...' : d.department;
        byDept[deptShort] = (byDept[deptShort] || 0) + 1;
      }
    });

    const approvalRate = total ? Math.round(((byStatus['Approved'] || 0) / total) * 100) : 0;
    const rejectionRate = total ? Math.round(((byStatus['Rejected'] || 0) / total) * 100) : 0;

    return { total, byStatus, byType, byDept, approvalRate, rejectionRate };
  }, [documents]);

  const StatCard: React.FC<{ label: string; value: string | number; color?: string; sub?: string }> = ({ label, value, color, sub }) => (
    <Paper sx={{ p: '20px 24px', bgcolor: '#1a2e45' }}>
      <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', color: '#8fa3b8', textTransform: 'uppercase', mb: 0.8 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: color || '#f5f0e8', lineHeight: 1 }}>
        {value}
      </Typography>
      {sub && <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.5 }}>{sub}</Typography>}
    </Paper>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>
          Process 5.0
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Document Analytics</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#8fa3b8', mt: 0.3 }}>
          Real-time analytics generated from the document database.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={3}><StatCard label="Total Documents" value={analytics.total} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Approval Rate" value={`${analytics.approvalRate}%`} color="#66bb6a" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Pending" value={analytics.byStatus['Pending'] || 0} color="#ffa726" /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Rejection Rate" value={`${analytics.rejectionRate}%`} color="#ef5350" /></Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#1a2e45', p: 0 }}>
            <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>By Approval Status</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2 }}>Distribution across all status categories</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <BarChart data={analytics.byStatus} colors={['#ffa726', '#ce93d8', '#66bb6a', '#ef5350', '#4fc3f7']} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#1a2e45', p: 0 }}>
            <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>By Document Type</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2 }}>Volume per RET document category</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <BarChart data={analytics.byType} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#1a2e45', p: 0 }}>
            <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>By Department</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2 }}>Submissions per office or department</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <BarChart data={analytics.byDept} colors={['#ce93d8', '#66bb6a', '#4fc3f7', '#ffa726', '#c9952a', '#ef5350']} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: '#1a2e45', p: 0 }}>
            <Box sx={{ p: '18px 24px 14px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>Summary Table</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#8fa3b8', mt: 0.2 }}>Status breakdown with percentage share</Typography>
            </Box>
            <Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Share</TableCell>
                    <TableCell sx={{ width: 120 }}>Distribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analytics.byStatus).map(([status, count]) => {
                    const pct = analytics.total ? Math.round((count / analytics.total) * 100) : 0;
                    return (
                      <TableRow key={status}>
                        <TableCell><StatusChip status={status as any} /></TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.8rem', color: '#c9952a' }}>{count}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.75rem', color: '#8fa3b8' }}>{pct}%</Typography>
                        </TableCell>
                        <TableCell>
                          <LinearProgress variant="determinate" value={pct} sx={{ height: 4, borderRadius: 2 }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {Object.keys(analytics.byStatus).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#8fa3b8', fontSize: '0.8rem' }}>
                        No data yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
