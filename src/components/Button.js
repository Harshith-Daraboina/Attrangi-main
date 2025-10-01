import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useThemeSettings } from '../styles/ThemeContext';
import { BorderRadius, Spacing, Shadows } from '../styles/designSystem';

export default function Button({ title, onPress, style, textStyle, disabled, variant }) {
  const { palette, isLargeText } = useThemeSettings();
  const primaryColor = palette?.primary || '#6c63ff'; // fallback color
  const computed = [
    styles.button,
    {
      backgroundColor: variant === 'secondary' ? '#fff' : primaryColor,
      borderColor: primaryColor,
    },
    style,
    disabled && { opacity: 0.6 },
  ];
  const textComputed = [
    styles.text,
    { color: variant === 'secondary' ? primaryColor : '#fff', fontSize: isLargeText ? 18 : 16 },
    textStyle,
  ];
  return (
    <TouchableOpacity onPress={onPress} style={computed} disabled={disabled} activeOpacity={0.85}>
      <Text style={textComputed}>{title}</Text>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.any,
  textStyle: PropTypes.any,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

Button.defaultProps = {
  onPress: () => {},
  style: null,
  textStyle: null,
  disabled: false,
  variant: 'primary',
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
    ...Shadows.sm,
  },
  text: {
    fontWeight: '700',
  },
});


