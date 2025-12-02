'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
  InputAdornment
} from '@mui/material';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    slug: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and company data
      localStorage.setItem('token', data.token);
      localStorage.setItem('company', JSON.stringify(data.company));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Get Started
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create your company's branded careers page
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Company Name"
        name="name"
        fullWidth
        required
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Company Slug (URL)"
        name="slug"
        fullWidth
        placeholder="acme-corp"
        value={formData.slug}
        onChange={handleChange}
        helperText={`Your page will be at /${formData.slug || 'company-name'}/careers`}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">/</InputAdornment>,
        }}
      />

      <TextField
        label="Email Address"
        name="email"
        type="email"
        fullWidth
        required
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
        autoComplete="email"
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        required
        value={formData.password}
        onChange={handleChange}
        helperText="Must be at least 8 characters"
        sx={{ mb: 3 }}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{ mb: 3, height: 48 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/login" passHref legacyBehavior>
            <MuiLink fontWeight="600" underline="hover">
              Sign in
            </MuiLink>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
