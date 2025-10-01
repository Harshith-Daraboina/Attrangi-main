import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';

const { width } = Dimensions.get('window');

export default function MoodTrackingScreen({ navigation }) {
  const { palette } = useThemeSettings();
  const [currentMood, setCurrentMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [notes, setNotes] = useState('');
  const [showTriggers, setShowTriggers] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
    { id: 'angry', label: 'Angry', emoji: '😠', color: '#F44336' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF9800' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: '#9C27B0' },
    { id: 'excited', label: 'Excited', emoji: '🤩', color: '#E91E63' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: '#607D8B' },
    { id: 'confused', label: 'Confused', emoji: '😕', color: '#795548' },
  ];

  const triggers = [
    'Work/School stress',
    'Family issues',
    'Health concerns',
    'Financial worries',
    'Social situations',
    'Sleep problems',
    'Weather',
    'Loneliness',
    'Past trauma',
    'Medication changes',
    'Physical pain',
    'Relationship problems',
    'Other',
  ];

  const intensityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMoodSelection = (mood) => {
    setCurrentMood(mood);
    setShowTriggers(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTriggerSelection = (trigger) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleIntensityChange = (intensity) => {
    setMoodIntensity(intensity);
  };

  const handleNext = () => {
    if (!currentMood) {
      Alert.alert('Please select your mood', 'Choose how you\'re feeling right now.');
      return;
    }
    setShowTriggers(false);
    setShowNotes(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSave = () => {
    const moodEntry = {
      mood: currentMood,
      intensity: moodIntensity,
      triggers: selectedTriggers,
      notes: notes,
      timestamp: new Date().toISOString(),
    };

    // Here you would save to backend/local storage
    console.log('Mood entry saved:', moodEntry);
    
    Alert.alert(
      'Mood Entry Saved!',
      'Your mood has been recorded. This information will help your therapist understand your patterns.',
      [
        {
          text: 'View Progress',
          onPress: () => navigation.navigate('MoodJournal'),
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderMoodSelection = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          How are you feeling?
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={[styles.introIcon, { backgroundColor: palette.primary }]}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          <Text style={[Typography.heading2, { color: palette.text, textAlign: 'center' }]}>
            Daily Mood Check-in
          </Text>
          <Text style={[Typography.body, { color: palette.text, textAlign: 'center', marginTop: Spacing.md }]}>
            Take a moment to check in with yourself. How are you feeling right now?
          </Text>
        </View>

        <View style={styles.moodsContainer}>
          <Text style={[Typography.heading3, { color: palette.text, marginBottom: Spacing.lg }]}>
            Select your current mood:
          </Text>
          <View style={styles.moodsGrid}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodCard,
                  {
                    backgroundColor: currentMood?.id === mood.id ? mood.color : '#fff',
                    borderColor: currentMood?.id === mood.id ? mood.color : Colors.border,
                  },
                ]}
                onPress={() => handleMoodSelection(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    {
                      color: currentMood?.id === mood.id ? '#fff' : palette.text,
                    },
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {currentMood && (
          <View style={styles.intensitySection}>
            <Text style={[Typography.heading3, { color: palette.text, marginBottom: Spacing.lg }]}>
              How intense is this feeling?
            </Text>
            <View style={styles.intensityContainer}>
              {[1, 2, 3, 4, 5].map(intensity => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.intensityButton,
                    {
                      backgroundColor: moodIntensity === intensity ? palette.primary : '#fff',
                      borderColor: moodIntensity === intensity ? palette.primary : Colors.border,
                    },
                  ]}
                  onPress={() => handleIntensityChange(intensity)}
                >
                  <Text
                    style={[
                      styles.intensityNumber,
                      {
                        color: moodIntensity === intensity ? '#fff' : palette.text,
                      },
                    ]}
                  >
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[Typography.caption, { color: palette.text, textAlign: 'center', marginTop: Spacing.sm }]}>
              {intensityLabels[moodIntensity - 1]}
            </Text>
          </View>
        )}
      </ScrollView>

      {currentMood && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const renderTriggerSelection = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowTriggers(false)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          What might be affecting you?
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={[styles.introIcon, { backgroundColor: currentMood.color }]}>
            <Text style={styles.moodEmojiLarge}>{currentMood.emoji}</Text>
          </View>
          <Text style={[Typography.heading2, { color: palette.text, textAlign: 'center' }]}>
            Feeling {currentMood.label}
          </Text>
          <Text style={[Typography.body, { color: palette.text, textAlign: 'center', marginTop: Spacing.md }]}>
            What might be contributing to this feeling? (Select all that apply)
          </Text>
        </View>

        <View style={styles.triggersContainer}>
          <View style={styles.triggersGrid}>
            {triggers.map(trigger => (
              <TouchableOpacity
                key={trigger}
                style={[
                  styles.triggerChip,
                  {
                    backgroundColor: selectedTriggers.includes(trigger) ? palette.primary : '#fff',
                    borderColor: selectedTriggers.includes(trigger) ? palette.primary : Colors.border,
                  },
                ]}
                onPress={() => handleTriggerSelection(trigger)}
              >
                <Text
                  style={[
                    styles.triggerText,
                    {
                      color: selectedTriggers.includes(trigger) ? '#fff' : palette.text,
                    },
                  ]}
                >
                  {trigger}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: palette.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderNotesSection = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowNotes(false)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Additional Notes
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={[styles.introIcon, { backgroundColor: currentMood.color }]}>
            <Text style={styles.moodEmojiLarge}>{currentMood.emoji}</Text>
          </View>
          <Text style={[Typography.heading2, { color: palette.text, textAlign: 'center' }]}>
            Any additional thoughts?
          </Text>
          <Text style={[Typography.body, { color: palette.text, textAlign: 'center', marginTop: Spacing.md }]}>
            Feel free to share any additional thoughts, feelings, or context about your current state.
          </Text>
        </View>

        <View style={styles.notesContainer}>
          <View style={styles.notesInput}>
            <TextInput
              style={[styles.textArea, { color: palette.text }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Share your thoughts here... (optional)"
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={[Typography.heading3, { color: palette.text, marginBottom: Spacing.md }]}>
            Summary
          </Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={[Typography.label, { color: palette.text }]}>Mood:</Text>
              <Text style={[Typography.body, { color: palette.text }]}>
                {currentMood.emoji} {currentMood.label} ({intensityLabels[moodIntensity - 1]})
              </Text>
            </View>
            {selectedTriggers.length > 0 && (
              <View style={styles.summaryItem}>
                <Text style={[Typography.label, { color: palette.text }]}>Triggers:</Text>
                <Text style={[Typography.body, { color: palette.text }]}>
                  {selectedTriggers.join(', ')}
                </Text>
              </View>
            )}
            {notes && (
              <View style={styles.summaryItem}>
                <Text style={[Typography.label, { color: palette.text }]}>Notes:</Text>
                <Text style={[Typography.body, { color: palette.text }]}>{notes}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: palette.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Save Entry</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (showNotes) {
    return renderNotesSection();
  }

  if (showTriggers) {
    return renderTriggerSelection();
  }

  return renderMoodSelection();
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
  },
  backButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  introSection: {
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
  moodEmojiLarge: {
    fontSize: 40,
  },
  moodsContainer: {
    marginBottom: Spacing.xl,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: (width - Spacing.md * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  intensitySection: {
    marginBottom: Spacing.xl,
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  triggersContainer: {
    marginBottom: Spacing.xl,
  },
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  triggerChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesContainer: {
    marginBottom: Spacing.xl,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  textArea: {
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 120,
  },
  summaryContainer: {
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  summaryItem: {
    marginBottom: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: '#fff',
    ...Shadows.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
});
