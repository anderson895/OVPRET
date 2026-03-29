import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#c9952a', light: '#e8b84b', dark: '#a07820', contrastText: '#0d1b2a' },
    secondary:  { main: '#4fc3f7' },
    background: { default: '#0d1b2a', paper: '#1a2e45' },
    text:       { primary: '#f5f0e8', secondary: '#8fa3b8' },
    success:    { main: '#66bb6a' },
    warning:    { main: '#ffa726' },
    error:      { main: '#ef5350' },
    info:       { main: '#4fc3f7' },
    divider:    'rgba(201,149,42,0.2)',
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    button: { fontWeight: 600, letterSpacing: '0.5px' },
    caption: { fontFamily: "'IBM Plex Mono', monospace" },
    overline: { fontWeight: 700, letterSpacing: '2px' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: '#0d1b2a' },
          '&::-webkit-scrollbar-thumb': { background: '#c9952a', borderRadius: 3 },
        },
      },
    },
    MuiPaper:  { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(201,149,42,0.18)' } } },
    MuiCard:   { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(201,149,42,0.18)' } } },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', borderRadius: 5 },
        containedPrimary: { color: '#0d1b2a', '&:hover': { backgroundColor: '#e8b84b' } },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& th': {
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem',
            letterSpacing: '2px', textTransform: 'uppercase', color: '#8fa3b8',
            fontWeight: 600, borderBottom: '1px solid rgba(201,149,42,0.2)',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': { borderBottom: '1px solid rgba(201,149,42,0.06)', '&:hover': { background: 'rgba(201,149,42,0.04)' } },
          '& td': { fontSize: '0.82rem', padding: '12px 16px' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': { borderColor: 'rgba(201,149,42,0.2)' },
          '&:hover fieldset': { borderColor: 'rgba(201,149,42,0.5) !important' },
          '&.Mui-focused fieldset': { borderColor: '#c9952a !important' },
        },
      },
    },
    MuiDrawer:        { styleOverrides: { paper: { border: 'none', borderRight: '1px solid rgba(201,149,42,0.2)' } } },
    MuiListItemButton:{
      styleOverrides: {
        root: {
          borderLeft: '2px solid transparent', borderRadius: 0,
          '&.Mui-selected': { background: 'rgba(201,149,42,0.1)', borderLeftColor: '#c9952a', color: '#c9952a', '& .MuiListItemIcon-root': { color: '#c9952a' } },
          '&:hover': { background: 'rgba(201,149,42,0.06)' },
        },
      },
    },
    MuiDialog:   { styleOverrides: { paper: { backgroundImage: 'none', border: '1px solid rgba(201,149,42,0.2)' } } },
    MuiDivider:  { styleOverrides: { root: { borderColor: 'rgba(201,149,42,0.2)' } } },
    MuiAlert:    { styleOverrides: { root: { borderRadius: 5, fontSize: '0.8rem' } } },
    MuiChip:     { styleOverrides: { root: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.8px' } } },
    MuiTab:      { styleOverrides: { root: { fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.68rem' } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 3, borderRadius: 2, background: 'rgba(201,149,42,0.1)' },
        bar:  { borderRadius: 2 },
      },
    },
  },
})
