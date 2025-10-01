import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';

export default function Card({ title, subtitle, right, children, style, onPress }) {
  return (
    <View style={[styles.card, style]} onTouchEnd={onPress}>
      {(title || subtitle || right) && (
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  right: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.any,
  onPress: PropTypes.func,
};

Card.defaultProps = {
  title: null,
  subtitle: null,
  right: null,
  children: null,
  style: null,
  onPress: undefined,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.heading3,
    marginBottom: 0,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});


