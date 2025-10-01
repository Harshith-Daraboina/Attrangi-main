import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';
import googleAuthService from '../services/googleAuth';
import { convertToDisplayFormat } from '../utils/dateUtils';
import QuickAccess from '../components/QuickAccess';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    role: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login, register, googleLogin, error, clearError } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('dateOfBirth', isoDate);
      setSelectedDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return false;
    }
    
    if (!isLogin) {
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        Alert.alert('Validation Error', 'Please fill in all required fields for registration.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          role: formData.role
        });
      }
      
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!googleAuthService.isAvailable()) {
      Alert.alert('Configuration Error', 'Google Sign-in is not configured. Please contact support.');
      return;
    }

    setIsGoogleLoading(true);
    clearError();

    try {
      const result = await googleAuthService.signInWithGoogle();
      
      if (result.success) {
        // Send Google user data to backend for authentication
        await googleLogin(result.user);
        // Navigation will be handled by AppNavigator based on auth state
      } else if (result.cancelled) {
        // User cancelled, no action needed
        console.log('Google Sign-in cancelled by user');
      }
    } catch (error) {
      console.error('Google Sign-in error:', error);
      Alert.alert('Sign-in Error', error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      role: 'patient'
    });
    clearError();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to continue your mental health journey' 
              : 'Join Attrangi and start your mental health journey'
            }
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="Enter your first name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Enter your last name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth *</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={showDatePickerModal}
                >
                  <Text style={[
                    styles.dateText, 
                    { color: formData.dateOfBirth ? Colors.textPrimary : Colors.textSecondary }
                  ]}>
                    {formData.dateOfBirth ? convertToDisplayFormat(formData.dateOfBirth) : 'DD/MM/YYYY'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>I am a *</Text>
                <View style={styles.roleSelector}>
                  {['patient', 'caregiver', 'therapist', 'doctor'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        formData.role === role && styles.roleOptionSelected
                      ]}
                      onPress={() => handleInputChange('role', role)}
                    >
                      <Text style={[
                        styles.roleText,
                        formData.role === role && styles.roleTextSelected
                      ]}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
            </>
          )}
        </TouchableOpacity>

        {/* Google Sign In */}
        <TouchableOpacity 
          style={[styles.googleButton, isGoogleLoading && styles.googleButtonDisabled]} 
          onPress={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color={Colors.textPrimary} />
          ) : (
            <Ionicons name="logo-google" size={20} color={Colors.textPrimary} />
          )}
          <Text style={styles.googleButtonText}>
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {/* Toggle Mode */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleLink}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your mental health data is protected and confidential.
          </Text>
        </View>

        {/* Quick Access - Direct Dashboard Navigation */}
        <QuickAccess navigation={navigation} />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    ...Typography.body,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  passwordInput: {
    flex: 1,
    padding: Spacing.md,
    ...Typography.body,
  },
  eyeButton: {
    padding: Spacing.md,
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  roleOptionSelected: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  roleText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  roleTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },
  forgotPasswordText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  googleButtonText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  toggleText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  toggleLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  privacyContainer: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  privacyText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
