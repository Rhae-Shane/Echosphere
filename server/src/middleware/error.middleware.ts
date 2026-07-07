import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

/**
 * Log ALL details about an error
 */
const logErrorDetails = (err: any, req: Request) => {
  console.error("───────────────────────────────");
  console.error("❌ ERROR CAUGHT BY GLOBAL HANDLER");
  console.error("📌 Route:", req.method, req.originalUrl);
  console.error("📥 Body:", req.body);
  console.error("🔍 Query:", req.query);
  console.error("🧩 Params:", req.params);
  console.error("💥 Error name:", err.name);
  console.error("💥 Error message:", err.message);
  console.error("📂 Stack trace:\n", err.stack);
  console.error("───────────────────────────────");
};

/**
 * Handles Zod validation errors by sending a 400 response.
 */
const handleZodError = (err: ZodError, res: Response) => {
  const errors = err.errors.map((error) => ({
    path: error.path.join('.'),
    message: error.message,
  }));

  return res.status(400).json({
    status: 'error',
    message: 'Invalid input data',
    errors,
  });
};

/**
 * Handles custom operational errors (AppError)
 */
const handleAppError = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
  });
};

/**
 * Handles unexpected internal server errors
 */
const handleServerError = (err: Error, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // needed for Express
) => {
  
  // 🔥 Log details BEFORE handling
  logErrorDetails(err, req);

  if (err instanceof ZodError) {
    return handleZodError(err, res);
  }

  if (err instanceof AppError) {
    return handleAppError(err, res);
  }

  return handleServerError(err, res);
};
