// ============================================================================
// modules/auth/auth.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { registerHandler, loginHandler, meHandler } from './auth.controller';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', registerHandler);

// POST /api/auth/login
authRouter.post('/login', loginHandler);

// GET /api/auth/me  (protected)
authRouter.get('/me', requireAuth, meHandler);
