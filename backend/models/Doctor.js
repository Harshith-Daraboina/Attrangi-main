const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience in years is required'],
    min: [0, 'Experience cannot be negative']
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date
  }],
  languages: [{
    type: String,
    trim: true
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  availability: {
    monday: [{
      start: String,
      end: String
    }],
    tuesday: [{
      start: String,
      end: String
    }],
    wednesday: [{
      start: String,
      end: String
    }],
    thursday: [{
      start: String,
      end: String
    }],
    friday: [{
      start: String,
      end: String
    }],
    saturday: [{
      start: String,
      end: String
    }],
    sunday: [{
      start: String,
      end: String
    }]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    maxlength: [500, 'Verification notes cannot be more than 500 characters']
  },
  verifiedAt: {
    type: Date
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActiveToday: {
    type: Boolean,
    default: false
  },
  consultationTypes: [{
    type: String,
    enum: ['video', 'in-person', 'phone'],
    default: ['video']
  }],
  maxPatientsPerDay: {
    type: Number,
    default: 10
  },
  currentPatientsCount: {
    type: Number,
    default: 0
  },
  // Financial/Payment Details
  paymentDetails: {
    upiId: {
      type: String,
      trim: true
    },
    phonePeId: {
      type: String,
      trim: true
    },
    bankAccount: {
      accountNumber: {
        type: String,
        trim: true
      },
      ifscCode: {
        type: String,
        trim: true
      },
      bankName: {
        type: String,
        trim: true
      },
      accountHolderName: {
        type: String,
        trim: true
      }
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    gstNumber: {
      type: String,
      trim: true
    }
  },
  // Document verification
  documents: {
    licenseDocument: {
      fileName: String,
      cloudinaryUrl: String,
      cloudinaryPublicId: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false }
    },
    identityDocument: {
      fileName: String,
      cloudinaryUrl: String,
      cloudinaryPublicId: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false }
    },
    degreeCertificate: {
      fileName: String,
      cloudinaryUrl: String,
      cloudinaryPublicId: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false }
    }
  },
  // Profile completion tracking
  profileCompletion: {
    personalInfo: { type: Boolean, default: false },
    professionalDetails: { type: Boolean, default: false },
    specialization: { type: Boolean, default: false },
    availability: { type: Boolean, default: false },
    paymentDetails: { type: Boolean, default: false },
    documents: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Index for better query performance
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'rating.average': -1 });
doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ isVerified: 1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return this.user ? this.user.name : 'Dr. Unknown';
});

// Method to update rating
doctorSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
  return this.save();
};

// Method to add review
doctorSchema.methods.addReview = function(patientId, rating, comment) {
  this.reviews.push({
    patient: patientId,
    rating,
    comment
  });
  return this.updateRating();
};

// Method to check availability for a specific time
doctorSchema.methods.isAvailableAt = function(day, time) {
  const dayAvailability = this.availability[day.toLowerCase()];
  if (!dayAvailability || dayAvailability.length === 0) return false;
  
  return dayAvailability.some(slot => {
    return time >= slot.start && time <= slot.end;
  });
};

// Method to calculate profile completion percentage
doctorSchema.methods.getProfileCompletionPercentage = function() {
  // Only count core requirements (documents are optional)
  const coreCompletionFields = [
    this.profileCompletion.personalInfo,
    this.profileCompletion.professionalDetails,
    this.profileCompletion.specialization,
    this.profileCompletion.availability,
    this.profileCompletion.paymentDetails
  ];
  
  const completedFields = coreCompletionFields.filter(field => field === true).length;
  return Math.round((completedFields / coreCompletionFields.length) * 100);
};

// Method to update profile completion status
doctorSchema.methods.updateProfileCompletion = function() {
  // Personal Info
  this.profileCompletion.personalInfo = !!(this.user && this.user.name && this.user.email);
  
  // Professional Details
  this.profileCompletion.professionalDetails = !!(this.licenseNumber && this.experience && this.education && this.education.length > 0);
  
  // Specialization
  this.profileCompletion.specialization = !!(this.specialization && this.languages && this.languages.length > 0);
  
  // Availability
  const hasAvailability = Object.values(this.availability).some(daySlots => daySlots && daySlots.length > 0);
  this.profileCompletion.availability = hasAvailability;
  
  // Payment Details
  const hasPaymentDetails = !!(this.paymentDetails && (
    this.paymentDetails.upiId || 
    this.paymentDetails.phonePeId || 
    (this.paymentDetails.bankAccount && this.paymentDetails.bankAccount.accountNumber)
  ));
  this.profileCompletion.paymentDetails = hasPaymentDetails;
  
  // Documents (optional - check if any documents are uploaded)
  const hasDocuments = !!(this.documents && (
    this.documents.licenseDocument.cloudinaryUrl ||
    this.documents.identityDocument.cloudinaryUrl ||
    this.documents.degreeCertificate.cloudinaryUrl
  ));
  this.profileCompletion.documents = hasDocuments;
  
  // Auto-verify if all core requirements are met (excluding documents)
  const coreRequirements = [
    this.profileCompletion.personalInfo,
    this.profileCompletion.professionalDetails,
    this.profileCompletion.specialization,
    this.profileCompletion.availability,
    this.profileCompletion.paymentDetails
  ];
  
  const allCoreRequirementsMet = coreRequirements.every(req => req === true);
  
  if (allCoreRequirementsMet && !this.isVerified) {
    this.isVerified = true;
    this.verificationStatus = 'verified';
    this.verifiedAt = new Date();
  }
  
  return this.save();
};

// Populate user data when querying
doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email profile.profilePicture'
  });
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
