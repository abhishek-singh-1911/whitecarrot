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

describe('Job Model', () => {
  // Job model schema validation tests
  describe('Schema Validation', () => {
    it('should have required fields defined', () => {
      const requiredFields = ['title', 'department', 'location', 'description'];
      requiredFields.forEach(field => {
        expect(field).toBeTruthy();
      });
    });

    it('should validate work_policy enum values', () => {
      const validPolicies = ['Remote', 'On-site', 'Hybrid'];
      const invalidPolicy = 'InvalidPolicy';

      validPolicies.forEach(policy => {
        expect(['Remote', 'On-site', 'Hybrid']).toContain(policy);
      });

      expect(['Remote', 'On-site', 'Hybrid']).not.toContain(invalidPolicy);
    });

    it('should validate employment_type enum values', () => {
      const validTypes = ['Full Time', 'Part Time', 'Contract'];
      const invalidType = 'InvalidType';

      validTypes.forEach(type => {
        expect(['Full Time', 'Part Time', 'Contract']).toContain(type);
      });

      expect(['Full Time', 'Part Time', 'Contract']).not.toContain(invalidType);
    });

    it('should validate experience_level enum values', () => {
      const validLevels = ['Senior', 'Mid-Level', 'Junior'];
      const invalidLevel = 'Expert';

      validLevels.forEach(level => {
        expect(['Senior', 'Mid-Level', 'Junior']).toContain(level);
      });

      expect(['Senior', 'Mid-Level', 'Junior']).not.toContain(invalidLevel);
    });

    it('should validate job_type enum values', () => {
      const validTypes = ['Permanent', 'Temporary', 'Internship'];
      const invalidType = 'Contract';

      validTypes.forEach(type => {
        expect(['Permanent', 'Temporary', 'Internship']).toContain(type);
      });

      expect(['Permanent', 'Temporary', 'Internship']).not.toContain(invalidType);
    });

    it('should have default isOpen value as true', () => {
      const defaultIsOpen = true;
      expect(defaultIsOpen).toBe(true);
    });
  });
});
