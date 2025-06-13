import User from "@/models/User";
import { RegisterData, LoginCredentials, IUser } from "@/types";

class AuthService {
  // Register a new user
  async register(
    userData: RegisterData
  ): Promise<{ user: IUser; token: string }> {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    await user.save();

    // Generate token
    const token = user.generateToken();

    return {
      user,
      token,
    };
  }

  // Login user
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: IUser; token: string }> {
    const { email, password } = credentials;

    // Find user with password field included
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateToken();

    // Remove password from user object before returning
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword as unknown as IUser,
      token,
    };
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId).populate("profile");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Update user
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    // Don't allow updating sensitive fields directly
    const allowedUpdates = ["name", "email", "avatar"];
    const updates: any = {};

    // Filter allowed updates
    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key as keyof IUser];
      }
    });

    // Check if email is being updated and is unique
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("profile");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Delete user and associated data
  async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Delete associated data (posts, profile, etc.)
    // For now, just delete the user
    await User.findByIdAndDelete(userId);
  }

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();
  }

  // Verify email
  async verifyEmail(userId: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isEmailVerified: true } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Get user statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    recentUsers: number;
  }> {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      totalUsers,
      verifiedUsers,
      recentUsers,
    };
  }

  // Search users (admin only)
  async searchUsers(
    query: string,
    page = 1,
    limit = 10
  ): Promise<{
    users: IUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchRegex = new RegExp(query, "i");
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [{ name: searchRegex }, { email: searchRegex }],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({
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

export default new AuthService();
