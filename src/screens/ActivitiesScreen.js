import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Card from '../components/Card';

const CATEGORIES = [
  { key: 'Breathing', description: 'Relax with guided breathwork' },
  { key: 'Meditation', description: 'Mindfulness and calm' },
  { key: 'CBT', description: 'Cognitive Behavioral exercises' },
];

export default function ActivitiesScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Guided Activities</Text>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Card title={item.key} subtitle={item.description} onPress={() => navigation.navigate('ActivityDetail', { category: item.key })} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
});


