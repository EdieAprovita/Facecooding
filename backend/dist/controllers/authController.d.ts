import { Response, NextFunction } from "express";
import { AuthRequest, ApiResponse } from "@/types";
declare class AuthController {
    register(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    login(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    getMe(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    updateProfile(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    changePassword(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    deleteAccount(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    getUserStats(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    searchUsers(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=authController.d.ts.map