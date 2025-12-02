'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';

interface Job {
  _id?: string;
  title: string;
  department: string;
  location: string;
  work_policy: string;
  employment_type: string;
  experience_level: string;
  job_type: string;
  salary_range: string;
  description: string;
  isOpen: boolean;
}

interface JobEditorDialogProps {
  open: boolean;
  job?: Job | null;
  onClose: () => void;
  onSave: (job: Job) => void;
}

const initialJob: Job = {
  title: '',
  department: '',
  location: '',
  work_policy: 'Remote',
  employment_type: 'Full Time',
  experience_level: 'Mid-Level',
  job_type: 'Permanent',
  salary_range: '',
  description: '',
  isOpen: true,
};

export default function JobEditorDialog({ open, job, onClose, onSave }: JobEditorDialogProps) {
  const [formData, setFormData] = useState<Job>(initialJob);

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData(initialJob);
    }
  }, [job, open]);

  const handleChange = (field: keyof Job, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{job ? 'Edit Job' : 'Post New Job'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Job Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Department"
                fullWidth
                required
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Location"
                fullWidth
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Work Policy"
                fullWidth
                required
                value={formData.work_policy}
                onChange={(e) => handleChange('work_policy', e.target.value)}
              >
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="On-site">On-site</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Employment Type"
                fullWidth
                required
                value={formData.employment_type}
                onChange={(e) => handleChange('employment_type', e.target.value)}
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Experience Level"
                fullWidth
                required
                value={formData.experience_level}
                onChange={(e) => handleChange('experience_level', e.target.value)}
              >
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Mid-Level">Mid-Level</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Job Type"
                fullWidth
                required
                value={formData.job_type}
                onChange={(e) => handleChange('job_type', e.target.value)}
              >
                <MenuItem value="Permanent">Permanent</MenuItem>
                <MenuItem value="Temporary">Temporary</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Salary Range"
                fullWidth
                required
                placeholder="e.g. $80k - $120k or Competitive"
                value={formData.salary_range}
                onChange={(e) => handleChange('salary_range', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Job Description"
                fullWidth
                required
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isOpen}
                    onChange={(e) => handleChange('isOpen', e.target.checked)}
                    color="primary"
                  />
                }
                label="Job is Open (Accepting Applications)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {job ? 'Update Job' : 'Post Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
