import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

export default function FeedbackScreen({ navigation, route }) {
  const { sessionData } = route.params || {};
  const [doctorRating, setDoctorRating] = useState(0);
  const [sessionRating, setSessionRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingOptions = [
    { value: 1, emoji: '😞', label: 'Poor' },
    { value: 2, emoji: '😕', label: 'Fair' },
    { value: 3, emoji: '😐', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Very Good' },
    { value: 5, emoji: '🤩', label: 'Excellent' },
  ];

  const handleSubmit = () => {
    if (doctorRating === 0) {
      Alert.alert('Missing Rating', 'Please rate your doctor before submitting feedback.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const feedbackData = {
        doctorRating,
        sessionRating,
        notes: notes.trim(),
        sessionId: sessionData?.id,
        timestamp: new Date().toISOString(),
      };

      console.log('Feedback submitted:', feedbackData);

      setIsSubmitting(false);

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. It helps us improve our services.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    }, 2000);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Feedback',
      'Are you sure you want to skip providing feedback? Your input helps us improve our services.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]
    );
  };

  const renderRatingOptions = (selectedRating, onRatingSelect, title) => (
    <View style={styles.ratingSection}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <Text style={styles.ratingDescription}>
        How would you rate {title.toLowerCase()}?
      </Text>
      
      <View style={styles.ratingContainer}>
        {ratingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.ratingOption,
              selectedRating === option.value && styles.ratingOptionSelected,
            ]}
            onPress={() => onRatingSelect(option.value)}
          >
            <Text style={styles.ratingEmoji}>{option.emoji}</Text>
            <Text style={[
              styles.ratingLabel,
              selectedRating === option.value && styles.ratingLabelSelected,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Session Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Session Info */}
      <View style={styles.sessionInfoCard}>
        <View style={styles.sessionInfoHeader}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={styles.sessionCompleteText}>Session Completed!</Text>
        </View>
        
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionDoctor}>
            Dr {sessionData?.therapist || 'Sarah Johnson'}
          </Text>
          <Text style={styles.sessionTime}>
            {sessionData?.time || 'Today, 2:00 PM'}
          </Text>
          <Text style={styles.sessionType}>
            {sessionData?.type || 'Video Session'}
          </Text>
        </View>
      </View>

      {/* Thank You Message */}
      <View style={styles.thankYouCard}>
        <Text style={styles.thankYouTitle}>Thank you for your session!</Text>
        <Text style={styles.thankYouDescription}>
          Your feedback helps us improve our services and helps other patients find the right therapist.
        </Text>
      </View>

      {/* Doctor Rating */}
      {renderRatingOptions(
        doctorRating,
        setDoctorRating,
        'Your Doctor'
      )}

      {/* Session Rating */}
      {renderRatingOptions(
        sessionRating,
        setSessionRating,
        'The Session'
      )}

      {/* Additional Comments */}
      <View style={styles.commentsCard}>
        <Text style={styles.commentsTitle}>Additional Comments (Optional)</Text>
        <Text style={styles.commentsDescription}>
          Share any specific feedback about your experience, what went well, or suggestions for improvement.
        </Text>
        
        <TextInput
          style={styles.commentsInput}
          placeholder="Your feedback helps us improve..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={6}
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      {/* Privacy Notice */}
      <View style={styles.privacyCard}>
        <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
        <Text style={styles.privacyText}>
          Your feedback is anonymous and will be used to improve our services.
        </Text>
      </View>

      {/* Quick Feedback Options */}
      <View style={styles.quickFeedbackCard}>
        <Text style={styles.quickFeedbackTitle}>What went well?</Text>
        <View style={styles.quickFeedbackOptions}>
          {[
            'Clear communication',
            'Helpful techniques',
            'Comfortable environment',
            'Good listening',
            'Practical advice',
            'Professional approach'
          ].map((option, index) => (
            <TouchableOpacity key={index} style={styles.quickFeedbackOption}>
              <Text style={styles.quickFeedbackOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Feedback</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (doctorRating === 0 || isSubmitting) && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={doctorRating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    ...Typography.heading2,
  },
  placeholder: {
    width: 40,
  },
  sessionInfoCard: {
    backgroundColor: Colors.success + '10',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  sessionInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sessionCompleteText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  sessionDetails: {
    marginLeft: Spacing.xl,
  },
  sessionDoctor: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sessionTime: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionType: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  thankYouCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  thankYouTitle: {
    ...Typography.heading3,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  thankYouDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ratingSection: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  ratingTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
  },
  ratingDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingOption: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    minWidth: 60,
  },
  ratingOptionSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ratingEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  ratingLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
  ratingLabelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  commentsCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  commentsTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
  },
  commentsDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  privacyCard: {
    backgroundColor: Colors.success + '10',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  privacyText: {
    ...Typography.caption,
    color: Colors.success,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  quickFeedbackCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  quickFeedbackTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  quickFeedbackOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickFeedbackOption: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickFeedbackOptionText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
});
