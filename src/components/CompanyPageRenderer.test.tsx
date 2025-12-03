import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyPageRenderer from './CompanyPageRenderer';

const mockCompany = {
  name: 'Test Company',
  logo_url: 'http://example.com/logo.png',
  theme: {
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    font: 'Inter',
    titleColor: '#111827',
    bodyColor: '#4b5563',
    buttonTextColor: '#ffffff',
  },
  content_sections: [
    {
      type: 'hero' as const,
      title: 'Welcome to Test Company',
      content: 'We are building the future',
      image_url: 'http://example.com/hero.jpg',
    },
    {
      type: 'text' as const,
      title: 'About Us',
      content: 'We are a great company',
    },
    {
      type: 'video' as const,
      title: 'Our Story',
      content: 'Watch our story',
      video_url: 'http://example.com/video',
    },
    {
      type: 'gallery' as const,
      title: 'Our Team',
      content: 'Meet the team',
      gallery_images: [
        'http://example.com/img1.jpg',
        'http://example.com/img2.jpg',
      ],
    },
  ],
};

describe('CompanyPageRenderer', () => {
  it('should render company name', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getAllByText('Test Company')[0]).toBeInTheDocument();
  });

  it('should render company logo', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    const logo = screen.getByAltText('Test Company');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'http://example.com/logo.png');
  });

  it('should render "View Open Roles" button by default', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getByText('View Open Roles')).toBeInTheDocument();
  });

  it('should not render "View Open Roles" button when showOpenRolesButton is false', () => {
    render(<CompanyPageRenderer company={mockCompany} showOpenRolesButton={false} />);
    expect(screen.queryByText('View Open Roles')).not.toBeInTheDocument();
  });

  it('should render hero section', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getByText('Welcome to Test Company')).toBeInTheDocument();
    expect(screen.getByText('We are building the future')).toBeInTheDocument();
  });

  it('should render text section', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('We are a great company')).toBeInTheDocument();
  });

  it('should render video section', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText('Watch our story')).toBeInTheDocument();
  });

  it('should render gallery section', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    expect(screen.getByText('Our Team')).toBeInTheDocument();
    expect(screen.getByText('Meet the team')).toBeInTheDocument();
  });

  it('should render footer with copyright', () => {
    render(<CompanyPageRenderer company={mockCompany} />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Test Company. All rights reserved.`)).toBeInTheDocument();
  });

  it('should apply theme colors', () => {
    const { container } = render(<CompanyPageRenderer company={mockCompany} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveStyle({ backgroundColor: '#ffffff' });
  });
});
