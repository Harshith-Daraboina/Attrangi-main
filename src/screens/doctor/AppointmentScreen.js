import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';

export default function AppointmentScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [list, setList] = useState([]);

  useEffect(() => {
    api.listAppointments().then(setList);
  }, []);

  return (
    <View style={g.screen}>
      <Text style={g.heading}>Appointments</Text>
      {list.length === 0 ? <Text style={g.paragraph}>No appointments yet.</Text> : null}
      {list.map((a) => (
        <View key={a.id} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 8 }}>
          <Text style={{ fontWeight: '700' }}>Doctor: {a.doctorId}</Text>
          <Text>Date: {new Date(a.dateISO).toLocaleString()}</Text>
          <Text>Status: {a.status}</Text>
        </View>
      ))}
    </View>
  );
}


