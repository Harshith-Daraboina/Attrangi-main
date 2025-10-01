import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../styles/designSystem';

const CircularProgress = ({ progress = 0, total = 4, size = 60, strokeWidth = 4 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View style={[styles.circle, styles.backgroundCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: strokeWidth 
      }]} />
      
      {/* Progress circle using border */}
      <View style={[styles.circle, styles.progressCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: Colors.primary,
        borderTopColor: Colors.primary,
        borderRightColor: progress >= 2 ? Colors.primary : Colors.border,
        borderBottomColor: progress >= 3 ? Colors.primary : Colors.border,
        borderLeftColor: progress >= 4 ? Colors.primary : Colors.border,
        transform: [{ rotate: '-90deg' }]
      }]} />
      
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>{progress}</Text>
        <Text style={styles.totalText}>/{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  backgroundCircle: {
    borderColor: Colors.border,
  },
  progressCircle: {
    borderColor: Colors.border,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    zIndex: 1,
  },
  progressText: {
    ...Typography.heading3,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  totalText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
});

export default CircularProgress;
