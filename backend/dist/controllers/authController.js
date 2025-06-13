"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const authService_1 = __importDefault(require("@/services/authService"));
class AuthController {
    async register(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const { name, email, password } = req.body;
            const result = await authService_1.default.register({ name, email, password });
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
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
    async login(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const { email, password } = req.body;
            const result = await authService_1.default.login({ email, password });
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
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
    async getMe(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
                return;
            }
            const user = await authService_1.default.getUserById(req.user.id);
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: { user },
            });
        }
        catch (error) {
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
    async updateProfile(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
                return;
            }
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const user = await authService_1.default.updateUser(req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: { user },
            });
        }
        catch (error) {
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
    async changePassword(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
                return;
            }
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const { currentPassword, newPassword } = req.body;
            await authService_1.default.changePassword(req.user.id, currentPassword, newPassword);
            res.status(200).json({
                success: true,
                message: "Password changed successfully",
            });
        }
        catch (error) {
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
    async deleteAccount(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
                return;
            }
            await authService_1.default.deleteUser(req.user.id);
            res.status(200).json({
                success: true,
                message: "Account deleted successfully",
            });
        }
        catch (error) {
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
    async getUserStats(req, res, next) {
        try {
            const stats = await authService_1.default.getUserStats();
            res.status(200).json({
                success: true,
                message: "User statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            console.error("Get user stats error:", error);
            res.status(500).json({
                success: false,
                message: "Server error retrieving statistics",
            });
        }
    }
    async searchUsers(req, res, next) {
        try {
            const { q: query = "", page = "1", limit = "10" } = req.query;
            const result = await authService_1.default.searchUsers(query, parseInt(page, 10), parseInt(limit, 10));
            res.status(200).json({
                success: true,
                message: "Users search completed",
                data: result.users,
                pagination: result.pagination,
            });
        }
        catch (error) {
            console.error("Search users error:", error);
            res.status(500).json({
                success: false,
                message: "Server error searching users",
            });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map