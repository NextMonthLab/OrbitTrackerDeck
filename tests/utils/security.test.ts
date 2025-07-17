import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Security Utils', () => {
  describe('Password hashing', () => {
    it('should hash passwords correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should verify passwords correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);
      
      const isInvalid = await bcrypt.compare('WrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Token handling', () => {
    const JWT_SECRET = 'test-secret-key';
    
    it('should create valid JWT tokens', () => {
      const payload = { userId: 1, username: 'testuser' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify JWT tokens correctly', () => {
      const payload = { userId: 1, username: 'testuser' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
    });

    it('should reject invalid JWT tokens', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, JWT_SECRET);
      }).toThrow();
    });

    it('should reject tokens with wrong secret', () => {
      const payload = { userId: 1, username: 'testuser' };
      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });
      
      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });
});