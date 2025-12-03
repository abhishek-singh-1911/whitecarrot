# Careers Builder - Architecture & Schema Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Architecture](#api-architecture)
6. [Component Architecture](#component-architecture)
7. [Authentication Flow](#authentication-flow)
8. [Routing Structure](#routing-structure)
9. [State Management](#state-management)
10. [Deployment Architecture](#deployment-architecture)

---

## Project Overview

**Careers Builder** is a full-stack SaaS application that enables companies to create and manage their own branded careers pages. The platform provides a comprehensive CMS for managing job postings, customizing themes, and creating rich content sections.

### Key Capabilities
- **Multi-tenant Architecture**: Each company gets their own branded careers page
- **Content Management**: Drag-and-drop content sections with real-time preview
- **Job Management**: Full CRUD operations for job postings with advanced filtering
- **Theme Customization**: Custom colors, fonts, and logos
- **Progressive Web App**: Installable on mobile devices with offline support
- **SEO Optimized**: Server-side rendering with dynamic sitemaps

---

## Technology Stack

### Frontend
```typescript
{
  "framework": "Next.js 16.0.6 (App Router)",
  "language": "TypeScript 5",
  "ui_library": "Material-UI (MUI) v7",
  "styling": "Emotion (CSS-in-JS)",
  "state_management": "React Hooks + localStorage",
  "drag_and_drop": "@hello-pangea/dnd",
  "pwa": "next-pwa v5.6.0"
}
```

### Backend
```typescript
{
  "runtime": "Node.js 20+",
  "framework": "Next.js API Routes",
  "database": "MongoDB (via Mongoose ODM)",
  "authentication": "JWT (jsonwebtoken)",
  "password_hashing": "bcryptjs (12 rounds)",
  "validation": "Mongoose Schema Validators"
}
```

### Testing & Development
```typescript
{
  "testing_framework": "Jest 30.2.0",
  "component_testing": "React Testing Library 16.3.0",
  "linting": "ESLint 9",
  "type_checking": "TypeScript"
}
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Mobile App  │  │   PWA        │      │
│  │   (React)    │  │  (React)     │  │  (Offline)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              App Router (Server Components)          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │   │
│  │  │   Public   │ │  Protected │ │    API     │       │   │
│  │  │   Routes   │ │   Routes   │ │   Routes   │       │   │
│  │  └────────────┘ └────────────┘ └────────────┘       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Middleware Layer                    │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │   │
│  │  │    Auth    │ │  Database  │ │  Validation│       │   │
│  │  │   (JWT)    │ │ Connection │ │   Logic    │       │   │
│  │  └────────────┘ └────────────┘ └────────────┘       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas (Cloud)                   │   │
│  │  ┌────────────┐ ┌────────────┐                       │   │
│  │  │ Companies  │ │    Jobs    │                       │   │
│  │  │ Collection │ │ Collection │                       │   │
│  │  └────────────┘ └────────────┘                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Request → Next.js Router → Authentication Check → 
Database Query → Data Processing → Response Generation → 
Client Rendering
```

---

## Database Schema

### Company Collection

The Company schema represents an organization's account and careers page configuration.

```typescript
interface ICompany {
  // Identity & Authentication
  _id: ObjectId;                    // Auto-generated MongoDB ID
  slug: string;                     // Unique company identifier (URL-safe)
  name: string;                     // Company name
  email: string;                    // Login email (unique)
  password: string;                 // Bcrypt hashed password (select: false)
  
  // Branding
  logo_url?: string;                // Company logo URL
  
  // Theme Configuration
  theme: {
    primaryColor: string;           // Hex color (default: '#2563eb')
    backgroundColor: string;        // Hex color (default: '#ffffff')
    font: string;                   // Font family (default: 'Inter')
    titleColor: string;             // Hex color (default: '#111827')
    bodyColor: string;              // Hex color (default: '#4b5563')
    buttonTextColor: string;        // Hex color (default: '#ffffff')
  };
  
  // Organization
  departments: string[];            // List of department names
  
  // Content Sections (Ordered)
  content_sections: Array<{
    type: 'hero' | 'text' | 'video' | 'gallery';
    title: string;
    content: string;
    image_url?: string;             // For hero sections
    gallery_images?: string[];      // For gallery sections
    video_url?: string;             // For video sections (embed URL)
    order: number;                  // Display order (0-based)
  }>;
  
  // Timestamps
  createdAt: Date;                  // Auto-managed by Mongoose
  updatedAt: Date;                  // Auto-managed by Mongoose
}
```

#### Schema Constraints
```typescript
{
  slug: {
    unique: true,
    indexed: true,
    pattern: /^[a-z0-9-]+$/,        // Lowercase letters, numbers, hyphens only
    lowercase: true,
    trim: true
  },
  email: {
    unique: true,
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    lowercase: true,
    trim: true
  },
  password: {
    select: false,                  // Never returned in queries by default
    required: true
  }
}
```

#### Indexes
```typescript
{
  slug: 1,           // Unique index (via schema constraint)
  email: 1           // Unique index (via schema constraint)
}
```

---

### Job Collection

The Job schema represents individual job postings linked to companies.

```typescript
interface IJob {
  // Identity & Relationships
  _id: ObjectId;                    // Auto-generated MongoDB ID
  company_id: ObjectId;             // Reference to Company (indexed)
  
  // Job Identity
  title: string;                    // Job title
  job_slug: string;                 // URL-safe identifier (unique per company)
  
  // Job Categorization
  work_policy: 'Remote' | 'On-site' | 'Hybrid';
  department: string;               // e.g., "Engineering", "Sales"
  employment_type: 'Full Time' | 'Part Time' | 'Contract';
  experience_level: 'Senior' | 'Mid-Level' | 'Junior';
  job_type: 'Permanent' | 'Temporary' | 'Internship';
  
  // Location & Compensation
  location: string;                 // e.g., "San Francisco, CA" or "Remote"
  salary_range: string;             // e.g., "$100k - $150k"
  
  // Job Details
  description: string;              // Full job description (supports HTML)
  
  // Status
  isOpen: boolean;                  // Whether job is currently accepting applications
  date_posted: Date;                // Publication date
  
  // Timestamps
  createdAt: Date;                  // Auto-managed by Mongoose
  updatedAt: Date;                  // Auto-managed by Mongoose
}
```

#### Schema Constraints
```typescript
{
  company_id: {
    type: ObjectId,
    ref: 'Company',
    required: true,
    indexed: true
  },
  job_slug: {
    lowercase: true,
    // Unique per company (compound index)
  },
  work_policy: {
    enum: ['Remote', 'On-site', 'Hybrid']
  },
  employment_type: {
    enum: ['Full Time', 'Part Time', 'Contract']
  },
  experience_level: {
    enum: ['Senior', 'Mid-Level', 'Junior']
  },
  job_type: {
    enum: ['Permanent', 'Temporary', 'Internship']
  },
  isOpen: {
    default: true
  },
  date_posted: {
    default: Date.now
  }
}
```

#### Indexes
```typescript
{
  company_id: 1,                              // Single index
  { company_id: 1, isOpen: 1 },              // Compound index
  { company_id: 1, job_slug: 1 },            // Unique compound index
  department: 1,                              // Single index
  work_policy: 1,                             // Single index
  employment_type: 1                          // Single index
}
```

---

### Database Relationships

```
┌─────────────────┐
│    Company      │
│  _id (PK)       │───┐
│  slug (UK)      │   │
│  email (UK)     │   │ One-to-Many
│  ...            │   │
└─────────────────┘   │
                      │
                      │ References
                      │
                      ↓
                ┌─────────────────┐
                │      Job        │
                │  _id (PK)       │
                │  company_id (FK)│
                │  job_slug       │
                │  ...            │
                └─────────────────┘
```

---

## API Architecture

### API Route Structure

```
/api
├── /auth
│   ├── /login
│   │   └── POST - Authenticate company and return JWT
│   └── /signup
│       └── POST - Create new company account
├── /company
│   ├── /[slug]
│   │   └── GET - Get public company data by slug
│   └── /update
│       └── PUT - Update company settings (protected)
└── /jobs
    ├── GET - List jobs for a company
    ├── POST - Create new job (protected)
    └── /[id]
        ├── PUT - Update job (protected)
        └── DELETE - Delete job (protected)
```

### API Endpoints Detailed

#### Authentication Endpoints

##### POST `/api/auth/signup`
**Purpose**: Create a new company account

**Request Body**:
```typescript
{
  name: string;           // Company name
  slug: string;           // Unique company URL slug
  email: string;          // Login email
  password: string;       // Plain text password (will be hashed)
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  message: "Company created successfully";
  token: string;          // JWT token
  company: {
    id: string;
    name: string;
    email: string;
    slug: string;
    theme: ThemeObject;
  }
}
```

**Errors**:
- 400: Missing required fields
- 409: Slug or email already exists
- 500: Server error

---

##### POST `/api/auth/login`
**Purpose**: Authenticate and get access token

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: "Login successful";
  token: string;          // JWT token
  company: {
    id: string;
    name: string;
    email: string;
    slug: string;
    theme: ThemeObject;
    logo_url?: string;
  }
}
```

**Errors**:
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

---

#### Company Endpoints

##### GET `/api/company/[slug]`
**Purpose**: Get public company data (no authentication required)

**URL Parameters**:
```typescript
{
  slug: string;           // Company slug
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  company: {
    name: string;
    slug: string;
    logo_url?: string;
    theme: ThemeObject;
    content_sections: Section[];
    departments: string[];
  }
}
```

**Errors**:
- 400: Missing slug
- 404: Company not found
- 500: Server error

---

##### PUT `/api/company/update`
**Purpose**: Update company settings (protected)

**Headers**:
```typescript
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body** (all fields optional):
```typescript
{
  name?: string;
  logo_url?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    font?: string;
    titleColor?: string;
    bodyColor?: string;
    buttonTextColor?: string;
  };
  departments?: string[];
  content_sections?: Section[];
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: "Company updated successfully";
  company: CompanyObject;
}
```

**Errors**:
- 401: Missing or invalid token
- 404: Company not found
- 500: Server error

---

#### Job Endpoints

##### GET `/api/jobs?companyId={id}&includeAll={boolean}`
**Purpose**: List jobs for a company

**Query Parameters**:
```typescript
{
  companyId: string;      // Required: Company ObjectId
  includeAll?: boolean;   // Optional: Include closed jobs (default: false)
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  count: number;
  jobs: Job[];
}
```

**Errors**:
- 400: Missing companyId
- 500: Server error

---

##### POST `/api/jobs`
**Purpose**: Create a new job (protected)

**Headers**:
```typescript
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body**:
```typescript
{
  title: string;
  work_policy: 'Remote' | 'On-site' | 'Hybrid';
  department: string;
  employment_type: 'Full Time' | 'Part Time' | 'Contract';
  experience_level: 'Senior' | 'Mid-Level' | 'Junior';
  job_type: 'Permanent' | 'Temporary' | 'Internship';
  location: string;
  salary_range: string;
  description: string;
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  message: "Job created successfully";
  job: JobObject;         // Includes auto-generated job_slug
}
```

**Job Slug Generation Logic**:
```typescript
// Converts "Senior Frontend Engineer" → "senior-frontend-engineer"
const slug = title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars
  .replace(/\s+/g, '-')              // Spaces to hyphens
  .replace(/-+/g, '-')               // Dedupe hyphens
  .substring(0, 100);                // Max 100 chars

// If slug exists, append random suffix
if (slugExists) {
  slug = `${slug}-${randomString}`;
}
```

**Errors**:
- 401: Missing or invalid token
- 400: Missing required fields / validation error
- 500: Server error

---

##### PUT `/api/jobs/[id]`
**Purpose**: Update an existing job (protected)

**Headers**:
```typescript
{
  "Authorization": "Bearer <jwt_token>"
}
```

**URL Parameters**:
```typescript
{
  id: string;             // Job ObjectId
}
```

**Request Body** (all fields optional):
```typescript
{
  title?: string;
  work_policy?: string;
  department?: string;
  employment_type?: string;
  experience_level?: string;
  job_type?: string;
  location?: string;
  salary_range?: string;
  description?: string;
  isOpen?: boolean;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: "Job updated successfully";
  job: JobObject;
}
```

**Errors**:
- 401: Missing or invalid token / not job owner
- 400: Invalid job ID
- 404: Job not found
- 500: Server error

---

##### DELETE `/api/jobs/[id]`
**Purpose**: Delete a job (protected)

**Headers**:
```typescript
{
  "Authorization": "Bearer <jwt_token>"
}
```

**URL Parameters**:
```typescript
{
  id: string;             // Job ObjectId
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: "Job deleted successfully";
}
```

**Errors**:
- 401: Missing or invalid token / not job owner
- 400: Invalid job ID
- 404: Job not found
- 500: Server error

---

## Component Architecture

### Component Hierarchy

```
App
├── Layout (Root)
│   ├── ThemeRegistry (MUI Provider)
│   └── PWAInstallPrompt
│
├── Public Routes
│   ├── Home (/)
│   │   └── Landing page
│   ├── Login (/login)
│   └── Signup (/signup)
│
├── Public Careers Pages
│   └── [companySlug]/careers
│       ├── CompanyPageRenderer
│       │   ├── Header
│       │   ├── Content Sections (Dynamic)
│       │   │   ├── HeroSection
│       │   │   ├── TextSection
│       │   │   ├── VideoSection
│       │   │   └── GallerySection
│       │   └── Footer
│       └── JobList
│           ├── SearchBar
│           ├── Filters (Department, Location, etc.)
│           └── JobCards[]
│
└── Protected Routes (requires JWT)
    └── /edit (Dashboard)
        ├── DashboardLayout
        │   ├── DashboardSidebar
        │   │   ├── Navigation Menu
        │   │   ├── View Live Page Button
        │   │   └── Logout Button
        │   └── Main Content Area
        │
        ├── Editor (/edit)
        │   ├── ThemeEditor
        │   │   ├── Color Pickers
        │   │   ├── Font Selector
        │   │   └── Logo Upload
        │   ├── ContentEditor
        │   │   ├── DragDropContext
        │   │   ├── Section List (Draggable)
        │   │   └── Add Section Button
        │   └── PreviewPane
        │       └── CompanyPageRenderer (Read-only)
        │
        └── Jobs (/edit/jobs)
            ├── JobEditorDialog
            │   └── Job Form
            └── Job List Table
                ├── DataGrid
                ├── Edit/Delete Actions
                └── Add Job Button
```

### Key Components

#### 1. **CompanyPageRenderer**
**Path**: `src/components/CompanyPageRenderer.tsx`

**Purpose**: Renders the public-facing careers page

**Props**:
```typescript
interface CompanyPageRendererProps {
  company: {
    name: string;
    logo_url?: string;
    theme: ThemeObject;
    content_sections: Section[];
  };
  showOpenRolesButton?: boolean;
}
```

**Features**:
- Dynamic section rendering based on type
- Scroll-to-jobs functionality
- Responsive design
- Theme-aware styling

---

#### 2. **JobList**
**Path**: `src/components/JobList.tsx`

**Purpose**: Displays and filters job listings

**Props**:
```typescript
interface JobListProps {
  jobs: Job[];
  company: {
    slug: string;
    theme: ThemeObject;
  };
}
```

**Features**:
- Real-time search filtering
- Multi-dimensional filtering (department, location, job type, work policy, experience)
- Responsive grid layout
- Empty state handling

**State Management**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [departmentFilter, setDepartmentFilter] = useState('All');
const [locationFilter, setLocationFilter] = useState('All');
const [jobTypeFilter, setJobTypeFilter] = useState('All');
const [workPolicyFilter, setWorkPolicyFilter] = useState('All');
const [experienceLevelFilter, setExperienceLevelFilter] = useState('All');
```

---

#### 3. **DashboardSidebar**
**Path**: `src/components/DashboardSidebar.tsx`

**Purpose**: Navigation for authenticated users

**Props**:
```typescript
interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onDrawerToggle?: () => void;
}
```

**Features**:
- Responsive drawer (permanent on desktop, temporary on mobile)
- Active route highlighting
- Company slug retrieval from localStorage
- Logout functionality

---

#### 4. **ThemeEditor**
**Path**: `src/components/editor/ThemeEditor.tsx`

**Purpose**: Visual theme customization interface

**Features**:
- Color picker for all theme colors
- Font family selector
- Logo URL input
- Real-time preview updates
- Department management

---

#### 5. **ContentEditor**
**Path**: `src/components/editor/ContentEditor.tsx`

**Purpose**: Drag-and-drop content section manager

**Features**:
- Drag and drop reordering (@hello-pangea/dnd)
- Add/remove sections
- Section type selection
- Field-specific inputs per section type
- Accordion-based UI

**Section Types**:
```typescript
type SectionType = 'hero' | 'text' | 'video' | 'gallery';
```

---

#### 6. **PreviewPane**
**Path**: `src/components/editor/PreviewPane.tsx`

**Purpose**: Real-time preview of careers page

**Features**:
- Live updates as theme/content changes
- Embedded CompanyPageRenderer
- Responsive preview
- No edit capabilities (read-only)

---

#### 7. **JobEditorDialog**
**Path**: `src/components/jobs/JobEditorDialog.tsx`

**Purpose**: Create/edit job postings

**Features**:
- Modal dialog interface
- Form validation
- All job fields
- Create and Update modes
- Integration with Jobs API

---

## Authentication Flow

### JWT Token Structure

```typescript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: string;           // Company ObjectId
    email: string;        // Company email
    iat: number;          // Issued at (timestamp)
    exp: number;          // Expiration (30 days)
  },
  signature: string       // HMAC SHA256 signature
}
```

### Authentication Workflow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. POST /api/auth/login
     │    { email, password }
     ↓
┌────────────┐
│ API Route  │
└────┬───────┘
     │
     │ 2. Verify credentials
     │    (bcrypt.compare)
     ↓
┌──────────┐
│ Database │
└────┬─────┘
     │
     │ 3. Generate JWT
     ↓
┌────────────┐
│   Server   │
└────┬───────┘
     │
     │ 4. Return token
     ↓
┌──────────┐
│  Client  │ 5. Store in localStorage
└────┬─────┘
     │
     │ 6. Include in subsequent requests
     │    Authorization: Bearer <token>
     ↓
┌────────────┐
│ Protected  │ 7. Verify token
│   Route    │    (jwt.verify)
└────────────┘
```

### Token Storage

**Client-side**:
```typescript
// Store token
localStorage.setItem('token', jwtToken);
localStorage.setItem('company', JSON.stringify(companyData));

// Retrieve token
const token = localStorage.getItem('token');

// Include in requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Clear on logout
localStorage.removeItem('token');
localStorage.removeItem('company');
```

### Protected Route Pattern

```typescript
// In API routes
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

// Access company ID
const companyId = decoded.id;
```

---

## Routing Structure

### File-based Routing (Next.js App Router)

```
src/app/
├── page.tsx                          → /
├── layout.tsx                        → Root layout (all pages)
├── globals.css                       → Global styles
│
├── (auth)/                           → Route group (no URL segment)
│   ├── login/
│   │   └── page.tsx                  → /login
│   └── signup/
│       └── page.tsx                  → /signup
│
├── [companySlug]/                    → Dynamic route
│   └── careers/
│       ├── page.tsx                  → /[slug]/careers
│       └── [jobSlug]/
│           └── page.tsx              → /[slug]/careers/[job]
│
├── edit/                             → Protected routes
│   ├── layout.tsx                    → Dashboard layout
│   ├── page.tsx                      → /edit (Editor)
│   └── jobs/
│       └── page.tsx                  → /edit/jobs
│
└── api/                              → API routes
    ├── auth/
    │   ├── login/route.ts            → POST /api/auth/login
    │   └── signup/route.ts           → POST /api/auth/signup
    ├── company/
    │   ├── [slug]/route.ts           → GET /api/company/[slug]
    │   └── update/route.ts           → PUT /api/company/update
    └── jobs/
        ├── route.ts                  → GET, POST /api/jobs
        └── [id]/route.ts             → PUT, DELETE /api/jobs/[id]
```

### Route Protection

**Client-side** (useEffect in protected pages):
```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  }
}, []);
```

**Server-side** (API routes):
```typescript
const token = extractToken(req.headers.get('authorization'));
if (!token || !verifyToken(token)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## State Management

### Local State (Component-level)
```typescript
// React useState for component state
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Persistent State (localStorage)
```typescript
// Authentication state
localStorage.setItem('token', token);
localStorage.setItem('company', JSON.stringify(company));

// Retrieval
const token = localStorage.getItem('token');
const company = JSON.parse(localStorage.getItem('company') || '{}');
```

### Server State (Database)
```typescript
// Mongoose models act as single source of truth
// Data fetched via API routes on-demand
// No global state management library (Redux, Zustand, etc.)
```

### State Flow

```
User Action → Component Event Handler → API Call →
Database Query → Response → State Update → Re-render
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────┐
│            Vercel Platform              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Edge Network (CDN)              │ │
│  │   - Static Assets                 │ │
│  │   - Cached Pages                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Serverless Functions            │ │
│  │   - API Routes                    │ │
│  │   - Server Components             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Environment Variables           │ │
│  │   - MONGODB_URI                   │ │
│  │   - JWT_SECRET                    │ │
│  │   - NEXT_PUBLIC_APP_URL           │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         MongoDB Atlas (Cloud)           │
│         - Multi-region replication      │
│         - Automated backups             │
│         - Connection pooling            │
└─────────────────────────────────────────┘
```

### Environment Variables

**Required**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-minimum-32-characters-long
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Optional**:
```bash
NODE_ENV=production
```

### Build Process

```bash
# Local development
npm run dev              # Next.js dev server (hot reload)

# Production build
npm run build            # Creates optimized production build
npm start                # Serves production build

# Testing
npm test                 # Run Jest test suite
npm run test:watch       # Watch mode for tests
```

### Performance Optimizations

1. **Server-Side Rendering (SSR)**
   - Public pages pre-rendered on server
   - SEO-friendly HTML delivery
   - First contentful paint optimization

2. **Static Asset Optimization**
   - Automatic image optimization
   - Code splitting
   - Tree shaking
   - Minification

3. **Database Connection Pooling**
   - Cached connections in serverless functions
   - Prevents connection exhaustion
   - Reduced latency

4. **Progressive Web App**
   - Service worker caching
   - Offline functionality
   - Installable app experience

---

## Security Considerations

### Authentication Security
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiration (30 days)
- ✅ Token verification on all protected routes
- ⚠️ Tokens stored in localStorage (consider httpOnly cookies for production)

### Database Security
- ✅ MongoDB connection string in environment variables
- ✅ Mongoose schema validation
- ✅ Input sanitization via Mongoose
- ✅ Unique indexes prevent duplicate emails/slugs

### API Security
- ✅ CORS handled by Next.js
- ✅ Request validation
- ✅ Error messages don't leak sensitive information
- ✅ MongoDB injection prevention via Mongoose ODM

### Production Recommendations
1. Implement rate limiting
2. Add CSRF protection
3. Use httpOnly cookies for tokens
4. Enable MongoDB IP whitelisting
5. Implement Content Security Policy (CSP)
6. Add request logging and monitoring
7. Set up automated backups

---

## Extensibility Points

### Adding New Content Section Types
1. Update `Company` model enum
2. Add rendering logic in `CompanyPageRenderer`
3. Add editor UI in `ContentEditor`

### Adding New Job Fields
1. Update `Job` model schema
2. Add fields to `JobEditorDialog`
3. Update job card display in `JobList`
4. Add filters if needed

### Integrating Third-party Services
- Email notifications → Add email service in API routes
- File uploads → Integrate cloud storage (S3, Cloudinary)
- Analytics → Add tracking scripts in layout
- Payment processing → Add Stripe/payment routes

---

## Conclusion

This architecture provides a scalable, maintainable foundation for a multi-tenant careers platform. The separation of concerns, clear data models, and comprehensive API design enable easy extension and modification while maintaining code quality and performance.

For implementation details, refer to the individual source files in the codebase. For testing information, see `testplan.md`.
