import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import type { User } from "@shared/schema";
import { monitoring } from "./monitoring";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; username: string };
    }
  }
}

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many API requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
];

const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export async function registerRoutes(app: Express): Promise<Server> {
  // serve deck.json from public directory (protected route)
  app.get("/deck.json", authenticateToken, async (req: Request, res: Response) => {
    try {
      const deckPath = path.resolve(import.meta.dirname, "..", "public", "deck.json");
      const deckData = await fs.promises.readFile(deckPath, "utf-8");
      res.setHeader("Content-Type", "application/json");
      res.send(deckData);
    } catch (error) {
      res.status(404).json({ message: "Deck not found" });
    }
  });

  // Public deck endpoint for sharing (with rate limiting)
  app.get("/api/deck/:id", apiLimiter, async (req: Request, res: Response) => {
    try {
      const deckPath = path.resolve(import.meta.dirname, "..", "public", "deck.json");
      const deckData = await fs.promises.readFile(deckPath, "utf-8");
      res.setHeader("Content-Type", "application/json");
      res.send(deckData);
    } catch (error) {
      res.status(404).json({ message: "Deck not found" });
    }
  });

  // Apply rate limiting to all API routes
  app.use('/api', apiLimiter);

  // Authentication routes
  app.post('/api/auth/register', authLimiter, validateRegistration, async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await storage.createUser({ username, password: hashedPassword });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', authLimiter, validateLogin, async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { username, password } = req.body;

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Protected route example
  app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json(monitoring.getHealthStatus());
  });

  // Metrics endpoint (protected)
  app.get('/api/metrics', authenticateToken, (req: Request, res: Response) => {
    res.json(monitoring.getMetrics());
  });

  const httpServer = createServer(app);

  return httpServer;
}
