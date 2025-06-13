const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { createResponse, createErrorResponse } = require('../utils/responseHelper');

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return createErrorResponse(res, 400, 'Validation failed', errors.array());
      }

      const { name, email, password } = req.body;
      
      const result = await authService.register({ name, email, password });
      
      return createResponse(res, 201, 'User registered successfully', result);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists with this email') {
        return createErrorResponse(res, 400, error.message);
      }
      
      return createErrorResponse(res, 500, 'Server error during registration');
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return createErrorResponse(res, 400, 'Validation failed', errors.array());
      }

      const { email, password } = req.body;
      
      const result = await authService.login({ email, password });
      
      return createResponse(res, 200, 'Login successful', result);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return createErrorResponse(res, 400, 'Invalid email or password');
      }
      
      return createErrorResponse(res, 500, 'Server error during login');
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async getMe(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      return createResponse(res, 200, 'User retrieved successfully', { user });
    } catch (error) {
      console.error('Get user error:', error);
      
      if (error.message === 'User not found') {
        return createErrorResponse(res, 404, 'User not found');
      }
      
      return createErrorResponse(res, 500, 'Server error retrieving user');
    }
  }

  // @desc    Update user profile
  // @route   PUT /api/auth/profile
  // @access  Private
  async updateProfile(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return createErrorResponse(res, 400, 'Validation failed', errors.array());
      }

      const user = await authService.updateUser(req.user.id, req.body);
      return createResponse(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.message === 'User not found') {
        return createErrorResponse(res, 404, 'User not found');
      }
      
      return createErrorResponse(res, 500, 'Server error updating profile');
    }
  }

  // @desc    Delete user account
  // @route   DELETE /api/auth/account
  // @access  Private
  async deleteAccount(req, res) {
    try {
      await authService.deleteUser(req.user.id);
      return createResponse(res, 200, 'Account deleted successfully');
    } catch (error) {
      console.error('Delete account error:', error);
      
      if (error.message === 'User not found') {
        return createErrorResponse(res, 404, 'User not found');
      }
      
      return createErrorResponse(res, 500, 'Server error deleting account');
    }
  }

  // @desc    Refresh token
  // @route   POST /api/auth/refresh
  // @access  Private
  async refreshToken(req, res) {
    try {
      const token = authService.generateToken(req.user.id);
      return createResponse(res, 200, 'Token refreshed successfully', { token });
    } catch (error) {
      console.error('Refresh token error:', error);
      return createErrorResponse(res, 500, 'Server error refreshing token');
    }
  }
}

module.exports = new AuthController();
