import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';

describe('Health Check API', () => {
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

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.metrics).toBeDefined();
    });

    it('should include system metrics', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.metrics.totalRequests).toBeDefined();
      expect(response.body.metrics.memoryUsage).toBeDefined();
      expect(response.body.metrics.memoryUsage.used).toBeDefined();
      expect(response.body.metrics.memoryUsage.rss).toBeDefined();
    });
  });
});