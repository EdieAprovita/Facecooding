import dotenv from "dotenv";
import path from "path";
import { Environment } from "@/types";

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const config: Environment = {
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/facecooding",
  JWT_SECRET:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10), // limit each IP to 100 requests per windowMs
  },
};

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] && config.NODE_ENV === "production") {
    throw new Error(`Environment variable ${envVar} is required in production`);
  }
}

export default config;
