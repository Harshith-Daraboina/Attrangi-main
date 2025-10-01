import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

export default function PreSessionTemplateScreen({ navigation, route }) {
  const { sessionData } = route.params || {};
  
  // Form state
  const [generalCondition, setGeneralCondition] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [majorEvents, setMajorEvents] = useState('');
  const [medicationUpdate, setMedicationUpdate] = useState('');
  const [medicationChanges, setMedicationChanges] = useState(false);
  const [specificConcerns, setSpecificConcerns] = useState('');
  const [caregiverObservations, setCaregiverObservations] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Options
  const generalConditionOptions = [
    { value: 'much_better', label: 'Much Better', emoji: '😊' },
    { value: 'slightly_better', label: 'Slightly Better', emoji: '🙂' },
    { value: 'no_change', label: 'No Change', emoji: '😐' },
    { value: 'worse', label: 'Worse', emoji: '😔' },
  ];

  const symptomOptions = [
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'sadness', label: 'Sadness / Low Mood', icon: '😢' },
    { id: 'aggression', label: 'Aggression / Irritation', icon: '😠' },
    { id: 'sleep', label: 'Sleep Issues', icon: '😴' },
    { id: 'eating', label: 'Eating Issues', icon: '🍽️' },
    { id: 'communication', label: 'Communication Difficulty', icon: '💬' },
    { id: 'others', label: 'Others', icon: '📝' },
  ];

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😔', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Below Average' },
    { value: 4, emoji: '🙂', label: 'Average' },
    { value: 5, emoji: '😊', label: 'Good' },
    { value: 6, emoji: '😄', label: 'Very Good' },
    { value: 7, emoji: '🤩', label: 'Excellent' },
    { value: 8, emoji: '🥰', label: 'Great' },
    { value: 9, emoji: '🤗', label: 'Amazing' },
    { value: 10, emoji: '🌟', label: 'Perfect' },
  ];

  // Helper functions
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = () => {
    // Store pre-session data
    const preSessionData = {
      generalCondition,
      selectedSymptoms,
      otherSymptoms: otherSymptoms.trim(),
      moodRating,
      majorEvents: majorEvents.trim(),
      medicationUpdate: medicationUpdate.trim(),
      medicationChanges,
      specificConcerns: specificConcerns.trim(),
      caregiverObservations: caregiverObservations.trim(),
      patientNotes: patientNotes.trim(),
      isUrgent,
      timestamp: new Date().toISOString(),
    };

    console.log('Pre-session data:', preSessionData);

    // Navigate to waiting screen
    navigation.navigate('WaitingScreen', { sessionData, preSessionData });
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Pre-Session Form',
      'Are you sure you want to skip? This information helps your therapist provide better care.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('WaitingScreen', { sessionData }),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>🎨 Pre-Session Template</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Ionicons name="time-outline" size={24} color={Colors.primary} />
        <Text style={styles.instructionsText}>
          ⏳ Please complete this quick form for the doctor before your session.
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* General Condition */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 General Condition</Text>
          <Text style={styles.cardDescription}>How are you feeling compared to your last session?</Text>
          
          <View style={styles.conditionContainer}>
            {generalConditionOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.conditionOption,
                  generalCondition === option.value && styles.conditionOptionSelected,
                ]}
                onPress={() => setGeneralCondition(option.value)}
              >
                <Text style={styles.conditionEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.conditionLabel,
                  generalCondition === option.value && styles.conditionLabelSelected,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Symptoms */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔍 Current Symptoms / Behaviors</Text>
          <Text style={styles.cardDescription}>Select all that apply (multi-select)</Text>
          
          <View style={styles.symptomsContainer}>
            {symptomOptions.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomOption,
                  selectedSymptoms.includes(symptom.id) && styles.symptomOptionSelected,
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                <Text style={[
                  styles.symptomLabel,
                  selectedSymptoms.includes(symptom.id) && styles.symptomLabelSelected,
                ]}>
                  {symptom.label}
                </Text>
                {selectedSymptoms.includes(symptom.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Other Symptoms Text Input */}
          {selectedSymptoms.includes('others') && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please describe other symptoms..."
                value={otherSymptoms}
                onChangeText={setOtherSymptoms}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Mood Rating */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>😊 Mood Rating (1-10)</Text>
          <Text style={styles.cardDescription}>Quick mood check</Text>
          
          <View style={styles.moodSliderContainer}>
            <Text style={styles.moodSliderLabel}>Mood: {moodRating}/10</Text>
            <View style={styles.moodSlider}>
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.moodSliderOption,
                    moodRating === option.value && styles.moodSliderOptionSelected,
                  ]}
                  onPress={() => setMoodRating(option.value)}
                >
                  <Text style={styles.moodSliderEmoji}>{option.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Major Events */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Major Events Since Last Session</Text>
          <Text style={styles.cardDescription}>E.g., "Had a breakdown yesterday" / "Started new medication"</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Describe any significant events or changes..."
            value={majorEvents}
            onChangeText={setMajorEvents}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Medication / Routine Update */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💊 Medication / Routine Update</Text>
          
          <View style={styles.medicationContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setMedicationChanges(!medicationChanges)}
              >
                {medicationChanges && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Missed doses? Changes?</Text>
            </View>
          </View>
          
          <TextInput
            style={styles.textInput}
            placeholder="Describe any medication or routine changes..."
            value={medicationUpdate}
            onChangeText={setMedicationUpdate}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Specific Concerns */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Specific Concerns for Today</Text>
          <Text style={styles.cardDescription}>"Please focus on anger issues today"</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="What would you like to focus on in today's session?"
            value={specificConcerns}
            onChangeText={setSpecificConcerns}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Caregiver Observations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Caregiver Observations (Optional)</Text>
          <Text style={styles.cardDescription}>If filled by patient</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Any observations from family or caregivers..."
            value={caregiverObservations}
            onChangeText={setCaregiverObservations}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Patient's Own Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Patient's Own Notes (Optional)</Text>
          <Text style={styles.cardDescription}>If caregiver fills</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Your personal notes or thoughts..."
            value={patientNotes}
            onChangeText={setPatientNotes}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Urgency Flag */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚨 Urgency Flag</Text>
          <Text style={styles.cardDescription}>If emergency/high concern → mark as urgent</Text>
          
          <View style={styles.urgencyContainer}>
            <View style={styles.urgencyContent}>
              <Ionicons 
                name={isUrgent ? "warning" : "warning-outline"} 
                size={24} 
                color={isUrgent ? Colors.error : Colors.textSecondary} 
              />
              <Text style={[
                styles.urgencyLabel,
                { color: isUrgent ? Colors.error : Colors.textSecondary }
              ]}>
                Mark as Urgent
              </Text>
            </View>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{ false: Colors.border, true: Colors.error + '40' }}
              thumbColor={isUrgent ? Colors.error : Colors.textTertiary}
            />
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          <Text style={styles.privacyText}>
            Your information is confidential and will only be shared with your therapist.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.surface} />
          <Text style={styles.submitButtonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    ...Typography.heading2,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  instructionsCard: {
    backgroundColor: Colors.primary + '08',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  instructionsText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.md,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  cardTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  cardDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  // General Condition Styles
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  conditionOption: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: 80,
    justifyContent: 'center',
  },
  conditionOptionSelected: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  conditionEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  conditionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  conditionLabelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  // Symptoms Styles
  symptomsContainer: {
    gap: Spacing.sm,
  },
  symptomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  symptomOptionSelected: {
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  symptomIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  symptomLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  symptomLabelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  textInputContainer: {
    marginTop: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Typography.body,
    textAlignVertical: 'top',
    backgroundColor: Colors.background,
    lineHeight: 22,
  },
  // Mood Rating Styles
  moodSliderContainer: {
    alignItems: 'center',
  },
  moodSliderLabel: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  moodSlider: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  moodSliderOption: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  moodSliderOptionSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  moodSliderEmoji: {
    fontSize: 18,
  },
  // Medication Styles
  medicationContainer: {
    marginBottom: Spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  // Urgency Styles
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urgencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyLabel: {
    ...Typography.body,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  // Privacy Card
  privacyCard: {
    backgroundColor: Colors.success + '08',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  privacyText: {
    ...Typography.caption,
    color: Colors.success,
    marginLeft: Spacing.sm,
    flex: 1,
    fontWeight: '500',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadows.lg,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  skipButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
});
