import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail, sendEmail } from "../utils/sendEmail.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user with email verification
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, phone, fitnessLevel, goal } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }

    // Check if phone already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ 
        message: "User with this phone number already exists" 
      });
    }

    // Hash password with strong algorithm
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      phone,
      fitnessLevel,
      goal,
      isVerified: false // User must verify OTP
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Yoga Planner',
        message: `Hello ${name},\n\nThank you for registering with Yoga Planner!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't register for an account, please ignore this email.\n\nBest regards,\nYoga Planner Team`
      });
    } catch (emailError) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again." 
      });
    }

    // Send success response immediately
    res.status(201).json({ 
      message: "Registration successful! Please check your email for the OTP verification code.",
      requiresVerification: true,
      email: email
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification token" 
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.json({ 
      message: "Email verified successfully! You can now log in." 
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ 
      message: "Email verification failed", 
      error: error.message 
    });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        message: "Email is already verified" 
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationUrl);

    res.json({ 
      message: "Verification email sent! Please check your inbox." 
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      message: "Failed to resend verification email", 
      error: error.message 
    });
  }
};

// Login user with security checks
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: "Account is temporarily locked due to multiple failed login attempts. Please try again later." 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email with OTP before logging in. Check your inbox for the verification code.",
        requiresVerification: true,
        email: user.email
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      message: "Login successful", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        fitnessLevel: user.fitnessLevel,
        goal: user.goal
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  });
  res.json({ message: "Logged out successfully" });
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Verify OTP
    const verification = user.verifyOTP(otp);

    if (!verification.success) {
      await user.save(); // Save incremented attempts
      return res.status(400).json({ message: verification.message });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ 
      message: "Email verified successfully! You can now login.",
      success: true 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "OTP verification failed", 
      error: error.message 
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Yoga Planner',
      message: `Hello ${user.name},\n\nYour new verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nYoga Planner Team`
    });

    res.json({ 
      message: "OTP has been resent to your email",
      success: true 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to resend OTP", 
      error: error.message 
    });
  }
};

// Forgot password - send reset link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ 
        message: "If a user with that email exists, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
      res.json({ 
        message: "If a user with that email exists, a password reset link has been sent." 
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      console.error("Password reset email failed:", emailError);
      return res.status(500).json({ 
        message: "Failed to send password reset email. Please try again." 
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      message: "Failed to process password reset request", 
      error: error.message 
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired password reset token" 
      });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Send confirmation email
    await sendEmail(
      user.email,
      "🔒 Password Reset Successful",
      `Hi ${user.name},\n\nYour password has been successfully reset.\n\nIf you didn't make this change, please contact us immediately.\n\n- Yoga Planner App Team`
    );

    res.json({ 
      message: "Password reset successful! You can now log in with your new password." 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      message: "Password reset failed", 
      error: error.message 
    });
  }
};

// Update user profile (protected route)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, age, fitnessLevel, goal } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: user._id } 
      });
      
      if (emailExists) {
        return res.status(400).json({ 
          message: 'Email is already in use by another account' 
        });
      }
      
      // If email is changed, update it (verification disabled)
      user.email = email;
      // user.isVerified = false; // Disabled verification
      
      // const verificationToken = user.generateVerificationToken();
      // const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
      
      // await sendVerificationEmail(email, name || user.name, verificationUrl);
    }

    // Check if new phone is already taken by another user
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ 
        phone, 
        _id: { $ne: user._id } 
      });
      
      if (phoneExists) {
        return res.status(400).json({ 
          message: 'Phone number is already in use by another account' 
        });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.fitnessLevel = fitnessLevel || user.fitnessLevel;
    user.goal = goal || user.goal;

    await user.save();

    res.json({
      message: email && email !== req.user.email 
        ? 'Profile updated successfully. Please verify your new email address.' 
        : 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        fitnessLevel: user.fitnessLevel,
        goal: user.goal,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};