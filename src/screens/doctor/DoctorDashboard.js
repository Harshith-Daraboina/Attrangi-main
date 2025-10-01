import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';

export default function DoctorDashboard({ navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  return (
    <View style={g.screen}>
      <Text style={g.heading}>Doctor Dashboard</Text>
      <Card title="Manage">
        <Button title="Session Dashboard" onPress={() => navigation.navigate('SessionDashboard')} />
        <Button title="Appointments" onPress={() => navigation.navigate('AppointmentScreen')} variant="secondary" />
        <Button title="Patients List" onPress={() => navigation.navigate('PatientListScreen')} />
        <Button title="Prescriptions" onPress={() => navigation.navigate('PrescriptionScreen')} variant="secondary" />
        <Button title="Reports" onPress={() => navigation.navigate('ReportDoctor')} />
      </Card>
    </View>
  );
}


