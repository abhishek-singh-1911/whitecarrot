import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CompanyPageRenderer from '@/components/CompanyPageRenderer';
import JobList from '@/components/JobList';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic';

async function getCompanyData(slug: string) {
  await dbConnect();
  const company = await Company.findOne({ slug: slug.toLowerCase() }).lean();

  if (!company) return null;

  console.log('Fetched company sections:', JSON.stringify(company.content_sections, null, 2));

  // Serialize MongoDB ID
  return {
    ...company,
    _id: company._id.toString(),
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

async function getCompanyJobs(companyId: string) {
  await dbConnect();
  const jobs = await Job.find({
    company_id: companyId,
    isOpen: true
  }).sort({ date_posted: -1 }).lean();

  // Serialize
  return jobs.map(job => ({
    ...job,
    _id: job._id.toString(),
    company_id: job.company_id.toString(),
    date_posted: job.date_posted.toISOString(),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ companySlug: string }> }): Promise<Metadata> {
  const { companySlug } = await params;
  const company = await getCompanyData(companySlug);

  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  return {
    title: `${company.name} Careers`,
    description: `Join the team at ${company.name}. View open roles and apply today.`,
  };
}

export default async function CareersPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params;
  const company = await getCompanyData(companySlug);

  if (!company) {
    notFound();
  }

  const jobs = await getCompanyJobs(company._id);

  return (
    <main>
      <CompanyPageRenderer company={company as any} />
      <JobList jobs={jobs as any} company={company as any} />
    </main>
  );
}
