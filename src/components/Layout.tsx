import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import RateReviewIcon from '@mui/icons-material/RateReview'
import BarChartIcon from '@mui/icons-material/BarChart'
import HistoryIcon from '@mui/icons-material/History'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import type { AppUser } from '../types'

export type PageId = 'dashboard' | 'submit' | 'review' | 'analytics' | 'logs' | 'staff'

const DRAWER_WIDTH = 264

interface NavItem {
  id: PageId; label: string
  icon: React.ReactNode; roles: string[]
  badge?: number
}

interface Props {
  user: AppUser; currentPage: PageId
  onNavigate: (p: PageId) => void; onLogout: () => void
  pendingCount: number; children: React.ReactNode; pageTitle: string
}

export const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Document Tracking Dashboard',
  submit:    'Submit RET Document',
  review:    'Review & Process Documents',
  analytics: 'Document Analytics',
  logs:      'Transaction Logs & History',
  staff:     'Staff Account Management',
}

export const Layout: React.FC<Props> = ({
  user, currentPage, onNavigate, onLogout, pendingCount, children, pageTitle,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard',        icon: <DashboardIcon  fontSize="small" />, roles: ['admin','staff','vp'] },
    { id: 'submit',    label: 'Submit Document',   icon: <UploadFileIcon fontSize="small" />, roles: ['staff'] },
    { id: 'review',    label: 'Review Documents',  icon: <RateReviewIcon fontSize="small" />, roles: ['vp'],   badge: pendingCount },
    { id: 'analytics', label: 'Analytics',         icon: <BarChartIcon   fontSize="small" />, roles: ['admin','staff','vp'] },
    { id: 'logs',      label: 'Logs & History',    icon: <HistoryIcon    fontSize="small" />, roles: ['admin','vp'] },
    { id: 'staff',     label: 'Manage Staff',      icon: <PeopleIcon     fontSize="small" />, roles: ['admin'] },
  ]

  const roleLabel = { admin: 'Administrator', staff: 'Staff', vp: 'Vice President' }[user.role]

  const SidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a2e45' }}>
      {/* Logo */}
      <Box sx={{ p: '24px 20px 20px', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
        <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', color: '#c9952a', textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
          Office of the Vice President
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
          OVPRET Web-Based<br />Document Tracking System
        </Typography>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <Typography sx={{ px: '20px', pb: 1, fontSize: '0.56rem', letterSpacing: '2.5px', color: '#8fa3b8', textTransform: 'uppercase', fontWeight: 700 }}>
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.filter((n) => n.roles.includes(user.role)).map((item) => (
            <ListItemButton
              key={item.id}
              selected={currentPage === item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
              sx={{ px: '20px', py: '10px', minHeight: 42 }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: currentPage === item.id ? '#c9952a' : '#8fa3b8' }}>
                {item.badge && item.badge > 0 ? (
                  <Badge badgeContent={item.badge} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.58rem', height: 15, minWidth: 15 } }}>
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500, color: currentPage === item.id ? '#c9952a' : '#8fa3b8' }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ px: '20px', pb: 1, fontSize: '0.56rem', letterSpacing: '2.5px', color: '#8fa3b8', textTransform: 'uppercase', fontWeight: 700 }}>
          Account
        </Typography>
        <List disablePadding>
          <ListItemButton onClick={onLogout} sx={{ px: '20px', py: '10px' }}>
            <ListItemIcon sx={{ minWidth: 30, color: '#8fa3b8' }}><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500, color: '#8fa3b8' }} />
          </ListItemButton>
        </List>
      </Box>


      {/* User */}
      <Box sx={{ p: '14px 20px', borderTop: '1px solid rgba(201,149,42,0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#c9952a', color: '#0d1b2a', fontSize: '0.82rem', fontWeight: 700, borderRadius: '6px' }}>
          {user.displayName?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.displayName}
          </Typography>
          <Typography sx={{ fontSize: '0.58rem', letterSpacing: '1.5px', color: '#c9952a', textTransform: 'uppercase', fontWeight: 600 }}>
            {roleLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0d1b2a' }}>
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        <SidebarContent />
      </Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        <SidebarContent />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: { md: `${DRAWER_WIDTH}px` } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(13,27,42,0.96)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(201,149,42,0.2)' }}>
          <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, md: 4 }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#8fa3b8' }}>
                <MenuIcon />
              </IconButton>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{pageTitle}</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#8fa3b8', display: { xs: 'none', sm: 'block' } }}>
              {new Date().toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
