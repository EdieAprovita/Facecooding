import express from "express";
import authController from "@/controllers/authController";
import { authenticate, authorize } from "@/middleware/auth";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
} from "@/validators/authValidators";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, authController.getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authenticate,
  updateProfileValidation,
  authController.updateProfile
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  authenticate,
  changePasswordValidation,
  authController.changePassword
);

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", authenticate, authController.deleteAccount);

// Admin routes
// @route   GET /api/auth/stats
// @desc    Get user statistics
// @access  Private/Admin
router.get(
  "/stats",
  authenticate,
  authorize("admin"),
  authController.getUserStats
);

// @route   GET /api/auth/search
// @desc    Search users
// @access  Private/Admin
router.get(
  "/search",
  authenticate,
  authorize("admin"),
  authController.searchUsers
);

export default router;
