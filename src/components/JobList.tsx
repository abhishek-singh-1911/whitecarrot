'use client';

import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Place as PlaceIcon, Work as WorkIcon } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  job_slug: string;
  department: string;
  location: string;
  employment_type: string;
  work_policy: string;
}

interface JobListProps {
  jobs: Job[];
  company: {
    slug: string;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      font: string;
    };
  };
}

export default function JobList({ jobs, company }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const departments = ['All', ...Array.from(new Set(jobs.map(job => job.department)))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9fafb', fontFamily: company.theme.font }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom>
          Open Positions
        </Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Find your next role at {company.slug}
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="Search jobs by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ backgroundColor: 'white' }}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Job Cards */}
        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      borderColor: company.theme.primaryColor
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {job.department}
                        </Typography>
                      </Box>
                      <Chip
                        label={job.work_policy}
                        size="small"
                        sx={{
                          backgroundColor: `${company.theme.primaryColor}15`,
                          color: company.theme.primaryColor,
                          fontWeight: 500
                        }}
                      />
                    </Box>

                    <Box display="flex" gap={2} mb={3}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PlaceIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <WorkIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.employment_type}
                        </Typography>
                      </Box>
                    </Box>

                    <Link href={`/${company.slug}/careers/${job.job_slug}`} passHref legacyBehavior>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: company.theme.primaryColor,
                          color: company.theme.primaryColor,
                          '&:hover': {
                            borderColor: company.theme.primaryColor,
                            backgroundColor: `${company.theme.primaryColor}05`
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Box textAlign="center" py={8}>
                <Typography color="text.secondary">
                  No jobs found matching your criteria.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
