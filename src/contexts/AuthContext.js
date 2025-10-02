import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '../services/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authState = await auth.initialize();
      
      if (authState.isAuthenticated) {
        const currentUser = auth.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError(error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await auth.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await auth.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleUser) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await auth.googleLogin(googleUser);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      
      const result = await auth.updateProfile(updates);
      
      if (result.success) {
        setUser(result.user);
        console.log('✅ AuthContext: Profile updated, new user:', result.user);
        return result;
      }
    } catch (error) {
      console.error('❌ AuthContext: Update profile error:', error);
      setError(error.message);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      setError(null);
      
      const updatedUser = await auth.refreshUser();
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Refresh user error:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Helper functions
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const isPatient = () => hasRole('patient');
  const isCaregiver = () => hasRole('caregiver');
  const isDoctor = () => hasRole('doctor');

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    refreshUser,
    clearError,
    initializeAuth,
    
    // Helpers
    hasRole,
    isPatient,
    isCaregiver,
    isDoctor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
