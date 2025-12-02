import { render, screen } from '@testing-library/react';
import Home from './page';
import '@testing-library/jest-dom';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

describe('Home Page', () => {
  it('renders the landing page correctly', () => {
    render(<Home />);

    expect(screen.getByText('Careers Builder')).toBeInTheDocument();
    expect(screen.getByText('Create beautiful, branded careers pages for your company in minutes.')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
