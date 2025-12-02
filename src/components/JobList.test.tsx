import { render, screen, fireEvent } from '@testing-library/react';
import JobList from './JobList';
import '@testing-library/jest-dom';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

const mockJobs = [
  {
    _id: '1',
    title: 'Senior Frontend Engineer',
    job_slug: 'senior-frontend',
    department: 'Engineering',
    location: 'Remote',
    employment_type: 'Full Time',
    work_policy: 'Remote',
  },
  {
    _id: '2',
    title: 'Product Manager',
    job_slug: 'product-manager',
    department: 'Product',
    location: 'New York',
    employment_type: 'Full Time',
    work_policy: 'Hybrid',
  },
];

const mockCompany = {
  slug: 'test-company',
  theme: {
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    font: 'Arial',
  },
};

describe('JobList Component', () => {
  it('renders all jobs initially', () => {
    render(<JobList jobs={mockJobs as any} company={mockCompany} />);

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('filters jobs by search term', () => {
    render(<JobList jobs={mockJobs as any} company={mockCompany} />);

    const searchInput = screen.getByPlaceholderText('Search jobs by title or location...');
    fireEvent.change(searchInput, { target: { value: 'Frontend' } });

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
  });

  it('filters jobs by department', () => {
    render(<JobList jobs={mockJobs as any} company={mockCompany} />);

    // Find the select element (MUI Select behaves a bit differently, but we used native select in the component)
    // In JobList.tsx: <TextField select ... SelectProps={{ native: true }}>
    // So it renders a real <select> inside.

    // However, MUI TextField with select renders a div with role="button" if not native, 
    // but we explicitly used `SelectProps={{ native: true }}` in the code I wrote earlier.
    // Let's verify the code in JobList.tsx... 
    // Yes: SelectProps={{ native: true }}

    // So we can find by role 'combobox' or just by display value if it was a custom select, 
    // but for native select we can use fireEvent.change on the select element.

    // Since MUI TextField wraps the select, let's try to find it by value or role.
    // Actually, let's just use getAllByRole('combobox') or similar.

    // To be safe with MUI, let's look at the implementation again.
    // It renders options.

    const selects = screen.getAllByRole('combobox');
    // The first one might be something else if not careful, but here we have search (input text) and department (select).
    // Search is input type text, so it's a textbox.
    // Department is the select.

    const departmentSelect = selects[0]; // Should be the only combobox if search is just a textbox

    fireEvent.change(departmentSelect, { target: { value: 'Engineering' } });

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
  });

  it('shows "No jobs found" when filter matches nothing', () => {
    render(<JobList jobs={mockJobs as any} company={mockCompany} />);

    const searchInput = screen.getByPlaceholderText('Search jobs by title or location...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    expect(screen.getByText('No jobs found matching your criteria.')).toBeInTheDocument();
  });
});
