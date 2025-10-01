import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import Button from '../../components/Button';

export default function PrescriptionScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [title, setTitle] = useState('Deep Breathing');
  const [steps, setSteps] = useState('Inhale 4s\nHold 4s\nExhale 4s');
  const [status, setStatus] = useState(null);

  return (
    <View style={g.screen}>
      <Text style={g.heading}>Prescribe Activity</Text>
      <Text style={g.paragraph}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12 }} />
      <Text style={[g.paragraph, { marginTop: 12 }]}>Steps (one per line)</Text>
      <TextInput value={steps} onChangeText={setSteps} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, minHeight: 90 }} multiline />
      <Button title="Save (Mock)" onPress={() => setStatus('Saved (mock)') } />
      {status ? <Text style={{ marginTop: 8 }}>{status}</Text> : null}
    </View>
  );
}


