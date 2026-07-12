// ============================================================================
// modules/auth/auth.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../../middleware/auth';
import { registerHandler, loginHandler, meHandler } from './auth.controller';

export const authRouter = Router();

// 10 attempts per IP per 15 min — prevents brute-force on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Try again in 15 minutes.' },
});

// 5 registrations per IP per hour — prevents account spam
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many accounts created from this IP. Try again later.' },
});

// POST /api/auth/register
authRouter.post('/register', registerLimiter, registerHandler);

// POST /api/auth/login
authRouter.post('/login', loginLimiter, loginHandler);

// GET /api/auth/me  (protected)
authRouter.get('/me', requireAuth, meHandler);
