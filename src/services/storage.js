// Storage service for React Native using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'attarangi_auth_token',
  USER_DATA: 'attarangi_user_data',
  APP_SETTINGS: 'attarangi_app_settings'
};

export const storage = {
  // Store authentication token
  async setAuthToken(token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error storing auth token:', error);
      return false;
    }
  },

  // Get authentication token
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Remove authentication token
  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return true;
    } catch (error) {
      console.error('Error removing auth token:', error);
      return false;
    }
  },

  // Store user data
  async setUserData(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  },

  // Get user data
  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Remove user data
  async removeUserData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      console.error('Error removing user data:', error);
      return false;
    }
  },

  // Store app settings
  async setAppSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error storing app settings:', error);
      return false;
    }
  },

  // Get app settings
  async getAppSettings() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting app settings:', error);
      return {};
    }
  },

  // Clear all app data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.APP_SETTINGS
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  },

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const token = await this.getAuthToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }
};

export default storage;
