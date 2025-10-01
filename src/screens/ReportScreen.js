import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeSettings } from '../styles/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';

export default function ReportScreen() {
  const { role } = useThemeSettings();
  const weekMoods = [6, 5, 7, 4, 8, 5, 6];
  const weekActivities = [1, 0, 2, 1, 0, 1, 2];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Reports & Insights</Text>
      {role === 'patient' && (
        <View style={styles.card}>
          <Text style={styles.body}>You completed 4 activities this week! Keep it up 🎉</Text>
        </View>
      )}
      {role === 'caregiver' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient mood and activity</Text>
          <View style={styles.chartsRow}>
            {weekMoods.map((v, i) => (
              <View key={`m${i}`} style={styles.chartItem}>
                <View style={[styles.barMood, { height: 12 + v * 8 }]} />
                <Text style={styles.chartLabel}>D{i+1}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.chartsRow, { marginTop: Spacing.md }]}>
            {weekActivities.map((v, i) => (
              <View key={`a${i}`} style={styles.chartItem}>
                <View style={[styles.barActivity, { height: 8 + v * 14 }]} />
                <Text style={styles.chartLabel}>D{i+1}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {role === 'doctor' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sessions and trends</Text>
          <Text style={styles.body}>- 12 sessions this week</Text>
          <Text style={styles.body}>- Median mood: 6</Text>
          <Text style={styles.body}>- Activities done: 9</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  sectionTitle: { ...Typography.heading3 },
  body: { ...Typography.paragraph, marginBottom: Spacing.xs },
  chartsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartItem: { flex: 1, alignItems: 'center' },
  barMood: { width: 14, backgroundColor: Colors.primary, borderRadius: BorderRadius.sm },
  barActivity: { width: 14, backgroundColor: '#7BC67B', borderRadius: BorderRadius.sm },
  chartLabel: { ...Typography.caption, marginTop: Spacing.xs },
});


