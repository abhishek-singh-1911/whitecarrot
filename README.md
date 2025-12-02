# Careers Page Builder

A full-stack Next.js application that enables companies to create beautiful, branded careers pages with custom themes, content sections, and job postings.

## 🚀 Features

### For Recruiters
- **Custom Branding**: Set your company's primary colors, background colors, and logo
- **Content Management**: Add/edit/remove content sections (Hero, Text, Video, Gallery)
- **Job Management**: Create, edit, and delete job postings with full details
- **Live Preview**: See changes in real-time before publishing
- **Responsive Dashboard**: Manage everything from an intuitive admin interface

### For Candidates
- **Beautiful Job Boards**: Browse open positions with search and filter capabilities
- **Job Details**: View comprehensive job descriptions with metadata (location, salary, etc.)
- **Responsive Design**: Optimized for all devices
- **Progressive Web App**: Installable on mobile devices for offline access

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion (MUI's styling engine)
- **PWA**: next-pwa for Progressive Web App support
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- Git

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd whitecarrot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/careers-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up MongoDB
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get the connection string and update `MONGODB_URI` in `.env.local`

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🏗 Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
whitecarrot/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── [companySlug]/       # Public company careers pages
│   │   │   └── careers/
│   │   │       ├── page.tsx     # Job board
│   │   │       └── [jobSlug]/   # Individual job details
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── company/        # Company CRUD
│   │   │   └── jobs/           # Job CRUD
│   │   ├── dashboard/          # Protected recruiter dashboard
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable components
│   │   ├── editor/            # Theme and content editors
│   │   ├── jobs/              # Job-related components
│   │   ├── CompanyPageRenderer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── JobList.tsx
│   │   └── PWAInstallPrompt.tsx
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Authentication helpers
│   │   └── db.ts             # MongoDB connection
│   └── models/               # Mongoose schemas
│       ├── Company.ts
│       └── Job.ts
├── public/                   # Static assets
│   └── manifest.json        # PWA manifest
├── .env.example             # Environment variable template
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup
├── next.config.mjs         # Next.js configuration
├── package.json
└── tsconfig.json
```

## 🎯 Usage Guide

### For Recruiters

1. **Sign Up**: Create an account at `/signup`
2. **Customize Theme**: Navigate to Dashboard → Editor to set your brand colors and logo
3. **Add Content**: Create content sections to tell your company story
4. **Post Jobs**: Go to Dashboard → Jobs to create job postings
5. **Share**: Share your careers page at `/{your-company-slug}/careers`

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create a new company account
- `POST /api/auth/login` - Login and get JWT token

#### Company Management
- `GET /api/company/[slug]` - Get public company data
- `PUT /api/company/update` - Update company settings (protected)

#### Job Management
- `GET /api/jobs?companyId=xxx` - Get all open jobs for a company
- `POST /api/jobs` - Create a new job (protected)
- `PUT /api/jobs/[id]` - Update a job (protected)
- `DELETE /api/jobs/[id]` - Delete a job (protected)

## 🚢 Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy!

## 🔒 Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed with bcrypt (12 rounds)
- All authenticated routes verify JWT tokens
- MongoDB uses connection pooling for performance
- Environment variables are never committed to git

## 🎨 Customization

### Adding New Content Section Types
Edit `src/models/Company.ts` and add to the `type` enum, then implement rendering in `src/components/CompanyPageRenderer.tsx`.

### Modifying Job Fields
Edit `src/models/Job.ts` and update the corresponding forms in `src/components/jobs/JobEditorDialog.tsx`.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and MongoDB
