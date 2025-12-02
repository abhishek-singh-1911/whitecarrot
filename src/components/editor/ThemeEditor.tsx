'use client';

import { Box, Typography, TextField, Stack, Divider } from '@mui/material';

interface ThemeEditorProps {
  theme: {
    primaryColor: string;
    backgroundColor: string;
    font: string;
    titleColor?: string;
    bodyColor?: string;
    buttonTextColor?: string;
  };
  logoUrl: string;
  onChange: (field: string, value: any) => void;
}

export default function ThemeEditor({ theme, logoUrl, onChange }: ThemeEditorProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Theme & Branding
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Logo URL"
          fullWidth
          value={logoUrl || ''}
          onChange={(e) => onChange('logo_url', e.target.value)}
          placeholder="https://example.com/logo.png"
          helperText="Enter a direct link to your company logo"
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Primary / Button Color
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => onChange('theme.primaryColor', e.target.value)}
              style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <TextField
              size="small"
              value={theme.primaryColor}
              onChange={(e) => onChange('theme.primaryColor', e.target.value)}
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Button Text Color
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={theme.buttonTextColor || '#ffffff'}
              onChange={(e) => onChange('theme.buttonTextColor', e.target.value)}
              style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <TextField
              size="small"
              value={theme.buttonTextColor || '#ffffff'}
              onChange={(e) => onChange('theme.buttonTextColor', e.target.value)}
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Background Color
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => onChange('theme.backgroundColor', e.target.value)}
              style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <TextField
              size="small"
              value={theme.backgroundColor}
              onChange={(e) => onChange('theme.backgroundColor', e.target.value)}
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Title Text Color
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={theme.titleColor || '#111827'}
              onChange={(e) => onChange('theme.titleColor', e.target.value)}
              style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <TextField
              size="small"
              value={theme.titleColor || '#111827'}
              onChange={(e) => onChange('theme.titleColor', e.target.value)}
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Body Text Color
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={theme.bodyColor || '#4b5563'}
              onChange={(e) => onChange('theme.bodyColor', e.target.value)}
              style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <TextField
              size="small"
              value={theme.bodyColor || '#4b5563'}
              onChange={(e) => onChange('theme.bodyColor', e.target.value)}
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
