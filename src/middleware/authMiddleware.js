const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.header('x-auth-token'); // Legacy support

    if (!token) {
      return createErrorResponse(res, 401, 'No token provided, authorization denied');
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return createErrorResponse(res, 401, 'Token expired');
    }
    
    if (error.name === 'JsonWebTokenError') {
      return createErrorResponse(res, 401, 'Invalid token');
    }
    
    return createErrorResponse(res, 500, 'Server error in authentication');
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.header('x-auth-token');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    // For optional auth, we just continue without setting user
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param {String|Array} roles - Required role(s)
 * @returns {Function} Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return createErrorResponse(res, 401, 'Not authenticated');
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return createErrorResponse(res, 403, 'Not authorized for this action');
    }

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize
};
