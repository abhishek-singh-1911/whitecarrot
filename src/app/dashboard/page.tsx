'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Tabs, Tab, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import ThemeEditor from '@/components/editor/ThemeEditor';
import ContentEditor from '@/components/editor/ContentEditor';
import PreviewPane from '@/components/editor/PreviewPane';

export default function DashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const storedCompany = localStorage.getItem('company');
      if (!storedCompany) return;

      const { slug } = JSON.parse(storedCompany);
      const res = await fetch(`/api/company/${slug}`);
      const data = await res.json();

      if (data.success) {
        setCompany(data.company);
      }
    } catch (error) {
      console.error('Failed to fetch company data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/company/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(company)
      });

      const data = await res.json();

      if (data.success) {
        setNotification({ open: true, message: 'Changes saved successfully!', severity: 'success' });
        // Update local storage if needed
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setNotification({ open: true, message: error.message || 'Failed to save changes', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (field: string, value: any) => {
    setCompany((prev: any) => {
      const newCompany = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newCompany[parent] = { ...newCompany[parent], [child]: value };
      } else {
        newCompany[field] = value;
      }
      return newCompany;
    });
  };

  const handleContentChange = (newSections: any[]) => {
    setCompany((prev: any) => ({ ...prev, content_sections: newSections }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 48px)' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Content" />
          <Tab label="Theme & Branding" />
        </Tabs>

        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Editor Column */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'auto' }}>
          <Paper sx={{ p: 3, minHeight: '100%' }}>
            {activeTab === 0 ? (
              <ContentEditor
                sections={company.content_sections}
                onChange={handleContentChange}
              />
            ) : (
              <ThemeEditor
                theme={company.theme}
                logoUrl={company.logo_url}
                onChange={handleThemeChange}
              />
            )}
          </Paper>
        </Grid>

        {/* Preview Column */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%' }}>
          <PreviewPane company={company} />
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
