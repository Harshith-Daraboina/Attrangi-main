import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Button from '../components/Button';

// Structured doctor profile with required professional fields
export default function DoctorProfileScreen() {
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    license: '',
    years: '',
    clinic: '',
    telehealth: false,
    languages: [],
    bio: '',
  });

  const toggleLang = (value) => {
    setForm((prev) => {
      const has = prev.languages.includes(value);
      return { ...prev, languages: has ? prev.languages.filter((v) => v !== value) : [...prev.languages, value] };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>About you</Text>
      <Text style={styles.caption}>Provide your professional information for patients and caregivers.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} placeholder="Dr. Jane Doe" placeholderTextColor={Colors.textSecondary} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Specialization</Text>
        <TextInput style={styles.input} placeholder="e.g., Psychiatry, Clinical Psychologist" placeholderTextColor={Colors.textSecondary} value={form.specialization} onChangeText={(t) => setForm({ ...form, specialization: t })} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>License number</Text>
        <TextInput style={styles.input} placeholder="License / Registration" placeholderTextColor={Colors.textSecondary} value={form.license} onChangeText={(t) => setForm({ ...form, license: t })} />
      </View>

      <View style={styles.row2}>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>Years of experience</Text>
          <TextInput style={styles.input} placeholder="e.g., 8" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={form.years} onChangeText={(t) => setForm({ ...form, years: t })} />
        </View>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>Clinic/Hospital</Text>
          <TextInput style={styles.input} placeholder="Affiliation" placeholderTextColor={Colors.textSecondary} value={form.clinic} onChangeText={(t) => setForm({ ...form, clinic: t })} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Languages</Text>
        <View style={styles.chipsRow}>
          {['English','Hindi','Spanish','French'].map((l) => (
            <TouchableOpacity key={l} style={[styles.chip, form.languages.includes(l) && styles.chipActive]} onPress={() => toggleLang(l)}>
              <Text style={[styles.chipText, form.languages.includes(l) && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Short bio</Text>
        <TextInput style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]} multiline placeholder="Share your approach and specialties" placeholderTextColor={Colors.textSecondary} value={form.bio} onChangeText={(t) => setForm({ ...form, bio: t })} />
      </View>

      <Button title="Save Profile" onPress={() => console.log('Doctor profile saved', form)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: Spacing.lg, backgroundColor: Colors.background },
  title: { ...Typography.heading1, marginBottom: Spacing.xs },
  caption: { ...Typography.caption, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm, marginBottom: Spacing.md },
  label: { ...Typography.label },
  input: { marginTop: Spacing.xs, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.textPrimary },
  row2: { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  chip: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary },
  chipText: { color: Colors.textPrimary },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },
});


