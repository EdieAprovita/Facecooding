"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.notFound = exports.AppError = void 0;
const config_1 = __importDefault(require("@/config/config"));
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (error, req, res, next) => {
    let err = { ...error };
    err.message = error.message;
    console.error("Error:", {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });
    if (error.name === "CastError") {
        const message = "Resource not found";
        err = new AppError(message, 404);
    }
    if (error.code === 11000) {
        const message = "Duplicate field value entered";
        err = new AppError(message, 400);
    }
    if (error.name === "ValidationError") {
        const message = Object.keys(error.errors)
            .map((key) => error.errors[key].message)
            .join(", ");
        err = new AppError(message, 400);
    }
    if (error.name === "JsonWebTokenError") {
        const message = "Invalid token";
        err = new AppError(message, 401);
    }
    if (error.name === "TokenExpiredError") {
        const message = "Token expired";
        err = new AppError(message, 401);
    }
    const response = {
        success: false,
        message: err.message || "Server Error",
    };
    if (config_1.default.NODE_ENV === "development") {
        response.data = {
            stack: error.stack,
            originalError: error.name,
        };
    }
    res.status(err.statusCode || 500).json(response);
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map