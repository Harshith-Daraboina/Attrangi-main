import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Spacing, BorderRadius, Typography } from '../styles/designSystem';

// Using RN community Slider is deprecated; Expo SDK 53 RN includes Slider via react-native
export default function MoodSlider({ value, onChange }) {
  const [internal, setInternal] = useState(value ?? 5);
  const emojis = useMemo(() => ['😢','😟','🙁','😕','😐','🙂','😊','😄','😸','🤩'], []);
  const select = (idx) => {
    const v = idx + 1;
    setInternal(v);
    onChange && onChange(v);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.row}>
        {emojis.map((e, i) => (
          <TouchableOpacity key={i} style={[styles.dot, internal - 1 === i && styles.dotActive]} onPress={() => select(i)}>
            <Text style={styles.dotText}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.emoji}>{emojis[internal - 1]} {internal}/10</Text>
    </View>
  );
}

MoodSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

MoodSlider.defaultProps = {
  value: 5,
  onChange: undefined,
};

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.md },
  label: { ...Typography.heading3 },
  emoji: { marginTop: Spacing.sm, fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dot: {
    backgroundColor: Colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotActive: { borderColor: Colors.primary },
  dotText: { fontSize: 18 },
});


