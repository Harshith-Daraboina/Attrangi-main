import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/designSystem';

const ComingSoon = ({ onPress, title = "Feature Coming Soon", description = "This feature is under development and will be available soon." }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading3,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '600',
  },
});

export default ComingSoon;
