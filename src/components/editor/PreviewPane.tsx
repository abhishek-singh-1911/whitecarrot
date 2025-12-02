'use client';

import { Box, Paper, Typography } from '@mui/material';
import CompanyPageRenderer from '@/components/CompanyPageRenderer';

interface PreviewPaneProps {
  company: any;
}

export default function PreviewPane({ company }: PreviewPaneProps) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Live Preview</Typography>
        <Typography variant="caption" color="text.secondary">
          Updates automatically
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}
      >
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
          <CompanyPageRenderer company={company} showOpenRolesButton={false} />
        </Box>
      </Paper>
    </Box>
  );
}
