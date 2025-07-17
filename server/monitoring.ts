import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Request metrics tracking
interface RequestMetrics {
  totalRequests: number;
  activeRequests: number;
  requestsByEndpoint: Map<string, number>;
  requestsByStatus: Map<number, number>;
  averageResponseTime: number;
  responseTimes: number[];
}

class MonitoringService {
  private metrics: RequestMetrics = {
    totalRequests: 0,
    activeRequests: 0,
    requestsByEndpoint: new Map(),
    requestsByStatus: new Map(),
    averageResponseTime: 0,
    responseTimes: []
  };

  // Request logging middleware
  requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add request ID to request object
    (req as any).requestId = requestId;
    
    this.metrics.totalRequests++;
    this.metrics.activeRequests++;
    
    // Track endpoint usage
    const endpoint = `${req.method} ${req.path}`;
    this.metrics.requestsByEndpoint.set(
      endpoint,
      (this.metrics.requestsByEndpoint.get(endpoint) || 0) + 1
    );

    logger.info('Request started', {
      requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function(chunk: any, encoding?: any): any {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Update metrics
      monitoring.metrics.activeRequests--;
      monitoring.metrics.requestsByStatus.set(
        res.statusCode,
        (monitoring.metrics.requestsByStatus.get(res.statusCode) || 0) + 1
      );
      
      // Track response times (keep last 1000 for rolling average)
      monitoring.metrics.responseTimes.push(responseTime);
      if (monitoring.metrics.responseTimes.length > 1000) {
        monitoring.metrics.responseTimes.shift();
      }
      
      // Calculate average response time
      monitoring.metrics.averageResponseTime = 
        monitoring.metrics.responseTimes.reduce((a, b) => a + b, 0) / 
        monitoring.metrics.responseTimes.length;

      logger.info('Request completed', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        contentLength: res.get('Content-Length'),
        timestamp: new Date().toISOString()
      });

      // Log slow requests
      if (responseTime > 1000) {
        logger.warn('Slow request detected', {
          requestId,
          method: req.method,
          url: req.url,
          responseTime: `${responseTime}ms`
        });
      }

      return originalEnd.call(this, chunk, encoding);
    };

    next();
  };

  // Error logging middleware
  errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId;
    
    logger.error('Request error', {
      requestId,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body,
        params: req.params,
        query: req.query
      },
      timestamp: new Date().toISOString()
    });

    next(error);
  };

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      requestsByEndpoint: Object.fromEntries(this.metrics.requestsByEndpoint),
      requestsByStatus: Object.fromEntries(this.metrics.requestsByStatus),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  // Health check status
  getHealthStatus() {
    const metrics = this.getMetrics();
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development',
      metrics: {
        totalRequests: metrics.totalRequests,
        activeRequests: metrics.activeRequests,
        averageResponseTime: Math.round(metrics.averageResponseTime),
        memoryUsage: {
          used: Math.round(memoryUsagePercent),
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        }
      }
    };
  }

  // Log system metrics periodically
  startMetricsLogging() {
    setInterval(() => {
      const metrics = this.getMetrics();
      logger.info('System metrics', metrics);
    }, 60000); // Log every minute
  }
}

export const monitoring = new MonitoringService();