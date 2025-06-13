const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return createErrorResponse(res, 401, 'No token provided, authorization denied');
    }

    // Check if token starts with 'Bearer '
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      token = authHeader; // Backward compatibility
    }

    if (!token) {
      return createErrorResponse(res, 401, 'No token provided, authorization denied');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return createErrorResponse(res, 401, 'Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        return createErrorResponse(res, 401, 'Invalid token');
      } else {
        return createErrorResponse(res, 401, 'Token verification failed');
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return createErrorResponse(res, 500, 'Server error in authentication');
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded.user;
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return createErrorResponse(res, 401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return createErrorResponse(res, 403, 'Insufficient permissions');
    }

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize
};
