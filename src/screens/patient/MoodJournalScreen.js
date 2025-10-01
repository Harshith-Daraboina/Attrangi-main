import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function MoodJournalScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);

  const moods = [
    { id: 1, emoji: '😢', label: 'Very Sad', color: '#EF4444', value: 1 },
    { id: 2, emoji: '😔', label: 'Sad', color: '#F97316', value: 2 },
    { id: 3, emoji: '😐', label: 'Neutral', color: '#F59E0B', value: 3 },
    { id: 4, emoji: '😊', label: 'Good', color: '#10B981', value: 4 },
    { id: 5, emoji: '😄', label: 'Great', color: '#3B82F6', value: 5 },
    { id: 6, emoji: '🤩', label: 'Excellent', color: '#8B5CF6', value: 6 },
  ];

  const activities = [
    { id: 1, name: 'Exercise', icon: 'fitness-outline' },
    { id: 2, name: 'Meditation', icon: 'leaf-outline' },
    { id: 3, name: 'Reading', icon: 'book-outline' },
    { id: 4, name: 'Music', icon: 'musical-notes-outline' },
    { id: 5, name: 'Socializing', icon: 'people-outline' },
    { id: 6, name: 'Work', icon: 'briefcase-outline' },
    { id: 7, name: 'Sleep', icon: 'bed-outline' },
    { id: 8, name: 'Eating', icon: 'restaurant-outline' },
  ];

  const recentEntries = [
    {
      id: 1,
      date: 'Today',
      mood: { emoji: '😊', label: 'Good', color: '#10B981' },
      notes: 'Feeling better after the morning walk',
      activities: ['Exercise', 'Meditation'],
    },
    {
      id: 2,
      date: 'Yesterday',
      mood: { emoji: '😐', label: 'Neutral', color: '#F59E0B' },
      notes: 'Had a stressful day at work',
      activities: ['Work', 'Music'],
    },
    {
      id: 3,
      date: '2 days ago',
      mood: { emoji: '😄', label: 'Great', color: '#3B82F6' },
      notes: 'Great session with my therapist',
      activities: ['Socializing', 'Reading'],
    },
  ];

  const toggleActivity = (activityId) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const saveMoodEntry = () => {
    // Save mood entry logic here
    console.log('Saving mood entry:', {
      mood: selectedMood,
      notes,
      activities: selectedActivities,
    });
    // Reset form
    setSelectedMood(null);
    setNotes('');
    setSelectedActivities([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mood Journal</Text>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* New Entry Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How are you feeling today?</Text>
        
        {/* Mood Selection */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionLabel}>Select your mood</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  selectedMood?.id === mood.id && styles.moodButtonSelected,
                  { borderColor: mood.color }
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionLabel}>What did you do today?</Text>
          <View style={styles.activitiesGrid}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityButton,
                  selectedActivities.includes(activity.id) && styles.activityButtonSelected
                ]}
                onPress={() => toggleActivity(activity.id)}
              >
                <Ionicons 
                  name={activity.icon} 
                  size={20} 
                  color={selectedActivities.includes(activity.id) ? Colors.surface : Colors.textSecondary} 
                />
                <Text style={[
                  styles.activityText,
                  selectedActivities.includes(activity.id) && styles.activityTextSelected
                ]}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionLabel}>Additional notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How was your day? What's on your mind?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            !selectedMood && styles.saveButtonDisabled
          ]}
          onPress={saveMoodEntry}
          disabled={!selectedMood}
        >
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Entries */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Entries</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentEntries.map((entry) => (
          <View key={entry.id} style={styles.entryItem}>
            <View style={styles.entryHeader}>
              <View style={styles.entryMood}>
                <Text style={styles.entryEmoji}>{entry.mood.emoji}</Text>
                <View>
                  <Text style={styles.entryMoodLabel}>{entry.mood.label}</Text>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
            
            {entry.notes && (
              <Text style={styles.entryNotes}>{entry.notes}</Text>
            )}
            
            <View style={styles.entryActivities}>
              {entry.activities.map((activity, index) => (
                <View key={index} style={styles.activityTag}>
                  <Text style={styles.activityTagText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Mood Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week's Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>4.2</Text>
            <Text style={styles.insightLabel}>Average Mood</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>7</Text>
            <Text style={styles.insightLabel}>Entries</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>85%</Text>
            <Text style={styles.insightLabel}>Consistency</Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.heading2,
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  moodSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: Spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: (width - Spacing.lg * 4) / 3,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  activitiesSection: {
    marginBottom: Spacing.lg,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityButton: {
    width: (width - Spacing.lg * 4) / 2,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activityButtonSelected: {
    backgroundColor: Colors.primary,
  },
  activityText: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
    color: Colors.textSecondary,
  },
  activityTextSelected: {
    color: Colors.surface,
  },
  notesSection: {
    marginBottom: Spacing.lg,
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  entryItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  entryMoodLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  entryDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  entryNotes: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  entryActivities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  activityTagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 12,
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightValue: {
    ...Typography.heading2,
    color: Colors.primary,
  },
  insightLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
