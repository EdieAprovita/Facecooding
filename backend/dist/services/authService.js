"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("@/models/User"));
class AuthService {
    async register(userData) {
        const { name, email, password } = userData;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists with this email");
        }
        const user = new User_1.default({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });
        await user.save();
        const token = user.generateToken();
        return {
            user,
            token,
        };
    }
    async login(credentials) {
        const { email, password } = credentials;
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        user.lastLogin = new Date();
        await user.save();
        const token = user.generateToken();
        const userObject = user.toObject();
        const { password: _, ...userWithoutPassword } = userObject;
        return {
            user: userWithoutPassword,
            token,
        };
    }
    async getUserById(userId) {
        const user = await User_1.default.findById(userId).populate("profile");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async updateUser(userId, updateData) {
        const allowedUpdates = ["name", "email", "avatar"];
        const updates = {};
        Object.keys(updateData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = updateData[key];
            }
        });
        if (updates.email) {
            const existingUser = await User_1.default.findOne({
                email: updates.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new Error("Email already exists");
            }
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).populate("profile");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async deleteUser(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        await User_1.default.findByIdAndDelete(userId);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User_1.default.findById(userId).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        user.password = newPassword;
        await user.save();
    }
    async verifyEmail(userId) {
        const user = await User_1.default.findByIdAndUpdate(userId, { $set: { isEmailVerified: true } }, { new: true });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async getUserStats() {
        const totalUsers = await User_1.default.countDocuments();
        const verifiedUsers = await User_1.default.countDocuments({ isEmailVerified: true });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentUsers = await User_1.default.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });
        return {
            totalUsers,
            verifiedUsers,
            recentUsers,
        };
    }
    async searchUsers(query, page = 1, limit = 10) {
        const searchRegex = new RegExp(query, "i");
        const skip = (page - 1) * limit;
        const users = await User_1.default.find({
            $or: [{ name: searchRegex }, { email: searchRegex }],
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await User_1.default.countDocuments({
            $or: [{ name: searchRegex }, { email: searchRegex }],
        });
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
}
exports.default = new AuthService();
//# sourceMappingURL=authService.js.map