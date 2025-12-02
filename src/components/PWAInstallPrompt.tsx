'use client';

import { useState, useEffect } from 'react';
import { Button, Snackbar, IconButton } from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      message="Install app for a better experience"
      action={
        <>
          <Button
            color="primary"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleInstall}
          >
            Install
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleDismiss}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
}
