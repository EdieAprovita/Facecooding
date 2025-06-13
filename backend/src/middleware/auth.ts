import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import config from "@/config/config";
import { AuthRequest, JwtPayload, ApiResponse } from "@/types";

// Protect routes - require authentication
export const authenticate = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

      // Check if user still exists
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Token is valid but user no longer exists",
        });
        return;
      }

      // Add user to request object
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      next();
    } catch (tokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate first.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Requires one of these roles: ${roles.join(
          ", "
        )}`,
      });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

      // Check if user still exists
      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        // Add user to request object
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      }

      next();
    } catch (tokenError) {
      // Invalid token, but continue without authentication
      next();
    }
  } catch (error) {
    // Continue without authentication on any error
    next();
  }
};

// Check if user owns resource
export const checkOwnership = (resourceUserField = "user") => {
  return (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate first.",
      });
      return;
    }

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Check if resource belongs to user
    const resourceUserId =
      req.params[resourceUserField] || req.body[resourceUserField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
      return;
    }

    next();
  };
};
