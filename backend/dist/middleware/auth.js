"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("@/models/User"));
const config_1 = __importDefault(require("@/config/config"));
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Token is valid but user no longer exists",
                });
                return;
            }
            req.user = {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            await User_1.default.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            next();
        }
        catch (tokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
            return;
        }
    }
    catch (error) {
        console.error("Authentication middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Server error in authentication",
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
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
                message: `Access denied. Requires one of these roles: ${roles.join(", ")}`,
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next();
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (user) {
                req.user = {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
            }
            next();
        }
        catch (tokenError) {
            next();
        }
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const checkOwnership = (resourceUserField = "user") => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Access denied. Please authenticate first.",
            });
            return;
        }
        if (req.user.role === "admin") {
            return next();
        }
        const resourceUserId = req.params[resourceUserField] || req.body[resourceUserField];
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
exports.checkOwnership = checkOwnership;
//# sourceMappingURL=auth.js.map