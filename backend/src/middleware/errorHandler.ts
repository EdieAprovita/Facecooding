import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/types";
import config from "@/config/config";

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found handler
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  let err = { ...error } as AppError;
  err.message = error.message;

  // Log error
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = "Resource not found";
    err = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((error as any).code === 11000) {
    const message = "Duplicate field value entered";
    err = new AppError(message, 400);
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const message = Object.keys((error as any).errors)
      .map((key) => (error as any).errors[key].message)
      .join(", ");
    err = new AppError(message, 400);
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    const message = "Invalid token";
    err = new AppError(message, 401);
  }

  if (error.name === "TokenExpiredError") {
    const message = "Token expired";
    err = new AppError(message, 401);
  }

  // Response format
  const response: ApiResponse = {
    success: false,
    message: err.message || "Server Error",
  };

  // Add stack trace in development
  if (config.NODE_ENV === "development") {
    response.data = {
      stack: error.stack,
      originalError: error.name,
    };
  }

  res.status(err.statusCode || 500).json(response);
};

// Async error wrapper
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
