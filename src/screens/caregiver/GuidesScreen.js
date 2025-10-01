import React from 'react';
import { View, Text } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';

export default function GuidesScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const tips = [
    { title: 'Short instructions', body: 'Use short, clear steps and visuals.' },
    { title: 'Positive reinforcement', body: 'Praise small wins to build momentum.' },
    { title: 'Sensory breaks', body: 'Introduce 3-5 minute movement breaks.' },
  ];
  return (
    <View style={g.screen}>
      <Text style={g.heading}>Guides & Tips</Text>
      {tips.map((t, i) => (
        <View key={i} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 8 }}>
          <Text style={{ fontWeight: '700' }}>{t.title}</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>{t.body}</Text>
        </View>
      ))}
    </View>
  );
}


