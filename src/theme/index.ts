import { createTheme } from '@mui/material/styles'

// ── Marinduque State University ───────────────────────────────
// Maroon : #7B1C2E  |  Gold : #F5A800  |  Dark Gold : #C98A00
// Background: white  |  Text: dark

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#F5A800', light: '#FFD04D', dark: '#C98A00', contrastText: '#1a0800' },
    secondary:  { main: '#7B1C2E', light: '#a8283f', dark: '#550d1e', contrastText: '#fff' },
    background: { default: '#F7F5F2', paper: '#FFFFFF' },
    text:       { primary: '#1C0A0E', secondary: '#6B4050' },
    success:    { main: '#2e7d32' },
    warning:    { main: '#F5A800' },
    error:      { main: '#c62828' },
    info:       { main: '#1565c0' },
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
          backgroundColor: '#F7F5F2',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#F7F5F2' },
          '&::-webkit-scrollbar-thumb': { background: '#7B1C2E', borderRadius: 3 },
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
    MuiCard: {
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
          background: 'linear-gradient(135deg, #F5A800 0%, #C98A00 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #FFD04D 0%, #F5A800 100%)' },
        },
        containedSecondary: {
          color: '#fff',
          background: '#7B1C2E',
          '&:hover': { background: '#a8283f' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7B1C2E',
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(123,28,46,0.25)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRight: '1px solid rgba(123,28,46,0.12)',
          backgroundColor: '#7B1C2E',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderLeft: '3px solid transparent',
          borderRadius: 0,
          '&.Mui-selected': {
            background: 'rgba(245,168,0,0.15)',
            borderLeftColor: '#F5A800',
            '& .MuiListItemIcon-root': { color: '#F5A800' },
            '& .MuiListItemText-primary': { color: '#F5A800' },
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
            color: '#6B4050', fontWeight: 700,
            borderBottom: '2px solid rgba(123,28,46,0.15)',
            backgroundColor: '#FDF8F9',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': {
            borderBottom: '1px solid rgba(123,28,46,0.07)',
            '&:hover': { background: 'rgba(123,28,46,0.03)' },
          },
          '& td': { fontSize: '0.83rem', padding: '11px 16px', color: '#1C0A0E' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': { borderColor: 'rgba(123,28,46,0.25)' },
          '&:hover fieldset': { borderColor: 'rgba(123,28,46,0.5) !important' },
          '&.Mui-focused fieldset': { borderColor: '#7B1C2E !important' },
          '& input::placeholder': { color: '#9E7080', opacity: 1 },
          '& textarea::placeholder': { color: '#9E7080', opacity: 1 },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': { color: '#9E7080', opacity: 1 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { color: '#6B4050', '&.Mui-focused': { color: '#7B1C2E' } } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: 'none', border: '1px solid rgba(123,28,46,0.15)', boxShadow: '0 8px 32px rgba(123,28,46,0.15)' },
      },
    },
    MuiDivider:  { styleOverrides: { root: { borderColor: 'rgba(123,28,46,0.1)' } } },
    MuiAlert:    { styleOverrides: { root: { borderRadius: 6, fontSize: '0.8rem' } } },
    MuiChip:     { styleOverrides: { root: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.8px' } } },
    MuiTab:      { styleOverrides: { root: { fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.68rem' } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 3, borderRadius: 2, background: 'rgba(123,28,46,0.1)' },
        bar:  { borderRadius: 2, background: 'linear-gradient(90deg, #7B1C2E, #F5A800)' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 700, fontSize: '1rem', color: '#1C0A0E' } },
    },
  },
})
