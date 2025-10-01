const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['meditation', 'exercise', 'journaling', 'breathing', 'social', 'cognitive', 'creative', 'other'],
    required: [true, 'Activity category is required']
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    }
  }],
  benefits: [String],
  duration: {
    type: Number, // in minutes
    required: [true, 'Activity duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [180, 'Duration cannot exceed 180 minutes']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  completedAt: Date,
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed', 'skipped'],
    default: 'assigned'
  },
  completion: {
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    moodBefore: {
      type: Number,
      min: 1,
      max: 10
    },
    moodAfter: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  recurrence: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    endDate: Date,
    nextDueDate: Date
  },
  resources: [{
    type: {
      type: String,
      enum: ['video', 'audio', 'document', 'link', 'image']
    },
    title: String,
    url: String,
    description: String
  }],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityTemplate'
  }
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ assignedTo: 1, dueDate: -1 });
activitySchema.index({ assignedBy: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ category: 1 });
activitySchema.index({ isPublic: 1 });

// Virtual for completion percentage
activitySchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'in-progress') return 50;
  if (this.status === 'skipped') return 0;
  return 0;
});

// Virtual for days until due
activitySchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to mark as completed
activitySchema.methods.markCompleted = function(notes, rating, feedback, moodBefore, moodAfter) {
  this.status = 'completed';
  this.completion.isCompleted = true;
  this.completion.completedAt = new Date();
  this.completedAt = new Date();
  
  if (notes) this.completion.notes = notes;
  if (rating) this.completion.rating = rating;
  if (feedback) this.completion.feedback = feedback;
  if (moodBefore) this.completion.moodBefore = moodBefore;
  if (moodAfter) this.completion.moodAfter = moodAfter;
  
  return this.save();
};

// Method to mark as in progress
activitySchema.methods.markInProgress = function() {
  this.status = 'in-progress';
  return this.save();
};

// Method to skip activity
activitySchema.methods.skipActivity = function(reason) {
  this.status = 'skipped';
  this.completion.notes = reason || 'Activity skipped';
  return this.save();
};

// Method to check if overdue
activitySchema.methods.isOverdue = function() {
  const now = new Date();
  return this.dueDate < now && this.status !== 'completed';
};

// Method to generate next recurring activity
activitySchema.methods.generateNextRecurring = function() {
  if (!this.recurrence.isRecurring) return null;
  
  const nextActivity = this.toObject();
  delete nextActivity._id;
  delete nextActivity.createdAt;
  delete nextActivity.updatedAt;
  
  const currentDue = new Date(this.dueDate);
  let nextDue;
  
  switch (this.recurrence.frequency) {
    case 'daily':
      nextDue = new Date(currentDue.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      nextDue = new Date(currentDue.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      nextDue = new Date(currentDue.getFullYear(), currentDue.getMonth() + 1, currentDue.getDate());
      break;
  }
  
  nextActivity.dueDate = nextDue;
  nextActivity.status = 'assigned';
  nextActivity.completion = {
    isCompleted: false
  };
  
  return nextActivity;
};

// Populate related data when querying
activitySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignedBy',
    select: 'name profile.profilePicture'
  }).populate({
    path: 'assignedTo',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
