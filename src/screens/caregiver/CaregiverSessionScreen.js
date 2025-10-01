import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function CaregiverSessionScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const upcomingSessions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Michael Chen',
      date: 'Today',
      time: '2:00 PM - 3:00 PM',
      type: 'Video Session',
      status: 'Confirmed',
      duration: '60 min',
      meetingId: '123-456-789',
      role: 'Observer',
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Lisa Wang',
      date: 'Tomorrow',
      time: '10:00 AM - 11:00 AM',
      type: 'Phone Call',
      status: 'Confirmed',
      duration: '45 min',
      meetingId: '987-654-321',
      role: 'Participant',
    },
  ];

  const pastSessions = [
    {
      id: 3,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Michael Chen',
      date: 'Yesterday',
      time: '2:00 PM - 3:00 PM',
      type: 'Video Session',
      status: 'Completed',
      duration: '60 min',
      rating: 5,
      notes: 'Great session, discussed anxiety management techniques',
      role: 'Observer',
    },
    {
      id: 4,
      patient: 'Sarah Johnson',
      therapist: 'Dr. Lisa Wang',
      date: '3 days ago',
      time: '10:00 AM - 11:00 AM',
      type: 'Video Session',
      status: 'Completed',
      duration: '45 min',
      rating: 4,
      notes: 'Focused on mindfulness practices',
      role: 'Participant',
    },
  ];

  const tabs = ['Upcoming', 'Past Sessions', 'Join Session'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return Colors.success;
      case 'Completed':
        return Colors.primary;
      case 'Cancelled':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'checkmark-circle';
      case 'Completed':
        return 'checkmark-done-circle';
      case 'Cancelled':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Observer':
        return '#3B82F6';
      case 'Participant':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Sessions</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === 'Upcoming' && (
        <View style={styles.sessionsContainer}>
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.patientName}>{session.patient}</Text>
                    <Text style={styles.therapistName}>with {session.therapist}</Text>
                    <Text style={styles.sessionDateTime}>{session.date} • {session.time}</Text>
                    <Text style={styles.sessionType}>{session.type}</Text>
                  </View>
                  <View style={styles.sessionStatus}>
                    <Ionicons
                      name={getStatusIcon(session.status)}
                      size={20}
                      color={getStatusColor(session.status)}
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
                      {session.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sessionDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{session.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="videocam-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>ID: {session.meetingId}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(session.role) + '20' }]}>
                    <Text style={[styles.roleText, { color: getRoleColor(session.role) }]}>
                      {session.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionActions}>
                  <TouchableOpacity style={styles.joinButton}>
                    <Ionicons name="videocam" size={20} color={Colors.surface} />
                    <Text style={styles.joinButtonText}>Join Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                    <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
              <Text style={styles.emptyDescription}>
                No sessions are scheduled for your patient at the moment.
              </Text>
            </View>
          )}
        </View>
      )}

      {selectedTab === 'Past Sessions' && (
        <View style={styles.sessionsContainer}>
          {pastSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.patientName}>{session.patient}</Text>
                  <Text style={styles.therapistName}>with {session.therapist}</Text>
                  <Text style={styles.sessionDateTime}>{session.date} • {session.time}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                </View>
                <View style={styles.sessionStatus}>
                  <Ionicons
                    name={getStatusIcon(session.status)}
                    size={20}
                    color={getStatusColor(session.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
                    {session.status}
                  </Text>
                </View>
              </View>
              
              {session.notes && (
                <Text style={styles.sessionNotes}>{session.notes}</Text>
              )}

              <View style={styles.sessionDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>{session.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="star" size={16} color={Colors.warning} />
                  <Text style={styles.detailText}>{session.rating}/5</Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(session.role) + '20' }]}>
                  <Text style={[styles.roleText, { color: getRoleColor(session.role) }]}>
                    {session.role}
                  </Text>
                </View>
              </View>

              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.viewButton}>
                  <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notesButton}>
                  <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
                  <Text style={styles.notesButtonText}>Session Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === 'Join Session' && (
        <View style={styles.joinContainer}>
          <View style={styles.joinCard}>
            <Text style={styles.joinTitle}>Join a Session</Text>
            <Text style={styles.joinDescription}>
              Enter the session ID or scan a QR code to join a therapy session.
            </Text>
            
            <View style={styles.joinOptions}>
              <TouchableOpacity style={styles.joinOption}>
                <Ionicons name="keypad-outline" size={24} color={Colors.primary} />
                <View style={styles.joinOptionInfo}>
                  <Text style={styles.joinOptionTitle}>Enter Session ID</Text>
                  <Text style={styles.joinOptionDescription}>
                    Type in the session meeting ID
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.joinOption}>
                <Ionicons name="qr-code-outline" size={24} color={Colors.primary} />
                <View style={styles.joinOptionInfo}>
                  <Text style={styles.joinOptionTitle}>Scan QR Code</Text>
                  <Text style={styles.joinOptionDescription}>
                    Use camera to scan QR code
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.joinOption}>
                <Ionicons name="link-outline" size={24} color={Colors.primary} />
                <View style={styles.joinOptionInfo}>
                  <Text style={styles.joinOptionTitle}>Join via Link</Text>
                  <Text style={styles.joinOptionDescription}>
                    Use a shared session link
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickJoinCard}>
            <Text style={styles.quickJoinTitle}>Quick Join</Text>
            <Text style={styles.quickJoinDescription}>
              Join the next scheduled session for your patient
            </Text>
            <TouchableOpacity style={styles.quickJoinButton}>
              <Ionicons name="play-circle-outline" size={24} color={Colors.surface} />
              <Text style={styles.quickJoinButtonText}>Join Next Session</Text>
            </TouchableOpacity>
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
  title: {
    ...Typography.heading2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  sessionsContainer: {
    padding: Spacing.lg,
  },
  sessionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  patientName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  therapistName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionDateTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  sessionStatus: {
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  sessionNotes: {
    ...Typography.caption,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: 'auto',
  },
  roleText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  joinButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  rescheduleButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rescheduleButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  viewButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  viewButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  notesButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  notesButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  joinContainer: {
    padding: Spacing.lg,
  },
  joinCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  joinTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.sm,
  },
  joinDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  joinOptions: {
    gap: Spacing.md,
  },
  joinOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  joinOptionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  joinOptionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  joinOptionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  quickJoinCard: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  quickJoinTitle: {
    ...Typography.heading3,
    color: Colors.surface,
    marginBottom: Spacing.sm,
  },
  quickJoinDescription: {
    ...Typography.caption,
    color: Colors.surface + '80',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  quickJoinButton: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  quickJoinButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
