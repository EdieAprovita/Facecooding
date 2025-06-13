const { createErrorResponse } = require('../utils/responseHelper');
const config = require('../config/config');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    return createErrorResponse(res, 400, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return createErrorResponse(res, 400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return createErrorResponse(res, 400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return createErrorResponse(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return createErrorResponse(res, 401, 'Token expired');
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Don't leak error details in production
  const errorDetails = config.NODE_ENV === 'production' ? null : {
    stack: err.stack,
    name: err.name
  };

  return createErrorResponse(res, statusCode, message, errorDetails);
};

/**
 * Handle 404 errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  return createErrorResponse(res, 404, message);
};

/**
 * Async error wrapper to catch async errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
