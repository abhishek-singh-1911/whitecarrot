# Feature Requirements: Careers Page Builder

## 1. Project Overview

A product that enables Recruiters to create branded Careers pages for their company and allows Candidates to browse open roles. The system should provide a "Wix-like" experience for recruiters (easy, visual customization) and a seamless, branded, mobile-friendly experience for candidates.

**Timeline:** 6–8 focused hours  
**Inspiration:** [Workable](https://apply.workable.com/careers/#jobs), [GBG](https://apply.workable.com/gbg), [Adtucon](https://jobs.ashbyhq.com/adtucon)

---

## 2. User Roles & Core Journeys

### 2.1 Recruiter (The Creator)

**Primary Goal:** Create a branded careers page, manage company content, post jobs, and share the public link.

#### Authentication & Onboarding
*   **Sign Up:** Create account with Company Name, Email/Slug, and Password
*   **Login:** Secure authentication with Email/Slug and Password
*   **Session Management:** JWT-based authentication with protected routes

#### Dashboard Features
*   **Home Base:** Simple dashboard with clear CTAs:
    *   "Edit Company Page"
    *   "Manage Jobs"
    *   View public link to careers page

#### Theme & Branding Customization
*   **Brand Colors:**
    *   Primary Color (used for CTAs, headings)
    *   Background Color
    *   Interactive color pickers with live preview
*   **Logo Management:**
    *   Upload logo or provide URL
    *   Logo appears in header of careers page
*   **Typography:**
    *   Font selection (optional enhancement)
    *   Default: Modern web fonts (Inter, Roboto, Outfit)
*   **Banner Image:**
    *   Hero banner for the top of careers page

#### Content Section Management
*   **Section Types:**
    *   **Hero:** Headline, Subheadline, Background Image
    *   **About Us:** Rich text/Markdown content about the company
    *   **Life at Company:** Culture, values, team photos
    *   **Custom Text Sections:** Flexible content blocks
    *   **Video Section:** Culture video embed (optional)
    *   **Gallery:** Team photos/office images
*   **Section Controls:**
    *   Add new sections
    *   Edit existing sections
    *   Remove sections
    *   Reorder sections (drag-drop or up/down arrows)
    *   Each section has order property for sorting

#### Department Management
*   Add departments (Engineering, Sales, Marketing, etc.)
*   Remove departments
*   Departments used for job categorization and filtering

#### Job Management (CRITICAL REQUIREMENT)
*   **Job Creation Form:**
    *   Job Title (required)
    *   Job Slug (auto-generated from title, kebab-case)
    *   Department (dropdown from company departments)
    *   Work Policy: Remote, On-site, Hybrid
    *   Employment Type: Full Time, Part Time, Contract
    *   Experience Level: Senior, Mid-Level, Junior
    *   Job Type: Permanent, Temporary, Internship
    *   Location (text input)
    *   Salary Range (e.g., "AED 8k-12k / month")
    *   Job Description (Rich text/Markdown)
*   **Job Management:**
    *   View all jobs in table/card format
    *   Edit existing jobs
    *   Delete jobs
    *   Toggle job status (Open/Closed)
    *   See creation date for each job

#### Preview & Publishing
*   **Live Preview:**
    *   Real-time preview pane showing how the page will look
    *   Split-screen layout (Editor controls | Live preview)
    *   Preview updates as changes are made
    *   Option to preview in new window/tab
*   **Save & Publish:**
    *   "Save Changes" button to persist all modifications
    *   Success/error notifications
    *   Changes immediately reflected on public page
*   **Share Public Link:**
    *   Copy-to-clipboard functionality for `/<company-slug>/careers`

---

### 2.2 Candidate (The Seeker)

**Primary Goal:** Learn about the company, discover open roles, and apply.

#### Page Access
*   Visit public URL: `/<company-slug>/careers`
*   No authentication required
*   Page loads with company's custom branding applied
*   SEO-optimized (crawlable by search engines)

#### Content Consumption
*   **Hero Section:**
    *   Company logo prominently displayed
    *   Compelling headline and subheadline
    *   Background image/banner
*   **About/Culture Sections:**
    *   Read about company mission, values, culture
    *   View team photos, office images
    *   Watch culture video (if provided)
*   **Dynamic Branding:**
    *   Page uses company's custom colors throughout
    *   Consistent branded experience

#### Job Discovery (CRITICAL REQUIREMENT)

##### Search Functionality
*   **Search Bar:**
    *   Search by Job Title (e.g., "Engineer")
    *   Real-time/instant filtering as user types
    *   Debounced input for performance
    *   Clear search button

##### Filter System
*   **Multiple Filter Options:**
    *   **Department:** Dropdown of all departments
    *   **Work Policy:** Remote, On-site, Hybrid
    *   **Employment Type:** Full Time, Part Time, Contract
    *   **Experience Level:** Senior, Mid-Level, Junior
    *   **Location:** Dropdown or text filter
*   **Filter Behavior:**
    *   Filters apply cumulatively (AND logic)
    *   Instant client-side filtering
    *   Show count of filtered results
    *   "Clear All Filters" option

##### Job Listing Display
*   **Job Cards showing:**
    *   Job Title
    *   Department
    *   Location
    *   Work Policy (Remote/On-site/Hybrid)
    *   Salary Range
    *   Employment Type
    *   Date Posted (relative format: "2 days ago")
    *   "View Details" or "Apply" button
*   **List Features:**
    *   Responsive grid/list layout
    *   Smooth animations on filter
    *   Empty state when no jobs match filters
    *   Loading states during data fetch

##### Job Details View
*   **Modal or Dedicated Page:**
    *   Full job description (rendered Markdown)
    *   All job metadata displayed clearly
    *   Responsibilities, Requirements, Benefits sections
    *   "Apply Now" button prominently displayed
*   **Application Flow:**
    *   External link or mailto: link (no full application flow needed for MVP)
    *   Opens in new tab/window

#### Mobile Experience
*   **Fully Responsive:**
    *   Mobile-first design
    *   Touch-friendly controls
    *   Collapsible filters on mobile
    *   Readable typography on small screens
    *   Optimized images

#### Accessibility
*   **WCAG Compliance:**
    *   Proper heading hierarchy (single H1 per page)
    *   ARIA labels for all interactive elements
    *   Keyboard navigation support
    *   Focus indicators
    *   Sufficient color contrast (minimum 4.5:1)
    *   Screen reader compatible

---

## 3. Technical Requirements

### 3.1 Architecture

#### Tech Stack
*   **Framework:** Next.js 14+ (App Router)
    *   Server-Side Rendering (SSR) for SEO
    *   Static Site Generation (SSG) where applicable
    *   API Routes for backend endpoints
*   **Language:** TypeScript (full-stack)
*   **Styling:** Material-UI (MUI) + styled-components
    *   Component library for rapid development
    *   CSS-in-JS for dynamic theming
    *   Built-in accessibility and responsive design
*   **PWA (Progressive Web App):**
    *   Installable to home screen
    *   Offline support with service workers
    *   App manifest for native-like experience
    *   Fast loading with caching strategies
*   **Database:** MongoDB (via MongoDB Atlas)
*   **ODM:** Mongoose for schema modeling
*   **Authentication:** JWT tokens with bcryptjs for password hashing
*   **Icons:** MUI Icons (built-in)
*   **Deployment:** Vercel (one-click deployment)

#### System Architecture
*   **Multi-tenancy:** Each company has unique slug-based routing
*   **Data Isolation:** All data queries filtered by `company_id`
*   **Client-Server Model:**
    *   Server Components for public pages (SEO)
    *   Client Components for interactive features (Editor, Filters)
    *   API Routes for data mutations

### 3.2 Data Models

#### Company Schema
```typescript
{
  slug: String (unique, indexed),
  name: String (required),
  logo_url: String,
  password: String (hashed, select: false),
  theme: {
    primaryColor: String (default: '#000000'),
    backgroundColor: String (default: '#ffffff'),
    font: String (default: 'Inter')
  },
  departments: [String],
  content_sections: [{
    type: 'hero' | 'text' | 'video' | 'gallery',
    title: String,
    content: String, // Markdown or HTML
    image_url: String,
    order: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Job Schema
```typescript
{
  company_id: ObjectId (ref: Company, indexed),
  title: String (required),
  job_slug: String (required),
  work_policy: 'Remote' | 'On-site' | 'Hybrid',
  department: String (required),
  employment_type: 'Full Time' | 'Part Time' | 'Contract',
  experience_level: 'Senior' | 'Mid-Level' | 'Junior',
  job_type: 'Temporary' | 'Permanent' | 'Internship',
  location: String,
  salary_range: String,
  description: String (Markdown),
  isOpen: Boolean (default: true),
  date_posted: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 API Endpoints

#### Authentication
*   `POST /api/auth/signup` - Create new company account
*   `POST /api/auth/login` - Authenticate recruiter

#### Company Management
*   `GET /api/company/[slug]` - Fetch public company data (no auth)
*   `PUT /api/company/[id]` - Update company settings (auth required)

#### Job Management
*   `GET /api/jobs?companyId=...` - List all jobs for a company
*   `POST /api/jobs` - Create new job (auth required)
*   `PUT /api/jobs/[id]` - Update job (auth required)
*   `DELETE /api/jobs/[id]` - Delete job (auth required)

### 3.4 Security & Performance

#### Security
*   Password hashing with bcryptjs (10+ rounds)
*   JWT for stateless authentication
*   HTTP-only cookies for token storage
*   Input validation and sanitization
*   Rate limiting on auth endpoints
*   CORS configuration

#### Performance
*   Cached MongoDB connections (serverless optimization)
*   Image optimization (Next.js Image component)
*   Code splitting and lazy loading
*   Debounced search inputs
*   Client-side caching where appropriate
*   Efficient database indexes (slug, company_id)

### 3.5 SEO Requirements

*   **Dynamic Metadata:**
    *   Page title: "Careers at [Company Name]"
    *   Meta description from company About section
    *   Open Graph tags for social sharing
    *   Twitter card metadata
*   **Structured Data:**
    *   JSON-LD for JobPosting schema
    *   Organization schema
*   **HTML Semantics:**
    *   Proper heading hierarchy
    *   Semantic HTML5 elements
    *   Descriptive alt text for images
*   **Crawlability:**
    *   Server-side rendered content
    *   robots.txt and sitemap.xml
    *   Clean URL structure

---

## 4. Design Requirements

### 4.1 Visual Design Principles

*   **Premium Aesthetics:** Design must "wow" at first glance
*   **Modern Design Patterns:**
    *   Vibrant, curated color palettes (avoid generic colors)
    *   Smooth gradients and transitions
    *   Glassmorphism effects (subtle)
    *   Micro-animations for user engagement
*   **Typography:**
    *   Modern web fonts (Google Fonts: Inter, Roboto, Outfit)
    *   Clear hierarchy and readable line heights
*   **Interactive Elements:**
    *   Hover effects on all clickable items
    *   Smooth transitions (200-300ms)
    *   Loading skeletons instead of spinners
    *   Toast notifications for actions

### 4.2 Recruiter Dashboard UI

*   **Layout:** Split-screen with resizable panels
*   **Sidebar Controls (300px):**
    *   Collapsible sections
    *   Clear labels and help text
    *   Validation feedback
    *   Save/Cancel buttons always visible
*   **Preview Pane:**
    *   Responsive preview toggle (desktop/tablet/mobile)
    *   Real-time updates
    *   Zoom controls

### 4.3 Candidate Page UI

*   **Hero Section:**
    *   Full-width background image
    *   Centered content with clear CTA
    *   Overlay for text readability
*   **Content Sections:**
    *   Generous whitespace
    *   Max-width container (1200px) for readability
    *   Alternating layouts for visual interest
*   **Job Board:**
    *   Clean, card-based design
    *   Clear visual hierarchy
    *   Sticky filters on desktop
    *   Smooth scroll to results

### 4.4 Mobile Responsiveness

*   Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
*   Touch targets minimum 44x44px
*   Collapsible navigation
*   Stacked layouts on mobile
*   Optimized images for bandwidth

---

## 5. Testing Requirements

### 5.1 Unit Tests
*   Auth utilities (password hashing, token generation)
*   Data validation helpers
*   Search/filter logic
*   Slug generation

### 5.2 Integration Tests
*   API route functionality
*   Database operations
*   Authentication flow
*   Protected route access

### 5.3 E2E Tests (Recommended)
*   Complete recruiter flow: Signup → Edit → Save → Preview
*   Complete candidate flow: Browse → Search → Filter → View Job
*   Mobile responsiveness testing

### 5.4 Accessibility Testing
*   Screen reader compatibility
*   Keyboard navigation
*   Color contrast verification
*   ARIA label presence

---

## 6. Deliverables Checklist

### Code & Documentation
- [ ] GitHub repository with clean commit history
- [ ] Production live link (Vercel/Netlify)
- [ ] **Tech Spec.md** - Assumptions, architecture, schema, test plan (NO AI)
- [ ] **README.md** - Setup guide, feature list, improvement plan (NO AI)
- [ ] **AGENT_LOG.md** - AI tool usage documentation (NO AI)

### Demo
- [ ] Demo video (≤5 minutes)
- [ ] Walkthrough: Recruiter flow + Candidate experience
- [ ] Showcase search, filters, and mobile view

---

## 7. Evaluation Criteria

### Tech Stack & Design Choices (20%)
*   Justification for technology choices
*   Trade-offs considered
*   Maintainability and scalability

### Functionality & UX (30%)
*   Intuitive interface for both user types
*   Smooth, consistent interactions
*   Error handling and edge cases
*   Mobile experience quality

### Code Quality (25%)
*   Clean, organized components
*   Structured API design
*   Database schema design
*   Design system implementation
*   Relevant tests

### AI & Tool Usage (10%)
*   Strategic use of AI for planning, prototyping, coding
*   Documentation of AI workflow
*   Demonstrating refinement of AI output

### Scalability & Vision (15%)
*   Handling hundreds of companies
*   Performance considerations
*   Next steps and improvement plan
*   Real-world deployment readiness

---

## 8. Bonus Features (Optional)

*   **Progressive Web App (PWA):** ⭐ **RECOMMENDED**
    *   Install to home screen (mobile & desktop)
    *   Offline job browsing capability
    *   Fast loading with service worker caching
    *   Push notifications for new jobs (future)
    *   App-like experience without app stores
*   **Rich Text Editor:** WYSIWYG for job descriptions
*   **Drag-and-Drop:** For section reordering
*   **Image Upload:** Direct file upload instead of URLs
*   **Analytics Dashboard:** Job view counts, application tracking
*   **Email Notifications:** Alert recruiters of new applications
*   **Custom Domain:** Allow companies to use custom domains
*   **Multi-user Support:** Multiple recruiters per company
*   **Role Permissions:** Admin vs Editor roles
*   **Draft Mode:** Save jobs as drafts before publishing
*   **Application Form Builder:** Custom application forms
*   **Integration APIs:** Connect to external ATS systems

---

## 9. Sample Data Reference

Use the provided sample data for testing:
[Sample Jobs Data Spreadsheet](https://docs.google.com/spreadsheets/d/16HRj1fHXuq10AxU-RtC6Qd1KBODsqvO4J4v3i1qGcD0/edit?usp=sharing)

Ensure the application can handle:
*   Multiple companies
*   Varied job counts per company
*   Jobs with different filter combinations
*   Companies with minimal vs extensive content sections
