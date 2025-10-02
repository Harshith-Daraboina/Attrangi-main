// Authentication service with backend API integration
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

let currentUser = null;
let authState = {
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: 'attarangi_user_data',
  AUTH_TOKEN: 'attarangi_auth_token'
};

// Helper functions
const getStoredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Error getting stored user:', e);
    return null;
  }
};

const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.error('Error getting stored token:', e);
    return null;
  }
};

const setStoredUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    return true;
  } catch (e) {
    console.error('Error setting stored user:', e);
    return false;
  }
};

const setStoredToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (e) {
    console.error('Error setting stored token:', e);
    return false;
  }
};

const clearStoredUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  } catch (e) {
    console.error('Error clearing stored user:', e);
    return false;
  }
};

// Authentication functions
const auth = {
  // Initialize auth state from stored user
  async initialize() {
    try {
      authState.isLoading = true;
      const storedUser = await getStoredUser();
      const storedToken = await getStoredToken();
      
      if (storedUser && storedToken) {
        // Set token for API calls
        api.setAuthToken(storedToken);
        
        // Verify token is still valid by fetching current user
        try {
          const response = await api.getCurrentUser();
          if (response.success) {
            currentUser = response.user;
            await setStoredUser(currentUser);
            authState.isAuthenticated = true;
            authState.error = null;
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.log('Token validation failed, logging out');
          await this.logout();
        }
      } else {
        authState.isAuthenticated = false;
        authState.error = null;
      }
    } catch (error) {
      console.error('Failed to restore auth session:', error);
      await this.logout();
    } finally {
      authState.isLoading = false;
    }
    return authState;
  },

  // Register new user
  async register(userData) {
    try {
      console.log('📝 Registering user:', userData.email);
      
      authState.isLoading = true;
      authState.error = null;
      
      // Prepare registration data for backend
      const registrationData = {
        name: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      
      // Call backend API
      const response = await api.register(registrationData);
      
      if (response.success) {
        // Store token
        await setStoredToken(response.token);
        
        // Set token for future API calls
        api.setAuthToken(response.token);
        
        // Fetch complete user data (should have no role initially)
        const userResponse = await api.getCurrentUser();
        if (userResponse.success) {
          currentUser = userResponse.user;
          await setStoredUser(currentUser);
        } else {
          // Fallback to basic user data if getCurrentUser fails
          currentUser = response.user;
          await setStoredUser(currentUser);
        }
        
        authState.isAuthenticated = true;
        authState.error = null;
        
        console.log('✅ Registration successful for:', currentUser.email);
        
        return { 
          success: true, 
          message: response.message,
          user: currentUser
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      authState.error = error.message;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  },

  // Email verification
  async verifyEmail(email, otp) {
    try {
      // Mock email verification - always succeed
      currentUser = {
        id: `user-${Date.now()}`,
        name: 'Demo User',
        email: email,
        role: 'patient',
        isEmailVerified: true,
        isProfileComplete: false
      };
      await setStoredUser(currentUser);
      authState.isAuthenticated = true;
      authState.error = null;
      
      return { success: true, user: currentUser };
    } catch (error) {
      authState.error = error.message;
      throw error;
    }
  },

  // Resend OTP
  async resendOTP(email) {
    try {
      // Mock resend OTP - always succeed
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      throw error;
    }
  },

  // Login
  async login(credentials) {
    try {
      authState.isLoading = true;
      authState.error = null;
      
      // Call backend API
      const response = await api.login(credentials);
      
      if (response.success) {
        // Store token
        await setStoredToken(response.token);
        
        // Set token for future API calls
        api.setAuthToken(response.token);
        
        // Fetch complete user data including doctor profile
        const userResponse = await api.getCurrentUser();
        if (userResponse.success) {
          currentUser = userResponse.user;
          await setStoredUser(currentUser);
        } else {
          // Fallback to basic user data if getCurrentUser fails
          currentUser = response.user;
          await setStoredUser(currentUser);
        }
        
        authState.isAuthenticated = true;
        authState.error = null;
        
        return { success: true, user: currentUser };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      authState.error = error.message;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  },

  // Google OAuth login
  async googleLogin(googleUser) {
    try {
      authState.isLoading = true;
      authState.error = null;
      
      // Create a user account with Google data
      const mockUser = {
        id: googleUser.id || `google-${Date.now()}`,
        name: `${googleUser.firstName} ${googleUser.lastName}`,
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        role: 'patient', // Default role, can be changed later
        isEmailVerified: googleUser.isEmailVerified,
        isProfileComplete: false
      };
      
      currentUser = mockUser;
      await setStoredUser(mockUser);
      authState.isAuthenticated = true;
      
      return { success: true, user: currentUser };
    } catch (error) {
      authState.error = error.message;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  },

  // Logout
  async logout() {
    try {
      // Call backend logout endpoint if token exists
      const token = await getStoredToken();
      if (token) {
        try {
          await api.logout();
        } catch (error) {
          console.log('Logout API call failed:', error.message);
        }
      }
      
      // Clear local data
      currentUser = null;
      await clearStoredUser();
      api.clearAuthToken();
      authState.isAuthenticated = false;
      authState.error = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      // Mock forgot password - always succeed
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email, otp, newPassword) {
    try {
      // Mock reset password - always succeed
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return currentUser;
  },

  // Get auth state
  getAuthState() {
    return { ...authState };
  },

  // Check if user is authenticated
  isAuthenticated() {
    return authState.isAuthenticated;
  },

  // Check if user has specific role
  hasRole(role) {
    return currentUser && currentUser.role === role;
  },

  // Check if user is a doctor
  isDoctor() {
    return this.hasRole('doctor');
  },

  // Check if user is a patient
  isPatient() {
    return this.hasRole('patient');
  },

  // Check if user is a caregiver
  isCaregiver() {
    return this.hasRole('caregiver');
  },

  // Get user role
  getRole() {
    return currentUser ? currentUser.role : null;
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      // Call backend API
      const response = await api.updateProfile(updates);
      
      if (response.success) {
        // Update current user with new data
        currentUser = { ...currentUser, ...response.user };
        await setStoredUser(currentUser);
        console.log('✅ Profile updated:', currentUser);
        return { success: true, user: currentUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(passwords) {
    try {
      // Mock change password - always succeed
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Refresh user data
  async refreshUser() {
    try {
      // Fetch fresh user data from server
      const response = await api.getCurrentUser();
      
      if (response.success) {
        // Update current user with fresh data
        currentUser = response.user;
        await setStoredUser(currentUser);
        return currentUser;
      } else {
        throw new Error(response.message || 'Failed to refresh user data');
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error.message);
      throw error;
    }
  }
};

// Helper function for setting role
export function setRole(role) {
  if (currentUser) {
    currentUser.role = role;
  }
}

// Export the auth service
export default auth;


