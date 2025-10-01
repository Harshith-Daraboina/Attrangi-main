// Onboarding4.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Spacing, Typography, Shadows, Colors, BorderRadius } from '../../styles/designSystem';
import CircularProgress from '../../components/CircularProgress';

const { height } = Dimensions.get('window');



export default function Onboarding4({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* Background Gradient */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.primary }]} />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <CircularProgress progress={4} total={4} size={50} strokeWidth={3} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Let's explore our diversity
          </Text>
          <Text style={styles.subtitle}>
            Join our inclusive community and discover the support you need to thrive
          </Text>
        </View>

        {/* Success Animation */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.replace('SignIn')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: Colors.primary,
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    color: Colors.surface,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.md,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  checkmark: {
    fontSize: 40,
    color: Colors.success,
    fontWeight: 'bold',
  },
  navigationContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  getStartedButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
