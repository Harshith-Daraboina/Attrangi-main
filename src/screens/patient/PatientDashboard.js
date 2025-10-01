import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';
import ComingSoon from '../../components/ComingSoon';

const { width } = Dimensions.get('window');

export default function PatientDashboard({ navigation }) {
  const [showMoodJournal, setShowMoodJournal] = useState(false);
  const [moodJournalCount, setMoodJournalCount] = useState(0);

  // Check if mood journal should popup (2 times per day)
  useEffect(() => {
    checkMoodJournalPopup();
  }, []);

  const checkMoodJournalPopup = async () => {
    try {
      const today = new Date().toDateString();
      const lastPopup = await AsyncStorage.getItem('lastMoodJournalPopup') || '';
      const popupCount = parseInt(await AsyncStorage.getItem('moodJournalCount') || '0');
      
      const now = new Date();
      const currentHour = now.getHours();
      
      // Reset count if it's a new day
      if (lastPopup !== today) {
        setMoodJournalCount(0);
        await AsyncStorage.setItem('moodJournalCount', '0');
      }
      
      // Show popup if:
      // 1. First time opening app today (count < 1)
      // 2. After 6 PM and count < 2
      if (popupCount < 2 && (popupCount < 1 || currentHour >= 18)) {
        setShowMoodJournal(true);
      }
    } catch (error) {
      console.error('Error checking mood journal popup:', error);
    }
  };

  const handleMoodJournalSubmit = async (mood, reasons) => {
    try {
      const newCount = moodJournalCount + 1;
      setMoodJournalCount(newCount);
      await AsyncStorage.setItem('moodJournalCount', newCount.toString());
      await AsyncStorage.setItem('lastMoodJournalPopup', new Date().toDateString());
      setShowMoodJournal(false);
      // Store mood data (will connect to backend later)
      console.log('Mood recorded:', { mood, reasons, timestamp: new Date() });
    } catch (error) {
      console.error('Error saving mood journal:', error);
      setShowMoodJournal(false);
    }
  };

  const upcomingSession = {
    id: 1,
    therapist: 'Dr Sarah Johnson',
    time: 'Today, 2:00 PM',
    type: 'Video Session',
    duration: '50 minutes',
    status: 'upcoming',
  };

  const bookedSessions = [
    {
      id: 2,
      therapist: 'Dr Michael Chen',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Video Session',
      status: 'confirmed',
    },
    {
      id: 3,
      therapist: 'Dr Priya Sharma',
      date: 'Friday',
      time: '3:00 PM',
      type: 'Audio Session',
      status: 'confirmed',
    },
  ];

  const dailyActivities = [
    { id: 1, title: 'Morning Breathing Exercise', completed: true, time: '9:00 AM' },
    { id: 2, title: 'Gratitude Journal', completed: false, time: '2:00 PM' },
    { id: 3, title: 'Physical Activity', completed: false, time: '4:00 PM' },
    { id: 4, title: 'Evening Reflection', completed: false, time: '8:00 PM' },
  ];

  const recentMoods = [
    { date: 'Today', mood: 'Good', score: 7, color: '#10B981', reasons: ['Had a good workout', 'Completed tasks'] },
    { date: 'Yesterday', mood: 'Okay', score: 5, color: '#F59E0B', reasons: ['Feeling tired'] },
    { date: '2 days ago', mood: 'Great', score: 8, color: '#10B981', reasons: ['Met with friends', 'Good news'] },
    { date: '3 days ago', mood: 'Stressed', score: 3, color: '#EF4444', reasons: ['Work pressure', 'Deadlines'] },
    { date: '4 days ago', mood: 'Neutral', score: 6, color: '#6B7280', reasons: ['Regular day'] },
  ];

  const handleBookSession = () => {
    try {
      navigation.navigate('DoctorList');
    } catch (error) {
      Alert.alert('Coming Soon', 'Doctor booking feature is under development.');
    }
  };

  const handleJoinSession = () => {
    try {
      navigation.navigate('PreSessionTemplate', { sessionData: upcomingSession });
    } catch (error) {
      Alert.alert('Coming Soon', 'Session joining feature is under development.');
    }
  };

  const handleNavigate = (screenName, params = {}) => {
    try {
      navigation.navigate(screenName, params);
    } catch (error) {
      Alert.alert('Coming Soon', `${screenName} feature is under development.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.name}>How are you feeling today?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleNavigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleNavigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Mood Check */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Mood Check</Text>
        <Text style={styles.cardDescription}>How are you feeling right now?</Text>
        <View style={styles.moodButtons}>
          {[
            { emoji: '😢', mood: 'Sad', score: 2 },
            { emoji: '😐', mood: 'Neutral', score: 5 },
            { emoji: '😊', mood: 'Good', score: 7 },
            { emoji: '😄', mood: 'Happy', score: 8 },
            { emoji: '🤩', mood: 'Great', score: 10 }
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.moodButton}>
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text style={styles.moodLabel}>{item.mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => handleNavigate('MoodTracking')}
        >
          <Text style={styles.primaryButtonText}>Log Mood</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Session */}
      {upcomingSession && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Session</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTherapist}>{upcomingSession.therapist}</Text>
              <Text style={styles.sessionTime}>{upcomingSession.time}</Text>
              <Text style={styles.sessionType}>{upcomingSession.type} • {upcomingSession.duration}</Text>
            </View>
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={handleJoinSession}
            >
              <Ionicons name="videocam" size={20} color={Colors.surface} />
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Book Sessions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Book Sessions</Text>
          <TouchableOpacity onPress={handleBookSession}>
            <Text style={styles.viewAllText}>Browse Doctors</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDescription}>Schedule your next therapy session</Text>
        <TouchableOpacity 
          style={styles.bookSessionButton}
          onPress={handleBookSession}
        >
          <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
          <Text style={styles.bookSessionText}>Book New Session</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Daily Activities */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Daily Activities</Text>
          <TouchableOpacity onPress={() => handleNavigate('Activities')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {dailyActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityInfo}>
              <View style={[
                styles.activityCheckbox,
                activity.completed && styles.activityCheckboxCompleted
              ]}>
                {activity.completed && <Ionicons name="checkmark" size={16} color={Colors.surface} />}
              </View>
              <View>
                <Text style={[
                  styles.activityTitle,
                  activity.completed && styles.activityTitleCompleted
                ]}>
                  {activity.title}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.activityButton}>
              <Text style={styles.activityButtonText}>
                {activity.completed ? 'Completed' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Upcoming/Booked Sessions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Upcoming Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {bookedSessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionItemInfo}>
              <Text style={styles.sessionItemTherapist}>{session.therapist}</Text>
              <Text style={styles.sessionItemDateTime}>{session.date} at {session.time}</Text>
              <Text style={styles.sessionItemType}>{session.type}</Text>
            </View>
            <View style={styles.sessionItemStatus}>
              <Text style={styles.statusText}>{session.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Mood Track */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Mood Track</Text>
          <TouchableOpacity onPress={() => handleNavigate('MoodJournal')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.moodHistory}>
          {recentMoods.map((mood, index) => (
            <View key={index} style={styles.moodItem}>
              <View style={[styles.moodIndicator, { backgroundColor: mood.color }]} />
              <Text style={styles.moodDate}>{mood.date}</Text>
              <Text style={styles.moodText}>{mood.mood}</Text>
              <Text style={styles.moodScore}>{mood.score}/10</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mood Journal Modal */}
      {showMoodJournal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daily Mood Check-in</Text>
            <Text style={styles.modalDescription}>
              How are you feeling today? This helps us track your progress.
            </Text>
            
            <View style={styles.modalMoodButtons}>
              {[
                { emoji: '😢', mood: 'Sad' },
                { emoji: '😐', mood: 'Neutral' },
                { emoji: '😊', mood: 'Good' },
                { emoji: '😄', mood: 'Happy' },
                { emoji: '🤩', mood: 'Great' }
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.modalMoodButton}>
                  <Text style={styles.modalMoodEmoji}>{item.emoji}</Text>
                  <Text style={styles.modalMoodLabel}>{item.mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowMoodJournal(false)}
              >
                <Text style={styles.modalButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => handleMoodJournalSubmit('Good', ['Feeling positive'])}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  greeting: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  name: {
    ...Typography.heading2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
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
  },
  cardDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  moodButton: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTherapist: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  joinButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  bookSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bookSessionText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
    marginLeft: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCheckboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  activityTitle: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  activityTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  activityButton: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  activityButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sessionItemInfo: {
    flex: 1,
  },
  sessionItemTherapist: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionItemDateTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionItemType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  sessionItemStatus: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  moodHistory: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodItem: {
    alignItems: 'center',
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: Spacing.xs,
  },
  moodDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  moodText: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  moodScore: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
  },
  modalTitle: {
    ...Typography.heading3,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalMoodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  modalMoodButton: {
    alignItems: 'center',
  },
  modalMoodEmoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  modalMoodLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalButtonText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: Colors.surface,
  },
});