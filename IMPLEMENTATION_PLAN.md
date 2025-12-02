# Implementation Plan: Careers Page Builder

**Project:** Full-stack Next.js application for creating branded Careers pages  
**Timeline:** 6–8 focused hours  
**Stack:** Next.js 14+ (App Router), TypeScript, MongoDB, Vercel

---

## Phase 1: Project Setup & Infrastructure 🛠️

### Step 1.1: Initialize Next.js Project
```bash
npx create-next-app@latest ./ --typescript --app --no-tailwind --eslint --src-dir
```

**Configuration during setup:**
*   ✅ TypeScript
*   ✅ ESLint
*   ✅ App Router
*   ✅ `src/` directory
*   ❌ Tailwind CSS (using MUI + styled-components instead)
*   ❌ Turbopack (optional)

**Post-initialization cleanup:**
*   Remove default boilerplate from `src/app/page.tsx`
*   Clean up `src/app/globals.css`
*   Remove unused default images

---

### Step 1.2: Install Core Dependencies

```bash
# Backend & Database
npm install mongoose bcryptjs jsonwebtoken

# UI & Styling
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled styled-components

# PWA Support
npm install next-pwa

# Development Dependencies
npm install -D @types/bcryptjs @types/jsonwebtoken @types/node @types/styled-components
```

**Dependency Rationale:**
*   `mongoose` - MongoDB ODM with schema validation
*   `bcryptjs` - Secure password hashing
*   `jsonwebtoken` - Stateless authentication
*   `@mui/material` - Component library with built-in accessibility
*   `@mui/icons-material` - Material Design icons
*   `@emotion/react` & `@emotion/styled` - Required peer dependencies for MUI
*   `styled-components` - CSS-in-JS for custom styling and theming
*   `next-pwa` - Progressive Web App support with service workers

---

### Step 1.3: Environment Configuration

Create `.env.local` in project root:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careers-builder?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars-long

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
*   Add `.env.local` to `.gitignore`
*   Use strong JWT secret (min 32 characters)
*   Never commit credentials to version control
*   Document required env vars in README

**MongoDB Setup:**
1.  Create free MongoDB Atlas account
2.  Create new cluster (Free tier: M0)
3.  Create database user with read/write permissions
4.  Whitelist IP address (or use 0.0.0.0/0 for development)
5.  Get connection string and add to `.env.local`

---

### Step 1.4: Database Connection Utility

Create `src/lib/db.ts`:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Cached connection for serverless optimization
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

**Why caching?** Serverless functions (Vercel) may create multiple connections. Caching prevents connection pool exhaustion.

---

### Step 1.5: Mongoose Models

