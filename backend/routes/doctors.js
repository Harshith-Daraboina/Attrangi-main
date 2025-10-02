const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Configure multer for memory storage (Cloudinary will handle file storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only PDF, JPG, JPEG, PNG files
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  console.log('File filter check:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extname: path.extname(file.originalname).toLowerCase(),
    extnameMatch: extname,
    mimetypeMatch: mimetype
  });
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, PNG files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 20MB default
    files: 3, // Maximum 3 files
    fields: 10, // Maximum 10 fields
    fieldSize: 2 * 1024 * 1024, // 2MB per field
  },
  fileFilter: fileFilter
});

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

// @route   PUT /api/doctors/payment-details
// @desc    Update payment details
// @access  Private (Doctor only)
router.put('/payment-details', authenticateToken, authorize('doctor'), [
  body('upiId').optional().isString().withMessage('UPI ID must be a string'),
  body('phonePeId').optional().isString().withMessage('PhonePe ID must be a string'),
  body('panNumber').optional().isString().withMessage('PAN number must be a string'),
  body('gstNumber').optional().isString().withMessage('GST number must be a string'),
  body('bankAccount.accountNumber').optional().isString().withMessage('Account number must be a string'),
  body('bankAccount.ifscCode').optional().isString().withMessage('IFSC code must be a string'),
  body('bankAccount.bankName').optional().isString().withMessage('Bank name must be a string'),
  body('bankAccount.accountHolderName').optional().isString().withMessage('Account holder name must be a string')
], validate, sanitizeInput, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Update payment details
    doctor.paymentDetails = {
      ...doctor.paymentDetails,
      ...req.body
    };

    // Update profile completion
    await doctor.updateProfileCompletion();

    await doctor.save();

    res.json({
      success: true,
      message: 'Payment details updated successfully',
      doctor: {
        paymentDetails: doctor.paymentDetails,
        profileCompletion: doctor.profileCompletion,
        completionPercentage: doctor.getProfileCompletionPercentage()
      }
    });
  } catch (error) {
    console.error('Update payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment details'
    });
  }
});

// @route   PUT /api/doctors/active-today
// @desc    Toggle active today status
// @access  Private (Doctor only)
router.put('/active-today', authenticateToken, authorize('doctor'), sanitizeInput, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Toggle active today status
    doctor.isActiveToday = !doctor.isActiveToday;
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor is now ${doctor.isActiveToday ? 'active' : 'inactive'} today`,
      isActiveToday: doctor.isActiveToday
    });
  } catch (error) {
    console.error('Toggle active today error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating active status'
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

// @route   POST /api/doctors/documents/upload
// @desc    Upload verification documents to Cloudinary
// @access  Private (Doctor only)
router.post('/documents/upload', authenticateToken, authorize('doctor'), (req, res, next) => {
  upload.fields([
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'identityDocument', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      
      // Handle specific limit errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 20MB per file.'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 3 files allowed.'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field. Please use the correct field names.'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Upload request received:', {
      user: req.user._id,
      files: req.files,
      body: req.body,
      headers: req.headers
    });

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const uploadedFiles = {};
    const files = req.files;

    // Process each uploaded file
    for (const [fieldName, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        
        console.log(`Processing file ${fieldName}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname
        });
        
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
              folder: 'attarangi/documents',
              resource_type: 'auto',
              public_id: `${fieldName}_${doctor._id}_${Date.now()}`,
              transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            }
          );

          uploadedFiles[fieldName] = {
            fileName: file.originalname,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            uploadedAt: new Date(),
            verified: false
          };

          console.log(`File ${fieldName} uploaded to Cloudinary:`, result.secure_url);
        } catch (cloudinaryError) {
          console.error(`Cloudinary upload error for ${fieldName}:`, cloudinaryError);
          return res.status(500).json({
            success: false,
            message: `Failed to upload ${fieldName} to cloud storage: ${cloudinaryError.message}`
          });
        }
      }
    }

    // Update doctor documents
    doctor.documents = {
      ...doctor.documents,
      ...uploadedFiles
    };

    // Update profile completion
    await doctor.updateProfileCompletion();
    await doctor.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: doctor.documents,
      profileCompletion: doctor.profileCompletion
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading documents'
    });
  }
});

// @route   GET /api/doctors/documents
// @desc    Get doctor's uploaded documents
// @access  Private (Doctor only)
router.get('/documents', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      documents: doctor.documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents'
    });
  }
});

// @route   DELETE /api/doctors/documents/:type
// @desc    Delete a specific document from Cloudinary and database
// @access  Private (Doctor only)
router.delete('/documents/:type', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['licenseDocument', 'identityDocument', 'degreeCertificate'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Delete from Cloudinary if it exists
    if (doctor.documents[type] && doctor.documents[type].cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(doctor.documents[type].cloudinaryPublicId);
        console.log(`Deleted file from Cloudinary: ${doctor.documents[type].cloudinaryPublicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database cleanup even if Cloudinary deletion fails
      }
    }

    // Remove document from database
    doctor.documents[type] = {
      fileName: null,
      cloudinaryUrl: null,
      cloudinaryPublicId: null,
      uploadedAt: null,
      verified: false
    };

    // Update profile completion
    await doctor.updateProfileCompletion();
    await doctor.save();

    res.json({
      success: true,
      message: 'Document deleted successfully',
      documents: doctor.documents
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting document'
    });
  }
});

module.exports = router;
