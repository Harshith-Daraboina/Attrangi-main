import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';

const QuickAccess = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const quickNavigate = async (role, screenName) => {
    try {
      // Update user role
      await updateProfile({ role });
      // Navigate to the screen
      navigation.navigate(screenName);
    } catch (error) {
      Alert.alert('Error', 'Navigation failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Quick Access</Text>
      <Text style={styles.subtitle}>Direct navigation to dashboards</Text>
      
      <View style={styles.buttonGrid}>
        <TouchableOpacity 
          style={[styles.button, styles.patientButton]} 
          onPress={() => quickNavigate('patient', 'MainPatient')}
        >
          <Ionicons name="person-outline" size={24} color={Colors.surface} />
          <Text style={styles.buttonText}>Patient Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.caregiverButton]} 
          onPress={() => quickNavigate('caregiver', 'MainCaregiver')}
        >
          <Ionicons name="heart-outline" size={24} color={Colors.surface} />
          <Text style={styles.buttonText}>Caregiver Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.therapistButton]} 
          onPress={() => quickNavigate('therapist', 'MainTherapist')}
        >
          <Ionicons name="medical-outline" size={24} color={Colors.surface} />
          <Text style={styles.buttonText}>Therapist Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current User: {user?.email || 'Not logged in'}</Text>
        <Text style={styles.infoText}>Current Role: {user?.role || 'None'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  title: {
    ...Typography.heading3,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonGrid: {
    gap: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  patientButton: {
    backgroundColor: '#6c63ff',
  },
  caregiverButton: {
    backgroundColor: '#5267df',
  },
  therapistButton: {
    backgroundColor: '#2a7f62',
  },
  buttonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});

export default QuickAccess;
