// Simplified Google Auth service for demo purposes

class GoogleAuthService {
  constructor() {
    this.request = null;
  }

  // Start Google OAuth flow (mock)
  async signInWithGoogle() {
    try {
      // Simulate a delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock Google user data
      const mockUserInfo = {
        id: `google-${Date.now()}`,
        email: 'demo@gmail.com',
        firstName: 'Demo',
        lastName: 'User',
        profileImage: 'https://via.placeholder.com/150',
        isEmailVerified: true
      };
      
      return {
        success: true,
        user: mockUserInfo,
        tokens: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token'
        }
      };
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  }

  // Sign out (mainly for clearing local state)
  async signOut() {
    // Google OAuth doesn't require explicit sign out on the client side
    // The app should clear its own authentication state
    return Promise.resolve();
  }

  // Check if Google Sign-in is available (always true for demo)
  isAvailable() {
    return true;
  }

  // Get redirect URI for debugging (mock)
  getRedirectUri() {
    return 'attrangi://auth';
  }
}

// Create singleton instance
const googleAuthService = new GoogleAuthService();

export default googleAuthService;
