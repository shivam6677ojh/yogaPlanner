import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  updateProfile,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate,
  validateEmail,
  validatePasswordReset 
} from "../middleware/validators.js";
import { 
  authLimiter, 
  passwordResetLimiter, 
  emailVerificationLimiter 
} from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes with rate limiting
router.post("/register", authLimiter, validateRegister, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.post("/logout", logoutUser);

// Password reset routes
router.post("/forgot-password", passwordResetLimiter, validateEmail, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, validatePasswordReset, resetPassword);

// Protected routes
router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    age: req.user.age,
    fitnessLevel: req.user.fitnessLevel,
    goal: req.user.goal,
    isVerified: req.user.isVerified,
    lastLogin: req.user.lastLogin
  });
});
router.put('/profile', protect, validateProfileUpdate, updateProfile);

export default router;
