'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/edit');
    }
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        color: 'white',
        textAlign: 'center',
        p: 3
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" fontWeight="800" gutterBottom>
          Careers Builder
        </Typography>
        <Typography variant="h5" sx={{ mb: 6, opacity: 0.9 }}>
          Create beautiful, branded careers pages for your company in minutes.
        </Typography>

        <Box display="flex" gap={2} justifyContent="center">
          <Link href="/login" passHref legacyBehavior>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#2563eb',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#f3f4f6'
                }
              }}
            >
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref legacyBehavior>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
