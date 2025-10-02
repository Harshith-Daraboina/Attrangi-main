// src/screens/Auth/SignInScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { useThemeSettings } from '../../styles/ThemeContext';
import Button from '../../components/Button';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import auth from '../../services/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useThemeSettings();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await auth.login({ email: email.trim(), password });
      
      if (result.success) {
        // Set the role in theme context for navigation
        setRole(result.user.role);
        
        // Login should go directly to main app based on role
        switch (result.user.role) {
          case 'patient':
            navigation.navigate('MainPatient');
            break;
          case 'caregiver':
            navigation.navigate('MainCaregiver');
            break;
          case 'doctor':
            navigation.navigate('MainDoctor');
            break;
          default:
            navigation.navigate('MainPatient');
        }
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if email verification is required
      if (error.message && error.message.includes('verify your email')) {
        Alert.alert(
          'Email Verification Required',
          'Please verify your email before logging in. Check your inbox for the verification code.',
          [
            {
              text: 'Verify Now',
              onPress: () => navigation.navigate('SignupOTP', { 
                email: email.trim(),
                message: 'Please enter the verification code sent to your email to complete your account setup.'
              })
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else if (error.message && error.message.includes('already exists')) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Please login instead.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Signin')
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }
    
    // Navigate to forgot password screen (you can implement this later)
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented soon. For now, please contact support.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Let's login to continue</Text>
      </View>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Icon name="mail" size={18} color={Colors.textPrimary} style={styles.inputIcon} />
        <TextInput
          placeholder="Email Address"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {email.length > 0 && (
          <MaterialIcon
            name="check-circle"
            size={20}
            color={Colors.primary}
            style={styles.inputRightIcon}
          />
        )}
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Icon name="lock" size={18} color={Colors.textPrimary} style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          style={styles.input}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.inputRightIcon}
          disabled={isLoading}
        >
          <Icon name={secureText ? 'eye-off' : 'eye'} size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Remember me & Forgot password */}
      <View style={styles.rememberForgotRow}>
        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotText}>Forgot password</Text>
        </TouchableOpacity>
      </View>

      {/* Sign in Button */}
      <Button
        title={isLoading ? "Signing in..." : "Sign in"}
        onPress={handleSignIn}
        style={styles.signInButton}
        disabled={isLoading}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      )}

      {/* Social Login */}
      <Text style={styles.loginWith}>You can connect with</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require('../../../assets/facebook.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require('../../../assets/google.jpg')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require('../../../assets/apple.jpg')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up link */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupEmail')}>
          <Text style={styles.signUpLink}>Sign up here</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.background },
  header: { alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.xl },
  title: { ...Typography.heading1 },
  subtitle: { ...Typography.caption },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    height: 52,
    ...Shadows.sm,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: 16, color: Colors.textPrimary },
  inputRightIcon: { marginLeft: Spacing.sm },
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
    alignItems: 'center'
  },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '500', textDecorationLine: 'underline' },
  signInButton: { width: '100%' },
  loadingContainer: {
    marginTop: Spacing.md,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: 14
  },
  loginWith: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md
  },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  socialBtn: {
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  socialIcon: { width: 36, height: 36, resizeMode: 'contain' },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  signUpText: { fontSize: 13, color: Colors.textPrimary },
  signUpLink: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});