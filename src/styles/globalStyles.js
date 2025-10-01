import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from './designSystem';

export default function createGlobalStyles({ palette, isLargeText }) {
  const scaleFactor = isLargeText ? 1.2 : 1;
  
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 50,
      padding: Spacing.md,
    },
    container: {
      flex: 1,
      padding: Spacing.md,
    },
    heading: {
      fontSize: Typography.heading1.fontSize * scaleFactor,
      fontWeight: '700',
      color: Colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    subheading: {
      fontSize: Typography.heading2.fontSize * scaleFactor,
      fontWeight: '600',
      color: Colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    paragraph: {
      fontSize: Typography.body.fontSize * scaleFactor,
      color: Colors.textPrimary,
      lineHeight: 22 * scaleFactor,
    },
    caption: {
      fontSize: Typography.caption.fontSize * scaleFactor,
      color: Colors.textSecondary,
    },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginVertical: Spacing.xs,
      ...Shadows.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    primaryText: {
      color: Colors.primary,
    },
    successText: {
      color: Colors.success,
    },
    warningText: {
      color: Colors.warning,
    },
  });
}