'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import JobEditorDialog from '@/components/jobs/JobEditorDialog';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const companyData = localStorage.getItem('company');
      if (!companyData) return;

      const { id } = JSON.parse(companyData);

      // Fetch all jobs (include closed ones)
      const res = await fetch(`/api/jobs?companyId=${id}&includeAll=true`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setDialogOpen(true);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setJobs(jobs.filter(job => job._id !== id));
        setNotification({ open: true, message: 'Job deleted successfully', severity: 'success' });
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (error) {
      setNotification({ open: true, message: 'Error deleting job', severity: 'error' });
    }
  };

  const handleSaveJob = async (jobData: any) => {
    try {
      const token = localStorage.getItem('token');
      const isEdit = !!jobData._id;
      const url = isEdit ? `/api/jobs/${jobData._id}` : '/api/jobs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await res.json();

      if (data.success) {
        setNotification({ open: true, message: `Job ${isEdit ? 'updated' : 'created'} successfully`, severity: 'success' });
        setDialogOpen(false);
        fetchJobs(); // Refresh list
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setNotification({ open: true, message: error.message || 'Error saving job', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="700">
          Jobs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateJob}
        >
          Post New Job
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No jobs posted yet.</Typography>
                  <Button sx={{ mt: 2 }} onClick={handleCreateJob}>Create your first job</Button>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>
                    <Typography fontWeight="500">{job.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{job.employment_type}</Typography>
                  </TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={job.isOpen ? 'Active' : 'Closed'}
                      color={job.isOpen ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>0</TableCell> {/* Placeholder for applicants */}
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditJob(job)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteJob(job._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <JobEditorDialog
        open={dialogOpen}
        job={editingJob}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveJob}
      />

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
