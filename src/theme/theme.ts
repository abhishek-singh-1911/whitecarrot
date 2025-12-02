'use client';

import { createTheme } from '@mui/material/styles';

export const createCustomTheme = (primaryColor?: string, backgroundColor?: string) => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor || '#2563eb',
      },
      background: {
        default: backgroundColor || '#ffffff',
        paper: '#f9fafb',
      },
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
        },
      },
    },
  });
};

export const defaultTheme = createCustomTheme();
