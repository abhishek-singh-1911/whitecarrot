import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import { verifyToken, extractToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
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

    const updates = await req.json();

    // Prevent updating sensitive fields
    const { password, email, slug, _id, ...allowedUpdates } = updates;

    // Update company
    const company = await Company.findByIdAndUpdate(
      decoded.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Company updated successfully',
      company: {
        id: company._id,
        name: company.name,
        slug: company.slug,
        logo_url: company.logo_url,
        theme: company.theme,
        departments: company.departments,
        content_sections: company.content_sections.sort((a, b) => a.order - b.order),
      },
    });
  } catch (error: any) {
    console.error('Update company error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
