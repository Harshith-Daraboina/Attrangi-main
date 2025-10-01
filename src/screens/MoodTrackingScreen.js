import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Button from '../components/Button';
import MoodSlider from '../components/MoodSlider';

export default function MoodTrackingScreen() {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');

  const saveMood = () => {
    // mock save
    console.log('Saved mood:', { mood, note });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mood Check-in</Text>
      <MoodSlider value={mood} onChange={setMood} />

      <View style={styles.inputCard}>
        <Text style={styles.fieldLabel}>Add a note (optional)</Text>
        <TextInput
          placeholder="Write a short note about your day..."
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
          value={note}
          onChangeText={setNote}
          multiline
        />
        <View style={styles.voiceHint}> 
          <Text style={styles.caption}>Voice input coming soon</Text>
        </View>
      </View>

      <Button title="Save" onPress={saveMood} />

      <View style={styles.trendCard}>
        <Text style={styles.sectionTitle}>This week</Text>
        <View style={styles.chartRow}>
          {useMemo(() => [6,5,7,4,8,5,6], []).map((v, i) => (
            <View key={i} style={styles.chartItem}>
              <View style={[styles.bar, { height: 12 + v * 8 }]} />
              <Text style={styles.chartLabel}>D{i+1}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
  inputCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm, marginBottom: Spacing.lg },
  fieldLabel: { ...Typography.label },
  input: { minHeight: 90, textAlignVertical: 'top', color: Colors.textPrimary },
  voiceHint: { paddingTop: Spacing.xs },
  caption: { ...Typography.caption },
  trendCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm, marginTop: Spacing.md },
  sectionTitle: { ...Typography.heading3 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: Spacing.md },
  chartItem: { alignItems: 'center', flex: 1 },
  bar: { width: 14, backgroundColor: Colors.primary, borderRadius: BorderRadius.sm },
  chartLabel: { ...Typography.caption, marginTop: Spacing.xs },
});


