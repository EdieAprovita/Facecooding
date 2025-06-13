const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.ts');
const authValidators = require('../validators/authValidators');
const { auth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', 
  authValidators.register, 
  asyncHandler(authController.register)
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  authValidators.login, 
  asyncHandler(authController.login)
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', 
  auth, 
  asyncHandler(authController.getMe)
);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
  auth, 
  authValidators.updateProfile, 
  asyncHandler(authController.updateProfile)
);

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Private
router.post('/refresh', 
  auth, 
  asyncHandler(authController.refreshToken)
);

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', 
  auth, 
  asyncHandler(authController.deleteAccount)
);

module.exports = router;
