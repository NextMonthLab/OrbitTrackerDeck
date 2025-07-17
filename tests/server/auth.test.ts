import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import { storage } from '../../server/storage';

describe('Authentication API', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.id).toBeDefined();
    });

    it('should fail with invalid username', async () => {
      const userData = {
        username: 'ab', // too short
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with weak password', async () => {
      const userData = {
        username: 'testuser2',
        password: 'weak', // doesn't meet requirements
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with duplicate username', async () => {
      const userData = {
        username: 'testuser', // already exists from first test
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(loginData.username);
    });

    it('should fail with invalid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeAll(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'TestPass123!',
        });
      token = loginResponse.body.token;
    });

    it('should get user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.id).toBeDefined();
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toBe('Access token required');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});