import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/Button';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import { Spacing, Colors, BorderRadius } from '../../styles/designSystem';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ScheduleScreen({ route, navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { doctor, doctorId } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [status, setStatus] = useState(null);

  const onConfirm = () => {
    // Navigate to payment screen with doctor and appointment details
    navigation.navigate('Payment', { 
      doctor: doctor || { id: doctorId }, 
      appointmentDate: date,
      appointmentTime: date.toLocaleTimeString()
    });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={g.screen}>
      <Text style={g.heading}>Schedule Appointment</Text>
      <Text style={[g.paragraph, { marginBottom: Spacing.lg }]}>
        Select a date and time for your consultation
      </Text>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Selected Date & Time</Text>
        <Text style={[g.paragraph, { 
          textAlign: 'center', 
          padding: Spacing.md, 
          backgroundColor: Colors.background, 
          borderRadius: BorderRadius.md,
          marginVertical: Spacing.sm
        }]}>
          {date.toLocaleString()}
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button 
            title="Change Date" 
            onPress={() => setShowDatePicker(true)} 
            variant="outline"
            style={{ flex: 1, marginRight: Spacing.xs }}
          />
          <Button 
            title="Change Time" 
            onPress={() => setShowTimePicker(true)} 
            variant="outline"
            style={{ flex: 1, marginLeft: Spacing.xs }}
          />
        </View>
      </View>

      <Button 
        title="Proceed to Payment" 
        onPress={onConfirm} 
        style={{ marginBottom: Spacing.md }}
      />

      {status && (
        <View style={[g.card, { backgroundColor: Colors.success + '20', borderLeftWidth: 4, borderLeftColor: Colors.success }]}>
          <Text style={[g.paragraph, { color: Colors.success }]}>{status}</Text>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
    </ScrollView>
  );
}