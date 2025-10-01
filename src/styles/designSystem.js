import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#6C63FF',       // Main purple accent
  primaryLight: '#9AA0FF',  // Lighter purple
  success: '#2A7F62',       // Green for success states
  warning: '#D97706',       // Amber for warnings
  background: '#F9F9FF',    // Very light purple background
  surface: '#FFFFFF',       // White for cards/surfaces
  textPrimary: '#1F1F3A',   // Dark blue-gray for primary text
  textSecondary: '#666687', // Medium gray for secondary text
  textTertiary: '#A0A0B0',  // Light gray for tertiary text
  border: '#E4E4EF',        // Light gray for borders
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Typography = StyleSheet.create({
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  body: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
};