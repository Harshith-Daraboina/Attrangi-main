import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ProfileSetupScreen({ navigation, route }) {
  const { palette } = useThemeSettings();
  const { user, refreshUser } = useAuth();
  const { userRole } = route.params || { userRole: 'patient' };
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    profilePicture: null,
    // Role-specific fields
    ...(userRole === 'doctor' && {
      specialization: '',
      consultationFee: '',
      yearsOfExperience: '',
    }),
    ...(userRole === 'patient' && {
      currentChallenges: [],
      emergencyContact: { name: '', phone: '' },
    }),
    ...(userRole === 'caregiver' && {
      relationToPatient: '',
      patientId: '',
    }),
  });

  // Load existing user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        profilePicture: user.profile?.profilePicture || null,
        // Load role-specific data
        ...(userRole === 'patient' && {
          currentChallenges: user.profile?.currentChallenges || [],
          emergencyContact: {
            name: user.profile?.emergencyContact?.name || '',
            phone: user.profile?.emergencyContact?.phone || ''
          },
        }),
        ...(userRole === 'caregiver' && {
          relationToPatient: user.profile?.relationToPatient || '',
          patientId: user.profile?.patientId || '',
        }),
      }));
    }
  }, [user, userRole]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare profile data for API
      const profileData = {
        name: formData.fullName,
        profile: {
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          phone: formData.phone,
          bio: formData.bio,
          profilePicture: formData.profilePicture,
          // Role-specific fields
          ...(userRole === 'patient' && {
            currentChallenges: formData.currentChallenges,
            emergencyContact: formData.emergencyContact,
          }),
          ...(userRole === 'caregiver' && {
            relationToPatient: formData.relationToPatient,
            patientId: formData.patientId,
          }),
        },
        isProfileComplete: true
      };

      // Save profile to backend
      const response = await api.updateProfile(profileData);
      
      if (response.success) {
        // Refresh user data to reflect changes
        await refreshUser();
        
        Alert.alert(
          'Profile Updated',
          'Your profile has been updated successfully.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderRoleSpecificFields = () => {
    switch (userRole) {
      case 'doctor':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Specialization
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.specialization}
                onChangeText={value => updateFormData('specialization', value)}
                placeholder="e.g., Clinical Psychology"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Consultation Fee (₹)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.consultationFee}
                onChangeText={value => updateFormData('consultationFee', value)}
                placeholder="Enter consultation fee"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Years of Experience
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.yearsOfExperience}
                onChangeText={value => updateFormData('yearsOfExperience', value)}
                placeholder="Enter years of experience"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
              />
            </View>
          </>
        );
        
      case 'patient':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Current Challenges
              </Text>
              <TextInput
                style={[styles.textArea, { borderColor: Colors.border, color: palette.text }]}
                value={formData.currentChallenges.join(', ')}
                onChangeText={value => updateFormData('currentChallenges', value.split(', '))}
                placeholder="e.g., Anxiety, Depression"
                placeholderTextColor={Colors.textTertiary}
                multiline
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Emergency Contact Name
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.emergencyContact.name}
                onChangeText={value => updateFormData('emergencyContact', { ...formData.emergencyContact, name: value })}
                placeholder="Enter emergency contact name"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Emergency Contact Phone
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.emergencyContact.phone}
                onChangeText={value => updateFormData('emergencyContact', { ...formData.emergencyContact, phone: value })}
                placeholder="Enter emergency contact phone"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </>
        );
        
      case 'caregiver':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Relation to Patient
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.relationToPatient}
                onChangeText={value => updateFormData('relationToPatient', value)}
                placeholder="e.g., Parent, Sibling, Spouse"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[Typography.label, { color: palette.text }]}>
                Patient ID
              </Text>
              <TextInput
                style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
                value={formData.patientId}
                onChangeText={value => updateFormData('patientId', value)}
                placeholder="Enter patient ID"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Profile Setup
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <View style={[styles.profilePicturePlaceholder, { borderColor: palette.primary }]}>
              {formData.profilePicture ? (
                <Image source={formData.profilePicture} style={styles.profilePicture} />
              ) : (
                <Ionicons name="person" size={60} color={palette.primary} />
              )}
            </View>
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="camera" size={20} color={palette.primary} />
              <Text style={[styles.uploadText, { color: palette.primary }]}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.lg }]}>
            Basic Information
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[Typography.label, { color: palette.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
              value={formData.fullName}
              onChangeText={value => updateFormData('fullName', value)}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.label, { color: palette.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.label, { color: palette.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { borderColor: Colors.border, color: palette.text }]}
              value={formData.phone}
              onChangeText={value => updateFormData('phone', value)}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.label, { color: palette.text }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { borderColor: Colors.border, color: palette.text }]}
              value={formData.bio}
              onChangeText={value => updateFormData('bio', value)}
              placeholder="Tell us about yourself..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Role-Specific Information */}
        <View style={styles.section}>
          <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.lg }]}>
            {userRole === 'doctor' ? 'Professional Information' : 
             userRole === 'patient' ? 'Health Information' : 
             'Care Information'}
          </Text>
          {renderRoleSpecificFields()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: palette.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: palette.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: palette.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: '#fff',
    ...Shadows.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  saveButton: {
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  profilePictureContainer: {
    alignItems: 'center',
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginBottom: Spacing.md,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  uploadText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: '#fff',
    ...Shadows.lg,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    marginLeft: Spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
