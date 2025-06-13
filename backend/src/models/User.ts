import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import gravatar from "gravatar";
import { IUser } from "@/types";
import config from "@/config/config";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: function (this: IUser) {
        return gravatar.url(this.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin",
      },
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
// Note: email index is automatically created by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for profile relationship
UserSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to generate avatar
UserSchema.pre("save", function (next) {
  if (this.isModified("email") && !this.avatar) {
    this.avatar = gravatar.url(this.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
  }
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Instance method to generate JWT token
UserSchema.methods.generateToken = function (): string {
  const payload = {
    id: this._id.toString(),
    email: this.email,
    role: this.role,
  };

  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
      issuer: "facecooding-api",
    } as SignOptions);
  } catch (error) {
    throw new Error("Error generating JWT token");
  }
};

// Static method to find user by email with password
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select("+password");
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function () {
  return this.find({ isEmailVerified: true });
};

// Create and export model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
