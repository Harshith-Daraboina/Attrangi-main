import React from 'react';
import { View, Text } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';

export default function PatientListScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const patients = [
    { id: 'p1', name: 'Aarav' },
    { id: 'p2', name: 'Ishita' },
  ];
  return (
    <View style={g.screen}>
      <Text style={g.heading}>Assigned Patients</Text>
      {patients.map((p) => (
        <View key={p.id} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 8 }}>
          <Text style={{ fontWeight: '700' }}>{p.name}</Text>
        </View>
      ))}
    </View>
  );
}


