import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';

const { width } = Dimensions.get('window');

export default function SessionDashboardScreen({ navigation }) {
  const { palette } = useThemeSettings();
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const upcomingSessions = [
    {
      id: 1,
      patientName: 'John Doe',
      patientAge: 28,
      patientImage: require('../../../assets/doc1.png'),
      date: '2024-01-15',
      time: '10:00 AM - 11:00 AM',
      type: 'Video Call',
      status: 'confirmed',
      challenges: ['Anxiety', 'Depression'],
      caregiverNotes: 'Patient has been experiencing increased anxiety this week. Sleep quality has been poor.',
      sessionGoals: 'Focus on anxiety management techniques and sleep hygiene.',
    },
    {
      id: 2,
      patientName: 'Sarah Wilson',
      patientAge: 35,
      patientImage: require('../../../assets/doc2.png'),
      date: '2024-01-15',
      time: '2:00 PM - 3:00 PM',
      type: 'Video Call',
      status: 'confirmed',
      challenges: ['PTSD', 'Social Anxiety'],
      caregiverNotes: 'Patient has been avoiding social situations. Shows improvement in therapy homework.',
      sessionGoals: 'Continue exposure therapy and discuss progress.',
    },
    {
      id: 3,
      patientName: 'Michael Chen',
      patientAge: 22,
      patientImage: require('../../../assets/doc3.png'),
      date: '2024-01-16',
      time: '11:00 AM - 12:00 PM',
      type: 'Audio Call',
      status: 'pending',
      challenges: ['ADHD', 'Depression'],
      caregiverNotes: 'Patient has been more focused on medication. Some side effects reported.',
      sessionGoals: 'Review medication effectiveness and adjust if needed.',
    },
  ];

  const pastSessions = [
    {
      id: 4,
      patientName: 'Emily Davis',
      patientAge: 30,
      patientImage: require('../../../assets/doc4.png'),
      date: '2024-01-12',
      time: '3:00 PM - 4:00 PM',
      type: 'Video Call',
      status: 'completed',
      challenges: ['Anxiety', 'Panic Disorder'],
      sessionNotes: 'Discussed breathing techniques. Patient showed good understanding. Assigned homework.',
      nextSteps: 'Continue with exposure therapy. Schedule follow-up in 2 weeks.',
    },
    {
      id: 5,
      patientName: 'David Brown',
      patientAge: 45,
      patientImage: require('../../../assets/doc5.png'),
      date: '2024-01-10',
      time: '4:00 PM - 5:00 PM',
      type: 'Video Call',
      status: 'completed',
      challenges: ['Depression', 'Substance Abuse'],
      sessionNotes: 'Patient is making progress with sobriety. Discussed relapse prevention strategies.',
      nextSteps: 'Continue weekly sessions. Consider group therapy referral.',
    },
  ];

  const handleStartSession = (session) => {
    Alert.alert(
      'Start Session',
      `Start session with ${session.patientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Session',
          onPress: () => navigation.navigate('VideoCallScreen', {
            sessionData: session,
            userRole: 'doctor',
          }),
        },
      ]
    );
  };

  const handleViewNotes = (session) => {
    navigation.navigate('SessionNotesScreen', { session });
  };

  const renderSessionCard = (session, isUpcoming = true) => (
    <View key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.patientInfo}>
          <Image source={session.patientImage} style={styles.patientImage} />
          <View style={styles.patientDetails}>
            <Text style={[Typography.heading3, { color: palette.text }]}>
              {session.patientName}
            </Text>
            <Text style={[Typography.caption, { color: palette.text }]}>
              Age: {session.patientAge} • {session.type}
            </Text>
            <View style={styles.challengesContainer}>
              {session.challenges.map((challenge, index) => (
                <View key={index} style={styles.challengeTag}>
                  <Text style={[Typography.caption, { color: palette.primary }]}>
                    {challenge}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.sessionMeta}>
          <Text style={[Typography.body, { color: palette.text }]}>
            {new Date(session.date).toLocaleDateString()}
          </Text>
          <Text style={[Typography.body, { color: palette.text }]}>
            {session.time}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: session.status === 'confirmed' ? Colors.success : 
                              session.status === 'pending' ? Colors.warning : 
                              Colors.textTertiary }
          ]}>
            <Text style={styles.statusText}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {isUpcoming && session.caregiverNotes && (
        <View style={styles.notesSection}>
          <Text style={[Typography.label, { color: palette.text }]}>
            Caregiver Notes:
          </Text>
          <Text style={[Typography.body, { color: palette.text }]}>
            {session.caregiverNotes}
          </Text>
        </View>
      )}

      {isUpcoming && session.sessionGoals && (
        <View style={styles.notesSection}>
          <Text style={[Typography.label, { color: palette.text }]}>
            Session Goals:
          </Text>
          <Text style={[Typography.body, { color: palette.text }]}>
            {session.sessionGoals}
          </Text>
        </View>
      )}

      {!isUpcoming && session.sessionNotes && (
        <View style={styles.notesSection}>
          <Text style={[Typography.label, { color: palette.text }]}>
            Session Notes:
          </Text>
          <Text style={[Typography.body, { color: palette.text }]}>
            {session.sessionNotes}
          </Text>
        </View>
      )}

      {!isUpcoming && session.nextSteps && (
        <View style={styles.notesSection}>
          <Text style={[Typography.label, { color: palette.text }]}>
            Next Steps:
          </Text>
          <Text style={[Typography.body, { color: palette.text }]}>
            {session.nextSteps}
          </Text>
        </View>
      )}

      <View style={styles.sessionActions}>
        {isUpcoming ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton, { borderColor: palette.primary }]}
              onPress={() => handleViewNotes(session)}
            >
              <Ionicons name="document-text" size={16} color={palette.primary} />
              <Text style={[styles.actionButtonText, { color: palette.primary }]}>
                View Notes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: palette.primary }]}
              onPress={() => handleStartSession(session)}
            >
              <Ionicons name="videocam" size={16} color="#fff" />
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                Start Session
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: palette.primary }]}
            onPress={() => handleViewNotes(session)}
          >
            <Ionicons name="document-text" size={16} color="#fff" />
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>
              View Full Notes
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabContent = () => {
    const sessions = selectedTab === 'upcoming' ? upcomingSessions : pastSessions;
    const isUpcoming = selectedTab === 'upcoming';

    if (sessions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={60} color={Colors.textTertiary} />
          <Text style={[Typography.heading3, { color: Colors.textTertiary, textAlign: 'center' }]}>
            No {isUpcoming ? 'upcoming' : 'past'} sessions
          </Text>
          <Text style={[Typography.body, { color: Colors.textTertiary, textAlign: 'center' }]}>
            {isUpcoming ? 'Your upcoming sessions will appear here' : 'Your completed sessions will appear here'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.sessionsList}>
        {sessions.map(session => renderSessionCard(session, isUpcoming))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Session Dashboard
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'upcoming' && { backgroundColor: palette.primary },
          ]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'upcoming' ? '#fff' : palette.text },
            ]}
          >
            Upcoming ({upcomingSessions.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'past' && { backgroundColor: palette.primary },
          ]}
          onPress={() => setSelectedTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'past' ? '#fff' : palette.text },
            ]}
          >
            Past ({pastSessions.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
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
  },
  backButton: {
    padding: Spacing.sm,
  },
  addButton: {
    padding: Spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sessionsList: {
    gap: Spacing.lg,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  patientDetails: {
    flex: 1,
  },
  challengesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  challengeTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  notesSection: {
    marginBottom: Spacing.md,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
});