#### Company Model - `src/models/Company.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  slug: string;
  name: string;
  email: string;
  password: string;
  logo_url?: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    font: string;
  };
  departments: string[];
  content_sections: Array<{
    type: 'hero' | 'text' | 'video' | 'gallery';
    title: string;
    content: string;
    image_url?: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    logo_url: {
      type: String,
      default: '',
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#2563eb', // Modern blue
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
      font: {
        type: String,
        default: 'Inter',
      },
    },
    departments: [String],
    content_sections: [
      {
        type: {
          type: String,
          enum: ['hero', 'text', 'video', 'gallery'],
          required: true,
        },
        title: String,
        content: String,
        image_url: String,
        order: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
```

#### Job Model - `src/models/Job.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  company_id: mongoose.Types.ObjectId;
  title: string;
  job_slug: string;
  work_policy: 'Remote' | 'On-site' | 'Hybrid';
  department: string;
  employment_type: 'Full Time' | 'Part Time' | 'Contract';
  experience_level: 'Senior' | 'Mid-Level' | 'Junior';
  job_type: 'Permanent' | 'Temporary' | 'Internship';
  location: string;
  salary_range: string;
  description: string;
  isOpen: boolean;
  date_posted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true, // For fast querying by company
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    job_slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    work_policy: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    employment_type: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract'],
      required: true,
    },
    experience_level: {
      type: String,
      enum: ['Senior', 'Mid-Level', 'Junior'],
      required: true,
    },
    job_type: {
      type: String,
      enum: ['Permanent', 'Temporary', 'Internship'],
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary_range: {
      type: String,
      required: [true, 'Salary range is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    date_posted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
```

---

### Step 1.6: Authentication Utilities

Create `src/lib/auth.ts`:

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

---

## Phase 2: Backend API Routes 🔌

### Step 2.1: Authentication APIs

#### Signup - `src/app/api/auth/signup/route.ts`

```typescript
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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if company exists
    const existingCompany = await Company.findOne({
      $or: [{ email }, { slug }],
    });
    
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this email or slug already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create company
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      departments: [],
      content_sections: [],
    });
    
    // Generate token
    const token = generateToken({
      id: company._id.toString(),
      email: company.email,
    });
    
    return NextResponse.json({
      success: true,
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        slug: company.slug,
      },
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Login - `src/app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find company (include password field)
    const company = await Company.findOne({ email }).select('+password');
    
    if (!company) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await comparePassword(password, company.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = generateToken({
      id: company._id.toString(),
      email: company.email,
    });
    
    return NextResponse.json({
      success: true,
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        slug: company.slug,
      },
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### Step 2.2: Company Management APIs

#### Get Public Company - `src/app/api/company/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const company = await Company.findOne({ slug: params.slug });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Return public data only (password excluded by schema)
    return NextResponse.json({
      success: true,
      company,
    });
    
  } catch (error: any) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Update Company - `src/app/api/company/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const updates = await req.json();
    
    // Update company
    const company = await Company.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
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
      company,
    });
    
  } catch (error: any) {
    console.error('Update company error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### Step 2.3: Job Management APIs

#### Jobs CRUD - `src/app/api/jobs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

// GET - List jobs (public or authenticated)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }
    
    const jobs = await Job.find({ company_id: companyId, isOpen: true })
      .sort({ date_posted: -1 });
    
    return NextResponse.json({
      success: true,
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
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const jobData = await req.json();
    
    // Auto-generate job_slug from title
    const job_slug = jobData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const job = await Job.create({
      ...jobData,
      company_id: decoded.id,
      job_slug,
    });
    
    return NextResponse.json({
      success: true,
      job,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Single Job - `src/app/api/jobs/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

// PUT - Update job
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const updates = await req.json();
    
    const job = await Job.findOneAndUpdate(
      { _id: params.id, company_id: decoded.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      job,
    });
    
  } catch (error: any) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const job = await Job.findOneAndDelete({
      _id: params.id,
      company_id: decoded.id,
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
    
  } catch (error: any) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Phase 3: Authentication Pages 🔐

### Step 3.1: Create Auth Layout

Create `src/app/(auth)/layout.tsx`:

```typescript
import '../globals.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}
```

Create `src/app/(auth)/auth.module.css` for styling.

---

### Step 3.2: Login Page

Create `src/app/(auth)/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('company', JSON.stringify(data.company));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Welcome Back</h1>
      <p>Sign in to manage your careers page</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
```

---

### Step 3.3: Signup Page

Create `src/app/(auth)/signup/page.tsx`:

Similar structure to login, with additional fields for `name` and auto-generated `slug`.

---

## Phase 4: Recruiter Dashboard 🎨

### Step 4.1: Dashboard Layout

Create `src/app/dashboard/layout.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        {/* Navigation here */}
      </nav>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
```

---

### Step 4.2: Dashboard Main Page

Create `src/app/dashboard/page.tsx`:

**Features:**
*   Split-screen: Sidebar (controls) + Preview pane
*   Theme controls (colors, logo)
*   Content section editor
*   Department manager
*   Save button

**Key state management:**
```typescript
const [company, setCompany] = useState(null);
const [theme, setTheme] = useState({ primaryColor: '', backgroundColor: '', logoUrl: '' });
const [sections, setSections] = useState([]);
const [departments, setDepartments] = useState([]);
```

---

### Step 4.3: Job Management Page

Create `src/app/dashboard/jobs/page.tsx`:

**Features:**
*   Fetch and display all jobs
*   "Add Job" button → opens modal
*   Edit/Delete functionality
*   Job form with all required fields

Create `src/components/JobModal.tsx` for the job creation/editing form.

---

## Phase 5: Public Careers Page 🌍

### Step 5.1: Dynamic Route Setup

Create `src/app/[slug]/careers/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';
import CareersPageClient from '@/components/CareersPageClient';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  await dbConnect();
  const company = await Company.findOne({ slug: params.slug });
  
  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }
  
  return {
    title: `Careers at ${company.name}`,
    description: company.content_sections[0]?.content || `Join the team at ${company.name}`,
  };
}

export default async function CareersPage({ params }: { params: { slug: string } }) {
  await dbConnect();
  
  const company = await Company.findOne({ slug: params.slug }).lean();
  
  if (!company) {
    notFound();
  }
  
  const jobs = await Job.find({ company_id: company._id, isOpen: true })
    .sort({ date_posted: -1 })
    .lean();
  
  return <CareersPageClient company={JSON.parse(JSON.stringify(company))} jobs={JSON.parse(JSON.stringify(jobs))} />;
}
```

---

### Step 5.2: Careers Page Client Component

Create `src/components/CareersPageClient.tsx`:

**Client component for:**
*   Theme injection (CSS variables)
*   Job search and filtering (client-side)
*   Job details modal

**Structure:**
1.  Hero Section
2.  Content Sections (rendered from company data)
3.  Job Board with Search/Filters
4.  Job Cards
5.  Job Details Modal

---

### Step 5.3: Job Board Component

Create `src/components/JobBoard.tsx`:

```typescript
'use client';

import { useState, useMemo } from 'react';

export default function JobBoard({ jobs, departments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    workPolicy: '',
    employmentType: '',
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !filters.department || job.department === filters.department;
      const matchesWorkPolicy = !filters.workPolicy || job.work_policy === filters.workPolicy;
      const matchesEmploymentType = !filters.employmentType || job.employment_type === filters.employmentType;
      
      return matchesSearch && matchesDepartment && matchesWorkPolicy && matchesEmploymentType;
    });
  }, [jobs, searchTerm, filters]);

  return (
    <div className="job-board">
      {/* Search and Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Filter dropdowns */}
      </div>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}
```

---

## Phase 6: MUI Theming & Custom Styling 🎨

### Step 6.1: Create MUI Theme Provider

Create `src/theme/theme.ts`:

```typescript
'use client';

import { createTheme } from '@mui/material/styles';

export const createCustomTheme = (primaryColor?: string, backgroundColor?: string) => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor || '#2563eb',
      },
      background: {
        default: backgroundColor || '#ffffff',
        paper: '#f9fafb',
      },
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
        },
      },
    },
  });
};

