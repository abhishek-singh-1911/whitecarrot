import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Box, Container, Typography, Button, Paper, Grid, Divider, Chip } from '@mui/material';
import { Place as PlaceIcon, Work as WorkIcon, AttachMoney as MoneyIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getJobData(companySlug: string, jobSlug: string) {
  await dbConnect();

  const company = await Company.findOne({ slug: companySlug.toLowerCase() });
  if (!company) return null;

  const job = await Job.findOne({
    company_id: company._id,
    job_slug: jobSlug.toLowerCase(),
    isOpen: true
  }).lean();

  // Fallback: Check if jobSlug is a valid ObjectId and try finding by ID (for backward compatibility)
  if (!job && /^[0-9a-fA-F]{24}$/.test(jobSlug)) {
    const jobById = await Job.findOne({
      company_id: company._id,
      _id: jobSlug,
      isOpen: true
    }).lean();

    if (jobById) {
      // If found by ID, use it
      return {
        job: {
          ...jobById,
          _id: jobById._id.toString(),
          company_id: jobById.company_id.toString(),
          date_posted: jobById.date_posted.toISOString(),
          createdAt: jobById.createdAt.toISOString(),
          updatedAt: jobById.updatedAt.toISOString(),
        },
        company: {
          name: company.name,
          slug: company.slug,
          logo_url: company.logo_url,
          theme: company.theme,
        }
      };
    }
  }

  if (!job) return null;

  return {
    job: {
      ...job,
      _id: job._id.toString(),
      company_id: job.company_id.toString(),
      date_posted: job.date_posted.toISOString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    },
    company: {
      name: company.name,
      slug: company.slug,
      logo_url: company.logo_url,
      theme: company.theme,
    }
  };
}

export async function generateMetadata({ params }: { params: Promise<{ companySlug: string; jobSlug: string }> }): Promise<Metadata> {
  const { companySlug, jobSlug } = await params;
  const data = await getJobData(companySlug, jobSlug);

  if (!data) {
    return { title: 'Job Not Found' };
  }

  return {
    title: `${data.job.title} at ${data.company.name}`,
    description: `Apply for the ${data.job.title} position at ${data.company.name}.`,
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<{ companySlug: string; jobSlug: string }> }) {
  const { companySlug, jobSlug } = await params;
  const data = await getJobData(companySlug, jobSlug);

  if (!data) {
    notFound();
  }

  const { job, company } = data;
  const { theme } = company;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.backgroundColor || '#f9fafb', fontFamily: theme.font }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', py: 2 }}>
        <Container maxWidth="lg">
          <Link href={`/${company.slug}/careers`} passHref legacyBehavior>
            <Button startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
              Back to Careers
            </Button>
          </Link>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box mb={4}>
              <Typography variant="h3" fontWeight="700" gutterBottom sx={{ color: theme.titleColor || '#111827' }}>
                {job.title}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
                  {job.department}
                </Typography>
                <Chip
                  label={job.work_policy}
                  size="small"
                  sx={{
                    backgroundColor: `${theme.primaryColor}15`,
                    color: theme.primaryColor,
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                About the Role
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: theme.bodyColor || '#4b5563',
                  lineHeight: 1.8
                }}
              >
                {job.description}
              </Typography>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 24 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                href={`mailto:${company.name.toLowerCase().replace(/\s/g, '')}@example.com?subject=Application for ${job.title}`}
                sx={{
                  mb: 3,
                  backgroundColor: theme.primaryColor,
                  color: theme.buttonTextColor || '#ffffff',
                  '&:hover': { backgroundColor: theme.primaryColor, filter: 'brightness(0.9)' },
                  py: 1.5
                }}
              >
                Apply for this Job
              </Button>

              <Divider sx={{ mb: 3 }} />

              <Box display="flex" flexDirection="column" gap={2.5}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PlaceIcon fontSize="small" color="action" />
                    <Typography fontWeight="500">{job.location}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Employment Type
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <WorkIcon fontSize="small" color="action" />
                    <Typography fontWeight="500">{job.employment_type}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Salary Range
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MoneyIcon fontSize="small" color="action" />
                    <Typography fontWeight="500">{job.salary_range}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Experience Level
                  </Typography>
                  <Typography fontWeight="500">{job.experience_level}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date Posted
                  </Typography>
                  <Typography fontWeight="500">
                    {new Date(job.date_posted).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
