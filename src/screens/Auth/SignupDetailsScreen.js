import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import Button from '../../components/Button';
import auth from '../../services/auth';
import { convertToISOFormat, convertToDisplayFormat, isValidDate } from '../../utils/dateUtils';

export default function SignupDetailsScreen({ navigation, route }) {
  const { email, role } = route.params || {};
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const validateForm = () => {
    if (!form.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!form.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!form.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!form.dateOfBirth) {
      Alert.alert('Error', 'Please select your date of birth');
      return false;
    }
    if (!isValidDate(form.dateOfBirth)) {
      Alert.alert('Error', 'Please enter a valid date of birth');
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleDateChange = (event, selectedDate) => {
    // On iOS, keep picker open until user clicks Done/Cancel
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setForm(prev => ({ ...prev, dateOfBirth: isoDate }));
      setSelectedDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: email,
        password: form.password,
        role: role,
        dateOfBirth: form.dateOfBirth, // Already in ISO format (YYYY-MM-DD)
        phone: form.phone.trim()
      };

      const result = await auth.register(userData);
      
      if (result.success) {
        // Prepare user data to pass to onboarding to avoid duplicate entry
        const onboardingData = {
          fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: email,
          phone: form.phone.trim(),
          dateOfBirth: form.dateOfBirth,
          role: role
        };

        // Account created successfully, navigate to appropriate onboarding based on role
        if (role === 'patient') {
          navigation.navigate('PatientOnboarding', { userData: onboardingData });
        } else if (role === 'doctor') {
          navigation.navigate('DoctorOnboarding', { userData: onboardingData });
        } else if (role === 'caregiver') {
          navigation.navigate('CaregiverOnboarding', { userData: onboardingData });
        } else {
          // Default fallback
          navigation.navigate('PatientOnboarding', { userData: onboardingData });
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.message && error.message.includes('already exists')) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Please login instead.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('SignIn')
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else if (error.message && error.message.includes('timeout')) {
        Alert.alert(
          'Connection Timeout',
          'The server is taking too long to respond. Please check your internet connection and try again.',
          [
            {
              text: 'Retry',
              onPress: () => handleSignup()
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else if (error.message && error.message.includes('Network request failed')) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.',
          [
            {
              text: 'Retry',
              onPress: () => handleSignup()
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Add your personal details to continue</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="First Name"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={form.firstName}
              onChangeText={(text) => setForm({ ...form, firstName: text })}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={form.lastName}
              onChangeText={(text) => setForm({ ...form, lastName: text })}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.inputContainer} onPress={showDatePickerModal}>
            <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <Text style={[styles.input, { color: form.dateOfBirth ? Colors.textPrimary : Colors.textSecondary }]}>
              {form.dateOfBirth ? convertToDisplayFormat(form.dateOfBirth) : 'Date of Birth (DD/MM/YYYY)'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {showDatePicker && Platform.OS === 'ios' && (
            <View style={styles.iosDatePickerContainer}>
              <View style={styles.iosDatePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.iosDatePickerButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.iosDatePickerButton, { color: Colors.primary, fontWeight: '600' }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                textColor={Colors.textPrimary}
              />
            </View>
          )}

          {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry={!showPassword}
              style={styles.input}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color={Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color={Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.roleInfo}>
            <Text style={styles.roleText}>Role: <Text style={styles.roleValue}>{role}</Text></Text>
            <Text style={styles.emailText}>Email: <Text style={styles.emailValue}>{email}</Text></Text>
          </View>

          <Button 
            title={isLoading ? "Creating Account..." : "Create Account"} 
            onPress={handleSignup} 
            style={styles.button}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Creating your {role} account...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1,
    paddingHorizontal: Spacing.lg, 
    paddingTop: Spacing.md, 
    paddingBottom: Spacing.xl,
    alignItems: 'center' 
  },
  title: { ...Typography.heading1, textAlign: 'center', marginBottom: Spacing.xs },
  subtitle: { ...Typography.caption, textAlign: 'center', marginBottom: Spacing.lg },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.md, 
    paddingHorizontal: Spacing.md, 
    height: 52, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: Spacing.md, 
    ...Shadows.sm 
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: 16, color: Colors.textPrimary },
  roleInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border
  },
  roleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs
  },
  roleValue: {
    color: Colors.primary,
    fontWeight: '600'
  },
  emailText: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  emailValue: {
    color: Colors.textPrimary,
    fontWeight: '500'
  },
  button: { width: '100%', marginTop: Spacing.lg },
  loadingContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: 14
  },
  iosDatePickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    width: '100%',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.border
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  iosDatePickerButton: {
    fontSize: 16,
    color: Colors.textPrimary
  }
});
