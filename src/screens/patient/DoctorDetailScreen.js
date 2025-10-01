import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { getTherapistById } from '../../services/demoData';
import Button from '../../components/Button';
import { Spacing, Colors } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorDetailScreen({ route, navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { id } = route.params;
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const doctorData = await getTherapistById(id);
        setDoctor(doctorData);
      } catch (error) {
        console.error('Error loading doctor:', error);
      }
    };
    
    loadDoctor();
  }, [id]);

  if (!doctor) return <View style={g.screen}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={g.screen}>
      <View style={[g.card, { alignItems: 'center', marginBottom: Spacing.md }]}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: Colors.primaryLight + '40',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacing.md
        }}>
          <Ionicons name="medical" size={40} color={Colors.primary} />
        </View>
        <Text style={g.heading}>{doctor.name}</Text>
        <Text style={[g.paragraph, { color: Colors.primary, fontWeight: '600' }]}>
          {doctor.specialization}
        </Text>
      </View>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Availability</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
          <Ionicons name="time" size={18} color={Colors.textSecondary} style={{ marginRight: Spacing.sm }} />
          <Text style={g.paragraph}>{doctor.availability}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
          <Ionicons name="calendar" size={18} color={Colors.textSecondary} style={{ marginRight: Spacing.sm }} />
          <Text style={g.paragraph}>Next available: Tomorrow</Text>
        </View>
      </View>

      <View style={g.card}>
        <Text style={g.subheading}>About Dr. {doctor.name.split(' ')[0]}</Text>
        <Text style={[g.paragraph, { marginBottom: Spacing.md }]}>
          Specialist in {doctor.specialization} with over 10 years of experience. 
          Known for patient-centered care and excellent bedside manner.
        </Text>
        
        <Button 
          title="Schedule Appointment" 
          onPress={() => navigation.navigate('Schedule', { doctorId: id })} 
          icon="calendar"
        />
      </View>
    </ScrollView>
  );
}