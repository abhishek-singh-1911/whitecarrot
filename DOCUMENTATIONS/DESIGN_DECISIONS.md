# Design Decisions & Technical Questions

## Table of Contents
1. [Multi-tenancy & Data Isolation](#1-how-will-you-store-data-for-each-company-separately)
2. [Page Customization](#2-how-can-recruiters-easily-build-and-customize-their-page)
3. [Safe Updates](#3-how-will-edits-safely-update-the-page)
4. [Candidate Experience](#4-how-can-candidates-browse-jobs-smoothly)
5. [Responsive Design](#5-how-does-your-design-adapt-across-devices)
6. [Scalability](#6-how-would-you-scale-if-hundreds-of-companies-used-it)

---

## 1. How will you store data for each company separately?

### Multi-tenant Database Architecture

We implement a **shared database, separate collections** multi-tenancy model using MongoDB:

#### Data Isolation Strategy

**Company Collection:**
```typescript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // Unique company identifier
  slug: "acme-corp",                            // URL identifier
  email: "admin@acmecorp.com",                  // Unique login
  name: "Acme Corporation",
  theme: { ... },
  content_sections: [ ... ],
  // Each company is a separate document
}
```

**Job Collection with Foreign Keys:**
```typescript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  company_id: ObjectId("507f1f77bcf86cd799439011"),  // Links to company
  title: "Software Engineer",
  department: "Engineering",
  // ... other fields
}
```

#### Key Isolation Mechanisms

**1. Company-level Indexing**
```javascript
// Compound index ensures fast queries per company
JobSchema.index({ company_id: 1, isOpen: 1 });
JobSchema.index({ company_id: 1, job_slug: 1 }, { unique: true });
```

**2. Query-level Filtering**
```typescript
// Every job query includes company_id filter
const jobs = await Job.find({ 
  company_id: companyId,  // Always filter by company
  isOpen: true 
});
```

**3. Authentication-based Access Control**
```typescript
// JWT token contains company ID
const decoded = verifyToken(token);
const companyId = decoded.id;  // Used in all queries

// Prevents cross-company data access
const job = await Job.findOne({ 
  _id: jobId,
  company_id: companyId  // Ensures ownership
});
```

#### Benefits of This Approach

✅ **Cost-effective**: One database serves all companies  
✅ **Simple maintenance**: No per-tenant database management  
✅ **Easy backups**: Single backup strategy for all data  
✅ **Fast queries**: Indexed by company_id for performance  
✅ **Data integrity**: Foreign key relationships via Mongoose  
✅ **Isolated slugs**: Job slugs unique per company, not globally  

#### Data Segregation Example

```
MongoDB Database: careers-builder
├── companies Collection
│   ├── acme-corp (id: 001)
│   ├── techstart (id: 002)
│   └── designco (id: 003)
│
└── jobs Collection
    ├── Job 1 (company_id: 001) → belongs to acme-corp
    ├── Job 2 (company_id: 001) → belongs to acme-corp
    ├── Job 3 (company_id: 002) → belongs to techstart
    ├── Job 4 (company_id: 002) → belongs to techstart
    └── Job 5 (company_id: 003) → belongs to designco
```

#### Security Measures

1. **No cross-company data leakage**: All queries filtered by authenticated company_id
2. **Unique slugs per company**: `acme-corp/careers/engineer` vs `techstart/careers/engineer`
3. **JWT payload validation**: Token manipulation detected and rejected
4. **Mongoose schema validation**: Ensures company_id is always present

---

## 2. How can recruiters easily build and customize their page?

### User-Friendly Page Builder

We provide a **visual, real-time editor** with live preview capabilities.

#### Three-Panel Editor Interface

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard Header                      │
└─────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────┬──────────────────┐
│          │                          │                  │
│ Sidebar  │    Editor Panel          │  Preview Pane    │
│          │                          │                  │
│ - Editor │  ┌─────────────────────┐ │  ┌────────────┐ │
│ - Jobs   │  │  Theme Editor       │ │  │ Live       │ │
│ - Logout │  │  - Primary Color    │ │  │ Preview    │ │
│          │  │  - Background       │ │  │            │ │
│          │  │  - Font             │ │  │ Updates    │ │
│          │  │  - Logo Upload      │ │  │ in         │ │
│          │  └─────────────────────┘ │  │ Real-time  │ │
│          │                          │  │            │ │
│          │  ┌─────────────────────┐ │  └────────────┘ │
│          │  │  Content Editor     │ │                  │
│          │  │  - Drag & Drop      │ │                  │
│          │  │  - Add Sections     │ │                  │
│          │  │  - Reorder          │ │                  │
│          │  └─────────────────────┘ │                  │
└──────────┴──────────────────────────┴──────────────────┘
```

#### Theme Customization

**Visual Color Pickers:**
```typescript
// Recruiters use color pickers, not hex codes
<ColorPicker
  label="Primary Color"
  value={theme.primaryColor}
  onChange={(color) => updateTheme('primaryColor', color)}
/>

// Changes appear instantly in preview
```

**Supported Theme Options:**
- Primary color (buttons, links, accents)
- Background color
- Title color
- Body text color
- Button text color
- Font family (dropdown with common fonts)
- Logo upload (URL input)

#### Content Section Management

**Drag-and-Drop Interface:**
```typescript
// Using @hello-pangea/dnd for intuitive reordering
<DragDropContext onDragEnd={handleReorder}>
  <Droppable droppableId="sections">
    {sections.map((section, index) => (
      <Draggable key={index} draggableId={`section-${index}`}>
        <SectionEditor section={section} />
      </Draggable>
    ))}
  </Droppable>
</DragDropContext>
```

**Section Types with Templates:**

1. **Hero Section**
   - Title (large, bold)
   - Subtitle (descriptive text)
   - Optional hero image
   - Automatic styling

2. **Text Section**
   - Heading
   - Body content
   - Clean typography

3. **Video Section**
   - Title
   - Description
   - Embed URL (YouTube, Vimeo)
   - Responsive video player

4. **Gallery Section**
   - Title
   - Description
   - Multiple image URLs
   - Auto-grid layout

**Adding Sections:**
```typescript
// One-click section addition
<Button onClick={addSection}>
  <AddIcon /> Add Section
</Button>

// Pre-configured defaults for each type
const newHeroSection = {
  type: 'hero',
  title: 'Welcome to Our Team',
  content: 'Join us in building the future',
  order: sections.length
};
```

#### Real-time Preview

**Instant Visual Feedback:**
```typescript
// Preview updates on every change
useEffect(() => {
  // Debounced preview refresh
  const timer = setTimeout(() => {
    refreshPreview();
  }, 300);
  
  return () => clearTimeout(timer);
}, [theme, contentSections]);
```

**Live Preview Shows:**
- Exact appearance of public page
- Responsive design preview
- All theme changes applied
- Content sections in order
- Job listings (mock data)

#### Job Management Interface

**Simple Job Creation:**
```typescript
// Modal dialog with form fields
<JobEditorDialog>
  <TextField label="Job Title" required />
  <Select label="Department" options={departments} />
  <Select label="Work Policy" options={['Remote', 'On-site', 'Hybrid']} />
  <Select label="Employment Type" options={['Full Time', 'Part Time']} />
  <TextField label="Location" />
  <TextField label="Salary Range" />
  <RichTextEditor label="Description" />
</JobEditorDialog>
```

**Job List Management:**
- Table view of all jobs
- Quick edit/delete actions
- Open/close job toggle
- Bulk operations

#### No-Code Philosophy

**Recruiters don't need to:**
- ❌ Write HTML/CSS
- ❌ Understand databases
- ❌ Deploy code
- ❌ Configure servers

**Recruiters simply:**
- ✅ Pick colors from a palette
- ✅ Upload a logo
- ✅ Type content in forms
- ✅ Drag sections to reorder
- ✅ See changes immediately

#### Guided Workflow

```
1. Sign Up → Auto-create company account
2. Dashboard → Welcomed with empty template
3. Theme Editor → Set brand colors & logo
4. Content Editor → Add sections about company
5. Preview → See live preview
6. Jobs Page → Create job postings
7. Publish → Share careers page URL
```

---

## 3. How will edits safely update the page?

### Safe Update Mechanisms

We implement multiple layers of safety to prevent data loss and ensure reliable updates.

#### 1. Authentication & Authorization

**Token-based Security:**
```typescript
// Every update request verified
const token = localStorage.getItem('token');

fetch('/api/company/update', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updates)
});

// Server verifies token ownership
const decoded = verifyToken(token);
if (decoded.id !== company._id) {
  return { error: 'Unauthorized', status: 403 };
}
```

**Only authenticated company owners can edit their own data.**

#### 2. Atomic Database Transactions

**MongoDB Update Operations:**
```typescript
// Atomic findOneAndUpdate ensures consistency
const updatedCompany = await Company.findOneAndUpdate(
  { _id: companyId },  // Find by ID
  { 
    $set: {
      theme: newTheme,
      content_sections: newSections,
      updatedAt: new Date()
    }
  },
  { 
    new: true,          // Return updated document
    runValidators: true // Run schema validation
  }
);

// If validation fails, no changes are saved
```

**Benefits:**
- ✅ All-or-nothing updates (no partial saves)
- ✅ Schema validation runs before save
- ✅ Concurrent update protection
- ✅ Automatic timestamp management

#### 3. Schema Validation

**Mongoose Validators:**
```typescript
// Invalid data rejected before database write
const CompanySchema = new Schema({
  slug: {
    type: String,
    required: true,
    match: /^[a-z0-9-]+$/,  // Only valid slugs
    unique: true
  },
  theme: {
    primaryColor: {
      type: String,
      validate: {
        validator: (v) => /^#[0-9A-F]{6}$/i.test(v),
        message: 'Invalid color format'
      }
    }
  }
});

// Prevents saving corrupted data
```

#### 4. Optimistic UI Updates with Rollback

**Client-side Pattern:**
```typescript
const handleSave = async () => {
  // 1. Save current state
  const previousState = { ...company };
  
  // 2. Optimistic update (instant UI feedback)
  setCompany(newState);
  
  try {
    // 3. Send to server
    const response = await updateCompany(newState);
    
    // 4. Confirm success
    if (response.success) {
      toast.success('Changes saved!');
    }
  } catch (error) {
    // 5. Rollback on error
    setCompany(previousState);
    toast.error('Failed to save. Please try again.');
  }
};
```

#### 5. Debounced Auto-save

**Prevent Excessive Saves:**
```typescript
// Save after user stops typing for 1 second
const debouncedSave = debounce(async (data) => {
  await updateCompany(data);
}, 1000);

// On every change
const handleChange = (field, value) => {
  const newData = { ...company, [field]: value };
  setCompany(newData);
  debouncedSave(newData);  // Auto-save after delay
};
```

#### 6. Publish vs. Draft Mode (Future Enhancement)

**Current Implementation:**
- Changes go live immediately (single version)
- Preview shows exact public page

**Recommended Future Enhancement:**
```typescript
// Add draft/published versions
const CompanySchema = {
  published_content: [ContentSection],  // Live version
  draft_content: [ContentSection],      // Work-in-progress
  published_theme: ThemeObject,
  draft_theme: ThemeObject,
  last_published: Date
};

// Recruiters work on draft
// Preview shows draft
// "Publish" button pushes draft → published
```

#### 7. Update Validation

**API Route Validation:**
```typescript
// Server-side validation before save
export async function PUT(req: NextRequest) {
  const updates = await req.json();
  
  // Validate required fields
  if (updates.theme?.primaryColor) {
    if (!isValidHexColor(updates.theme.primaryColor)) {
      return NextResponse.json(
        { error: 'Invalid color format' },
        { status: 400 }
      );
    }
  }
  
  // Sanitize inputs
  const sanitized = sanitizeInput(updates);
  
  // Apply updates
  const company = await Company.findByIdAndUpdate(
    companyId,
    sanitized,
    { runValidators: true }
  );
}
```

#### 8. Error Handling & User Feedback

**Comprehensive Error States:**
```typescript
try {
  await saveChanges();
  setStatus({ type: 'success', message: 'Saved!' });
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    setStatus({ type: 'error', message: 'Please check your inputs' });
  } else if (error.code === 'NETWORK_ERROR') {
    setStatus({ type: 'error', message: 'Connection lost. Retrying...' });
    // Auto-retry logic
  } else {
    setStatus({ type: 'error', message: 'Something went wrong' });
  }
}
```

**Visual Feedback:**
- Loading spinners during save
- Success/error toast notifications
- Inline validation errors
- Unsaved changes warnings

#### Safety Summary

| Safety Measure | Purpose | Implementation |
|----------------|---------|----------------|
| Authentication | Prevent unauthorized edits | JWT token verification |
| Authorization | Ensure owner-only access | Token payload validation |
| Atomic Updates | No partial saves | MongoDB transactions |
| Schema Validation | Reject invalid data | Mongoose validators |
| Optimistic UI | Fast UX with rollback | Client-side state management |
| Debouncing | Reduce server load | Delayed auto-save |
| Error Handling | Graceful degradation | Try-catch with user feedback |
| Input Sanitization | Prevent XSS/injection | Server-side cleaning |

---

## 4. How can candidates browse jobs smoothly?

### Optimized Job Browsing Experience

We prioritize performance and usability for job seekers.

#### 1. Fast Initial Page Load

**Server-Side Rendering (SSR):**
```typescript
// Next.js App Router automatically SSR
export default async function CareersPage({ params }) {
  // Fetch data on server
  const company = await getCompany(params.slug);
  const jobs = await getJobs(company._id);
  
  // Return pre-rendered HTML
  return <JobList jobs={jobs} company={company} />;
}
```

**Benefits:**
- ✅ HTML sent to browser (no loading spinner)
- ✅ Content visible before JavaScript loads
- ✅ SEO-friendly (Google crawlers see content)
- ✅ Faster perceived performance

**Performance Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- No loading states on initial load

#### 2. Client-Side Filtering (No Server Roundtrips)

**All Jobs Loaded Once:**
```typescript
// Initial load: fetch all open jobs
const jobs = await fetch(`/api/jobs?companyId=${id}`);

// Filtering happens in browser
const filteredJobs = jobs.filter(job => {
  const matchesSearch = job.title.toLowerCase().includes(search);
  const matchesDept = dept === 'All' || job.department === dept;
  const matchesLocation = loc === 'All' || job.location === loc;
  const matchesType = type === 'All' || job.employment_type === type;
  const matchesPolicy = policy === 'All' || job.work_policy === policy;
  const matchesLevel = level === 'All' || job.experience_level === level;
  
  return matchesSearch && matchesDept && matchesLocation && 
         matchesType && matchesPolicy && matchesLevel;
});
```

**Why This Works:**
- Most companies have < 100 open jobs
- 100 jobs × 1KB each = 100KB (small payload)
- Instant filtering with no network delay
- Better UX than pagination for most cases

**Real-time Search:**
```typescript
// Updates on every keystroke
<TextField
  placeholder="Search jobs by title..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

// Instant results (no debouncing needed)
filteredJobs displayed immediately
```

#### 3. Smart Filtering UI

**Auto-populated Filters:**
```typescript
// Extract unique values from jobs
const departments = ['All', ...new Set(jobs.map(j => j.department))];
const locations = ['All', ...new Set(jobs.map(j => j.location))];
const types = ['All', ...new Set(jobs.map(j => j.employment_type))];

// Show only relevant filters (no empty options)
```

**Multi-dimensional Filtering:**
- Search by title (text input)
- Filter by department (dropdown)
- Filter by location (dropdown)
- Filter by job type (Full Time, Part Time, Contract)
- Filter by work policy (Remote, On-site, Hybrid)
- Filter by experience level (Senior, Mid, Junior)

**All filters combine (AND logic):**
```typescript
// Show only jobs matching ALL selected filters
const results = jobs.filter(job => 
  matchesAllFilters(job, {
    search, department, location, 
    jobType, workPolicy, experienceLevel
  })
);
```

#### 4. Empty State Handling

**Helpful Feedback:**
```typescript
{filteredJobs.length > 0 ? (
  <JobCards jobs={filteredJobs} />
) : (
  <EmptyState>
    <Typography>No jobs found matching your criteria.</Typography>
    <Button onClick={clearFilters}>Clear Filters</Button>
  </EmptyState>
)}
```

#### 5. Job Card Design

**Scannable Information:**
```
┌────────────────────────────────────────┐
│  Senior Frontend Engineer       [Remote]│
│  Engineering                            │
│                                         │
│  📍 San Francisco, CA                  │
│  💼 Full Time                           │
│                                         │
│  [Apply →]                              │
└────────────────────────────────────────┘
```

**Key Information at a Glance:**
- Job title (bold, large)
- Department (subtitle)
- Work policy (badge, color-coded)
- Location & employment type (icons)
- Apply button (call-to-action)

#### 6. Responsive Grid Layout

**Material-UI Grid:**
```typescript
<Grid container spacing={3}>
  {filteredJobs.map(job => (
    <Grid size={{ xs: 12, md: 6 }} key={job._id}>
      <JobCard job={job} />
    </Grid>
  ))}
</Grid>
```

**Responsive Behavior:**
- Mobile: 1 column (full width)
- Tablet: 2 columns
- Desktop: 2 columns (max readability)

#### 7. Smooth Animations

**Hover Effects:**
```typescript
<Card sx={{
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    borderColor: theme.primaryColor
  }
}}>
```

**Micro-interactions:**
- Cards lift on hover
- Border color changes
- Smooth color transitions
- Button state feedback

#### 8. Accessibility

**Keyboard Navigation:**
- Tab through filters
- Arrow keys in dropdowns
- Enter to apply

**Screen Reader Support:**
```typescript
<TextField
  label="Search jobs"
  aria-label="Search jobs by title"
  placeholder="Search jobs by title..."
/>

<Button aria-label="Apply to Senior Frontend Engineer">
  Apply
</Button>
```

#### 9. Progressive Web App (PWA)

**Offline Capability:**
```javascript
// Service worker caches job listings
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**Benefits:**
- View cached jobs offline
- Installable on mobile (Add to Home Screen)
- Fast repeat visits

#### 10. SEO Optimization

**Dynamic Metadata:**
```typescript
export async function generateMetadata({ params }) {
  const company = await getCompany(params.slug);
  
  return {
    title: `Careers at ${company.name}`,
    description: `Join ${company.name}. Browse ${jobs.length} open positions.`,
    openGraph: {
      title: `Careers at ${company.name}`,
      images: [company.logo_url]
    }
  };
}
```

**Structured Data:**
```typescript
// JobPosting schema for Google Jobs
<script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "employmentType": job.employment_type,
    "hiringOrganization": {
      "@type": "Organization",
      "name": company.name
    }
  }}
</script>
```

**Smooth Browsing Checklist:**

✅ Fast initial load (SSR)  
✅ Instant search (client-side filtering)  
✅ Multi-dimensional filters  
✅ Responsive design  
✅ Hover animations  
✅ Empty state handling  
✅ Keyboard accessible  
✅ PWA offline support  
✅ SEO optimized  

---

## 5. How does your design adapt across devices?

### Responsive Design Strategy

We use a **mobile-first, responsive design** approach with Material-UI's Grid system.

#### 1. Responsive Grid System

**Material-UI Grid v2:**
```typescript
import { Grid } from '@mui/material';

// Responsive breakpoints
<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
    {/* 
      xs: mobile (1 column)
      sm: tablet (2 columns)  
      md: laptop (3 columns)
      lg: desktop (4 columns)
    */}
  </Grid>
</Grid>
```

**Breakpoint Values:**
```typescript
{
  xs: 0,      // Extra small (mobile)
  sm: 600,    // Small (tablet portrait)
  md: 900,    // Medium (tablet landscape)
  lg: 1200,   // Large (laptop)
  xl: 1536    // Extra large (desktop)
}
```

#### 2. Component-Level Responsiveness

**Job List Layout:**
```typescript
// Mobile: 1 column, Desktop: 2 columns
<Grid container spacing={3}>
  {jobs.map(job => (
    <Grid size={{ xs: 12, md: 6 }} key={job._id}>
      <JobCard job={job} />
    </Grid>
  ))}
</Grid>
```

**Filter Layout:**
```typescript
// Search: Full width on all devices
<Grid size={{ xs: 12 }}>
  <SearchBar />
</Grid>

// Filters: Stack on mobile, grid on desktop
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
  <DepartmentFilter />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
  <LocationFilter />
</Grid>
```

#### 3. Dashboard Sidebar

**Adaptive Navigation:**
```typescript
<Box component="nav" sx={{ 
  width: { sm: 240 },     // 240px on desktop
  flexShrink: { sm: 0 }   // Don't shrink on desktop
}}>
  {/* Mobile: Temporary drawer (overlay) */}
  <Drawer
    variant="temporary"
    open={mobileOpen}
    onClose={toggleDrawer}
    sx={{
      display: { xs: 'block', sm: 'none' }  // Mobile only
    }}
  >
    {drawerContent}
  </Drawer>

  {/* Desktop: Permanent drawer (sidebar) */}
  <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', sm: 'block' }  // Desktop only
    }}
  >
    {drawerContent}
  </Drawer>
</Box>
```

**Mobile Behavior:**
- Hamburger menu icon
- Drawer slides in from left
- Closes on navigation
- Overlay darkens background

**Desktop Behavior:**
- Always visible sidebar
- Fixed 240px width
- No hamburger menu needed

#### 4. Typography Scaling

**Responsive Font Sizes:**
```typescript
<Typography 
  variant="h2"
  sx={{
    fontSize: { 
      xs: '2rem',    // 32px on mobile
      sm: '2.5rem',  // 40px on tablet
      md: '3rem'     // 48px on desktop
    }
  }}
>
  Welcome to Our Team
</Typography>
```

**Material-UI Variants:**
```typescript
// Automatically responsive
<Typography variant="h1">   {/* 96px → 60px on mobile */}
<Typography variant="h3">   {/* 48px → 32px on mobile */}
<Typography variant="body1"> {/* 16px consistent */}
```

#### 5. Content Section Responsiveness

**Gallery Grid:**
```typescript
<Grid container spacing={3}>
  {images.map(img => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img}>
      {/* Mobile: 1 col, Tablet: 2 col, Desktop: 3 col */}
      <Image src={img} />
    </Grid>
  ))}
</Grid>
```

**Video Embed:**
```typescript
// Responsive aspect ratio container
<Box sx={{
  position: 'relative',
  paddingTop: '56.25%',  // 16:9 aspect ratio
  width: '100%'
}}>
  <iframe
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }}
    src={videoUrl}
  />
</Box>
```

#### 6. Spacing & Padding

**Responsive Spacing:**
```typescript
<Container sx={{
  py: { xs: 4, md: 8 },     // Padding: 32px mobile, 64px desktop
  px: { xs: 2, sm: 3 }      // Horizontal padding
}}>
```

**Material-UI Spacing Scale:**
```typescript
theme.spacing(1) = 8px
theme.spacing(2) = 16px
theme.spacing(3) = 24px
theme.spacing(4) = 32px
// etc.
```

#### 7. Button & Input Sizes

**Responsive Inputs:**
```typescript
<TextField
  fullWidth              // Always 100% width
  size="medium"          // Default size
  sx={{
    '& .MuiInputBase-root': {
      fontSize: { xs: '0.875rem', sm: '1rem' }
    }
  }}
/>
```

#### 8. Touch-Friendly Targets

**Minimum Touch Areas:**
```typescript
<Button sx={{
  minHeight: 44,  // iOS guideline: 44px
  minWidth: 44,
  fontSize: { xs: '0.875rem', sm: '1rem' }
}}>
  Apply
</Button>
```

#### 9. Viewport Meta Tag

**Essential HTML:**
```html
<!-- In layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### 10. Testing Across Devices

**Chrome DevTools:**
- Responsive design mode
- Device emulation (iPhone, iPad, etc.)
- Network throttling

**Real Device Testing:**
- iOS Safari (iPhone, iPad)
- Android Chrome
- Desktop browsers (Chrome, Firefox, Safari)

#### 11. Progressive Enhancement

**Base Experience (No JavaScript):**
- Server-rendered HTML works
- Basic styling applied
- Links functional

**Enhanced Experience (With JavaScript):**
- Client-side filtering
- Smooth animations
- Dynamic interactions

#### Responsive Design Matrix

| Component | Mobile (xs) | Tablet (sm) | Desktop (md+) |
|-----------|-------------|-------------|---------------|
| Job Cards | 1 column | 2 columns | 2 columns |
| Filters | Stacked | 2×2 grid | 1 row |
| Gallery | 1 column | 2 columns | 3 columns |
| Navigation | Hamburger | Hamburger | Sidebar |
| Typography | Smaller | Medium | Larger |
| Spacing | Compact | Medium | Spacious |

---

## 6. How would you scale if hundreds of companies used it?

### Scalability Architecture

Our design supports horizontal scaling to accommodate growth.

#### Current Architecture Limits

**Single-Instance Setup:**
- MongoDB Atlas (shared cluster): ~100-500 concurrent companies
- Next.js (Vercel): Auto-scales, no hard limit
- Database queries: O(n) with indexes, fast for n < 10,000 jobs total

**Bottlenecks to Address:**
- Database connections
- Query performance
- API rate limiting
- Storage costs

#### Scaling Strategy (100 → 1000+ Companies)

### 1. Database Scaling

**Horizontal Scaling:**
```typescript
// MongoDB Atlas Cluster Tiers
{
  current: "M0 (Free)",      // Shared CPU, 512MB storage
  first_upgrade: "M10",      // Dedicated 2GB RAM, 10GB storage
  growth: "M30",             // 8GB RAM, 40GB storage
  enterprise: "M50+",        // Auto-sharding, multi-region
}
```

**Sharding Strategy:**
```javascript
// Shard by company_id (natural partition)
db.companies.createIndex({ _id: "hashed" });
db.jobs.createIndex({ company_id: "hashed" });

sh.enableSharding("careers-builder");
sh.shardCollection("careers-builder.jobs", { company_id: "hashed" });

// Each shard handles subset of companies
// Queries filtered by company_id stay on one shard
```

**Read Replicas:**
```javascript
// Separate read traffic from write traffic
const readOptions = { readPreference: 'secondary' };

// Public pages read from replicas
const jobs = await Job.find({ company_id })
  .read(readOptions);

// Dashboard writes to primary
await Job.create(newJob);  // Primary node
```

**Connection Pooling:**
```typescript
// Increase pool size for high concurrency
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 100,        // Up from default 10
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### 2. Application Scaling

**Vercel Auto-Scaling:**
```typescript
// Vercel automatically scales
// No configuration needed

export const config = {
  runtime: 'edge',  // Optional: Use Edge Runtime for fastest response
};
```

**Serverless Function Limits:**
```javascript
// Free tier: 100GB-Hours/month
// Pro tier: 1000GB-Hours/month
// Enterprise: Unlimited (custom pricing)

// Each request = ~50ms = 0.000014 GB-Hours
// Pro tier = ~71 million requests/month
```

**Region Distribution:**
```javascript
// Deploy to multiple regions
{
  regions: ['iad1', 'sfo1', 'lhr1'],  // US East, US West, London
  // Routes to nearest region automatically
  // Reduces latency globally
}
```

### 3. Caching Strategy

**Redis Cache Layer:**
```typescript
// Cache common queries
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache company data (rarely changes)
async function getCompany(slug: string) {
  const cached = await redis.get(`company:${slug}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const company = await Company.findOne({ slug });
  await redis.setex(`company:${slug}`, 3600, JSON.stringify(company));
  
  return company;
}

// Invalidate on update
async function updateCompany(id: string, updates: any) {
  const company = await Company.findByIdAndUpdate(id, updates);
  await redis.del(`company:${company.slug}`);  // Clear cache
  return company;
}
```

**CDN Caching (Vercel Edge):**
```typescript
// Cache static assets and pages
export const config = {
  // Cache public pages for 1 hour
  cache: 'public, max-age=3600, stale-while-revalidate=86400'
};
```

**Client-Side Caching:**
```typescript
// SWR or React Query for data caching
import useSWR from 'swr';

function JobsPage() {
  const { data, error } = useSWR(
    `/api/jobs?companyId=${id}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  
  // Cache for 60s, no unnecessary refetches
}
```

### 4. Database Query Optimization

**Compound Indexes:**
```javascript
// Optimize common queries
JobSchema.index({ company_id: 1, isOpen: 1, date_posted: -1 });
JobSchema.index({ company_id: 1, department: 1 });
JobSchema.index({ company_id: 1, work_policy: 1 });

// Query uses index: fast even with millions of jobs
db.jobs.find({ 
  company_id: ObjectId('...'),
  isOpen: true 
}).sort({ date_posted: -1 })
.explain('executionStats')
// Uses index: totalDocsExamined === nReturned (perfect)
```

**Projection (Select Only Needed Fields):**
```typescript
// Don't fetch description for list view
const jobs = await Job.find({ company_id })
  .select('-description')  // Exclude heavy field
  .lean();                 // Return plain objects (faster)

// Reduces payload: 1KB → 0.2KB per job
```

**Pagination (for very large companies):**
```typescript
// If a company has 1000+ jobs
const jobs = await Job.find({ company_id, isOpen: true })
  .sort({ date_posted: -1 })
  .skip(page * limit)
  .limit(limit);

// Or cursor-based pagination
const jobs = await Job.find({ 
  company_id,
  _id: { $gt: lastId }  // Cursor
})
.limit(20);
```

### 5. Rate Limiting

**API Protection:**
```typescript
import rateLimit from 'express-rate-limit';

// Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Apply to API routes
app.use('/api/', limiter);
```

**Per-Company Limits:**
```typescript
// Prevent single company from monopolizing resources
const companyLimiter = {
  max_jobs_per_company: 500,
  max_content_sections: 20,
  max_gallery_images: 50,
};

// Enforce in API
if (company.jobs.length >= companyLimiter.max_jobs_per_company) {
  return { error: 'Job limit reached. Contact support.' };
}
```

### 6. Monitoring & Alerts

**Application Performance Monitoring:**
```typescript
// Integrate APM tool (e.g., Sentry, Datadog)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% of transactions
});

// Track slow queries
const startTime = Date.now();
const result = await query();
const duration = Date.now() - startTime;

if (duration > 1000) {
  Sentry.captureMessage(`Slow query: ${duration}ms`);
}
```

**Database Monitoring:**
```javascript
// MongoDB Atlas built-in monitoring
{
  metrics: [
    'CPU utilization',
    'Memory usage',
    'Disk IOPS',
    'Connection count',
    'Query execution time'
  ],
  alerts: {
    cpu_threshold: 80%,
    connection_threshold: 90%,
    slow_query_threshold: 100ms
  }
}
```

### 7. Cost Optimization

**Tiered Pricing Model:**
```typescript
// Monetize scale
const pricing = {
  free: {
    max_jobs: 10,
    max_page_views: 1000/month,
    features: ['basic_theme', 'job_postings']
  },
  pro: {
    price: '$99/month',
    max_jobs: 100,
    max_page_views: 50000/month,
    features: ['custom_theme', 'analytics', 'custom_domain']
  },
  enterprise: {
    price: 'Custom',
    max_jobs: 'Unlimited',
    features: ['dedicated_support', 'sla', 'custom_integrations']
  }
};
```

**Resource Usage Tracking:**
```typescript
// Track per-company usage
const CompanyUsage = {
  company_id: ObjectId,
  period: '2025-12',
  page_views: 15234,
  api_calls: 5421,
  storage_mb: 45.2,
  bandwidth_gb: 2.3
};

// Bill based on usage
```

### 8. Microservices Architecture (Future)

**Service Separation:**
```
Current: Monolith
┌─────────────────────┐
│   Next.js App       │
│  - Frontend         │
│  - API Routes       │
│  - Auth             │
│  - Job CRUD         │
│  - Company CRUD     │
└─────────────────────┘

Future: Microservices (at 10,000+ companies)
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Frontend    │  │   Auth       │  │   Jobs       │
│  Service     │→ │   Service    │→ │   Service    │
│  (Next.js)   │  │  (Node.js)   │  │  (Node.js)   │
└──────────────┘  └──────────────┘  └──────────────┘
                         ↓                  ↓
                  ┌──────────────────────────────┐
                  │      MongoDB Cluster         │
                  │   - Auth DB | Jobs DB        │
                  └──────────────────────────────┘
```

### Scaling Roadmap

**Phase 1: 0 - 100 Companies (Current)**
- ✅ MongoDB Atlas M0 (free tier)
- ✅ Vercel Hobby plan
- ✅ No caching needed
- ✅ Basic monitoring

**Phase 2: 100 - 500 Companies**
- 📈 Upgrade MongoDB to M10 (dedicated)
- 📈 Vercel Pro plan
- 📈 Add Redis caching layer
- 📈 Enable query monitoring
- 📈 Implement rate limiting

**Phase 3: 500 - 2,000 Companies**
- 📈 MongoDB M30 with replicas
- 📈 Multi-region deployment
- 📈 Advanced caching (CDN + Redis)
- 📈 Database query optimization
- 📈 Implement tiered pricing

**Phase 4: 2,000+ Companies**
- 📈 MongoDB sharding
- 📈 Microservices architecture
- 📈 Dedicated enterprise support
- 📈 Custom integrations (ATS, HRIS)
- 📈 Advanced analytics

### Scalability Metrics

| Metric | Current | 100 Cos | 1K Cos | 10K Cos |
|--------|---------|---------|--------|---------|
| **DB Size** | 1 GB | 10 GB | 100 GB | 1 TB |
| **DB Tier** | M0 | M10 | M30 | M50+ Sharded |
| **API Calls/mo** | 100K | 10M | 100M | 1B |
| **Page Views/mo** | 10K | 1M | 10M | 100M |
| **Infra Cost** | $0 | $200 | $2K | $20K+ |
| **Response Time** | <100ms | <150ms | <200ms | <300ms |

---

## Conclusion

These design decisions prioritize:
1. **Data Isolation**: Multi-tenant with query-level filtering
2. **User Experience**: Visual editors with real-time preview
3. **Data Safety**: Atomic updates with validation
4. **Performance**: SSR, client-side filtering, smart caching
5. **Responsiveness**: Mobile-first design with Material-UI
6. **Scalability**: Horizontal scaling with MongoDB and Vercel

The architecture supports growth from MVP to enterprise scale while maintaining code simplicity and developer productivity.
