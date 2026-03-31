import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import type { AppUser } from '../types'

interface Props { user: AppUser }

export const ProfilePage: React.FC<Props> = ({ user }) => {
  const roleLabel = { admin: 'Administrator', staff: 'Staff Member', vp: 'Vice President' }[user.role]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', color: '#c9952a', letterSpacing: '2px', textTransform: 'uppercase', mb: 0.5 }}>OVPRET</Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0A0E' }}>Profile & Settings</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: '32px 28px', bgcolor: '#fff', textAlign: 'center' }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#7B1C2E', color: '#fff', fontSize: '1.8rem', fontWeight: 800, mx: 'auto', mb: 2 }}>
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0A0E' }}>{user.displayName}</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#6B4050', mt: 0.3 }}>{user.email}</Typography>
            <Chip label={roleLabel} size="small" sx={{ mt: 1.5, fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.62rem', fontWeight: 700, bgcolor: 'rgba(123,28,46,0.08)', color: '#7B1C2E', border: '1px solid rgba(123,28,46,0.2)' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: '24px 28px', bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '0.88rem', mb: 2.5 }}>Account Details</Typography>
            {[
              { label: 'Full Name', value: user.displayName },
              { label: 'Email Address', value: user.email },
              { label: 'Role', value: roleLabel },
              { label: 'Office', value: user.department || '—' },
              { label: 'Account Status', value: user.isActive !== false ? 'Active' : 'Inactive' },
            ].map((row) => (
              <Box key={row.label} sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid rgba(123,28,46,0.06)' }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B4050', width: 150, flexShrink: 0 }}>{row.label}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#1C0A0E' }}>{row.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
