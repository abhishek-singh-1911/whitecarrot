# Test Plan Documentation

## Overview
This document provides a comprehensive overview of the testing strategy, test coverage, and testing practices for the Careers Builder application.

**Last Updated:** December 3, 2025  
**Total Test Suites:** 8  
**Total Tests:** 49  
**Test Framework:** Jest + React Testing Library  
**Test Coverage:** Component, Unit, and Integration Tests

---

## Testing Strategy

### 1. Testing Framework & Tools
- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **@testing-library/jest-dom**: For custom DOM matchers

### 2. Test Categories

#### **Component Tests**
Testing React components to ensure they render correctly and respond to user interactions.

#### **Unit Tests**
Testing individual functions and modules in isolation.

#### **Integration Tests**
Testing how different parts of the application work together.

#### **API Logic Tests**
Testing business logic for API routes, authentication, and data processing.

---

## Test Coverage

### 1. Component Tests

#### **JobList Component** (`src/components/JobList.test.tsx`)
- **File:** `src/components/JobList.tsx`
- **Tests:** 3
- **Coverage:**
  - ✅ Renders all jobs initially
  - ✅ Filters jobs by search term
  - ✅ Shows "No jobs found" when filter matches nothing

**Test Details:**
```typescript
describe('JobList Component', () => {
  it('renders all jobs initially')
  it('filters jobs by search term')
  it('shows "No jobs found" when filter matches nothing')
})
```

#### **CompanyPageRenderer Component** (`src/components/CompanyPageRenderer.test.tsx`)
- **File:** `src/components/CompanyPageRenderer.tsx`
- **Tests:** 10
- **Coverage:**
  - ✅ Renders company name
  - ✅ Renders company logo
  - ✅ Renders "View Open Roles" button by default
  - ✅ Hides button when showOpenRolesButton is false
  - ✅ Renders hero section
  - ✅ Renders text section
  - ✅ Renders video section
  - ✅ Renders gallery section
  - ✅ Renders footer with copyright
  - ✅ Applies theme colors

**Test Details:**
```typescript
describe('CompanyPageRenderer', () => {
  it('should render company name')
  it('should render company logo')
  it('should render "View Open Roles" button by default')
  it('should not render "View Open Roles" button when showOpenRolesButton is false')
  it('should render hero section')
  it('should render text section')
  it('should render video section')
  it('should render gallery section')
  it('should render footer with copyright')
  it('should apply theme colors')
})
```

#### **Home Page** (`src/app/page.test.tsx`)
- **File:** `src/app/page.tsx`
- **Tests:** 3
- **Coverage:**
  - ✅ Renders the landing page correctly
  - ✅ Displays login and signup buttons
  - ✅ Shows correct heading and description

**Test Details:**
```typescript
describe('Home Page', () => {
  it('renders the landing page correctly')
  it('displays login and signup buttons')
  it('shows correct heading and description')
})
```

---

### 2. Model Tests

#### **Company Model** (`src/models/Company.test.ts`)
- **File:** `src/models/Company.ts`
- **Tests:** 6
- **Coverage:**
  - ✅ Required fields validation
  - ✅ Valid slug format acceptance
  - ✅ Invalid slug format rejection
  - ✅ Valid email format acceptance
  - ✅ Invalid email format rejection
  - ✅ Default theme values

**Test Details:**
```typescript
describe('Company Model', () => {
  describe('Schema Validation', () => {
    it('should have required fields defined')
    it('should accept valid slug format')
    it('should reject invalid slug format')
    it('should accept valid email format')
    it('should reject invalid email format')
    it('should have default theme values')
  })
})
```

#### **Job Model** (`src/models/Job.test.ts`)
- **File:** `src/models/Job.ts`
- **Tests:** 6
- **Coverage:**
  - ✅ Required fields validation
  - ✅ work_policy enum values validation
  - ✅ employment_type enum values validation
  - ✅ experience_level enum values validation
  - ✅ job_type enum values validation
  - ✅ Default isOpen value

**Test Details:**
```typescript
describe('Job Model', () => {
  describe('Schema Validation', () => {
    it('should have required fields defined')
    it('should validate work_policy enum values')
    it('should validate employment_type enum values')
    it('should validate experience_level enum values')
    it('should validate job_type enum values')
    it('should have default isOpen value as true')
  })
})
```

---

### 3. Authentication & Authorization Tests

#### **Auth Library** (`src/lib/auth.test.ts`)
- **File:** `src/lib/auth.ts`
- **Tests:** 6
- **Coverage:**
  - ✅ Hash password functionality
  - ✅ Compare password functionality
  - ✅ Generate JWT token
  - ✅ Verify valid JWT token
  - ✅ Reject invalid JWT token
  - ✅ Extract token from authorization header

**Test Details:**
```typescript
describe('Auth Functions', () => {
  describe('hashPassword', () => {
    it('should hash a password')
  })
  
  describe('comparePassword', () => {
    it('should return true for matching passwords')
    it('should return false for non-matching passwords')
  })
  
  describe('generateToken', () => {
    it('should generate a valid JWT token')
  })
  
  describe('verifyToken', () => {
    it('should verify a valid token')
    it('should return null for invalid token')
  })
  
  describe('extractToken', () => {
    it('should extract token from Bearer header')
  })
})
```

