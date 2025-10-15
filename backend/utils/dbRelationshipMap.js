/**
 * Database Relationship Mapping for Attarangi Mental Health App
 * This file provides a comprehensive view of all database models and their relationships
 */

const relationshipMap = {
  // ============ CORE MODELS ============
  
  User: {
    collection: 'users',
    description: 'Core user model for all roles (patient, doctor, caregiver)',
    fields: {
      _id: 'ObjectId (Primary Key)',
      name: 'String',
      email: 'String (Unique)',
      password: 'String (Hashed)',
      role: 'String (patient | doctor | caregiver)',
      phone: 'String',
      authProvider: 'String (local | google)',
      googleId: 'String',
      isEmailVerified: 'Boolean',
      profile: {
        firstName: 'String',
        lastName: 'String',
        dateOfBirth: 'Date',
        gender: 'String',
        phone: 'String',
        address: 'Object',
        emergencyContact: 'Object',
        profilePicture: 'String',
        bio: 'String',
        preferences: 'Object'
      },
      isProfileComplete: 'Boolean',
      isActive: 'Boolean',
      lastLogin: 'Date',
      loginCount: 'Number',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      oneToOne: [
        { model: 'Doctor', field: 'user', description: 'Doctor profile linked to user' },
        { model: 'Subscription', field: 'user', description: 'User subscription plan' }
      ],
      oneToMany: [
        { model: 'Appointment', field: 'patient', description: 'Appointments as patient' },
        { model: 'Appointment', field: 'doctor', description: 'Appointments as doctor (via Doctor model)' },
        { model: 'Activity', field: 'assignedTo', description: 'Activities assigned to user' },
        { model: 'Activity', field: 'assignedBy', description: 'Activities created by user' },
        { model: 'Chat', field: 'participants', description: 'Chat conversations user is part of' },
        { model: 'Resource', field: 'uploadedBy', description: 'Resources uploaded by user' },
        { model: 'DoctorAvailability', field: 'doctor', description: 'Doctor availability slots' },
        { model: 'Payment', field: 'user', description: 'Payments made by user' },
        { model: 'SessionLog', field: 'user', description: 'Session logs as participant' },
        { model: 'SessionLog', field: 'doctor', description: 'Session logs as doctor' },
        { model: 'AIBotLog', field: 'user', description: 'AI chatbot interactions' },
        { model: 'PreSessionResponse', field: 'patient', description: 'Pre-session questionnaire responses' },
        { model: 'MoodJournal', field: 'patient', description: 'Mood journal entries' }
      ]
    }
  },

  Doctor: {
    collection: 'doctors',
    description: 'Extended profile for users with doctor role',
    fields: {
      _id: 'ObjectId (Primary Key)',
      user: 'ObjectId (Foreign Key -> User)',
      specialization: 'String',
      licenseNumber: 'String (Unique)',
      experience: 'Number',
      education: 'Array of Objects',
      certifications: 'Array of Objects',
      languages: 'Array of Strings',
      consultationFee: 'Number',
      bio: 'String',
      availability: 'Object (day-wise schedule)',
      rating: {
        average: 'Number',
        count: 'Number'
      },
      reviews: 'Array of Objects',
      isVerified: 'Boolean',
      verificationStatus: 'String (pending | under_review | verified | rejected)',
      isAvailable: 'Boolean',
      isActiveToday: 'Boolean',
      consultationTypes: 'Array (video | in-person | phone)',
      paymentDetails: 'Object',
      documents: 'Object (verification documents)',
      profileCompletion: 'Object',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'user', description: 'Associated user account' }
      ],
      oneToMany: [
        { model: 'Appointment', field: 'doctor', description: 'Doctor\'s appointments' },
        { model: 'DoctorAvailability', field: 'doctor', description: 'Doctor\'s availability slots' }
      ]
    }
  },

  // ============ APPOINTMENT & SCHEDULING ============

  Appointment: {
    collection: 'appointments',
    description: 'Appointment bookings between patients and doctors',
    fields: {
      _id: 'ObjectId (Primary Key)',
      patient: 'ObjectId (Foreign Key -> User)',
      doctor: 'ObjectId (Foreign Key -> Doctor)',
      date: 'Date',
      time: 'String',
      duration: 'Number (minutes)',
      type: 'String (video | in-person | phone)',
      status: 'String (scheduled | confirmed | in-progress | completed | cancelled | no-show)',
      meetingLink: 'String',
      location: 'String',
      notes: 'Object',
      symptoms: 'Array of Strings',
      diagnosis: 'Array of Strings',
      treatment: 'Array of Strings',
      payment: 'Object',
      reminders: 'Array of Objects',
      cancellation: 'Object',
      rating: 'Object',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'patient', description: 'Patient who booked' },
        { model: 'Doctor', field: 'doctor', description: 'Doctor for appointment' }
      ],
      oneToOne: [
        { model: 'VideoCall', field: 'appointment', description: 'Video call session' }
      ],
      oneToMany: [
        { model: 'Payment', field: 'appointment', description: 'Payment for appointment' },
        { model: 'SessionLog', field: 'appointment', description: 'Session logs' },
        { model: 'PreSessionResponse', field: 'appointment', description: 'Pre-session questionnaire responses' }
      ]
    }
  },

  DoctorAvailability: {
    collection: 'doctoravailabilities',
    description: 'Doctor availability time slots',
    fields: {
      _id: 'ObjectId (Primary Key)',
      doctor: 'ObjectId (Foreign Key -> User)',
      date: 'Date',
      startTime: 'String (HH:MM)',
      endTime: 'String (HH:MM)',
      isActive: 'Boolean',
      isBooked: 'Boolean',
      slotDuration: 'Number (minutes)',
      consultationType: 'String (video | in-person | phone)',
      notes: 'String',
      breakTime: 'Array of Objects',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'doctor', description: 'Doctor who owns this slot' }
      ]
    }
  },

  // ============ ACTIVITIES & THERAPY ============

  Activity: {
    collection: 'activities',
    description: 'Therapeutic activities assigned by doctors to patients',
    fields: {
      _id: 'ObjectId (Primary Key)',
      title: 'String',
      description: 'String',
      category: 'String (meditation | exercise | journaling | breathing | social | cognitive | creative | other)',
      assignedBy: 'ObjectId (Foreign Key -> User - Doctor)',
      assignedTo: 'ObjectId (Foreign Key -> User - Patient)',
      instructions: 'Array of Objects',
      benefits: 'Array of Strings',
      duration: 'Number (minutes)',
      difficulty: 'String (beginner | intermediate | advanced)',
      dueDate: 'Date',
      completedAt: 'Date',
      status: 'String (assigned | in-progress | completed | skipped)',
      completion: 'Object (notes, rating, feedback, mood tracking)',
      recurrence: 'Object',
      resources: 'Array of Objects',
      tags: 'Array of Strings',
      isPublic: 'Boolean',
      template: 'ObjectId (Foreign Key -> ActivityTemplate)',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'assignedBy', description: 'Doctor who assigned activity' },
        { model: 'User', field: 'assignedTo', description: 'Patient assigned to activity' }
      ]
    }
  },

  // ============ MOOD & MENTAL HEALTH TRACKING ============

  MoodJournal: {
    collection: 'moodjournals',
    description: 'Daily mood tracking and journaling entries',
    fields: {
      _id: 'ObjectId (Primary Key)',
      patient: 'ObjectId (Foreign Key -> User)',
      mood: 'String (happy | sad | angry | anxious | neutral | excited | stressed | calm | frustrated | content)',
      intensity: 'Number (1-10 scale)',
      causeCategory: 'String (work | family | health | relationship | financial | social | other)',
      causeDetail: 'String (free text)',
      notes: 'String',
      activities: 'Array of Strings',
      gratitude: 'Array of Strings',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'patient', description: 'Patient who created entry' }
      ]
    }
  },

  // ============ COMMUNICATION ============

  Chat: {
    collection: 'chats',
    description: 'Chat conversations between users',
    fields: {
      _id: 'ObjectId (Primary Key)',
      participants: 'Array of ObjectIds (Foreign Keys -> User)',
      chatType: 'String (private | group)',
      name: 'String (for group chats)',
      description: 'String',
      messages: 'Array of Subdocuments',
      lastMessage: 'Object',
      unreadCount: 'Map of Numbers',
      isActive: 'Boolean',
      createdBy: 'ObjectId (Foreign Key -> User)',
      groupSettings: 'Object',
      metadata: 'Object',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToMany: [
        { model: 'User', field: 'participants', description: 'Users in conversation' }
      ],
      manyToOne: [
        { model: 'User', field: 'createdBy', description: 'User who created chat' }
      ]
    }
  },

  AIBotLog: {
    collection: 'aibotlogs',
    description: 'AI chatbot conversation logs',
    fields: {
      _id: 'ObjectId (Primary Key)',
      user: 'ObjectId (Foreign Key -> User)',
      message: 'String (user message)',
      response: 'String (bot response)',
      timestamp: 'Date',
      context: 'String (general | mood | activity | appointment | profile)',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'user', description: 'User who interacted with bot' }
      ]
    }
  },

  // ============ PAYMENT & SUBSCRIPTION ============

  Payment: {
    collection: 'payments',
    description: 'Payment transactions for appointments',
    fields: {
      _id: 'ObjectId (Primary Key)',
      appointment: 'ObjectId (Foreign Key -> Appointment)',
      user: 'ObjectId (Foreign Key -> User)',
      amount: 'Number (Decimal)',
      currency: 'String (default: INR)',
      paymentMethod: 'String (card | paypal | upi | wallet)',
      paymentStatus: 'String (pending | completed | failed | refunded)',
      transactionId: 'String (Unique)',
      paidAt: 'Date',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'Appointment', field: 'appointment', description: 'Appointment paid for' },
        { model: 'User', field: 'user', description: 'User who made payment' }
      ]
    }
  },

  Subscription: {
    collection: 'subscriptions',
    description: 'User subscription plans (free | pro)',
    fields: {
      _id: 'ObjectId (Primary Key)',
      user: 'ObjectId (Foreign Key -> User)',
      planType: 'String (free | pro)',
      startDate: 'Date',
      endDate: 'Date',
      status: 'String (active | expired | cancelled)',
      autoRenew: 'Boolean',
      paymentMethod: 'String',
      transactionId: 'String',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      oneToOne: [
        { model: 'User', field: 'user', description: 'User with subscription' }
      ]
    }
  },

  // ============ RESOURCES & CONTENT ============

  Resource: {
    collection: 'resources',
    description: 'Educational resources (ebooks, videos, documents)',
    fields: {
      _id: 'ObjectId (Primary Key)',
      title: 'String',
      description: 'String',
      type: 'String (ebook | video | document | audio | article | guide)',
      url: 'String',
      accessLevel: 'String (free | pro)',
      uploadedBy: 'ObjectId (Foreign Key -> User)',
      category: 'String',
      tags: 'Array of Strings',
      thumbnail: 'String',
      duration: 'Number (minutes)',
      fileSize: 'Number (bytes)',
      downloads: 'Number',
      views: 'Number',
      rating: 'Object',
      reviews: 'Array of Objects',
      isPublished: 'Boolean',
      isFeatured: 'Boolean',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'User', field: 'uploadedBy', description: 'User who uploaded resource' }
      ]
    }
  },

  // ============ VIDEO & SESSION MANAGEMENT ============

  VideoCall: {
    collection: 'videocalls',
    description: 'Video call sessions for appointments',
    fields: {
      _id: 'ObjectId (Primary Key)',
      appointment: 'ObjectId (Foreign Key -> Appointment - Unique)',
      roomId: 'String (Unique)',
      startedAt: 'Date',
      endedAt: 'Date',
      status: 'String (scheduled | ongoing | completed | missed)',
      participants: 'Array of Objects',
      duration: 'Number (minutes)',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      oneToOne: [
        { model: 'Appointment', field: 'appointment', description: 'Associated appointment' }
      ]
    }
  },

  SessionLog: {
    collection: 'sessionlogs',
    description: 'Detailed logs of therapy sessions',
    fields: {
      _id: 'ObjectId (Primary Key)',
      appointment: 'ObjectId (Foreign Key -> Appointment)',
      user: 'ObjectId (Foreign Key -> User - Patient)',
      doctor: 'ObjectId (Foreign Key -> User - Doctor)',
      sessionStart: 'Date',
      sessionEnd: 'Date',
      notes: 'String (session notes)',
      recordingUrl: 'String',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'Appointment', field: 'appointment', description: 'Associated appointment' },
        { model: 'User', field: 'user', description: 'Patient in session' },
        { model: 'User', field: 'doctor', description: 'Doctor conducting session' }
      ]
    }
  },

  // ============ PRE-SESSION QUESTIONNAIRES ============

  PreSessionQuestion: {
    collection: 'presessionquestions',
    description: 'Pre-session questionnaire questions',
    fields: {
      _id: 'ObjectId (Primary Key)',
      questionText: 'String',
      questionType: 'String (text | multiple-choice | scale | boolean)',
      options: 'Array of Strings',
      isActive: 'Boolean',
      order: 'Number',
      category: 'String (mood | symptoms | medication | general)',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      oneToMany: [
        { model: 'PreSessionResponse', field: 'question', description: 'Responses to this question' }
      ]
    }
  },

  PreSessionResponse: {
    collection: 'presessionresponses',
    description: 'Patient responses to pre-session questions',
    fields: {
      _id: 'ObjectId (Primary Key)',
      appointment: 'ObjectId (Foreign Key -> Appointment)',
      question: 'ObjectId (Foreign Key -> PreSessionQuestion)',
      patient: 'ObjectId (Foreign Key -> User)',
      answer: 'String',
      createdAt: 'Date',
      updatedAt: 'Date'
    },
    relationships: {
      manyToOne: [
        { model: 'Appointment', field: 'appointment', description: 'Appointment for response' },
        { model: 'PreSessionQuestion', field: 'question', description: 'Question being answered' },
        { model: 'User', field: 'patient', description: 'Patient providing answer' }
      ]
    }
  }
};

