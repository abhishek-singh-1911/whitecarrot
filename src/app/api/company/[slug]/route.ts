import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Company slug is required' },
        { status: 400 }
      );
    }

    // Find company by slug (password is excluded by default in schema)
    const company = await Company.findOne({ slug: slug.toLowerCase() });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Return public company data
    return NextResponse.json({
      success: true,
      company: {
        id: company._id,
        slug: company.slug,
        name: company.name,
        logo_url: company.logo_url,
        theme: company.theme,
        departments: company.departments,
        content_sections: company.content_sections.sort((a, b) => a.order - b.order),
      },
    });
  } catch (error: any) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
