import { hashPassword, comparePassword, generateToken, verifyToken } from './auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash the password', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('mock_salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await hashPassword('password123');

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mock_salt');
      expect(result).toBe('hashed_password');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword('password123', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword('wrong', 'hashed_password');

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');
      process.env.JWT_SECRET = 'test_secret';

      const payload = { id: '123', email: 'test@example.com' };
      const token = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_secret', { expiresIn: '7d' });
      expect(token).toBe('mock_token');
    });
  });
});
