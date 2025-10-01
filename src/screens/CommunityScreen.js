import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Card from '../components/Card';

const GROUPS = {
  patient: [
    { id: 'pl1', name: 'Patient Lounge', description: 'General peer support' },
    { id: 'an1', name: 'Anonymous Share', description: 'Post anonymously' },
  ],
  caregiver: [
    { id: 'cg1', name: 'Caregiver Circle', description: 'Support and tips' },
  ],
};

export default function CommunityScreen({ navigation }) {
  const [tab, setTab] = useState('patient');

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Community</Text>
      <View style={styles.tabsRow}>
        {['patient','caregiver'].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'patient' ? 'Patient Lounge' : 'Caregiver Circle'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={GROUPS[tab]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card title={item.name} subtitle={item.description} onPress={() => navigation.navigate('Chat', { group: item })} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading1, marginBottom: Spacing.md },
  tabsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  tab: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  tabActive: { borderColor: Colors.primary },
  tabText: { color: Colors.textPrimary },
  tabTextActive: { color: Colors.primary, fontWeight: '600' },
});