---

### 4. API Logic Tests

#### **Login API Logic** (`src/app/api/auth/login/route.test.ts`)
- **File:** `src/app/api/auth/login/route.ts`
- **Tests:** 7
- **Coverage:**
  - ✅ Auth validation (required fields)
  - ✅ Valid credentials format acceptance
  - ✅ Password comparison (correct)
  - ✅ Password comparison (incorrect)
  - ✅ Token generation
  - ✅ Success response structure
  - ✅ Error response structure

**Test Details:**
```typescript
describe('Login API Logic', () => {
  describe('Auth validation', () => {
    it('should validate required fields')
    it('should accept valid credentials format')
  })
  
  describe('Password comparison', () => {
    it('should compare passwords correctly')
    it('should reject incorrect passwords')
  })
  
  describe('Token generation', () => {
    it('should generate a token for valid user')
    it('should call generateToken with correct payload')
  })
  
  describe('Response structure', () => {
    it('should have correct success response structure')
    it('should have correct error response structure')
  })
})
```

#### **Jobs API Logic** (`src/app/api/jobs/route.test.ts`)
- **File:** `src/app/api/jobs/route.ts`
- **Tests:** 8
- **Coverage:**
  - ✅ Required fields validation
  - ✅ Missing fields detection
  - ✅ Job slug generation from title
  - ✅ Special characters handling in slug
  - ✅ Long slug truncation
  - ✅ Token extraction from header
  - ✅ Token verification
  - ✅ Query parameters for filtering

**Test Details:**
```typescript
describe('Jobs API Logic', () => {
  describe('Required fields validation', () => {
    it('should validate all required fields are present')
    it('should detect missing required fields')
  })
  
  describe('Job slug generation', () => {
    it('should generate slug from title')
    it('should handle special characters in title')
    it('should truncate long slugs')
  })
  
  describe('Authentication', () => {
    it('should extract token from authorization header')
    it('should verify valid token')
    it('should reject invalid token')
  })
  
  describe('Query parameters', () => {
    it('should build query for open jobs only')
    it('should build query for all jobs')
  })
})
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npm test -- src/components/JobList.test.tsx
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

---

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(mongoose|bson)/)',
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'
```

---

## Test Patterns & Best Practices

### 1. Component Testing Patterns
- ✅ Use `render()` from React Testing Library
- ✅ Query by accessible roles and text
- ✅ Test user interactions with `fireEvent`
- ✅ Assert on DOM changes after interactions
- ✅ Mock Next.js router when needed

### 2. Unit Testing Patterns
- ✅ Test one function at a time
- ✅ Mock external dependencies
- ✅ Test edge cases and error handling
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)

### 3. Mocking Strategy
- ✅ Mock external APIs and services
- ✅ Mock database connections
- ✅ Mock Next.js navigation hooks
- ✅ Mock environment variables when needed

---

## Known Issues & Warnings

### Console Warnings
- **React Key Prop Warning**: JobList component displays a warning about missing keys in the MuiNativeSelectSelect component. This is a minor issue in the MUI library's internal rendering and doesn't affect functionality.

---

## Future Testing Improvements

### 1. Additional Test Coverage
- [ ] Add E2E tests with Playwright or Cypress
- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Add accessibility tests (a11y)

### 2. API Route Testing
- [ ] Add full integration tests for API routes with a test database
- [ ] Add request/response validation tests
- [ ] Add rate limiting tests

### 3. Database Testing
- [ ] Add tests with real MongoDB test instance
- [ ] Add transaction tests
- [ ] Add data validation tests

### 4. Component Coverage
- [ ] Add tests for remaining components:
  - DashboardSidebar
  - PWAInstallPrompt
  - ThemeRegistry
  - ContentEditor
  - PreviewPane
  - ThemeEditor
  - JobEditorDialog

---

## Test Results Summary

### Latest Test Run
- **Test Suites:** 8 passed, 8 total
- **Tests:** 49 passed, 49 total
- **Snapshots:** 0 total
- **Time:** ~1.7s
- **Status:** ✅ All tests passing

### Coverage by Category
| Category | Test Files | Tests | Status |
|----------|-----------|-------|--------|
| Components | 3 | 16 | ✅ Pass |
| Models | 2 | 12 | ✅ Pass |
| Auth | 1 | 6 | ✅ Pass |
| API Logic | 2 | 15 | ✅ Pass |
| **Total** | **8** | **49** | **✅ Pass** |

---

## Continuous Integration

### CI/CD Integration Recommendations
1. Run tests on every pull request
2. Block merges if tests fail
3. Generate coverage reports
4. Set minimum coverage thresholds
5. Run tests in multiple Node.js versions

### Example GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
```

---

## Conclusion

The Careers Builder application has a comprehensive test suite covering components, models, authentication, and API logic. All 49 tests are currently passing, providing confidence in the application's functionality. The test suite follows best practices and is easy to maintain and extend.

For questions or suggestions regarding the test suite, please contact the development team.
