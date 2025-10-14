import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';
import { convertToISOFormat, convertToDisplayFormat } from '../../utils/dateUtils';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function CaregiverOnboardingScreen({ navigation, route }) {
  const { palette } = useThemeSettings();
  const { refreshUser } = useAuth();
  const { userData } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    gender: '',
    dateOfBirth: userData?.dateOfBirth || '',
    relationToPatient: '',
    patientId: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [additionalData, setAdditionalData] = useState({
    inviteCode: '',
    medicalNotes: '',
    profilePicture: null,
  });

  const relations = [
    'Parent',
    'Sibling',
    'Spouse/Partner',
    'Child',
    'Friend',
    'Guardian',
    'Other Family Member',
    'Professional Caregiver',
  ];

  const steps = [
    'Personal Information',
    'Profile Picture',
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      updateFormData('dateOfBirth', isoDate);
      setSelectedDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - save profile data
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Prepare profile data for API
      const profileData = {
        profile: {
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
          gender: formData.gender,
          phone: formData.phone,
          bio: `Caregiver for ${formData.relationToPatient}`,
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            privacy: {
              profileVisibility: 'private',
              showOnlineStatus: true
            }
          }
        },
        isProfileComplete: true
      };

      // Save profile to backend
      const response = await api.updateProfile(profileData);
      
      if (response.success) {
        // Refresh user data
        await refreshUser();
        
        Alert.alert(
          'Welcome to Attrangi!',
          'Your caregiver profile has been created successfully. You can now support your loved one on their wellness journey.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('MainCaregiver'),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Caregiver onboarding completion error:', error);
      Alert.alert(
        'Error',
        'Failed to complete profile setup. Please try again.',
        [
          { text: 'Retry', onPress: () => completeOnboarding() },
          { text: 'Skip for now', onPress: () => navigation.navigate('MainCaregiver') }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: index <= currentStep ? palette.primary : Colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                { color: index <= currentStep ? '#fff' : Colors.textTertiary },
              ]}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              { color: index <= currentStep ? palette.primary : Colors.textTertiary },
            ]}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Personal Information
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Let's start with your basic information
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.fullName}
          onChangeText={value => updateFormData('fullName', value)}
          placeholder="Enter your full name"
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>Email Address</Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
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
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.phone}
          onChangeText={value => updateFormData('phone', value)}
          placeholder="Enter your phone number"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map(gender => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderOption,
                {
                  backgroundColor: formData.gender === gender ? palette.primary : '#fff',
                  borderColor: formData.gender === gender ? palette.primary : Colors.border,
                },
              ]}
              onPress={() => updateFormData('gender', gender)}
            >
              <Text
                style={[
                  styles.genderText,
                  { color: formData.gender === gender ? '#fff' : palette.text },
                ]}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>Date of Birth</Text>
        <TouchableOpacity 
          style={[styles.input, { borderColor: Colors.border }]} 
          onPress={showDatePickerModal}
        >
          <Text style={[
            styles.dateText, 
            { color: formData.dateOfBirth ? palette.text : Colors.textTertiary }
          ]}>
            {formData.dateOfBirth ? convertToDisplayFormat(formData.dateOfBirth) : 'DD/MM/YYYY'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPatientConnection = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Connect with Patient
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Link your profile with the patient you're caring for
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Your Relationship to Patient
        </Text>
        <View style={styles.optionsContainer}>
          {relations.map(relation => (
            <TouchableOpacity
              key={relation}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.relationToPatient === relation ? palette.primary : '#fff',
                  borderColor: formData.relationToPatient === relation ? palette.primary : Colors.border,
                },
              ]}
              onPress={() => updateFormData('relationToPatient', relation)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: formData.relationToPatient === relation ? '#fff' : palette.text },
                ]}
              >
                {relation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.connectionMethod}>
        <Text style={[Typography.label, { color: palette.text, marginBottom: Spacing.md }]}>
          How would you like to connect?
        </Text>
        
        <View style={styles.methodOption}>
          <View style={styles.methodHeader}>
            <Ionicons name="person-outline" size={24} color={palette.primary} />
            <Text style={[Typography.heading3, { color: palette.text, marginLeft: Spacing.sm }]}>
              Patient ID
            </Text>
          </View>
          <Text style={[Typography.caption, { marginBottom: Spacing.sm }]}>
            If you know the patient's ID number
          </Text>
          <TextInput
            style={[styles.input, { borderColor: Colors.border }]}
            value={formData.patientId}
            onChangeText={value => updateFormData('patientId', value)}
            placeholder="Enter patient ID"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.methodOption}>
          <View style={styles.methodHeader}>
            <Ionicons name="link-outline" size={24} color={palette.primary} />
            <Text style={[Typography.heading3, { color: palette.text, marginLeft: Spacing.sm }]}>
              Invite Code
            </Text>
          </View>
          <Text style={[Typography.caption, { marginBottom: Spacing.sm }]}>
            If the patient shared an invite code with you
          </Text>
          <TextInput
            style={[styles.input, { borderColor: Colors.border }]}
            value={formData.inviteCode}
            onChangeText={value => updateFormData('inviteCode', value)}
            placeholder="Enter invite code"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={palette.primary} />
        <Text style={[Typography.caption, { color: palette.text, marginLeft: Spacing.sm, flex: 1 }]}>
          Don't worry if you don't have this information now. You can connect with the patient later from your profile.
        </Text>
      </View>
    </View>
  );

  const renderMedicalNotes = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Medical Notes & Observations
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Share any important observations about the patient's condition
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Medical Notes & Observations
        </Text>
        <TextInput
          style={[styles.textArea, { borderColor: Colors.border }]}
          value={formData.medicalNotes}
          onChangeText={value => updateFormData('medicalNotes', value)}
          placeholder="Share any important observations about the patient's condition, behavior patterns, medications, or other relevant information..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.notesInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
          <Text style={[Typography.caption, { color: palette.text, marginLeft: Spacing.sm }]}>
            Current medications and dosages
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
          <Text style={[Typography.caption, { color: palette.text, marginLeft: Spacing.sm }]}>
            Behavioral patterns and triggers
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
          <Text style={[Typography.caption, { color: palette.text, marginLeft: Spacing.sm }]}>
            Recent changes in condition
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
          <Text style={[Typography.caption, { color: palette.text, marginLeft: Spacing.sm }]}>
            Emergency contact preferences
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProfilePicture = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Profile Picture
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Add a photo for your profile
      </Text>

      <View style={styles.profilePictureContainer}>
        <View style={[styles.profilePicturePlaceholder, { borderColor: palette.primary }]}>
          {formData.profilePicture ? (
            <Image source={formData.profilePicture} style={styles.profilePicture} />
          ) : (
            <Ionicons name="person" size={60} color={palette.primary} />
          )}
        </View>
        <TouchableOpacity style={[styles.uploadButton, { marginTop: Spacing.md }]}>
          <Ionicons name="camera" size={20} color={palette.primary} />
          <Text style={[styles.uploadText, { color: palette.primary }]}>
            Take Photo or Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderProfilePicture();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Caregiver Onboarding
        </Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: palette.primary }]}
            onPress={prevStep}
          >
            <Text style={[styles.buttonText, { color: palette.primary }]}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: palette.primary }]}
          onPress={nextStep}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, { color: '#fff' }]}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
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
  },
  backButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  stepContent: {
    paddingBottom: Spacing.xl,
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
    ...Shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 120,
    ...Shadows.sm,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  connectionMethod: {
    marginTop: Spacing.lg,
  },
  methodOption: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  notesInfo: {
    marginTop: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  uploadText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
  profilePictureContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
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
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
