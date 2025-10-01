# Attrangi Mental Health App - Setup Guide

## Overview
Attrangi is a comprehensive mental health application that connects patients, caregivers, therapists, and doctors. It features secure authentication, session management, mood tracking, and community support.

## Features Implemented

### ✅ Authentication System
- **Backend Authentication**: MongoDB + JWT + bcrypt
- **Google OAuth Integration**: Secure sign-in with Google
- **Role-based Access**: Patient, Caregiver, Therapist, Doctor roles
- **Session Management**: Persistent authentication with token refresh
- **Profile Management**: Complete user profiles with role-specific fields

### ✅ Backend API
- **RESTful API**: Express.js with MongoDB
- **User Management**: Registration, login, profile updates
- **Session Management**: Therapy session booking and management
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database Models**: User, Session with comprehensive schemas

### ✅ Frontend
- **React Native + Expo**: Cross-platform mobile app
- **Authentication Flow**: Login/signup with Google OAuth
- **Navigation**: Role-based navigation with protected routes
- **UI/UX Improvements**: Better scrolling, form validation, loading states
- **State Management**: Context API for authentication state

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Expo CLI (`npm install -g @expo/cli`)
- Google Cloud Console account (for OAuth)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp config.env.example .env

# Edit .env file with your configuration:
# MONGODB_URI=mongodb://localhost:27017/attrangi
# JWT_SECRET=your-super-secret-jwt-key
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# PORT=5000

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create environment file
cp config.example .env

# Edit .env file with your configuration:
# EXPO_PUBLIC_API_URL=http://localhost:5000/api
# EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Start the development server
npm start
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - For development: `http://localhost:19006/auth/callback`
   - For production: Your production domain
6. Copy Client ID and Client Secret to your environment files

### 4. Database Setup

The app will automatically create the necessary collections when you start the backend. The main collections are:

- **users**: User profiles and authentication data
- **sessions**: Therapy sessions and appointments

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Google OAuth
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### Users
- `GET /api/user/:userId` - Get user by ID
- `GET /api/user` - Search users
- `GET /api/user/professionals/available` - Get available professionals

### Sessions
- `GET /api/session` - Get user sessions
- `POST /api/session` - Create new session
- `GET /api/session/:sessionId` - Get session details
- `PUT /api/session/:sessionId` - Update session
- `DELETE /api/session/:sessionId` - Cancel session

## User Roles and Features

### Patient
- Mood tracking and journaling
- Session booking with therapists
- Activity recommendations
- Community support

### Caregiver
- Monitor patient progress
- Support during sessions
- Activity tracking
- Caregiver community

### Therapist
- Patient management
- Session notes and feedback
- Activity assignments
- Professional network

### Doctor
- Patient consultations
- Prescription management
- Medical history tracking
- Professional collaboration

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request rate limiting
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Cross-origin resource sharing security
- **Helmet Security**: HTTP header security

## Development Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Start Expo development server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify database permissions

2. **Google OAuth Error**
   - Verify Google Client ID and Secret
   - Check redirect URI configuration
   - Ensure Google+ API is enabled

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across environments

4. **Frontend Build Issues**
   - Clear Expo cache: `expo r -c`
   - Reinstall node_modules
   - Check environment variables

## Production Deployment

### Backend
1. Set up MongoDB Atlas or production MongoDB
2. Configure environment variables for production
3. Set up SSL certificates
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend
1. Configure production API URL
2. Set up Google OAuth for production domain
3. Build and deploy to app stores or web

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
