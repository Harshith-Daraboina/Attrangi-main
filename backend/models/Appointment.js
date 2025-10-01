const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 45, // minutes
    min: [15, 'Duration must be at least 15 minutes'],
    max: [120, 'Duration cannot exceed 120 minutes']
  },
  type: {
    type: String,
    enum: ['video', 'in-person', 'phone'],
    required: [true, 'Appointment type is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  location: {
    type: String,
    required: function() {
      return this.type === 'in-person';
    }
  },
  notes: {
    patientNotes: String,
    doctorNotes: String,
    prescription: String,
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  },
  symptoms: [String],
  diagnosis: [String],
  treatment: [String],
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: String,
    transactionId: String,
    paidAt: Date
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    }
  }],
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  rating: {
    patientRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    doctorRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1 });

// Virtual for appointment duration in hours
appointmentSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentTime = new Date(this.date);
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' || this.status === 'confirmed' && hoursUntilAppointment > 2;
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentTime = new Date(this.date);
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' || this.status === 'confirmed' && hoursUntilAppointment > 24;
};

// Method to generate meeting link for video appointments
appointmentSchema.methods.generateMeetingLink = function() {
  if (this.type === 'video') {
    const meetingId = `attarangi-${this._id}-${Date.now()}`;
    this.meetingLink = `https://meet.attarangi.com/${meetingId}`;
  }
  return this.meetingLink;
};

// Method to calculate refund amount
appointmentSchema.methods.calculateRefund = function() {
  const now = new Date();
  const appointmentTime = new Date(this.date);
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  if (hoursUntilAppointment > 24) {
    return this.payment.amount; // Full refund
  } else if (hoursUntilAppointment > 2) {
    return this.payment.amount * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

// Populate related data when querying
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'name email profile.profilePicture'
  }).populate({
    path: 'doctor',
    select: 'specialization consultationFee',
    populate: {
      path: 'user',
      select: 'name profile.profilePicture'
    }
  });
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