export const defaultTheme = createCustomTheme();
```

---

### Step 6.2: Setup Theme Provider in Root Layout

Update `src/app/layout.tsx`:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from '@/theme/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Step 6.3: Create Styled Components for Custom Styling

Create `src/components/styled/StyledComponents.ts`:

```typescript
import styled from 'styled-components';
import { Box, Card } from '@mui/material';

export const DashboardContainer = styled(Box)`
  display: flex;
  height: 100vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled(Box)`
  width: 320px;
  background: #f9fafb;
  padding: 24px;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const PreviewPane = styled(Box)`
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  padding: 24px;
`;

export const JobCard = styled(Card)`
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const HeroSection = styled(Box)<{ backgroundImage?: string }>`
  min-height: 400px;
  background-image: url(${props => props.backgroundImage || ''});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  
  & > * {
    position: relative;
    z-index: 2;
  }
`;
```

---

### Step 6.4: Configure PWA Support

#### Update `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /^\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 1 day
        }
      }
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 1 day
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
```

---

#### Create `public/manifest.json`:

```json
{
  "name": "Careers Page Builder",
  "short_name": "Careers",
  "description": "Build and browse beautiful branded careers pages",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["business", "productivity"],
  "screenshots": [
    {
      "src": "/screenshot-mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

---

#### Update `src/app/layout.tsx` to include manifest:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from '@/theme/theme';

export const metadata = {
  title: 'Careers Page Builder',
  description: 'Create beautiful branded careers pages',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Careers Builder',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Careers" />
      </head>
      <body>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

#### Create PWA Install Prompt Component

Create `src/components/PWAInstallPrompt.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button, Snackbar, IconButton } from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      message="Install app for a better experience"
      action={
        <>
          <Button
            color="primary"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleInstall}
          >
            Install
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleDismiss}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
}
```

**Usage:** Add `<PWAInstallPrompt />` to your careers page layout.

---

#### Generate PWA Icons

Use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
npx pwa-asset-generator public/logo.png public/icons --favicon --index public/manifest.json
```

Or create manually:
- `icon-192x192.png`
- `icon-256x256.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `apple-icon-180x180.png`

---

## Phase 7: Testing 🧪

### Step 7.1: Setup Testing Environment

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jest-environment-jsdom
```

Create `jest.config.js`, `jest.setup.js`.

---

### Step 7.2: Write Tests

**Priority tests:**
1.  Authentication flow (login, signup)
2.  API routes (mocked database)
3.  Job filtering logic
4.  Component rendering

---

## Phase 8: Deployment ✨

### Step 8.1: Prepare for Production

1.  Update `README.md` with setup instructions
2.  Add `.env.example` file
3.  Test production build: `npm run build`
4.  Fix any build errors

---

### Step 8.2: Deploy to Vercel

1.  Push code to GitHub
2.  Import project in Vercel dashboard
3.  Add environment variables:
    *   `MONGODB_URI`
    *   `JWT_SECRET`
    *   `NEXT_PUBLIC_APP_URL`
4.  Deploy
5.  Test production site thoroughly

---

## Phase 9: Documentation & Demo 📹

### Step 9.1: Write Documentation

1.  **README.md:**
    *   Project overview
    *   Tech stack and why
    *   Setup instructions
    *   Deployment guide
    *   Feature list
    *   Future improvements
2.  **Tech Spec.md:**
    *   Architecture decisions
    *   Schema design
    *   API documentation
    *   Test plan
3.  **AGENT_LOG.md:**
    *   How AI was used
    *   Prompts and refinements
    *   What worked / what didn't
    *   Learnings

---

### Step 9.2: Record Demo Video

**Script (≤5 minutes):**
1.  **Intro** (30s): Project overview
2.  **Recruiter Flow** (2min):
    *   Sign up
    *   Customize theme
    *   Add content section
    *   Post a job
    *   Preview page
3.  **Candidate Flow** (1.5min):
    *   Visit public page
    *   Browse jobs
    *   Use search and filters
    *   View job details
4.  **Mobile Demo** (30s): Show responsive design
5.  **Wrap-up** (30s): Tech stack, next steps

---

## Completion Checklist ✅

### Core Functionality
- [ ] User can sign up and log in
- [ ] Dashboard loads with company data
- [ ] Can customize theme (colors, logo)
- [ ] Can add/edit/remove content sections
- [ ] Can create/edit/delete jobs
- [ ] Can preview and save changes
- [ ] Public careers page renders correctly
- [ ] Jobs can be searched and filtered
- [ ] Job details modal works

### Technical Requirements
- [ ] MongoDB connected and models working
- [ ] All API routes functional
- [ ] JWT authentication secure
- [ ] Protected routes working
- [ ] Server-side rendering for SEO
- [ ] Dynamic metadata generation
- [ ] Responsive on mobile devices
- [ ] Accessible (keyboard nav, ARIA labels)
- [ ] PWA manifest.json configured
- [ ] Service worker registered and caching
- [ ] App installable on mobile/desktop
- [ ] Offline functionality working
- [ ] PWA icons generated (all sizes)
- [ ] Install prompt working

### Deliverables
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel/Netlify
- [ ] README.md complete
- [ ] Tech Spec.md documented
- [ ] AGENT_LOG.md written
- [ ] Demo video recorded and uploaded
- [ ] Submission form filled

### Polish
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/error notifications
- [ ] Smooth transitions and animations
- [ ] Premium visual design
- [ ] No console errors
- [ ] Clean, commented code

---

**Good luck! Build something amazing! 🚀**
