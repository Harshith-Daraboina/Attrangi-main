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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';
import { convertToISOFormat, convertToDisplayFormat } from '../../utils/dateUtils';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function PatientOnboardingScreen({ navigation, route }) {
  const { palette } = useThemeSettings();
  const { refreshUser } = useAuth();
  const { userData } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [isChatbotActive, setIsChatbotActive] = useState(false);
  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotResponses, setChatbotResponses] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    gender: '',
    dateOfBirth: userData?.dateOfBirth || '',
    medicalHistory: '',
    currentChallenges: [],
    preferredLanguages: [],
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
    },
    profilePicture: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const challenges = [
    'Anxiety',
    'Depression',
    'Autism',
    'ADHD',
    'Bipolar Disorder',
    'PTSD',
    'OCD',
    'Eating Disorders',
    'Substance Abuse',
    'Sleep Disorders',
    'Social Anxiety',
    'Panic Disorder',
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

  const chatbotQuestions = [
    {
      question: "Hello! I'm here to help you set up your profile. How have you been feeling lately?",
      type: 'mood',
      options: ['Great', 'Good', 'Okay', 'Not so good', 'Struggling'],
    },
    {
      question: "That's helpful to know. Do you face more stress at home or work/school?",
      type: 'stress_source',
      options: ['Home', 'Work/School', 'Both equally', 'Neither', 'Not sure'],
    },
    {
      question: "I understand. How would you describe your sleep patterns recently?",
      type: 'sleep',
      options: ['Very good', 'Good', 'Fair', 'Poor', 'Very poor'],
    },
    {
      question: "Thank you for sharing. Do you find it easy to connect with others?",
      type: 'social',
      options: ['Very easy', 'Easy', 'Sometimes', 'Difficult', 'Very difficult'],
    },
    {
      question: "One last question - what activities help you feel better when you're down?",
      type: 'coping',
      options: ['Exercise', 'Music', 'Reading', 'Talking to friends', 'Art/Creative activities', 'Other'],
    },
  ];

  const steps = [
    'Basic Information',
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

  const updateEmergencyContact = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const startChatbotAssessment = () => {
    setIsChatbotActive(true);
    setChatbotStep(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleChatbotResponse = (questionType, response) => {
    setChatbotResponses(prev => ({ ...prev, [questionType]: response }));
    
    if (chatbotStep < chatbotQuestions.length - 1) {
      setTimeout(() => {
        setChatbotStep(chatbotStep + 1);
      }, 1000);
    } else {
      // Analyze responses and suggest challenges
      analyzeResponsesAndSuggestChallenges();
      setTimeout(() => {
        setIsChatbotActive(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
        setCurrentStep(2); // Move to medical history
      }, 2000);
    }
  };

  const analyzeResponsesAndSuggestChallenges = () => {
    const suggestedChallenges = [];
    
    if (chatbotResponses.mood === 'Not so good' || chatbotResponses.mood === 'Struggling') {
      suggestedChallenges.push('Depression', 'Anxiety');
    }
    
    if (chatbotResponses.sleep === 'Poor' || chatbotResponses.sleep === 'Very poor') {
      suggestedChallenges.push('Sleep Disorders');
    }
    
    if (chatbotResponses.social === 'Difficult' || chatbotResponses.social === 'Very difficult') {
      suggestedChallenges.push('Social Anxiety');
    }
    
    if (chatbotResponses.stress_source === 'Both equally') {
      suggestedChallenges.push('Anxiety', 'Stress-related disorders');
    }

    // Update form data with suggested challenges
    setFormData(prev => ({
      ...prev,
      currentChallenges: [...new Set([...prev.currentChallenges, ...suggestedChallenges])],
    }));
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
          bio: formData.medicalHistory,
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
          'Your profile has been created successfully. You can now connect with therapists and start your wellness journey.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('MainPatient'),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert(
        'Error',
        'Failed to complete profile setup. Please try again.',
        [
          { text: 'Retry', onPress: () => completeOnboarding() },
          { text: 'Skip for now', onPress: () => navigation.navigate('MainPatient') }
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

  const renderChatbotInterface = () => (
    <Animated.View style={[styles.chatbotContainer, { opacity: fadeAnim }]}>
      <View style={styles.chatbotHeader}>
        <View style={[styles.chatbotAvatar, { backgroundColor: palette.primary }]}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </View>
        <Text style={[Typography.heading3, { color: palette.text }]}>
          Therapy Assistant
        </Text>
      </View>

      <View style={styles.chatContainer}>
        <View style={styles.chatBubble}>
          <Text style={styles.chatText}>
            {chatbotQuestions[chatbotStep]?.question}
          </Text>
        </View>

        <View style={styles.responseContainer}>
          {chatbotQuestions[chatbotStep]?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.responseOption,
                { borderColor: palette.primary },
              ]}
              onPress={() => handleChatbotResponse(
                chatbotQuestions[chatbotStep].type,
                option
              )}
            >
              <Text style={[styles.responseText, { color: palette.text }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((chatbotStep + 1) / chatbotQuestions.length) * 100}%`,
                backgroundColor: palette.primary,
              },
            ]}
          />
        </View>
        <Text style={[Typography.caption, { color: palette.text }]}>
          {chatbotStep + 1} of {chatbotQuestions.length} questions
        </Text>
      </View>
    </Animated.View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Basic Information
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

  const renderTherapyAssessment = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Therapy Assessment
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Let our AI assistant help understand your needs through a friendly conversation
      </Text>

      {!isChatbotActive ? (
        <View style={styles.assessmentIntro}>
          <View style={[styles.introIcon, { backgroundColor: palette.primary }]}>
            <Ionicons name="chatbubble-ellipses" size={40} color="#fff" />
          </View>
          <Text style={[Typography.heading3, { color: palette.text, textAlign: 'center' }]}>
            Interactive Assessment
          </Text>
          <Text style={[Typography.body, { color: palette.text, textAlign: 'center', marginTop: Spacing.md }]}>
            Our therapy assistant will ask you a few questions to better understand your needs and suggest appropriate support options.
          </Text>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: palette.primary }]}
            onPress={startChatbotAssessment}
          >
            <Text style={styles.startButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderChatbotInterface()
      )}
    </View>
  );

  const renderMedicalHistory = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Medical History & Challenges
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Tell us about your medical background and current challenges
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Medical History
        </Text>
        <TextInput
          style={[styles.textArea, { borderColor: Colors.border }]}
          value={formData.medicalHistory}
          onChangeText={value => updateFormData('medicalHistory', value)}
          placeholder="Describe any relevant medical history, medications, or treatments..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Current Challenges (Based on assessment + additional)
        </Text>
        <View style={styles.optionsContainer}>
          {challenges.map(challenge => (
            <TouchableOpacity
              key={challenge}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.currentChallenges.includes(challenge)
                    ? palette.primary
                    : '#fff',
                  borderColor: formData.currentChallenges.includes(challenge)
                    ? palette.primary
                    : Colors.border,
                },
              ]}
              onPress={() =>
                updateFormData(
                  'currentChallenges',
                  toggleArrayItem(formData.currentChallenges, challenge)
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: formData.currentChallenges.includes(challenge)
                      ? '#fff'
                      : palette.text,
                  },
                ]}
              >
                {challenge}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Preferred Languages
        </Text>
        <View style={styles.optionsContainer}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.preferredLanguages.includes(lang)
                    ? palette.primary
                    : '#fff',
                  borderColor: formData.preferredLanguages.includes(lang)
                    ? palette.primary
                    : Colors.border,
                },
              ]}
              onPress={() =>
                updateFormData(
                  'preferredLanguages',
                  toggleArrayItem(formData.preferredLanguages, lang)
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: formData.preferredLanguages.includes(lang)
                      ? '#fff'
                      : palette.text,
                  },
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

  const renderEmergencyContact = () => (
    <View style={styles.stepContent}>
      <Text style={[Typography.heading2, { color: palette.text }]}>
        Emergency Contact
      </Text>
      <Text style={[Typography.caption, { marginBottom: Spacing.lg }]}>
        Provide emergency contact information
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Contact Name
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.emergencyContact.name}
          onChangeText={value => updateEmergencyContact('name', value)}
          placeholder="Enter emergency contact name"
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Relationship
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.emergencyContact.relation}
          onChangeText={value => updateEmergencyContact('relation', value)}
          placeholder="e.g., Parent, Sibling, Friend"
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[Typography.label, { color: palette.text }]}>
          Contact Phone
        </Text>
        <TextInput
          style={[styles.input, { borderColor: Colors.border }]}
          value={formData.emergencyContact.phone}
          onChangeText={value => updateEmergencyContact('phone', value)}
          placeholder="Enter emergency contact phone"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="phone-pad"
        />
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
        return renderBasicInfo();
      case 1:
        return renderProfilePicture();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Patient Onboarding
        </Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {!isChatbotActive && (
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
            <Text style={[styles.buttonText, { color: '#fff' }]}>
              {isLoading ? 'Saving...' : (currentStep === steps.length - 1 ? 'Complete Setup' : 'Next')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
    height: 100,
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
  assessmentIntro: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  introIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  startButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatbotContainer: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  chatbotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  chatbotAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  chatContainer: {
    marginBottom: Spacing.lg,
  },
  chatBubble: {
    backgroundColor: '#f8f9fa',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  chatText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  responseContainer: {
    gap: Spacing.sm,
  },
  responseOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  responseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
