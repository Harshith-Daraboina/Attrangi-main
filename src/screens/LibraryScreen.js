import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Card from '../components/Card';
import Button from '../components/Button';

const MOCK_ARTICLES = [
  { id: '1', title: 'Breathing 4-7-8', description: 'A quick technique to calm your nervous system', category: 'Breathing' },
  { id: '2', title: 'Body Scan Meditation', description: 'Mindfully relax each part of your body', category: 'Meditation' },
  { id: '3', title: 'Thought Records', description: 'CBT tool to challenge negative thoughts', category: 'CBT' },
  { id: '4', title: 'Sleep Hygiene', description: 'Lifestyle habits that improve sleep quality', category: 'Lifestyle' },
];

const CATEGORIES = ['All', 'Breathing', 'Meditation', 'CBT', 'Lifestyle'];

export default function LibraryScreen({ navigation }) {
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() =>
    category === 'All' ? MOCK_ARTICLES : MOCK_ARTICLES.filter(a => a.category === category),
  [category]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Self-help Library</Text>

      <View style={styles.chipsRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card title={item.title} subtitle={item.category} onPress={() => navigation.navigate('Article', { article: item })}>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.cardActions}>
              <Button title="Read" variant="secondary" onPress={() => navigation.navigate('Article', { article: item })} />
            </View>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  chip: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary },
  chipText: { color: Colors.textPrimary },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },
  description: { ...Typography.paragraph, marginTop: Spacing.xs },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: Spacing.sm },
});


