const express = require('express');
const { body } = require('express-validator');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validation');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'doctor', 'caregiver', 'therapist']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const verifyEmailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { name, email, password, role = 'patient' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      authProvider: 'local'
    });

    // Generate email verification OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save();

    // TODO: Send OTP via email
    console.log(`Email verification OTP for ${email}: ${otp}`);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', verifyEmailValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend email verification OTP
// @access  Public
router.post('/resend-otp', forgotPasswordValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const otp = user.generateEmailVerificationOTP();
    await user.save();

    // TODO: Send OTP via email
    console.log(`Resent email verification OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.updateLastLogin();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/google-login
// @desc    Google OAuth login
// @access  Public
router.post('/google-login', sanitizeInput, async (req, res) => {
  try {
    const { googleId, email, name, firstName, lastName, isEmailVerified } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Google ID and email are required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: name || `${firstName} ${lastName}`,
        email,
        googleId,
        authProvider: 'google',
        isEmailVerified: isEmailVerified || true,
        role: 'patient'
      });
      await user.save();
    }

    // Update last login
    await user.updateLastLogin();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete
      },
      token
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post('/forgot-password', forgotPasswordValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = user.generatePasswordResetOTP();
    await user.save();

    // TODO: Send OTP via email
    console.log(`Password reset OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: 'Password reset OTP sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending password reset OTP'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', resetPasswordValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ 
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // If user is a doctor, get doctor profile
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        doctorProfile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // You could implement token blacklisting here if needed
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

module.exports = router;
