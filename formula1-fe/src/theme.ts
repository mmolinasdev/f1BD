import { createTheme } from '@mui/material/styles';

export const f1Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E10600',
      light: '#FF3B36',
      dark: '#A80400',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#15151E',
      light: '#38383f',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#15151E',
      secondary: '#67676D',
    },
    success: {
      main: '#00A550',
    },
    warning: {
      main: '#FF8800',
    },
    error: {
      main: '#E10600',
    },
    divider: 'rgba(21,21,30,0.08)',
  },
  typography: {
    fontFamily: '"Titillium Web", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 900,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 900,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 900,
      letterSpacing: '0em',
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: '"Titillium Web", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F5F5',
          scrollbarWidth: 'thin',
          scrollbarColor: '#E10600 #F5F5F5',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: '#F5F5F5' },
          '&::-webkit-scrollbar-thumb': { background: '#E10600' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#15151E',
          boxShadow: 'none',
          borderBottom: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#15151E',
          borderRight: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: '0 2px 8px rgba(21,21,30,0.08)',
          borderRadius: 0,
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(21,21,30,0.14)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#E10600',
          '&:hover': { backgroundColor: '#A80400' },
        },
        containedSecondary: {
          backgroundColor: '#15151E',
          '&:hover': { backgroundColor: '#38383f' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: '"Titillium Web", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          fontSize: '0.7rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#15151E',
            color: '#FFFFFF',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            borderBottom: 'none',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(225,6,0,0.03) !important',
          },
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(21,21,30,0.02)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(21,21,30,0.06)',
          padding: '10px 16px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Titillium Web", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#67676D',
          '&.Mui-selected': { color: '#E10600' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid rgba(21,21,30,0.08)',
        },
        indicator: {
          backgroundColor: '#E10600',
          height: '3px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(21,21,30,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(21,21,30,0.08)',
        },
      },
    },
  },
});
