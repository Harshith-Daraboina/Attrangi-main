import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import Button from '../../components/Button';
import auth from '../../services/auth';

export default function SignupOTPScreen({ navigation, route }) {
  const { email, userId, message } = route.params || {};
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await auth.verifyEmail(email, otp.trim());
      
      if (result.success) {
        Alert.alert(
          'Success!', 
          'Email verified successfully! You can now login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Signin')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to verify email');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', error.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const result = await auth.resendOTP(email);
      
      if (result.success) {
        Alert.alert('Success', 'New verification code sent to your email');
        setCountdown(180);
        setCanResend(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    navigation.navigate('SignupEmail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToSignup} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Email Verification</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../../../assets/signup2.png')} 
              style={styles.illustration} 
              resizeMode="contain" 
            />
          </View>

          {/* Title and Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Success Message */}
          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>Enter 6-digit code</Text>
            <View style={styles.otpInputWrapper}>
              <TextInput
                placeholder="000000"
                placeholderTextColor={Colors.textSecondary}
                style={styles.otpInput}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                autoFocus
                selectionColor={Colors.primary}
                textAlign="center"
              />
            </View>
            <Text style={styles.otpHint}>
              Type the 6-digit code sent to your email
            </Text>
          </View>

          {/* Verify Button */}
          <Button 
            title={isLoading ? "Verifying..." : "Verify Email"} 
            onPress={handleVerifyOTP} 
            style={styles.verifyButton}
            disabled={isLoading || !otp.trim()}
          />

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>
              Didn't receive the code?
            </Text>
            {canResend ? (
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={resendLoading}
                style={styles.resendButton}
              >
                <Text style={[styles.resendButtonText, resendLoading && styles.resendButtonTextDisabled]}>
                  {resendLoading ? "Sending..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>
                  Resend in {formatTime(countdown)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Verifying your email...</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  backButtonText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    height: 200,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body1,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emailText: {
    ...Typography.body1,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#F0F8FF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  messageText: {
    ...Typography.body2,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpContainer: {
    marginBottom: Spacing.xl,
  },
  otpLabel: {
    ...Typography.body1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  otpInputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  otpInput: {
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
  },
  otpHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  resendSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  resendText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  resendButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  resendButtonText: {
    ...Typography.body2,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  countdownContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countdownText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.lg,
  },
  loadingText: {
    ...Typography.body1,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
