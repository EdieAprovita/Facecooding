import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import authService from "@/services/authService";
import { AuthRequest, ApiResponse } from "@/types";

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { name, email, password } = req.body;

      const result = await authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof Error) {
        if (error.message === "User already exists with this email") {
          res.status(400).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        if (error.message === "Invalid credentials") {
          res.status(400).json({
            success: false,
            message: "Invalid email or password",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async getMe(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      const user = await authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Get user error:", error);

      if (error instanceof Error) {
        if (error.message === "User not found") {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error retrieving user",
      });
    }
  }

  // @desc    Update user profile
  // @route   PUT /api/auth/profile
  // @access  Private
  async updateProfile(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const user = await authService.updateUser(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);

      if (error instanceof Error) {
        if (error.message === "User not found") {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        }

        if (error.message === "Email already exists") {
          res.status(400).json({
            success: false,
            message: "Email already exists",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error updating profile",
      });
    }
  }

  // @desc    Change password
  // @route   PUT /api/auth/change-password
  // @access  Private
  async changePassword(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);

      if (error instanceof Error) {
        if (error.message === "User not found") {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        }

        if (error.message === "Current password is incorrect") {
          res.status(400).json({
            success: false,
            message: "Current password is incorrect",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error changing password",
      });
    }
  }

  // @desc    Delete user account
  // @route   DELETE /api/auth/account
  // @access  Private
  async deleteAccount(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      await authService.deleteUser(req.user.id);

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete account error:", error);

      if (error instanceof Error) {
        if (error.message === "User not found") {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error deleting account",
      });
    }
  }

  // @desc    Get user statistics (Admin only)
  // @route   GET /api/auth/stats
  // @access  Private/Admin
  async getUserStats(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await authService.getUserStats();

      res.status(200).json({
        success: true,
        message: "User statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Get user stats error:", error);

      res.status(500).json({
        success: false,
        message: "Server error retrieving statistics",
      });
    }
  }

  // @desc    Search users (Admin only)
  // @route   GET /api/auth/search
  // @access  Private/Admin
  async searchUsers(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q: query = "", page = "1", limit = "10" } = req.query;

      const result = await authService.searchUsers(
        query as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      res.status(200).json({
        success: true,
        message: "Users search completed",
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Search users error:", error);

      res.status(500).json({
        success: false,
        message: "Server error searching users",
      });
    }
  }
}

export default new AuthController();
