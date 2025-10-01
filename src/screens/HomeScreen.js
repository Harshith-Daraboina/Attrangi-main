import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeSettings } from '../styles/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const { role } = useThemeSettings();

  const actions = useMemo(() => {
    if (role === 'caregiver') {
      return [
        { key: 'reports', label: 'Patient Reports', icon: 'stats-chart', onPress: () => navigation.navigate('ReportCaregiver') },
        { key: 'guides', label: 'Guides', icon: 'book', onPress: () => navigation.navigate('GuidesScreen') },
        { key: 'community', label: 'Community', icon: 'chatbubble-ellipses', onPress: () => navigation.navigate('Community') },
        { key: 'profile', label: 'Profile', icon: 'person-circle', onPress: () => navigation.navigate('PatientProfile') },
      ];
    }
    if (role === 'doctor') {
      return [
        { key: 'appointments', label: 'Appointments', icon: 'calendar', onPress: () => navigation.navigate('Appointments') },
        { key: 'patients', label: 'Patient List', icon: 'people', onPress: () => navigation.navigate('Patients') },
        { key: 'prescriptions', label: 'Prescriptions', icon: 'medkit', onPress: () => navigation.navigate('PrescriptionScreen') },
        { key: 'profile', label: 'Profile', icon: 'person-circle', onPress: () => navigation.navigate('DoctorProfile') },
      ];
    }
    // default patient
    return [
      { key: 'mood', label: 'Mood Check', icon: 'happy', onPress: () => navigation.navigate('Mood') },
      { key: 'consult', label: 'Consult Doctor', icon: 'medkit', onPress: () => navigation.navigate('DoctorList') },
      { key: 'activities', label: 'Guided Activities', icon: 'list', onPress: () => navigation.navigate('Activities') },
      { key: 'community', label: 'Community', icon: 'chatbubble-ellipses', onPress: () => navigation.navigate('Community') },
      { key: 'profile', label: 'Profile', icon: 'person-circle', onPress: () => navigation.navigate('PatientProfile') },
    ];
  }, [role, navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.greeting}>Hi, there! How are you today?</Text>
      <Card style={styles.cardInfo}>
        <Text style={styles.infoText}>Quick actions</Text>
      </Card>
      <FlatList
        data={actions}
        keyExtractor={(item) => item.key}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.actionCard} onPress={item.onPress} activeOpacity={0.9}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  greeting: { ...Typography.heading2, marginBottom: Spacing.md },
  cardInfo: { marginBottom: Spacing.sm },
  infoText: { ...Typography.caption },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: { fontWeight: '600', color: Colors.textPrimary },
});


