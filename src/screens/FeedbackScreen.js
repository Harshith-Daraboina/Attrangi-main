import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Button from '../components/Button';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Thanks for your feedback!</Text>
        <Text style={styles.caption}>We appreciate your help improving the app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>How was your session?</Text>
      <View style={styles.starsRow}>
        {[1,2,3,4,5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Text style={[styles.star, i <= rating && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.inputCard}>
        <TextInput
          placeholder="Any suggestions?"
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
      </View>
      <Button title="Submit" onPress={() => setSubmitted(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
  caption: { ...Typography.caption },
  starsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  star: { fontSize: 28, color: Colors.border },
  starActive: { color: '#FFC107' },
  inputCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm, marginBottom: Spacing.lg },
  input: { minHeight: 120, textAlignVertical: 'top', color: Colors.textPrimary },
});


