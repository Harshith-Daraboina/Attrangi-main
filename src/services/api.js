// API service for backend integration
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.3.89:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = null;
  }

  // Set authentication token
  setAuthToken(token) {
    this.authToken = token;
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null;
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Authentication endpoints
  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async googleLogin(googleUser) {
    return this.post('/auth/google-login', googleUser);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async changePassword(passwordData) {
    return this.put('/auth/change-password', passwordData);
  }

  async verifyEmail(email, otp) {
    return this.post('/auth/verify-email', { email, otp });
  }

  async resendOTP(email) {
    return this.post('/auth/resend-otp', { email });
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(email, otp, newPassword) {
    return this.post('/auth/reset-password', { email, otp, newPassword });
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // User management
  async updateProfile(updates) {
    return this.put('/users/profile', updates);
  }

  async changePassword(passwords) {
    return this.put('/users/change-password', passwords);
  }

  // Doctor operations
  async listDoctors(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/doctors?${queryParams}` : '/doctors';
    return this.get(endpoint);
  }

  async getDoctor(doctorId) {
    return this.get(`/doctors/${doctorId}`);
  }

  async createDoctorProfile(profileData) {
    return this.post('/doctors/profile', profileData);
  }

  async updateDoctorProfile(updates) {
    return this.put('/doctors/profile', updates);
  }

  async updateDoctorPaymentDetails(paymentDetails) {
    return this.put('/doctors/payment-details', paymentDetails);
  }

  async updateDoctorAvailability(availability) {
    return this.put('/doctors/availability', availability);
  }

  async toggleDoctorActiveToday() {
    return this.put('/doctors/active-today');
  }

  async updateDoctorPaymentDetails(paymentData) {
    return this.put('/doctors/payment-details', paymentData);
  }

  // Document operations
  async uploadDocuments(formData) {
    const url = `${this.baseURL}/doctors/documents/upload`;
    const headers = {};
    
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    // Don't set Content-Type header for FormData - let the browser set it with boundary
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async getDocuments() {
    return this.get('/doctors/documents');
  }

  async deleteDocument(documentType) {
    return this.delete(`/doctors/documents/${documentType}`);
  }

  // Appointment operations
  async createAppointment(appointmentData) {
    return this.post('/appointments', appointmentData);
  }

  async listAppointments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/appointments?${queryParams}` : '/appointments';
    return this.get(endpoint);
  }

  async getAppointment(appointmentId) {
    return this.get(`/appointments/${appointmentId}`);
  }

  async updateAppointmentStatus(appointmentId, updates) {
    return this.put(`/appointments/${appointmentId}`, updates);
  }

  async cancelAppointment(appointmentId) {
    return this.delete(`/appointments/${appointmentId}`);
  }

  async rescheduleAppointment(appointmentId, scheduleData) {
    return this.put(`/appointments/${appointmentId}/reschedule`, scheduleData);
  }

  // Activity operations
  async listActivities(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/activities?${queryParams}` : '/activities';
    return this.get(endpoint);
  }

  async getActivity(activityId) {
    return this.get(`/activities/${activityId}`);
  }

  async createActivity(activityData) {
    return this.post('/activities', activityData);
  }

  async updateActivity(activityId, updates) {
    return this.put(`/activities/${activityId}`, updates);
  }

  async toggleActivityComplete(activityId) {
    return this.put(`/activities/${activityId}/toggle-complete`);
  }

  async deleteActivity(activityId) {
    return this.delete(`/activities/${activityId}`);
  }

  // Chat operations
  async listChats() {
    return this.get('/chat');
  }

  async getChat(chatId) {
    return this.get(`/chat/${chatId}`);
  }

  async createChat(chatData) {
    return this.post('/chat', chatData);
  }

  async sendMessage(chatId, messageData) {
    return this.post(`/chat/${chatId}/messages`, messageData);
  }

  async getChatMessages(chatId, page = 1, limit = 50) {
    return this.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  async markChatAsRead(chatId) {
    return this.put(`/chat/${chatId}/mark-read`);
  }

  async getUnreadCount() {
    return this.get('/chat/unread-count');
  }

  // Group chat operations
  async getGroupMessages(channel) {
    return this.get(`/chat/groups/${channel}/messages`);
  }

  async sendGroupMessage(channel, messageData) {
    return this.post(`/chat/groups/${channel}/messages`, messageData);
  }

  // Utility functions
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('attarangi_auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async getToken() {
    return await AsyncStorage.getItem('attarangi_auth_token');
  }

  async clearToken() {
    return await AsyncStorage.removeItem('attarangi_auth_token');
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;