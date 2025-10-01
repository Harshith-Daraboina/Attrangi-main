import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Button from '../components/Button';

export default function ArticleScreen({ route }) {
  const { article } = route.params || {};
  const [favorite, setFavorite] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>{article?.title || 'Article'}</Text>
      <Text style={styles.category}>{article?.category}</Text>
      <View style={styles.contentCard}>
        <Text style={styles.content}>Content coming soon. This is a placeholder for the article body.</Text>
      </View>
      <View style={styles.actionsRow}>
        <Button title={favorite ? 'Favorited' : 'Mark as Favorite'} variant="secondary" onPress={() => setFavorite(true)} />
        <Button title={completed ? 'Completed' : 'Mark as Complete'} onPress={() => setCompleted(true)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: Spacing.lg, backgroundColor: Colors.background },
  title: { ...Typography.heading1 },
  category: { ...Typography.caption, marginBottom: Spacing.md },
  contentCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  content: { ...Typography.paragraph },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, marginTop: Spacing.lg },
});


