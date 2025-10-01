// Onboarding2.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Spacing, Typography, Shadows, Colors, BorderRadius } from '../../styles/designSystem';
import CircularProgress from '../../components/CircularProgress';

const { width, height } = Dimensions.get('window');




export default function Onboarding2({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />

      {/* Background Gradient */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.primary }]} />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <CircularProgress progress={2} total={4} size={50} strokeWidth={3} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Connect. Learn. Grow
          </Text>
          <Text style={styles.subtitle}>
            Connect with professionals, learn new skills, and grow stronger every day
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../assets/doc4.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Onboarding3')}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
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
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.4,
    maxHeight: 300,
  },
  navigationContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  nextButton: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  nextButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.7,
  },
});
