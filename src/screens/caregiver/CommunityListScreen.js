import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';

export default function CommunityListScreen({ navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  return (
    <View style={g.screen}>
      <Text style={g.heading}>Community Connect</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 8 }}
        onPress={() => navigation.navigate('ChatCaregiver', { channel: 'caregivers' })}
      >
        <Text style={{ fontWeight: '700' }}>Caregiver Circle</Text>
        <Text style={{ color: '#666' }}>Caregiver-only chat</Text>
      </TouchableOpacity>
    </View>
  );
}


