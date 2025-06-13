import { RegisterData, LoginCredentials, IUser } from "@/types";
declare class AuthService {
    register(userData: RegisterData): Promise<{
        user: IUser;
        token: string;
    }>;
    login(credentials: LoginCredentials): Promise<{
        user: IUser;
        token: string;
    }>;
    getUserById(userId: string): Promise<IUser>;
    updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
    deleteUser(userId: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    verifyEmail(userId: string): Promise<IUser>;
    getUserStats(): Promise<{
        totalUsers: number;
        verifiedUsers: number;
        recentUsers: number;
    }>;
    searchUsers(query: string, page?: number, limit?: number): Promise<{
        users: IUser[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=authService.d.ts.map