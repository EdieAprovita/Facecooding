import { Request } from "express";
import { Document } from "mongoose";

// User types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
}

// Profile types
export interface IProfile extends Document {
  _id: string;
  user: string;
  bio?: string;
  location?: string;
  website?: string;
  social?: {
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Post types
export interface IPost extends Document {
  _id: string;
  user: string;
  text: string;
  name: string;
  avatar: string;
  likes: Array<{
    user: string;
  }>;
  comments: Array<{
    _id: string;
    user: string;
    text: string;
    name: string;
    avatar: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Database connection types
export interface DatabaseConfig {
  uri: string;
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
    bufferCommands?: boolean;
  };
}

// Environment types
export interface Environment {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  BCRYPT_ROUNDS: number;
  RATE_LIMIT: {
    windowMs: number;
    max: number;
  };
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
