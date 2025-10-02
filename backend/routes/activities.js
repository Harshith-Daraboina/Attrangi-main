const express = require('express');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const { authorize } = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

const router = express.Router();

// Validation rules
const createActivityValidation = [
  body('title').trim().notEmpty().withMessage('Activity title is required'),
  body('description').trim().notEmpty().withMessage('Activity description is required'),
  body('category').isIn(['meditation', 'exercise', 'journaling', 'breathing', 'social', 'cognitive', 'creative', 'other']).withMessage('Invalid category'),
  body('assignedTo').isMongoId().withMessage('Valid user ID is required'),
  body('duration').isInt({ min: 1, max: 180 }).withMessage('Duration must be between 1 and 180 minutes'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level')
];

const updateActivityValidation = [
  body('title').optional().trim().notEmpty().withMessage('Activity title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Activity description cannot be empty'),
  body('status').optional().isIn(['assigned', 'in-progress', 'completed', 'skipped']).withMessage('Invalid status')
];

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private (Doctor only)
router.post('/', authorize('doctor'), createActivityValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      assignedBy: req.user._id
    };

    const activity = new Activity(activityData);
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating activity'
    });
  }
});

// @route   GET /api/activities
// @desc    Get user's activities
// @access  Private
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const { 
      status, 
      category, 
      assignedBy,
      page = 1, 
      limit = 10,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;

    // Build filter based on user role
    let filter = {};
    if (req.user.role === 'patient') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.assignedBy = req.user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add additional filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (assignedBy) filter.assignedBy = assignedBy;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      activities,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities'
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Private
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user has access to this activity
    const hasAccess = req.user.role === 'admin' || 
                     activity.assignedTo.toString() === req.user._id.toString() ||
                     activity.assignedBy.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity'
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
router.put('/:id', updateActivityValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user has permission to update
    const canUpdate = req.user.role === 'admin' || 
                     activity.assignedBy.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Activity updated successfully',
      activity: updatedActivity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating activity'
    });
  }
});

// @route   POST /api/activities/:id/complete
// @desc    Mark activity as completed
// @access  Private
router.post('/:id/complete', [
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot be more than 500 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback cannot be more than 500 characters'),
  body('moodBefore').optional().isInt({ min: 1, max: 10 }).withMessage('Mood before must be between 1 and 10'),
  body('moodAfter').optional().isInt({ min: 1, max: 10 }).withMessage('Mood after must be between 1 and 10')
], validate, sanitizeInput, async (req, res) => {
  try {
    const { notes, rating, feedback, moodBefore, moodAfter } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user has permission to complete this activity
    if (activity.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark as completed
    await activity.markCompleted(notes, rating, feedback, moodBefore, moodAfter);

    res.json({
      success: true,
      message: 'Activity marked as completed',
      activity
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing activity'
    });
  }
});

// @route   POST /api/activities/:id/start
// @desc    Mark activity as in progress
// @access  Private
router.post('/:id/start', sanitizeInput, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user has permission to start this activity
    if (activity.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark as in progress
    await activity.markInProgress();

    res.json({
      success: true,
      message: 'Activity started',
      activity
    });
  } catch (error) {
    console.error('Start activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting activity'
    });
  }
});

// @route   POST /api/activities/:id/skip
// @desc    Skip activity
// @access  Private
router.post('/:id/skip', [
  body('reason').optional().isLength({ max: 200 }).withMessage('Reason cannot be more than 200 characters')
], validate, sanitizeInput, async (req, res) => {
  try {
    const { reason } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user has permission to skip this activity
    if (activity.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Skip activity
    await activity.skipActivity(reason);

    res.json({
      success: true,
      message: 'Activity skipped',
      activity
    });
  } catch (error) {
    console.error('Skip activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while skipping activity'
    });
  }
});

// @route   GET /api/activities/patient/:patientId
// @desc    Get activities for a specific patient (Doctor only)
// @access  Private (Doctor only)
router.get('/patient/:patientId', authorize('doctor'), sanitizeInput, async (req, res) => {
  try {
    const { 
      status, 
      category, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {
      assignedTo: req.params.patientId,
      assignedBy: req.user._id
    };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find(filter)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      activities,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get patient activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patient activities'
    });
  }
});

// @route   GET /api/activities/stats/summary
// @desc    Get activity statistics
// @access  Private
router.get('/stats/summary', sanitizeInput, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'patient') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.assignedBy = req.user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const [
      totalActivities,
      completedActivities,
      pendingActivities,
      overdueActivities
    ] = await Promise.all([
      Activity.countDocuments(filter),
      Activity.countDocuments({ ...filter, status: 'completed' }),
      Activity.countDocuments({ ...filter, status: { $in: ['assigned', 'in-progress'] } }),
      Activity.countDocuments({ 
        ...filter, 
        status: { $in: ['assigned', 'in-progress'] },
        dueDate: { $lt: new Date() }
      })
    ]);

    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    res.json({
      success: true,
      stats: {
        totalActivities,
        completedActivities,
        pendingActivities,
        overdueActivities,
        completionRate: Math.round(completionRate * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity statistics'
    });
  }
});

module.exports = router;
