import { Response, NextFunction } from "express";
import { AuthRequest, ApiResponse } from "@/types";
export declare const authenticate: (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const checkOwnership: (resourceUserField?: string) => (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map