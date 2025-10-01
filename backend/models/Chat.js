const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'audio', 'video']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatType: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  },
  name: {
    type: String,
    required: function() {
      return this.chatType === 'group';
    },
    trim: true,
    maxlength: [50, 'Chat name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  messages: [messageSchema],
  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupSettings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 100
    }
  },
  metadata: {
    channel: String, // For group chats like 'patients', 'caregivers', 'general'
    tags: [String],
    category: {
      type: String,
      enum: ['support', 'general', 'therapy', 'community']
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ chatType: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });
chatSchema.index({ 'metadata.channel': 1 });

// Virtual for message count
chatSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Method to add message
chatSchema.methods.addMessage = function(senderId, text, messageType = 'text', attachments = []) {
  const message = {
    sender: senderId,
    text,
    messageType,
    attachments,
    readBy: [{
      user: senderId,
      readAt: new Date()
    }]
  };
  
  this.messages.push(message);
  this.lastMessage = {
    text,
    sender: senderId,
    timestamp: new Date()
  };
  
  // Update unread count for all participants except sender
  this.participants.forEach(participantId => {
    if (participantId.toString() !== senderId.toString()) {
      const currentCount = this.unreadCount.get(participantId.toString()) || 0;
      this.unreadCount.set(participantId.toString(), currentCount + 1);
    }
  });
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId) {
  // Mark all messages as read for this user
  this.messages.forEach(message => {
    if (!message.readBy.some(read => read.user.toString() === userId.toString())) {
      message.readBy.push({
        user: userId,
        readAt: new Date()
      });
    }
  });
  
  // Reset unread count for this user
  this.unreadCount.set(userId.toString(), 0);
  
  return this.save();
};

// Method to get unread count for user
chatSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

// Method to add participant
chatSchema.methods.addParticipant = function(userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.unreadCount.set(userId.toString(), 0);
  }
  return this.save();
};

// Method to remove participant
chatSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(id => id.toString() !== userId.toString());
  this.unreadCount.delete(userId.toString());
  return this.save();
};

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(id => id.toString() === userId.toString());
};

// Static method to find or create private chat
chatSchema.statics.findOrCreatePrivateChat = async function(user1Id, user2Id) {
  let chat = await this.findOne({
    chatType: 'private',
    participants: { $all: [user1Id, user2Id] }
  });
  
  if (!chat) {
    chat = await this.create({
      participants: [user1Id, user2Id],
      chatType: 'private',
      createdBy: user1Id
    });
  }
  
  return chat;
};

// Static method to get group chats by channel
chatSchema.statics.getGroupChatsByChannel = function(channel) {
  return this.find({
    chatType: 'group',
    'metadata.channel': channel,
    isActive: true
  }).populate('participants', 'name profile.profilePicture');
};

// Populate related data when querying
chatSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'participants',
    select: 'name email profile.profilePicture'
  }).populate({
    path: 'messages.sender',
    select: 'name profile.profilePicture'
  }).populate({
    path: 'lastMessage.sender',
    select: 'name'
  });
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
