const express = require('express');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const { checkOwnership } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('role').optional().isIn(['patient', 'doctor', 'caregiver']).withMessage('Invalid role'),
  body('profile.firstName').optional().trim().isLength({ max: 25 }).withMessage('First name cannot be more than 25 characters'),
  body('profile.lastName').optional().trim().isLength({ max: 25 }).withMessage('Last name cannot be more than 25 characters'),
  body('profile.phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('profile.gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('profile.dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
];

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfileValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const updates = req.body;
    
    // Check if profile is being completed
    const requiredFields = ['profile.firstName', 'profile.lastName', 'profile.dateOfBirth', 'profile.gender'];
    const hasRequiredFields = requiredFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], updates);
      return value !== undefined && value !== null && value !== '';
    });
    
    if (hasRequiredFields) {
      updates.isProfileComplete = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', changePasswordValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get dashboard data based on user role
    let dashboardData = {
      user: user.toJSON(),
      stats: {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedActivities: 0,
        pendingActivities: 0
      }
    };

    // Add role-specific data
    if (user.role === 'patient') {
      // Get patient-specific stats
      const Appointment = require('../models/Appointment');
      const Activity = require('../models/Activity');
      
      const [totalAppointments, upcomingAppointments, completedActivities, pendingActivities] = await Promise.all([
        Appointment.countDocuments({ patient: user._id }),
        Appointment.countDocuments({ 
          patient: user._id, 
          status: { $in: ['scheduled', 'confirmed'] },
          date: { $gte: new Date() }
        }),
        Activity.countDocuments({ 
          assignedTo: user._id, 
          'completion.isCompleted': true 
        }),
        Activity.countDocuments({ 
          assignedTo: user._id, 
          status: { $in: ['assigned', 'in-progress'] }
        })
      ]);

      dashboardData.stats = {
        totalAppointments,
        upcomingAppointments,
        completedActivities,
        pendingActivities
      };
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    // Soft delete - deactivate account instead of deleting
    await User.findByIdAndUpdate(req.user._id, { 
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}` // Make email unique for potential reactivation
    });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    // TODO: Implement notifications system
    const notifications = [];

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

module.exports = router;
