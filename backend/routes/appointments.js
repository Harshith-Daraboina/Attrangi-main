const express = require('express');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const { authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Validation rules
const createAppointmentValidation = [
  body('doctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('date').isISO8601().withMessage('Valid appointment date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required (HH:MM)'),
  body('type').isIn(['video', 'in-person', 'phone']).withMessage('Invalid appointment type'),
  body('duration').optional().isInt({ min: 15, max: 120 }).withMessage('Duration must be between 15 and 120 minutes')
];

const updateAppointmentValidation = [
  body('date').optional().isISO8601().withMessage('Valid appointment date is required'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required (HH:MM)'),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']).withMessage('Invalid status')
];

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', createAppointmentValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { doctor, date, time, type, duration = 45, notes, symptoms } = req.body;

    // Check if doctor exists and is available
    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (!doctorDoc.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available for new appointments'
      });
    }

    // Check if appointment time is available
    const appointmentDateTime = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: appointmentDateTime,
      time,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointmentData = {
      patient: req.user._id,
      doctor,
      date: appointmentDateTime,
      time,
      type,
      duration,
      payment: {
        amount: doctorDoc.consultationFee
      }
    };

    if (notes) appointmentData.notes = { patientNotes: notes };
    if (symptoms) appointmentData.symptoms = symptoms;

    // Generate meeting link for video appointments
    if (type === 'video') {
      appointmentData.meetingLink = `https://meet.attarangi.com/${Date.now()}-${req.user._id}`;
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate the appointment data
    await appointment.populate([
      {
        path: 'patient',
        select: 'name email profile.profilePicture'
      },
      {
        path: 'doctor',
        select: 'specialization consultationFee',
        populate: {
          path: 'user',
          select: 'name profile.profilePicture'
        }
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating appointment'
    });
  }
});

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const { 
      status, 
      type, 
      page = 1, 
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter based on user role
    let filter = {};
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add additional filters
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate([
        {
          path: 'patient',
          select: 'name email profile.profilePicture'
        },
        {
          path: 'doctor',
          select: 'specialization consultationFee',
          populate: {
            path: 'user',
            select: 'name profile.profilePicture'
          }
        }
      ]);

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate([
        {
          path: 'patient',
          select: 'name email profile.profilePicture'
        },
        {
          path: 'doctor',
          select: 'specialization consultationFee',
          populate: {
            path: 'user',
            select: 'name profile.profilePicture'
          }
        }
      ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = req.user.role === 'admin' || 
                     appointment.patient._id.toString() === req.user._id.toString() ||
                     appointment.doctor.user._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', updateAppointmentValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to update
    const canUpdate = req.user.role === 'admin' || 
                     appointment.patient.toString() === req.user._id.toString() ||
                     appointment.doctor.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'patient',
        select: 'name email profile.profilePicture'
      },
      {
        path: 'doctor',
        select: 'specialization consultationFee',
        populate: {
          path: 'user',
          select: 'name profile.profilePicture'
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment'
    });
  }
});

// @route   POST /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.post('/:id/cancel', sanitizeInput, async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled at this time'
      });
    }

    // Check if user has permission to cancel
    const canCancel = req.user.role === 'admin' || 
                     appointment.patient.toString() === req.user._id.toString() ||
                     appointment.doctor.toString() === req.user._id.toString();

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate refund amount
    const refundAmount = appointment.calculateRefund();

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancellation = {
      cancelledBy: req.user._id,
      reason,
      cancelledAt: new Date(),
      refundAmount,
      refundStatus: refundAmount > 0 ? 'pending' : 'processed'
    };

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      refundAmount
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling appointment'
    });
  }
});

// @route   POST /api/appointments/:id/reschedule
// @desc    Reschedule appointment
// @access  Private
router.post('/:id/reschedule', [
  body('date').isISO8601().withMessage('Valid appointment date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required (HH:MM)')
], validate, sanitizeInput, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be rescheduled
    if (!appointment.canBeRescheduled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be rescheduled at this time'
      });
    }

    // Check if user has permission to reschedule
    const canReschedule = req.user.role === 'admin' || 
                         appointment.patient.toString() === req.user._id.toString() ||
                         appointment.doctor.toString() === req.user._id.toString();

    if (!canReschedule) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if new time slot is available
    const appointmentDateTime = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      date: appointmentDateTime,
      time,
      status: { $in: ['scheduled', 'confirmed'] },
      _id: { $ne: appointment._id }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Update appointment
    appointment.date = appointmentDateTime;
    appointment.time = time;
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully'
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rescheduling appointment'
    });
  }
});

// @route   GET /api/appointments/doctor/:doctorId/availability
// @desc    Get doctor's available time slots
// @access  Public
router.get('/doctor/:doctorId/availability', sanitizeInput, async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.doctorId;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    // Get doctor's availability for the day
    const dayAvailability = doctor.availability[dayName] || [];
    
    // Get booked appointments for the day
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedAppointments.map(apt => apt.time);
    
    // Filter available slots
    const availableSlots = dayAvailability.filter(slot => 
      !bookedTimes.includes(slot.start)
    );

    res.json({
      success: true,
      availableSlots,
      doctorAvailability: dayAvailability
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor availability'
    });
  }
});

module.exports = router;
