import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, slug } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and password are required' },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const companySlug = slug || name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 50); // Limit length

    // Check if company with email or slug already exists
    const existingCompany = await Company.findOne({
      $or: [{ email: email.toLowerCase() }, { slug: companySlug }],
    });

    if (existingCompany) {
      if (existingCompany.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'A company with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'This company name is already taken. Please choose a different name.' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create company with default content sections
    const company = await Company.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      slug: companySlug,
      departments: ['Engineering', 'Sales', 'Marketing'], // Default departments
      content_sections: [
        {
          type: 'hero',
          title: `Welcome to ${name}`,
          content: 'Join our team and make a difference',
          order: 0,
        },
      ],
    });

    // Generate JWT token
    const token = generateToken({
      id: company._id.toString(),
      email: company.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Company created successfully',
        token,
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          slug: company.slug,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
