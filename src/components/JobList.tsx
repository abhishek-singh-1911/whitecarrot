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
  experience_level: string;
  job_type: string;
}

interface JobListProps {
  jobs: Job[];
  company: {
    slug: string;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      font: string;
      titleColor?: string;
      bodyColor?: string;
      buttonTextColor?: string;
    };
  };
}

export default function JobList({ jobs, company }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [workPolicyFilter, setWorkPolicyFilter] = useState('All');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('All');

  const departments = ['All', ...Array.from(new Set(jobs.map(job => job.department)))];
  const locations = ['All', ...Array.from(new Set(jobs.map(job => job.location)))];
  const jobTypes = ['All', ...Array.from(new Set(jobs.map(job => job.employment_type)))];
  const workPolicies = ['All', ...Array.from(new Set(jobs.map(job => job.work_policy)))];
  const experienceLevels = ['All', ...Array.from(new Set(jobs.map((job: any) => job.experience_level)))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    const matchesLocation = locationFilter === 'All' || job.location === locationFilter;
    const matchesJobType = jobTypeFilter === 'All' || job.employment_type === jobTypeFilter;
    const matchesWorkPolicy = workPolicyFilter === 'All' || job.work_policy === workPolicyFilter;
    const matchesExperienceLevel = experienceLevelFilter === 'All' || (job as any).experience_level === experienceLevelFilter;
    return matchesSearch && matchesDept && matchesLocation && matchesJobType && matchesWorkPolicy && matchesExperienceLevel;
  });

  return (
    <Box id="open-roles" sx={{ py: 8, backgroundColor: company.theme.backgroundColor || '#f9fafb', fontFamily: company.theme.font }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom sx={{ color: company.theme.titleColor || 'inherit' }}>
          Open Positions
        </Typography>
        <Typography textAlign="center" sx={{ mb: 6, color: company.theme.bodyColor || 'text.secondary' }}>
          Find your next role at {company.slug}
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {/* Search Bar - Full width on mobile, 12 cols on desktop */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              placeholder="Search jobs by title..."
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

          {/* Department Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Department"
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

          {/* Location Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ backgroundColor: 'white' }}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </TextField>
          </Grid>

          {/* Job Type Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Job Type"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ backgroundColor: 'white' }}
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </TextField>
          </Grid>

          {/* Work Policy Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Work Policy"
              value={workPolicyFilter}
              onChange={(e) => setWorkPolicyFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ backgroundColor: 'white' }}
            >
              {workPolicies.map(policy => (
                <option key={policy} value={policy}>{policy}</option>
              ))}
            </TextField>
          </Grid>

          {/* Experience Level Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Experience Level"
              value={experienceLevelFilter}
              onChange={(e) => setExperienceLevelFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ backgroundColor: 'white' }}
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
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
                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: company.theme.titleColor || 'inherit' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ color: company.theme.bodyColor || 'text.secondary' }}>
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

                    <Link href={`/${company.slug}/careers/${job.job_slug || job._id}`} passHref legacyBehavior>
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
