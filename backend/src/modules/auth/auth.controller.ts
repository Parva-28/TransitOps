// ============================================================================
// modules/auth/auth.controller.ts  — BA owns
// Thin controllers: validate input, call service, send response.
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { ValidationError } from '../../middleware/error';

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'email, password, name, role are required' });
      return;
    }
    const result = await authService.register({ email, password, name, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'email and password are required' });
      return;
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    // Map ValidationError from login → 401 per CONTRACT.md
    if (err instanceof ValidationError) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    next(err);
  }
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await authService.getMe(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
