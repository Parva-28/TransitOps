// ============================================================================
// middleware/error.ts — FROZEN after Hour 0
// Global error handler. Catches ValidationError (422) and any unhandled throws.
// ============================================================================

import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  status = 422;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error & { status?: number; code?: string }, _req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'Conflict', message: 'A record with that value already exists' });
    return;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Not Found', message: err.message });
    return;
  }

  // Known app errors
  const status = err.status || 500;
  const body =
    err.name === 'ValidationError'
      ? { error: 'VALIDATION_FAILED', message: err.message }
      : { error: err.name || 'InternalServerError', message: err.message };

  res.status(status).json(body);
}
