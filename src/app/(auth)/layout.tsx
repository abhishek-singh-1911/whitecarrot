'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContainer>
      <AuthPaper elevation={0}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="700" color="primary" gutterBottom>
            Careers Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create beautiful careers pages in minutes
          </Typography>
        </Box>
        {children}
      </AuthPaper>
    </AuthContainer>
  );
}
