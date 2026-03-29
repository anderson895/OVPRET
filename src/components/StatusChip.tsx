import React from 'react'
import Chip from '@mui/material/Chip'
import type { DocStatus } from '../types'

interface Props { status: DocStatus | string; size?: 'small' | 'medium' }

const CFG: Record<string, { color: string; bg: string; border: string }> = {
  'Pending':              { color: '#ffa726', bg: 'rgba(230,81,0,0.12)',    border: 'rgba(230,81,0,0.3)'    },
  'Under Review':         { color: '#ce93d8', bg: 'rgba(123,31,162,0.12)', border: 'rgba(123,31,162,0.3)'  },
  'Approved':             { color: '#66bb6a', bg: '#0e2010',  border: 'rgba(46,125,50,0.3)'   },
  'Rejected':             { color: '#ef5350', bg: '#200e0e',  border: 'rgba(183,28,28,0.3)'   },
  'Request For Revision': { color: '#4fc3f7', bg: 'rgba(2,119,189,0.12)',  border: 'rgba(2,119,189,0.3)'   },
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
