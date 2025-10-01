const express = require('express');
const { body } = require('express-validator');
const { validate, sanitizeInput } = require('../middleware/validation');
const Chat = require('../models/Chat');
const User = require('../models/User');

const router = express.Router();

// Validation rules
const sendMessageValidation = [
  body('text').trim().notEmpty().withMessage('Message text is required'),
  body('messageType').optional().isIn(['text', 'image', 'file', 'audio', 'video']).withMessage('Invalid message type')
];

const createChatValidation = [
  body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
  body('chatType').optional().isIn(['private', 'group']).withMessage('Invalid chat type'),
  body('name').optional().trim().isLength({ max: 50 }).withMessage('Chat name cannot be more than 50 characters')
];

// @route   GET /api/chat
// @desc    Get user's chats
// @access  Private
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    }).sort({ 'lastMessage.timestamp': -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chats'
    });
  }
});

// @route   GET /api/chat/:id
// @desc    Get chat by ID
// @access  Private
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark messages as read
    await chat.markAsRead(req.user._id);

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat'
    });
  }
});

// @route   POST /api/chat
// @desc    Create new chat
// @access  Private
router.post('/', createChatValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { participants, chatType = 'private', name, description } = req.body;

    // Add current user to participants if not already included
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id);
    }

    // For private chats, ensure only 2 participants
    if (chatType === 'private' && participants.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Private chats must have exactly 2 participants'
      });
    }

    // Check if private chat already exists
    if (chatType === 'private') {
      const existingChat = await Chat.findOne({
        chatType: 'private',
        participants: { $all: participants }
      });

      if (existingChat) {
        return res.json({
          success: true,
          message: 'Chat already exists',
          chat: existingChat
        });
      }
    }

    const chatData = {
      participants,
      chatType,
      createdBy: req.user._id
    };

    if (name) chatData.name = name;
    if (description) chatData.description = description;

    const chat = new Chat(chatData);
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating chat'
    });
  }
});

// @route   POST /api/chat/:id/messages
// @desc    Send message to chat
// @access  Private
router.post('/:id/messages', sendMessageValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { text, messageType = 'text', attachments = [] } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add message to chat
    await chat.addMessage(req.user._id, text, messageType, attachments);

    // Get updated chat
    const updatedChat = await Chat.findById(req.params.id);

    res.json({
      success: true,
      message: 'Message sent successfully',
      chat: updatedChat
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @route   GET /api/chat/:id/messages
// @desc    Get chat messages
// @access  Private
router.get('/:id/messages', sanitizeInput, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = chat.messages
      .filter(msg => !msg.isDeleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit))
      .reverse();

    res.json({
      success: true,
      messages,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total: chat.messages.filter(msg => !msg.isDeleted).length
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
});

// @route   POST /api/chat/:id/read
// @desc    Mark chat as read
// @access  Private
router.post('/:id/read', sanitizeInput, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await chat.markAsRead(req.user._id);

    res.json({
      success: true,
      message: 'Chat marked as read'
    });
  } catch (error) {
    console.error('Mark chat as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking chat as read'
    });
  }
});

// @route   GET /api/chat/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', sanitizeInput, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      totalUnread += chat.getUnreadCount(req.user._id);
    });

    res.json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching unread count'
    });
  }
});

// @route   POST /api/chat/private/:userId
// @desc    Create or get private chat with user
// @access  Private
router.post('/private/:userId', sanitizeInput, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find or create private chat
    const chat = await Chat.findOrCreatePrivateChat(req.user._id, otherUserId);

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create private chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating private chat'
    });
  }
});

// @route   GET /api/chat/groups/:channel
// @desc    Get group chats by channel
// @access  Private
router.get('/groups/:channel', sanitizeInput, async (req, res) => {
  try {
    const { channel } = req.params;
    const chats = await Chat.getGroupChatsByChannel(channel);

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Get group chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching group chats'
    });
  }
});

// @route   POST /api/chat/groups/:channel/messages
// @desc    Send message to group channel
// @access  Private
router.post('/groups/:channel/messages', sendMessageValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { channel } = req.params;
    const { text, messageType = 'text', attachments = [] } = req.body;

    // Find or create group chat for channel
    let chat = await Chat.findOne({
      chatType: 'group',
      'metadata.channel': channel,
      isActive: true
    });

    if (!chat) {
      chat = new Chat({
        chatType: 'group',
        participants: [req.user._id],
        createdBy: req.user._id,
        metadata: {
          channel
        }
      });
      await chat.save();
    } else {
      // Add user to participants if not already there
      await chat.addParticipant(req.user._id);
    }

    // Add message
    await chat.addMessage(req.user._id, text, messageType, attachments);

    res.json({
      success: true,
      message: 'Message sent successfully',
      chat
    });
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending group message'
    });
  }
});

// @route   GET /api/chat/groups/:channel/messages
// @desc    Get group messages by channel
// @access  Private
router.get('/groups/:channel/messages', sanitizeInput, async (req, res) => {
  try {
    const { channel } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findOne({
      chatType: 'group',
      'metadata.channel': channel,
      isActive: true
    });

    if (!chat) {
      return res.json({
        success: true,
        messages: [],
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: 0
        }
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = chat.messages
      .filter(msg => !msg.isDeleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit))
      .reverse();

    res.json({
      success: true,
      messages,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total: chat.messages.filter(msg => !msg.isDeleted).length
      }
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching group messages'
    });
  }
});

module.exports = router;
