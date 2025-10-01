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

export default function TherapistSessionScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Today');

  const todaySessions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '10:00 AM - 11:00 AM',
      type: 'Video Session',
      status: 'Confirmed',
      duration: '60 min',
      meetingId: '123-456-789',
      notes: 'Anxiety management session',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      time: '2:00 PM - 3:00 PM',
      type: 'Phone Call',
      status: 'Confirmed',
      duration: '45 min',
      meetingId: '987-654-321',
      notes: 'Follow-up on depression treatment',
    },
    {
      id: 3,
      patient: 'Lisa Wang',
      time: '4:00 PM - 5:00 PM',
      type: 'Video Session',
      status: 'Pending',
      duration: '60 min',
      meetingId: '456-789-123',
      notes: 'Initial consultation',
    },
  ];

  const pastSessions = [
    {
      id: 4,
      patient: 'Sarah Johnson',
      time: 'Yesterday, 2:00 PM - 3:00 PM',
      type: 'Video Session',
      status: 'Completed',
      duration: '60 min',
      rating: 5,
      notes: 'Great session, discussed anxiety management techniques',
      sessionNotes: 'Patient showed significant improvement in anxiety management. Discussed breathing exercises and cognitive restructuring techniques.',
    },
    {
      id: 5,
      patient: 'Michael Chen',
      time: '3 days ago, 10:00 AM - 11:00 AM',
      type: 'Video Session',
      status: 'Completed',
      duration: '45 min',
      rating: 4,
      notes: 'Focused on mindfulness practices',
      sessionNotes: 'Patient engaged well with mindfulness exercises. Recommended daily meditation practice.',
    },
  ];

  const tabs = ['Today', 'Past Sessions', 'Session Notes'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return Colors.success;
      case 'Completed':
        return Colors.primary;
      case 'Pending':
        return Colors.warning;
      case 'Cancelled':
        return '#EF4444';
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
      case 'Pending':
        return 'time';
      case 'Cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
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

      {selectedTab === 'Today' && (
        <View style={styles.sessionsContainer}>
          {todaySessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.patientName}>{session.patient}</Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionNotes}>{session.notes}</Text>
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
              </View>

              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Ionicons name="videocam" size={20} color={Colors.surface} />
                  <Text style={styles.joinButtonText}>Start Session</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notesButton}>
                  <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
                  <Text style={styles.notesButtonText}>Add Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === 'Past Sessions' && (
        <View style={styles.sessionsContainer}>
          {pastSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.patientName}>{session.patient}</Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionNotes}>{session.notes}</Text>
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
              
              {session.sessionNotes && (
                <View style={styles.sessionNotesContainer}>
                  <Text style={styles.sessionNotesTitle}>Session Notes:</Text>
                  <Text style={styles.sessionNotesText}>{session.sessionNotes}</Text>
                </View>
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
              </View>

              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.viewButton}>
                  <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={16} color={Colors.primary} />
                  <Text style={styles.editButtonText}>Edit Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === 'Session Notes' && (
        <View style={styles.notesContainer}>
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Session Notes</Text>
            <Text style={styles.notesDescription}>
              Add detailed notes about your therapy sessions to track patient progress.
            </Text>
            
            <View style={styles.notesForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Patient</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Select patient..."
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Session Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Select date..."
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Session Type</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity style={styles.typeButton}>
                    <Text style={styles.typeButtonText}>Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.typeButton}>
                    <Text style={styles.typeButtonText}>Phone</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.typeButton}>
                    <Text style={styles.typeButtonText}>In-Person</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Session Notes</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter detailed session notes..."
                  multiline
                  numberOfLines={6}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Treatment Plan Updates</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Any changes to treatment plan..."
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Next Session Goals</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Goals for next session..."
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Notes</Text>
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
  sessionStatus: {
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  sessionNotesContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  sessionNotesTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionNotesText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sessionDetails: {
    flexDirection: 'row',
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
  editButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  notesContainer: {
    padding: Spacing.lg,
  },
  notesCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  notesTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.sm,
  },
  notesDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  notesForm: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    ...Typography.label,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
});
