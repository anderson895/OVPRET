import { createTheme } from '@mui/material/styles'

// ── OVPRET DTS — Light Color Palette ─────────────────────────
export const C = {
  // Surfaces
  cardBg:     '#FFFFFF',
  cardAlt:    '#F9F6F1',
  maroon:     '#7B1C2E',
  maroonHover:'#a8283f',
  appBg:      '#F7F5F2',

  // Gold
  gold:       '#F5A800',
  goldMuted:  '#c9952a',
  goldDark:   '#C98A00',
  goldLight:  '#FFD04D',

  // Text on dark (sidebar, dialog headers)
  cream:      '#f0e8d0',
  mutedBlue:  '#8fa3b8',
  dimBlue:    '#6a8aaa',
  labelBlue:  '#a8bfd4',

  // Text on light
  textDark:   '#1C0A0E',
  textSub:    '#6B4050',
  textMuted:  '#8B7A6B',

  // Status
  success:    '#2e7d32',
  warning:    '#e6911a',
  error:      '#c62828',
  info:       '#1565c0',
  review:     '#7b1fa2',
  inactive:   '#9e9e9e',
} as const

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: C.gold, light: C.goldLight, dark: C.goldDark, contrastText: '#1a0800' },
    secondary:  { main: C.maroon, light: C.maroonHover, dark: '#550d1e', contrastText: '#fff' },
    background: { default: C.appBg, paper: '#FFFFFF' },
    text:       { primary: C.textDark, secondary: C.textSub },
    success:    { main: C.success },
    warning:    { main: C.gold },
    error:      { main: C.error },
    info:       { main: C.info },
    divider:    'rgba(123,28,46,0.12)',
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    button:  { fontWeight: 700, letterSpacing: '0.8px' },
    caption: { fontFamily: "'IBM Plex Mono', monospace" },
    overline:{ fontWeight: 700, letterSpacing: '2.5px' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: C.appBg,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: C.appBg },
          '&::-webkit-scrollbar-thumb': { background: C.maroon, borderRadius: 3 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(123,28,46,0.1)',
          boxShadow: '0 1px 4px rgba(123,28,46,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.8px', borderRadius: 6 },
        containedPrimary: {
          color: '#1a0800',
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
          '&:hover': { background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)` },
        },
        containedSecondary: {
          color: '#fff',
          background: C.maroon,
          '&:hover': { background: C.maroonHover },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: C.maroon, backgroundImage: 'none', boxShadow: '0 2px 8px rgba(123,28,46,0.25)' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { border: 'none', borderRight: '1px solid rgba(123,28,46,0.12)', backgroundColor: C.maroon },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderLeft: '3px solid transparent', borderRadius: 0,
          '&.Mui-selected': {
            background: 'rgba(245,168,0,0.15)', borderLeftColor: C.gold,
            '& .MuiListItemIcon-root': { color: C.gold },
            '& .MuiListItemText-primary': { color: C.gold },
          },
          '&:hover': { background: 'rgba(255,255,255,0.08)' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& th': {
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: C.textSub, fontWeight: 700,
            borderBottom: `2px solid rgba(123,28,46,0.12)`,
            backgroundColor: '#F9F6F1',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': { borderBottom: `1px solid rgba(123,28,46,0.08)`, '&:hover': { background: 'rgba(123,28,46,0.03)' } },
          '& td': { fontSize: '0.83rem', padding: '11px 16px', color: C.textDark },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': { borderColor: 'rgba(123,28,46,0.25)' },
          '&:hover fieldset': { borderColor: 'rgba(123,28,46,0.5) !important' },
          '&.Mui-focused fieldset': { borderColor: `${C.maroon} !important` },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { color: C.textSub, '&.Mui-focused': { color: C.maroon } } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: 'none', backgroundColor: '#FFFFFF', border: `1px solid rgba(123,28,46,0.15)`, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
      },
    },
    MuiDivider:  { styleOverrides: { root: { borderColor: 'rgba(123,28,46,0.12)' } } },
    MuiAlert:    { styleOverrides: { root: { borderRadius: 6, fontSize: '0.8rem' } } },
    MuiChip:     { styleOverrides: { root: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.8px' } } },
    MuiTab:      { styleOverrides: { root: { fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.68rem', color: C.textSub, '&.Mui-selected': { color: C.maroon } } } },
    MuiTabs:     { styleOverrides: { indicator: { backgroundColor: C.maroon } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 3, borderRadius: 2, background: 'rgba(123,28,46,0.1)' },
        bar:  { borderRadius: 2, background: `linear-gradient(90deg, ${C.maroon}, ${C.gold})` },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, fontSize: '1rem', color: C.textDark } } },
    MuiDialogContent: { styleOverrides: { root: { color: C.textDark } } },
    MuiMenuItem: { styleOverrides: { root: { fontSize: '0.85rem', color: C.textDark } } },
    MuiSelect: { styleOverrides: { select: { color: C.textDark, fontSize: '0.85rem' }, icon: { color: C.textSub } } },
  },
})
