import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';
import ComingSoon from '../../components/ComingSoon';

const { width } = Dimensions.get('window');

export default function CaregiverDashboard({ navigation }) {
  const patient = {
    name: 'Sarah Johnson',
    age: 28,
    lastSession: '2 days ago',
    nextSession: 'Today, 2:00 PM',
    mood: 'Good',
    moodColor: '#10B981',
  };

  const upcomingSessions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Michael Chen',
      time: 'Today, 2:00 PM',
      type: 'Video Session',
      status: 'Confirmed',
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Lisa Wang',
      time: 'Tomorrow, 10:00 AM',
      type: 'Phone Call',
      status: 'Confirmed',
    },
  ];

  const recentActivities = [
    { id: 1, title: 'Mood Check-in', completed: true, time: '9:00 AM' },
    { id: 2, title: 'Meditation', completed: false, time: '2:00 PM' },
    { id: 3, title: 'Journal Entry', completed: true, time: '8:00 PM' },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Patient missed morning medication',
      time: '1 hour ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'New session notes available',
      time: '3 hours ago',
    },
  ];

  const handleNavigate = (screenName, params = {}) => {
    try {
      navigation.navigate(screenName, params);
    } catch (error) {
      Alert.alert('Coming Soon', `${screenName} feature is under development.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.name}>How is your patient doing today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          {alerts.length > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Patient Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Overview</Text>
        <View style={styles.patientCard}>
          <View style={styles.patientInfo}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientInitial}>{patient.name.charAt(0)}</Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientAge}>Age {patient.age}</Text>
              <View style={styles.moodContainer}>
                <Text style={styles.moodLabel}>Current Mood:</Text>
                <View style={[styles.moodIndicator, { backgroundColor: patient.moodColor }]} />
                <Text style={styles.moodText}>{patient.mood}</Text>
              </View>
            </View>
          </View>
          <View style={styles.patientStats}>
            <Text style={styles.lastSession}>Last Session: {patient.lastSession}</Text>
            <Text style={styles.nextSession}>Next: {patient.nextSession}</Text>
          </View>
        </View>
      </View>

      {/* Alerts */}
      {alerts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alerts & Notifications</Text>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <Ionicons
                name={alert.type === 'warning' ? 'warning' : 'information-circle'}
                size={20}
                color={alert.type === 'warning' ? Colors.warning : Colors.primary}
              />
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Sessions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Upcoming Sessions</Text>
          <TouchableOpacity onPress={() => handleNavigate('CaregiverSession')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {upcomingSessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionPatient}>{session.patient}</Text>
              <Text style={styles.sessionTherapist}>with {session.therapist}</Text>
              <Text style={styles.sessionTime}>{session.time}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
            </View>
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.joinButton}>
                <Ionicons name="videocam" size={16} color={Colors.surface} />
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Activities */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Patient Activities</Text>
          <TouchableOpacity onPress={() => handleNavigate('CaregiverActivity')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentActivities.map((activity) => (
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
                {activity.completed ? 'Completed' : 'Mark Done'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('PreSessionTemplate')}
          >
            <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Pre-Session Form</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('CaregiverCommunity')}
          >
            <Ionicons name="people-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('CaregiverPayments')}
          >
            <Ionicons name="card-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Payments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('CaregiverSession')}
          >
            <Ionicons name="videocam-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Sessions</Text>
          </TouchableOpacity>
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
  greeting: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  name: {
    ...Typography.heading2,
  },
  notificationButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
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
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  patientCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  patientInitial: {
    ...Typography.heading3,
    color: Colors.surface,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  patientAge: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  moodText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastSession: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  nextSession: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  alertContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  alertMessage: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  alertTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionPatient: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionTherapist: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
  sessionActions: {
    marginLeft: Spacing.md,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  joinButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - Spacing.lg * 4) / 2,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});