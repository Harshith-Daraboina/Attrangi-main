import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';

const { width } = Dimensions.get('window');

export default function PreSessionTemplateScreen({ navigation }) {
  const { palette } = useThemeSettings();
  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    sessionDate: new Date().toLocaleDateString(),
    therapistName: 'Dr. Sarah Johnson',
    
    // Physical Health
    sleepQuality: '',
    appetite: '',
    energyLevel: '',
    medicationCompliance: '',
    physicalSymptoms: '',
    
    // Emotional State
    mood: '',
    anxietyLevel: '',
    stressTriggers: '',
    emotionalRegulation: '',
    
    // Behavioral Observations
    socialInteraction: '',
    dailyActivities: '',
    behavioralChanges: '',
    copingStrategies: '',
    
    // Recent Events
    significantEvents: '',
    familyUpdates: '',
    challenges: '',
    achievements: '',
    
    // Session Goals
    sessionGoals: '',
    concerns: '',
    questions: '',
    
    // Additional Notes
    additionalNotes: '',
  });

  const sleepOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
  const appetiteOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
  const energyOptions = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
  const complianceOptions = ['Perfect', 'Good', 'Fair', 'Poor', 'Missed Doses'];
  const moodOptions = ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'];
  const anxietyOptions = ['None', 'Mild', 'Moderate', 'High', 'Severe'];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert(
      'Template Saved',
      'The pre-session template has been saved and will be shared with the therapist.',
      [
        {
          text: 'Continue to Session',
          onPress: () => navigation.navigate('CaregiverSession'),
        },
        {
          text: 'Save Only',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderSection = (title, icon, children) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={palette.primary} />
        <Text style={[Typography.heading3, { color: palette.text, marginLeft: Spacing.sm }]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  const renderDropdown = (label, field, options) => (
    <View style={styles.inputGroup}>
      <Text style={[Typography.label, { color: palette.text }]}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              {
                backgroundColor: formData[field] === option ? palette.primary : '#fff',
                borderColor: formData[field] === option ? palette.primary : Colors.border,
              },
            ]}
            onPress={() => updateFormData(field, option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: formData[field] === option ? '#fff' : palette.text },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTextInput = (label, field, multiline = false, placeholder = '') => (
    <View style={styles.inputGroup}>
      <Text style={[Typography.label, { color: palette.text }]}>{label}</Text>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
          { borderColor: Colors.border, color: palette.text },
        ]}
        value={formData[field]}
        onChangeText={value => updateFormData(field, value)}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Pre-Session Template
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <View style={styles.infoCard}>
            <Text style={[Typography.heading3, { color: palette.text, marginBottom: Spacing.md }]}>
              Session Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[Typography.label, { color: palette.text }]}>Patient:</Text>
              <Text style={[Typography.body, { color: palette.text }]}>{formData.patientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.label, { color: palette.text }]}>Date:</Text>
              <Text style={[Typography.body, { color: palette.text }]}>{formData.sessionDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.label, { color: palette.text }]}>Therapist:</Text>
              <Text style={[Typography.body, { color: palette.text }]}>{formData.therapistName}</Text>
            </View>
          </View>
        </View>

        {/* Physical Health */}
        {renderSection(
          'Physical Health',
          'fitness-outline',
          <>
            {renderDropdown('Sleep Quality', 'sleepQuality', sleepOptions)}
            {renderDropdown('Appetite', 'appetite', appetiteOptions)}
            {renderDropdown('Energy Level', 'energyLevel', energyOptions)}
            {renderDropdown('Medication Compliance', 'medicationCompliance', complianceOptions)}
            {renderTextInput(
              'Physical Symptoms',
              'physicalSymptoms',
              true,
              'Describe any physical symptoms, pain, or discomfort...'
            )}
          </>
        )}

        {/* Emotional State */}
        {renderSection(
          'Emotional State',
          'heart-outline',
          <>
            {renderDropdown('Overall Mood', 'mood', moodOptions)}
            {renderDropdown('Anxiety Level', 'anxietyLevel', anxietyOptions)}
            {renderTextInput(
              'Stress Triggers',
              'stressTriggers',
              true,
              'What situations or events have been causing stress...'
            )}
            {renderTextInput(
              'Emotional Regulation',
              'emotionalRegulation',
              true,
              'How well has the patient been managing their emotions...'
            )}
          </>
        )}

        {/* Behavioral Observations */}
        {renderSection(
          'Behavioral Observations',
          'eye-outline',
          <>
            {renderTextInput(
              'Social Interaction',
              'socialInteraction',
              true,
              'How has the patient been interacting with others...'
            )}
            {renderTextInput(
              'Daily Activities',
              'dailyActivities',
              true,
              'What activities has the patient been engaging in...'
            )}
            {renderTextInput(
              'Behavioral Changes',
              'behavioralChanges',
              true,
              'Any noticeable changes in behavior patterns...'
            )}
            {renderTextInput(
              'Coping Strategies',
              'copingStrategies',
              true,
              'What coping strategies has the patient been using...'
            )}
          </>
        )}

        {/* Recent Events */}
        {renderSection(
          'Recent Events',
          'calendar-outline',
          <>
            {renderTextInput(
              'Significant Events',
              'significantEvents',
              true,
              'Any important events or milestones...'
            )}
            {renderTextInput(
              'Family Updates',
              'familyUpdates',
              true,
              'Updates about family members or relationships...'
            )}
            {renderTextInput(
              'Challenges Faced',
              'challenges',
              true,
              'What challenges has the patient been facing...'
            )}
            {renderTextInput(
              'Achievements',
              'achievements',
              true,
              'Any accomplishments or positive developments...'
            )}
          </>
        )}

        {/* Session Goals */}
        {renderSection(
          'Session Goals',
          'flag-outline',
          <>
            {renderTextInput(
              'Goals for This Session',
              'sessionGoals',
              true,
              'What would you like to focus on in this session...'
            )}
            {renderTextInput(
              'Main Concerns',
              'concerns',
              true,
              'What are your main concerns right now...'
            )}
            {renderTextInput(
              'Questions for Therapist',
              'questions',
              true,
              'Any specific questions you have for the therapist...'
            )}
          </>
        )}

        {/* Additional Notes */}
        {renderSection(
          'Additional Notes',
          'document-text-outline',
          <>
            {renderTextInput(
              'Additional Notes',
              'additionalNotes',
              true,
              'Any other important information to share...'
            )}
          </>
        )}
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
          <Text style={[styles.buttonText, { color: '#fff' }]}>Save & Continue</Text>
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
  sessionInfo: {
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  section: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
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