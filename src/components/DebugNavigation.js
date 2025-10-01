import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';

const DebugNavigation = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const handleSetRole = async (role) => {
    try {
      await updateProfile({ role });
      Alert.alert('Success', `Role set to ${role}. You can now navigate to the dashboard.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const handleNavigateToDashboard = (role) => {
    switch (role) {
      case 'patient':
        navigation.navigate('MainPatient');
        break;
      case 'caregiver':
        navigation.navigate('MainCaregiver');
        break;
      case 'therapist':
      case 'doctor':
        navigation.navigate('MainTherapist');
        break;
      default:
        Alert.alert('Error', 'Please select a role first');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Navigation</Text>
      <Text style={styles.subtitle}>Current User: {user.email}</Text>
      <Text style={styles.subtitle}>Current Role: {user.role || 'None'}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSetRole('patient')}
        >
          <Text style={styles.buttonText}>Set as Patient</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSetRole('caregiver')}
        >
          <Text style={styles.buttonText}>Set as Caregiver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSetRole('therapist')}
        >
          <Text style={styles.buttonText}>Set as Therapist</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.navButton]} 
          onPress={() => handleNavigateToDashboard(user.role)}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.navButton]} 
          onPress={() => navigation.navigate('RoleSelect')}
        >
          <Text style={styles.buttonText}>Role Selection</Text>
        </TouchableOpacity>
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
    borderColor: Colors.warning,
  },
  title: {
    ...Typography.heading3,
    color: Colors.warning,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  navigationContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    flex: 1,
    minWidth: 100,
  },
  navButton: {
    backgroundColor: Colors.success,
  },
  buttonText: {
    ...Typography.caption,
    color: Colors.surface,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DebugNavigation;
