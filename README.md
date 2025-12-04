# Careers Page Builder

A full-stack Next.js application that enables companies to create beautiful, branded careers pages with custom themes, content sections, and job postings.

## Prerequisites How To Run

- Node.js 18+ and npm
- MongoDB Atlas account
- Git

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/abhishek-singh-1911/whitecarrot.git
cd whitecarrot
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the root directory:
Copy the contents of `.env.example` to `.env.local` and fill in the values.

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/careers-builder?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

NEXT_PUBLIC_APP_URL= http://localhost:3000
```

### 3. Set up MongoDB
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get the connection string and update `MONGODB_URI` in `.env.local`

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What I built

A full-stack application for building and managing career pages for recruiters.

### Features

- User authentication and authorization
- Job posting management
- Custom branding and theming
- Responsive design and PWA support
- MongoDB data storage
- Live preview of the career page

## Improvement Plans

- Add more UI customization options for career page.
- Add social media urls to career page.
- Refresh JWT token upon expiration.
- Complete the apply feature.
- Add more sections in career page.
