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

export default function DoctorOnboardingScreen({ navigation, route }) {
  const { palette } = useThemeSettings();
  const { user, refreshUser } = useAuth();
  const { userData } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    gender: '',
    dateOfBirth: userData?.dateOfBirth || '',
    medicalLicenseNumber: '',
    yearsOfExperience: '',
    specialization: '',
    languages: [],
    consultationFee: '',
    availability: {
      weekdays: [],
      timeSlots: [],
    },
    paymentDetails: {
      upiId: '',
      platform: '', // phonepe, gpay, paytm, etc.
    },
    profilePicture: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check if we're editing an existing profile
  useEffect(() => {
    if (user?.doctorProfile) {
      setIsEditing(true);
      const profile = user.doctorProfile;
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        gender: user.profile?.gender || '',
        dateOfBirth: user.profile?.dateOfBirth || '',
        medicalLicenseNumber: profile.licenseNumber || '',
        yearsOfExperience: profile.experience?.toString() || '',
        specialization: profile.specialization || '',
        languages: profile.languages || [],
        consultationFee: profile.consultationFee?.toString() || '',
        availability: {
          weekdays: Object.keys(profile.availability || {}).filter(day => 
            profile.availability[day] && profile.availability[day].length > 0
          ),
          timeSlots: [],
        },
        paymentDetails: {
          upiId: profile.paymentDetails?.upiId || '',
          platform: profile.paymentDetails?.platform || '',
        },
        profilePicture: null,
      });
    }
  }, [user]);

  const specializations = [
    'Psychology',
    'Psychiatry',
    'Speech Therapy',
    'Occupational Therapy',
    'Behavioral Therapy',
    'Cognitive Therapy',
    'Family Therapy',
    'Child Psychology',
    'Clinical Psychology',
    'Neuropsychology',
  ];

  const languages = [
    'English',
    'Hindi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
  ];

  const paymentPlatforms = [
    'PhonePe',
    'Google Pay',
    'Paytm',
    'Amazon Pay',
    'BHIM',
    'Other',
  ];

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
  ];

  const steps = [
    'Personal Information',
    'Professional Details',
    'Specialization & Languages',
    'Availability & Fees',
    'Payment Details',
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

  const updateAvailability = (field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  const updatePaymentDetails = (field, value) => {
    setFormData(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [field]: value },
    }));
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and save to backend
      await completeDoctorOnboarding();
    }
  };

  const completeDoctorOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Prepare doctor profile data
      const doctorProfile = {
        specialization: formData.specialization,
        licenseNumber: formData.medicalLicenseNumber,
        experience: parseInt(formData.yearsOfExperience) || 0,
        education: [
          {
            degree: 'MD',
            institution: 'Medical College',
            year: new Date().getFullYear() - parseInt(formData.yearsOfExperience) || 2020
          }
        ],
        languages: formData.languages,
        consultationFee: parseInt(formData.consultationFee) || 1000,
        bio: `Dr. ${formData.fullName} is a ${formData.specialization} specialist with ${formData.yearsOfExperience} years of experience.`,
        availability: {
          monday: formData.availability.weekdays.includes('Monday') ? [{ start: '09:00', end: '17:00' }] : [],
          tuesday: formData.availability.weekdays.includes('Tuesday') ? [{ start: '09:00', end: '17:00' }] : [],
          wednesday: formData.availability.weekdays.includes('Wednesday') ? [{ start: '09:00', end: '17:00' }] : [],
          thursday: formData.availability.weekdays.includes('Thursday') ? [{ start: '09:00', end: '17:00' }] : [],
          friday: formData.availability.weekdays.includes('Friday') ? [{ start: '09:00', end: '17:00' }] : [],
          saturday: formData.availability.weekdays.includes('Saturday') ? [{ start: '09:00', end: '13:00' }] : [],
          sunday: formData.availability.weekdays.includes('Sunday') ? [] : [],
        },
        consultationTypes: ['video', 'in-person'],
        maxPatientsPerDay: 10,
        verificationStatus: 'pending',
        paymentDetails: {
          upiId: formData.paymentDetails.upiId,
          platform: formData.paymentDetails.platform,
        },
        profileCompletion: {
          personalInfo: true,
          professionalDetails: true,
          specialization: true,
          availability: true,
          paymentDetails: true,
          documents: true // Optional, always true
        }
      };

      // Create or update doctor profile
      let response;
      if (isEditing) {
        response = await api.updateDoctorProfile(doctorProfile);
      } else {
        response = await api.createDoctorProfile(doctorProfile);
      }
      
      if (response.success) {
        // If editing and payment details are provided, update them separately
        if (isEditing && formData.paymentDetails.upiId && formData.paymentDetails.platform) {
          try {
            await api.updateDoctorPaymentDetails({
              upiId: formData.paymentDetails.upiId,
              platform: formData.paymentDetails.platform,
            });
          } catch (paymentError) {
            console.error('Payment details update error:', paymentError);
            // Don't fail the entire process if payment update fails
          }
        }
        
        // Refresh user data to include doctor profile
        await refreshUser();
        
        Alert.alert(
          isEditing ? 'Profile Updated Successfully!' : 'Profile Created Successfully!',
          isEditing 
            ? 'Your doctor profile has been updated successfully.'
            : 'Your doctor profile has been created and is pending verification. You will be notified once it\'s approved.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('MainDoctor'),
            },
          ]
        );
      } else {
        throw new Error(response.message || `Failed to ${isEditing ? 'update' : 'create'} doctor profile`);
      }
    } catch (error) {
      console.error('Doctor onboarding error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create doctor profile. Please try again.',
        [{ text: 'OK' }]
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

  const renderProfessionalDetails = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Professional Details
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Tell us about your medical credentials
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Medical License Number
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.medicalLicenseNumber}
          onChangeText={value => updateFormData('medicalLicenseNumber', value)}
          placeholder="Enter your license number"
          placeholderTextColor={Colors.textTertiary}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={20} color={palette.primary} />
          <Text style={[styles.uploadText, { color: palette.primary }]}>
            Upload License Document
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Years of Experience
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.yearsOfExperience}
          onChangeText={value => updateFormData('yearsOfExperience', value)}
          placeholder="Enter years of experience"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderSpecialization = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Specialization & Languages
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Select your areas of expertise and languages
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>Specialization</Text>
        <View style={styles.optionsContainer}>
          {specializations.map(spec => (
            <TouchableOpacity
              key={spec}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.specialization === spec ? palette.primary : '#fff',
                  borderColor: formData.specialization === spec ? palette.primary : Colors.border,
                },
              ]}
              onPress={() => updateFormData('specialization', spec)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: formData.specialization === spec ? '#fff' : palette.text },
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Languages Spoken (Select all that apply)
        </Text>
        <View style={styles.optionsContainer}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.languages.includes(lang) ? palette.primary : '#fff',
                  borderColor: formData.languages.includes(lang) ? palette.primary : Colors.border,
                },
              ]}
              onPress={() =>
                updateFormData('languages', toggleArrayItem(formData.languages, lang))
              }
            >
              <Text
                style={[
                  styles.optionText,
                  { color: formData.languages.includes(lang) ? '#fff' : palette.text },
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAvailability = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Availability & Fees
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Set your consultation schedule and fees
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Consultation Fee per Session (₹)
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.consultationFee}
          onChangeText={value => updateFormData('consultationFee', value)}
          placeholder="Enter consultation fee"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Available Weekdays (Select all that apply)
        </Text>
        <View style={styles.optionsContainer}>
          {weekdays.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.availability.weekdays.includes(day)
                    ? palette.primary
                    : '#fff',
                  borderColor: formData.availability.weekdays.includes(day)
                    ? palette.primary
                    : Colors.border,
                },
              ]}
              onPress={() =>
                updateAvailability(
                  'weekdays',
                  toggleArrayItem(formData.availability.weekdays, day)
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: formData.availability.weekdays.includes(day) ? '#fff' : palette.text,
                  },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Available Time Slots (Select all that apply)
        </Text>
        <View style={styles.optionsContainer}>
          {timeSlots.map(slot => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.availability.timeSlots.includes(slot)
                    ? palette.primary
                    : '#fff',
                  borderColor: formData.availability.timeSlots.includes(slot)
                    ? palette.primary
                    : Colors.border,
                },
              ]}
              onPress={() =>
                updateAvailability(
                  'timeSlots',
                  toggleArrayItem(formData.availability.timeSlots, slot)
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: formData.availability.timeSlots.includes(slot) ? '#fff' : palette.text,
                  },
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPaymentDetails = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Payment Details
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Set up your payment information to receive payments from patients
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          UPI ID
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.paymentDetails.upiId}
          onChangeText={value => updatePaymentDetails('upiId', value)}
          placeholder="Enter your UPI ID (e.g., yourname@paytm)"
          placeholderTextColor={Colors.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.xs }]}>
          This will be used to receive payments from patients
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          UPI Platform
        </Text>
        <View style={styles.optionsContainer}>
          {paymentPlatforms.map(platform => (
            <TouchableOpacity
              key={platform}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.paymentDetails.platform === platform
                    ? palette.primary
                    : '#fff',
                  borderColor: formData.paymentDetails.platform === platform
                    ? palette.primary
                    : Colors.border,
                },
              ]}
              onPress={() => updatePaymentDetails('platform', platform)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: formData.paymentDetails.platform === platform ? '#fff' : palette.text,
                  },
                ]}
              >
                {platform}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: palette.primary + '10', borderColor: palette.primary + '30' }]}>
        <Ionicons name="information-circle-outline" size={20} color={palette.primary} />
        <Text style={[styles.infoText, { color: palette.text }]}>
          Your payment details are secure and encrypted. You can update them anytime from your profile.
        </Text>
      </View>
    </View>
  );

  const renderProfilePicture = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Profile Picture
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Add a professional photo for your profile
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
        return renderProfessionalDetails();
      case 2:
        return renderSpecialization();
      case 3:
        return renderAvailability();
      case 4:
        return renderPaymentDetails();
      case 5:
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
          {isEditing ? 'Edit Doctor Profile' : 'Dr. Onboarding'}
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
              {currentStep === steps.length - 1 ? (isEditing ? 'Update Profile' : 'Complete Setup') : 'Next'}
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 14,
    lineHeight: 20,
  },
});
