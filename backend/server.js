const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const activityRoutes = require('./routes/activities');
const chatRoutes = require('./routes/chat');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:8081",
      "http://10.0.3.89:8081",
      "http://localhost:3000",
      "http://10.0.3.89:3000"
    ],
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:8081",
    "http://10.0.3.89:8081",
    "http://localhost:3000",
    "http://10.0.3.89:3000"
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Attarangi API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/activities', authenticateToken, activityRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join chat room
  socket.on('join-chat', (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`User joined chat: ${chatId}`);
  });

  // Send message
  socket.on('send-message', (data) => {
    socket.to(`chat-${data.chatId}`).emit('new-message', data);
  });

  // Join group chat
  socket.on('join-group', (channel) => {
    socket.join(`group-${channel}`);
    console.log(`User joined group: ${channel}`);
  });

  // Send group message
  socket.on('send-group-message', (data) => {
    socket.to(`group-${data.channel}`).emit('new-group-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/att1', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8083'}`);
    console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

startServer();

module.exports = { app, io };
