import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { verifyToken, extractToken } from '@/lib/auth';

// GET - List jobs (public or authenticated)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const includeAll = searchParams.get('includeAll') === 'true'; // For admin dashboard

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId query parameter is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { company_id: companyId };

    // Only show open jobs for public view
    if (!includeAll) {
      query.isOpen = true;
    }

    const jobs = await Job.find(query)
      .sort({ date_posted: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create job (authenticated)
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const jobData = await req.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'work_policy',
      'department',
      'employment_type',
      'experience_level',
      'job_type',
      'location',
      'salary_range',
      'description',
    ];

    const missingFields = requiredFields.filter((field) => !jobData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields,
        },
        { status: 400 }
      );
    }

    // Auto-generate job_slug from title
    let job_slug = jobData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);

    // Ensure uniqueness within the company
    let slugExists = await Job.findOne({ company_id: decoded.id, job_slug });

    if (slugExists) {
      // Append a random string to ensure uniqueness if the base slug exists
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      job_slug = `${job_slug}-${randomSuffix}`;
    }

    // Create job
    const job = await Job.create({
      ...jobData,
      company_id: decoded.id,
      job_slug,
    });

    console.log(`Created job with slug: ${job_slug}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Job created successfully',
        job,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create job error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
