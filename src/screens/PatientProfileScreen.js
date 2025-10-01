import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Button from '../components/Button';

// Conversational, guided patient profile builder with options
export default function PatientProfileScreen() {
  const [answers, setAnswers] = useState({
    name: '',
    ageRange: '',
    primaryCondition: '',
    diagnosisYear: '',
    triggers: [],
    medications: '',
    therapy: '',
    goals: [],
  });

  const toggleMulti = (key, value) => {
    setAnswers((prev) => {
      const has = prev[key].includes(value);
      return { ...prev, [key]: has ? prev[key].filter((v) => v !== value) : [...prev[key], value] };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>About you</Text>
      <Text style={styles.caption}>We will ask a few quick questions to personalize your care. You can skip any question.</Text>

      <View style={styles.card}>
        <Text style={styles.q}>What should we call you?</Text>
        <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={Colors.textSecondary} value={answers.name} onChangeText={(t) => setAnswers({ ...answers, name: t })} />
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Your age range</Text>
        <View style={styles.chipsRow}>
          {['<18','18-25','26-35','36-50','50+'].map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, answers.ageRange === opt && styles.chipActive]} onPress={() => setAnswers({ ...answers, ageRange: opt })}>
              <Text style={[styles.chipText, answers.ageRange === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Primary condition</Text>
        <View style={styles.chipsRow}>
          {['Anxiety','Depression','ADHD','Autism','PTSD','Other'].map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, answers.primaryCondition === opt && styles.chipActive]} onPress={() => setAnswers({ ...answers, primaryCondition: opt })}>
              <Text style={[styles.chipText, answers.primaryCondition === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Year of diagnosis (approx.)</Text>
        <TextInput style={styles.input} placeholder="e.g., 2020" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={answers.diagnosisYear} onChangeText={(t) => setAnswers({ ...answers, diagnosisYear: t })} />
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Common triggers</Text>
        <View style={styles.chipsRow}>
          {['Work stress','Social settings','Sleep loss','Diet','Loud noise','Bright light'].map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, answers.triggers.includes(opt) && styles.chipActive]} onPress={() => toggleMulti('triggers', opt)}>
              <Text style={[styles.chipText, answers.triggers.includes(opt) && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Current medications</Text>
        <TextInput style={styles.input} placeholder="Optional" placeholderTextColor={Colors.textSecondary} value={answers.medications} onChangeText={(t) => setAnswers({ ...answers, medications: t })} />
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Therapy</Text>
        <View style={styles.chipsRow}>
          {['None','CBT','DBT','ACT','Other'].map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, answers.therapy === opt && styles.chipActive]} onPress={() => setAnswers({ ...answers, therapy: opt })}>
              <Text style={[styles.chipText, answers.therapy === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Your goals</Text>
        <View style={styles.chipsRow}>
          {['Reduce anxiety','Improve focus','Sleep better','Build routine','Social confidence'].map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, answers.goals.includes(opt) && styles.chipActive]} onPress={() => toggleMulti('goals', opt)}>
              <Text style={[styles.chipText, answers.goals.includes(opt) && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button title="Save Profile" onPress={() => console.log('Patient profile saved', answers)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: Spacing.lg, backgroundColor: Colors.background },
  title: { ...Typography.heading1, marginBottom: Spacing.xs },
  caption: { ...Typography.caption, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm, marginBottom: Spacing.md },
  q: { ...Typography.heading3 },
  input: { marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.textPrimary },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  chip: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary },
  chipText: { color: Colors.textPrimary },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },
});


