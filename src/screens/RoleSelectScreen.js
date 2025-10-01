import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';
import DebugNavigation from '../components/DebugNavigation';
import QuickAccess from '../components/QuickAccess';

const { width } = Dimensions.get('window');

export default function RoleSelectScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  
  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Track your mental health journey',
      icon: 'person-outline',
      color: '#6c63ff',
      features: ['Mood Tracking', 'Therapy Sessions', 'Activities'],
    },
    {
      id: 'caregiver',
      title: 'Caregiver',
      description: 'Support your loved one\'s journey',
      icon: 'heart-outline',
      color: '#5267df',
      features: ['Patient Monitoring', 'Session Support', 'Community'],
    },
    {
      id: 'therapist',
      title: 'Therapist',
      description: 'Manage your practice',
      icon: 'medical-outline',
      color: '#2a7f62',
      features: ['Patient Management', 'Session Notes', 'Resources'],
    },
  ];

  const handleRoleSelection = async (roleId) => {
    try {
      // Update user role in backend
      await updateProfile({ role: roleId });
      
      // Navigate to the appropriate onboarding screen based on role
      switch (roleId) {
        case 'patient':
          navigation.navigate('PatientOnboarding');
          break;
        case 'caregiver':
          navigation.navigate('CaregiverOnboarding');
          break;
        case 'therapist':
          navigation.navigate('DoctorOnboarding');
          break;
        case 'doctor':
          navigation.navigate('DoctorOnboarding');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating role:', error);
      // Still navigate even if update fails
      navigation.navigate('PatientOnboarding');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Attrangi</Text>
        <Text style={styles.subtitle}>Choose your role to get started</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, { borderColor: role.color }]}
            onPress={() => handleRoleSelection(role.id)}
          >
            <View style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}>
              <Ionicons name={role.icon} size={32} color={role.color} />
            </View>
            
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
            
            <View style={styles.featuresContainer}>
              {role.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={role.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <View style={[styles.selectButton, { backgroundColor: role.color }]}>
              <Text style={styles.selectButtonText}>Select {role.title}</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change your role later in settings
        </Text>
      </View>

      {/* Quick Access - Direct Dashboard Navigation */}
      <QuickAccess navigation={navigation} />

      {/* Debug Screen Access */}
      <TouchableOpacity 
        style={styles.debugButton}
        onPress={() => navigation.navigate('Debug')}
      >
        <Text style={styles.debugButtonText}>🔧 Debug Screen</Text>
      </TouchableOpacity>

      {/* Debug Navigation - Remove in production */}
      <DebugNavigation navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xl * 2,
  },
  title: {
    ...Typography.heading1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    ...Shadows.md,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  roleTitle: {
    ...Typography.heading2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  roleDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  featuresContainer: {
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    ...Typography.caption,
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  selectButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: Colors.warning,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  debugButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
});