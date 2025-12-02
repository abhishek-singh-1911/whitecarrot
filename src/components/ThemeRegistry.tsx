'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { defaultTheme } from '@/theme/theme';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {children}
        <PWAInstallPrompt />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
