import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whitecarrot-five.vercel.app';

  await dbConnect();

  // Get all companies
  const companies = await Company.find({}).select('slug updatedAt').lean();

  // Get all open jobs with company info
  const jobs = await Job.find({ isOpen: true })
    .populate('company_id', 'slug')
    .select('job_slug updatedAt company_id')
    .lean();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // Company careers pages
  const companyRoutes: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${baseUrl}/${company.slug}/careers`,
    lastModified: new Date(company.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Individual job pages
  const jobRoutes: MetadataRoute.Sitemap = jobs
    .filter((job: any) => job.company_id && job.company_id.slug)
    .map((job: any) => ({
      url: `${baseUrl}/${job.company_id.slug}/careers/${job.job_slug}`,
      lastModified: new Date(job.updatedAt),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

  return [...staticRoutes, ...companyRoutes, ...jobRoutes];
}
