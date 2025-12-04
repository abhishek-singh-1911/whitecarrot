# Technical Specification

## 1. Assumptions

### Product & Usage
*   **Target Audience**: The platform is designed for companies / recruiters to quickly launch branded careers pages without engineering resources.
*   **User Roles**:
    *   **Recruiters (Admins)**: Use desktop or mobile devices to manage content, themes, and job postings.
    *   **Candidates**: Browse jobs on both mobile and desktop devices.
*   **Scale**: The initial version supports hundreds of companies with moderate traffic. Horizontal scaling strategies are planned but not strictly enforced for MVP.

### Technical
*   **Authentication**: JWT authentication is sufficient for the initial release. Tokens are stored in `localStorage` for simplicity, with plans to enhance security in the future.
*   **Database**: A single MongoDB cluster can handle the relational needs (Company -> Jobs) using Mongoose for schema enforcement.
*   **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) are supported.

---

## 2. Architecture

### Technology Stack
*   **Language**: TypeScript
*   **Frontend**: Next.js (App Router), Material-UI.
*   **Backend**: Next.js API Routes, Node.js.
*   **Database**: MongoDB with Mongoose ODM.
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs.
*   **Testing**: Jest & React Testing Library.

### System Design
The application follows a monolithic architecture deployed as serverless functions, leveraging Next.js for both frontend rendering and backend API logic.

### Component Hierarchy
*   **Public Routes**:
    *   `[companySlug]/careers`: Dynamic route rendering the public careers page.
    *   `/login /signup`: To login/signup to the dashboard.
*   **Protected Routes (Dashboard)**:
    *   `edit/`: Creation and editing of the content sections (Hero, Text, Video, Gallery). Editing of themes (colors).
    *   `edit/jobs`: Form for creating/editing job postings.

---

## 3. Database Schema

The database consists of two primary collections: **Companies** and **Jobs**.

### Company Schema
Represents a tenant (organization) and their page configuration.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier. |
| `slug` | String | Unique URL-safe identifier (indexed). |
| `name` | String | Display name of the company. |
| `email` | String | Unique login email. |
| `password` | String | Hashed password (bcrypt). |
| `logo_url` | String | URL of the company's logo. |
| `departments` | Array | List of departments. |
| `theme` | Object | Customization settings (`primaryColor`, `backgroundColor`, `titleColorr`, etc.). |
| `content_sections` | Array | List of section objects (`hero`, `text`, `video`, `gallery`, `order`). |
| `createdAt` | Date | Timestamp. |
| `updatedAt` | Date | Timestamp. |

### Job Schema
Represents individual job postings linked to a company.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier. |
| `company_id` | ObjectId | Reference to Company (indexed). |
| `title` | String | Job title. |
| `job_slug` | String | URL-safe identifier unique to the company. |
| `department` | String | E.g., Engineering, Sales. |
| `location` | String | E.g., Remote, New York. |
| `type` | Enum | Full Time, Part Time, Contract. |
| `isOpen` | Boolean | Status of the job posting. |
| `description` | String | Full job details. |
| `work_policy` | Enum | Remote, On-site, Hybrid. |
| `employment_type` | Enum | Full Time, Part Time, Contract. |
| `experience_level` | Enum | Senior, Mid-Level, Junior. |
| `job_type` | Enum | Permanent, Temporary, Internship. |
| `salary_range` | String | E.g., $50,000 - $100,000. |
| `date_posted` | Date | Timestamp. |
| `createdAt` | Date | Timestamp. |
| `updatedAt` | Date | Timestamp. |

---

## 4. Test Plan

### Testing Strategy
We utilize Jest and React Testing Library to ensure reliability across the stack.

### Test Coverage Areas

#### 1. Backend
*   **Auth Library**: Verify password hashing, token generation, and token verification logic.
*   **API Routes**:
    *   `POST /api/auth/login`: Validate credentials, error handling, and token response.
    *   `GET/POST /api/jobs`: Verify filtering, creation logic, and authorization checks.

#### 2. Frontend Components
*   **`CompanyPageRenderer`**:
    *   Verify rendering of all section types (Hero, Text, Video, Gallery).
    *   Check theme application (colors, fonts).
*   **`JobList`**:
    *   Test search and filtering functionality.
    *   Verify empty states and job card rendering.
*   **`Pages`**:
    *   Ensure the landing page and public career pages render without crashing.

### Execution
Tests can be run locally during before deployment. CICD not implemented yet.

```bash
# Run all tests
npm test
```

**Key Suites**: 
 - `auth.test.ts`
 - `JobList.test.tsx`
 - `page.test.tsx`
 - `CompanyPageRenderer.test.tsx`.
