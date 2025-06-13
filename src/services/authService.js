const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const User = require('../models/User');
const config = require('../config/config');

class AuthService {
  // Generate JWT Token
  generateToken(userId) {
    return jwt.sign(
      { user: { id: userId } },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );
  }

  // Verify JWT Token
  verifyToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate avatar from email
  generateAvatar(email) {
    return normalize(
      gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'identicon'
      }),
      { forceHttps: true }
    );
  }

  // Register user
  async register({ name, email, password }) {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Generate avatar
      const avatar = this.generateAvatar(email);

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        avatar
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login({ email, password }) {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      // Only fetch the user document. Profile data was removed along with the
      // legacy profile model, so we no longer populate the "profile" field.
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
