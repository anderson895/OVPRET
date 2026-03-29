import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c9952a',
      light: '#e8b84b',
      dark: '#a07820',
      contrastText: '#0d1b2a',
    },
    secondary: {
      main: '#4fc3f7',
      light: '#8bf6ff',
      dark: '#0093c4',
    },
    background: {
      default: '#0d1b2a',
      paper: '#1a2e45',
    },
    text: {
      primary: '#f5f0e8',
      secondary: '#8fa3b8',
    },
    success: { main: '#66bb6a' },
    warning: { main: '#ffa726' },
    error: { main: '#ef5350' },
    info: { main: '#4fc3f7' },
    divider: 'rgba(201,149,42,0.2)',
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.5px' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, letterSpacing: '0.5px' },
    caption: { fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.5px' },
    overline: { fontWeight: 700, letterSpacing: '2px' },
    button: { fontWeight: 600, letterSpacing: '0.5px' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'IBM Plex Sans', sans-serif",
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#0d1b2a' },
          '&::-webkit-scrollbar-thumb': { background: '#c9952a', borderRadius: 3 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(201,149,42,0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(201,149,42,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.5px',
          borderRadius: 5,
        },
        containedPrimary: {
          color: '#0d1b2a',
          '&:hover': { backgroundColor: '#e8b84b' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& th': {
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#8fa3b8',
            fontWeight: 600,
            borderBottom: '1px solid rgba(201,149,42,0.2)',
            padding: '10px 16px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': {
            borderBottom: '1px solid rgba(201,149,42,0.06)',
            '&:hover': { backgroundColor: 'rgba(201,149,42,0.04)' },
          },
          '& td': { padding: '12px 16px', fontSize: '0.82rem' },
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
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '1px' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.7rem' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRight: '1px solid rgba(201,149,42,0.2)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderLeft: '2px solid transparent',
          '&.Mui-selected': {
            backgroundColor: 'rgba(201,149,42,0.1)',
            borderLeftColor: '#c9952a',
            color: '#c9952a',
            '& .MuiListItemIcon-root': { color: '#c9952a' },
          },
          '&:hover': { backgroundColor: 'rgba(201,149,42,0.06)' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: '1px solid rgba(201,149,42,0.2)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(201,149,42,0.2)' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(201,149,42,0.1)', height: 3, borderRadius: 2 },
        bar: { backgroundColor: '#c9952a', borderRadius: 2 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 5, fontSize: '0.82rem' },
      },
    },
  },
});

export const COLORS = {
  navy: '#0d1b2a',
  navyMid: '#1a2e45',
  navyLight: '#243b55',
  gold: '#c9952a',
  goldLight: '#e8b84b',
  cream: '#f5f0e8',
  slate: '#8fa3b8',
};
