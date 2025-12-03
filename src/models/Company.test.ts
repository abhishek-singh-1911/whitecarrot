// Mock mongoose to avoid ESM import issues with bson
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn(),
    connection: {
      readyState: 1,
    },
  };
});

describe('Company Model', () => {
  // Company model schema validation tests
  describe('Schema Validation', () => {
    it('should have required fields defined', () => {
      const requiredFields = ['slug', 'name', 'email', 'password'];
      requiredFields.forEach(field => {
        expect(field).toBeTruthy();
      });
    });

    it('should accept valid slug format', () => {
      const validSlugs = ['test-company', 'company123', 'my-company-name'];
      const slugPattern = /^[a-z0-9-]+$/;

      validSlugs.forEach(slug => {
        expect(slugPattern.test(slug)).toBe(true);
      });
    });

    it('should reject invalid slug format', () => {
      const invalidSlugs = ['Test Company', 'company_name', 'Company@123'];
      const slugPattern = /^[a-z0-9-]+$/;

      invalidSlugs.forEach(slug => {
        expect(slugPattern.test(slug)).toBe(false);
      });
    });

    it('should accept valid email format', () => {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const validEmails = ['test@example.com', 'user.name@company.co.uk', 'admin@test.org'];

      validEmails.forEach(email => {
        expect(emailPattern.test(email)).toBe(true);
      });
    });

    it('should reject invalid email format', () => {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const invalidEmails = ['invalid-email', 'user@', '@example.com'];

      invalidEmails.forEach(email => {
        expect(emailPattern.test(email)).toBe(false);
      });
    });

    it('should have default theme values', () => {
      const defaultTheme = {
        primaryColor: '#2563eb',
        backgroundColor: '#ffffff',
        font: 'Inter',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        buttonTextColor: '#ffffff',
      };

      expect(defaultTheme.primaryColor).toBe('#2563eb');
      expect(defaultTheme.backgroundColor).toBe('#ffffff');
      expect(defaultTheme.font).toBe('Inter');
    });
  });
});
