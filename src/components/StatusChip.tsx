import React from 'react'
import Chip from '@mui/material/Chip'
import type { DocStatus } from '../types'

interface Props { status: DocStatus | string; size?: 'small' | 'medium' }

const CFG: Record<string, { color: string; bg: string; border: string }> = {
  'Pending':              { color: '#b36b00', bg: 'rgba(245,168,0,0.12)',   border: 'rgba(245,168,0,0.35)' },
  'Under Review':         { color: '#7b1fa2', bg: 'rgba(123,31,162,0.1)',  border: 'rgba(123,31,162,0.3)' },
  'Approved':             { color: '#2e7d32', bg: 'rgba(46,125,50,0.1)',   border: 'rgba(46,125,50,0.3)'  },
  'Rejected':             { color: '#c62828', bg: 'rgba(198,40,40,0.08)',  border: 'rgba(198,40,40,0.3)'  },
  'Request For Revision': { color: '#1565c0', bg: 'rgba(21,101,192,0.08)', border: 'rgba(21,101,192,0.3)' },
}

export const StatusChip: React.FC<Props> = ({ status, size = 'small' }) => {
  const c = CFG[status] || CFG['Pending']
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        color: c.color, backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: size === 'small' ? '0.6rem' : '0.68rem',
        fontWeight: 700, letterSpacing: '0.8px',
        height: size === 'small' ? 22 : 28,
        '& .MuiChip-label': { px: 1.2 },
      }}
    />
  )
}