/**
 * Relationship Summary by Type
 */
const relationshipSummary = {
  oneToOne: [
    'User <-> Doctor (via user field)',
    'User <-> Subscription (via user field)',
    'Appointment <-> VideoCall (via appointment field)'
  ],
  
  oneToMany: [
    'User -> Appointments (as patient)',
    'Doctor -> Appointments (as doctor)',
    'User -> Activities (assigned to)',
    'User -> Activities (assigned by)',
    'User -> DoctorAvailability',
    'User -> Payments',
    'User -> SessionLogs (as patient/doctor)',
    'User -> AIBotLogs',
    'User -> MoodJournals',
    'User -> Resources (uploaded by)',
    'Appointment -> Payments',
    'Appointment -> SessionLogs',
    'Appointment -> PreSessionResponses',
    'PreSessionQuestion -> PreSessionResponses'
  ],
  
  manyToMany: [
    'User <-> Chat (via participants array)'
  ]
};

/**
 * Data Flow Patterns
 */
const dataFlowPatterns = {
  patientJourney: [
    '1. User signs up -> Creates User account',
    '2. User chooses doctor -> Views Doctor profiles',
    '3. User books appointment -> Creates Appointment',
    '4. Payment processed -> Creates Payment record',
    '5. User fills pre-session form -> Creates PreSessionResponse',
    '6. Video call starts -> Creates/Updates VideoCall',
    '7. Session logged -> Creates SessionLog',
    '8. User tracks mood -> Creates MoodJournal',
    '9. Doctor assigns activity -> Creates Activity',
    '10. User completes activity -> Updates Activity'
  ],
  
  doctorJourney: [
    '1. User signs up as doctor -> Creates User account',
    '2. Doctor creates profile -> Creates Doctor record',
    '3. Doctor uploads documents -> Updates Doctor.documents',
    '4. Doctor sets availability -> Creates DoctorAvailability slots',
    '5. Doctor receives appointment -> Appointment.doctor references them',
    '6. Doctor conducts session -> Updates VideoCall & SessionLog',
    '7. Doctor assigns activities -> Creates Activity records',
    '8. Doctor uploads resources -> Creates Resource records'
  ],
  
  subscriptionFlow: [
    '1. User has free subscription by default',
    '2. User upgrades to pro -> Creates/Updates Subscription',
    '3. Subscription grants access -> Resources with accessLevel="pro"',
    '4. Subscription renewal -> Updates Subscription.endDate',
    '5. Subscription expires -> Updates Subscription.status'
  ]
};

/**
 * Key Indexes for Performance
 */
const keyIndexes = {
  User: ['email', 'role', 'isActive'],
  Doctor: ['specialization', 'rating.average', 'isAvailable', 'isVerified'],
  Appointment: ['patient + date', 'doctor + date', 'status', 'date'],
  DoctorAvailability: ['doctor + date + startTime', 'date + isActive', 'isBooked'],
  Activity: ['assignedTo + dueDate', 'assignedBy', 'status', 'category'],
  Chat: ['participants', 'chatType', 'lastMessage.timestamp'],
  Payment: ['appointment', 'user', 'paymentStatus', 'transactionId'],
  MoodJournal: ['patient + createdAt', 'mood', 'causeCategory'],
  Resource: ['type', 'accessLevel', 'category', 'rating.average', 'views'],
  PreSessionResponse: ['appointment', 'question', 'patient']
};

module.exports = {
  relationshipMap,
  relationshipSummary,
  dataFlowPatterns,
  keyIndexes
};

