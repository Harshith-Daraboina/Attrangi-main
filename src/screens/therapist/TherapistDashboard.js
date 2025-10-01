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

export default function TherapistDashboard({ navigation }) {
  const todaySessions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '10:00 AM - 11:00 AM',
      type: 'Video Session',
      status: 'Confirmed',
      notes: 'Anxiety management session',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      time: '2:00 PM - 3:00 PM',
      type: 'Phone Call',
      status: 'Confirmed',
      notes: 'Follow-up on depression treatment',
    },
    {
      id: 3,
      patient: 'Lisa Wang',
      time: '4:00 PM - 5:00 PM',
      type: 'Video Session',
      status: 'Pending',
      notes: 'Initial consultation',
    },
  ];

  const newPatientRequests = [
    {
      id: 1,
      name: 'John Smith',
      age: 34,
      condition: 'Anxiety',
      urgency: 'High',
      requestDate: '2 hours ago',
    },
    {
      id: 2,
      name: 'Emily Davis',
      age: 28,
      condition: 'Depression',
      urgency: 'Medium',
      requestDate: '1 day ago',
    },
  ];

  const recentNotes = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      date: 'Yesterday',
      type: 'Session Notes',
      preview: 'Patient showed significant improvement in anxiety management...',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      date: '2 days ago',
      type: 'Progress Report',
      preview: 'Depression symptoms have decreased by 40%...',
    },
  ];

  const stats = {
    totalPatients: 24,
    sessionsToday: 3,
    completedSessions: 1,
    pendingRequests: 2,
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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Dr. Smith!</Text>
          <Text style={styles.subtitle}>Here's your schedule for today</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          {stats.pendingRequests > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPatients}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.sessionsToday}</Text>
          <Text style={styles.statLabel}>Sessions Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedSessions}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingRequests}</Text>
          <Text style={styles.statLabel}>New Requests</Text>
        </View>
      </View>

      {/* Today's Sessions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Today's Sessions</Text>
          <TouchableOpacity onPress={() => handleNavigate('TherapistSession')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {todaySessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.patientName}>{session.patient}</Text>
              <Text style={styles.sessionTime}>{session.time}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
              <Text style={styles.sessionNotes}>{session.notes}</Text>
            </View>
            <View style={styles.sessionActions}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: session.status === 'Confirmed' ? Colors.success + '20' : Colors.warning + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: session.status === 'Confirmed' ? Colors.success : Colors.warning }
                ]}>
                  {session.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Ionicons name="videocam" size={16} color={Colors.surface} />
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* New Patient Requests */}
      {newPatientRequests.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>New Patient Requests</Text>
            <TouchableOpacity onPress={() => handleNavigate('PatientManagement')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {newPatientRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text style={styles.requestDetails}>Age {request.age} • {request.condition}</Text>
                <Text style={styles.requestDate}>{request.requestDate}</Text>
              </View>
              <View style={styles.requestActions}>
                <View style={[
                  styles.urgencyBadge,
                  { backgroundColor: request.urgency === 'High' ? '#EF4444' + '20' : Colors.warning + '20' }
                ]}>
                  <Text style={[
                    styles.urgencyText,
                    { color: request.urgency === 'High' ? '#EF4444' : Colors.warning }
                  ]}>
                    {request.urgency}
                  </Text>
                </View>
                <TouchableOpacity style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Recent Notes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Notes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentNotes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <View style={styles.noteInfo}>
              <Text style={styles.notePatient}>{note.patient}</Text>
              <Text style={styles.noteType}>{note.type}</Text>
              <Text style={styles.notePreview}>{note.preview}</Text>
              <Text style={styles.noteDate}>{note.date}</Text>
            </View>
            <TouchableOpacity style={styles.viewNoteButton}>
              <Ionicons name="eye-outline" size={16} color={Colors.primary} />
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
            onPress={() => handleNavigate('PatientManagement')}
          >
            <Ionicons name="people-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Manage Patients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('ActivityAssignment')}
          >
            <Ionicons name="list-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Assign Activities</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('TherapistCommunity')}
          >
            <Ionicons name="chatbubble-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleNavigate('Earnings')}
          >
            <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Earnings</Text>
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
    ...Typography.heading2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statValue: {
    ...Typography.heading2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
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
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sessionInfo: {
    flex: 1,
  },
  patientName: {
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
    marginBottom: Spacing.xs,
  },
  sessionNotes: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  sessionActions: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
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
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  requestDetails: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  requestDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  requestActions: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  urgencyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  urgencyText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  reviewButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  noteInfo: {
    flex: 1,
  },
  notePatient: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  noteType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  notePreview: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 16,
  },
  noteDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  viewNoteButton: {
    padding: Spacing.sm,
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
