const express = require('express');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Validation rules
const createDoctorProfileValidation = [
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('bio').optional().isLength({ max: 1000 }).withMessage('Bio cannot be more than 1000 characters'),
  body('languages').optional().isArray().withMessage('Languages must be an array'),
  body('consultationTypes').optional().isArray().withMessage('Consultation types must be an array')
];

const updateDoctorProfileValidation = [
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('bio').optional().isLength({ max: 1000 }).withMessage('Bio cannot be more than 1000 characters')
];

// @route   GET /api/doctors
// @desc    Get all doctors with filters
// @access  Public
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const { 
      specialization, 
      minRating, 
      maxFee, 
      isAvailable, 
      page = 1, 
      limit = 10,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isVerified: true };
    
    if (specialization) {
      filter.specialization = new RegExp(specialization, 'i');
    }
    
    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    if (maxFee) {
      filter.consultationFee = { $lte: parseFloat(maxFee) };
    }
    
    if (isAvailable === 'true') {
      filter.isAvailable = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const doctors = await Doctor.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name profile.profilePicture');

    const total = await Doctor.countDocuments(filter);

    res.json({
      success: true,
      doctors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors'
    });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email profile.profilePicture')
      .populate('reviews.patient', 'name profile.profilePicture');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor'
    });
  }
});

// @route   POST /api/doctors/profile
// @desc    Create doctor profile
// @access  Private (Doctor only)
router.post('/profile', authenticateToken, authorize('doctor'), createDoctorProfileValidation, validate, sanitizeInput, async (req, res) => {
  try {
    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists'
      });
    }

    const doctorData = {
      user: req.user._id,
      ...req.body
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    // Update user role if not already doctor
    if (req.user.role !== 'doctor') {
      await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });
    }

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      doctor
    });
  } catch (error) {
    console.error('Create doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating doctor profile'
    });
  }
});

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private (Doctor only)
router.put('/profile', authenticateToken, authorize('doctor'), updateDoctorProfileValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating doctor profile'
    });
  }
});

// @route   GET /api/doctors/profile/me
// @desc    Get current doctor's profile
// @access  Private (Doctor only)
router.get('/profile/me', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email profile.profilePicture');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor profile'
    });
  }
});

// @route   PUT /api/doctors/availability
// @desc    Update doctor availability
// @access  Private (Doctor only)
router.put('/availability', authenticateToken, authorize('doctor'), sanitizeInput, async (req, res) => {
  try {
    const { availability } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: { availability } },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: doctor.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating availability'
    });
  }
});

// @route   POST /api/doctors/:id/review
// @desc    Add review for doctor
// @access  Private
router.post('/:id/review', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot be more than 500 characters')
], validate, sanitizeInput, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctorId = req.params.id;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if user already reviewed this doctor
    const existingReview = doctor.reviews.find(review => 
      review.patient.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this doctor'
      });
    }

    // Add review
    await doctor.addReview(req.user._id, rating, comment);

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/doctors/specializations
// @desc    Get all specializations
// @access  Public
router.get('/specializations/list', async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization', { isVerified: true });
    
    res.json({
      success: true,
      specializations: specializations.sort()
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching specializations'
    });
  }
});

module.exports = router;
