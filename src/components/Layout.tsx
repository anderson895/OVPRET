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

const DRAWER_WIDTH = 268

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

  const roleLabel = { admin: 'Administrator', staff: 'Staff Member', vp: 'Vice President' }[user.role]

  const SidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#7B1C2E' }}>

      {/* University branding header */}
      <Box sx={{
        p: '18px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 46, height: 46, flexShrink: 0,
            borderRadius: '50%',
            border: '2px solid rgba(245,168,0,0.5)',
            overflow: 'hidden', bgcolor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            <img src="/logo.png" alt="MSU" style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, color: '#F5A800', lineHeight: 1.2, letterSpacing: '0.3px' }}>
              Marinduque State<br />University
            </Typography>
            <Typography sx={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.3, mt: 0.3, letterSpacing: '0.2px' }}>
              OVPRET · DTS
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto' }}>
        <Typography sx={{
          px: '16px', pt: 0.5, pb: 0.8,
          fontSize: '0.5rem', letterSpacing: '2.5px',
          color: 'rgba(245,168,0,0.55)',
          textTransform: 'uppercase', fontWeight: 700,
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.filter((n) => n.roles.includes(user.role)).map((item) => {
            const active = currentPage === item.id
            return (
              <ListItemButton
                key={item.id}
                selected={active}
                onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                sx={{
                  px: '16px', py: '8px', minHeight: 40,
                  borderLeft: `3px solid ${active ? '#F5A800' : 'transparent'}`,
                  bgcolor: active ? 'rgba(245,168,0,0.12)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, color: active ? '#F5A800' : 'rgba(255,255,255,0.55)' }}>
                  {item.badge && item.badge > 0 ? (
                    <Badge badgeContent={item.badge} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.58rem', height: 15, minWidth: 15 } }}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: active ? 700 : 400, color: active ? '#F5A800' : 'rgba(255,255,255,0.75)' }}
                />
              </ListItemButton>
            )
          })}
        </List>

        <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Typography sx={{
          px: '16px', pb: 0.8,
          fontSize: '0.5rem', letterSpacing: '2.5px',
          color: 'rgba(245,168,0,0.55)',
          textTransform: 'uppercase', fontWeight: 700,
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          Account
        </Typography>
        <List disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{ px: '16px', py: '8px', borderLeft: '3px solid transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' } }}
          >
            <ListItemIcon sx={{ minWidth: 30, color: 'rgba(255,255,255,0.55)' }}><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 400, color: 'rgba(255,255,255,0.75)' }} />
          </ListItemButton>
        </List>
      </Box>

      {/* User card */}
      <Box sx={{
        p: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        bgcolor: 'rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Avatar sx={{
          width: 34, height: 34,
          bgcolor: '#F5A800',
          color: '#1a0800', fontSize: '0.85rem', fontWeight: 800, borderRadius: '7px',
        }}>
          {user.displayName?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.displayName}
          </Typography>
          <Typography sx={{ fontSize: '0.54rem', color: 'rgba(245,168,0,0.8)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', fontFamily: "'IBM Plex Mono', monospace" }}>
            {roleLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F7F5F2' }}>
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#7B1C2E', border: 'none' } }}>
        <SidebarContent />
      </Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: '#7B1C2E', border: 'none' } }}>
        <SidebarContent />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* AppBar */}
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, md: 4 }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: 'rgba(255,255,255,0.8)' }}>
                <MenuIcon />
              </IconButton>
              <Box sx={{ width: 3, height: 20, bgcolor: '#F5A800', borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                {pageTitle}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)', display: { xs: 'none', sm: 'block' } }}>
                {new Date().toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </Typography>
              <Box sx={{ px: 1.2, py: 0.4, borderRadius: '4px', bgcolor: 'rgba(245,168,0,0.2)', border: '1px solid rgba(245,168,0,0.35)' }}>
                <Typography sx={{ fontSize: '0.52rem', fontWeight: 700, color: '#F5A800', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {{ admin: 'Admin', staff: 'Staff', vp: 'VP' }[user.role]}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, md: '28px 36px' }, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
