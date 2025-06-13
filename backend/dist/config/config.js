"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    NODE_ENV: process.env.NODE_ENV ||
        "development",
    PORT: parseInt(process.env.PORT || "3000", 10),
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/facecooding",
    JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
    RATE_LIMIT: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
        max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    },
};
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] && config.NODE_ENV === "production") {
        throw new Error(`Environment variable ${envVar} is required in production`);
    }
}
exports.default = config;
//# sourceMappingURL=config.js.map