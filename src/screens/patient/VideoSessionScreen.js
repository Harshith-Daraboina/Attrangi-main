import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { Spacing, Colors, BorderRadius } from '../../styles/designSystem';

export default function VideoSessionScreen({ route, navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { doctor, appointmentDate, appointmentTime, meetingId, sessionType = 'video' } = route.params || {};
  
  // Handle case where doctor might be passed as string
  const doctorData = typeof doctor === 'string' ? { name: doctor } : doctor;
  
  // Debug logging
  console.log('VideoSessionScreen received params:', {
    doctor: doctorData?.name,
    appointmentDate: appointmentDate?.toLocaleDateString(),
    appointmentTime,
    meetingId,
    originalDoctor: doctor
  });
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [isGeneratingMeeting, setIsGeneratingMeeting] = useState(false);

  useEffect(() => {
    // Generate meeting link for video sessions
    if (sessionType === 'video') {
      generateMeetingLink();
    }
  }, [sessionType]);

  const generateMeetingLink = async () => {
    setIsGeneratingMeeting(true);
    
    try {
      // In a real implementation, you would call your backend API to create a Google Meet
      // For demo purposes, we'll generate a mock meeting URL
      const mockMeetingId = `therapy-session-${Date.now()}`;
      const mockMeetingUrl = `https://meet.google.com/${mockMeetingId}`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMeetingUrl(mockMeetingUrl);
      setIsGeneratingMeeting(false);
      
      // Auto-start session notification
      Alert.alert(
        'Session Ready!',
        `Your ${sessionType} therapy session with ${doctorData?.name || 'your therapist'} is ready to begin.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      setIsGeneratingMeeting(false);
      Alert.alert(
        'Error',
        'Failed to create video session. Please try again.',
        [{ text: 'Retry', onPress: generateMeetingLink }, { text: 'Cancel', style: 'cancel' }]
      );
    }
  };

  const startVideoCall = async () => {
    try {
      if (meetingUrl) {
        // Open Google Meet in browser or app
        const supported = await Linking.canOpenURL(meetingUrl);
        
        if (supported) {
          await Linking.openURL(meetingUrl);
          setSessionStarted(true);
        } else {
          Alert.alert(
            'Cannot Open Link',
            'Please install Google Meet app or use a web browser to join the session.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to open video call. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const startAudioSession = () => {
    setSessionStarted(true);
    Alert.alert(
      'Session Started',
      `Your audio therapy session with ${doctorData?.name || 'your therapist'} has begun.`,
      [{ text: 'OK' }]
    );
  };

  const startSession = () => {
    if (sessionType === 'video') {
      startVideoCall();
    } else {
      startAudioSession();
    }
  };

  const copyMeetingLink = () => {
    // In a real app, you'd use Clipboard API
    Alert.alert(
      'Meeting Link',
      meetingUrl,
      [
        { text: 'OK' }
      ]
    );
  };

  const endSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end the therapy session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('MainPatient');
          }
        }
      ]
    );
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Session</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Session Info */}
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Ionicons name="videocam" size={32} color={Colors.primary} />
                  <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>Therapy Session</Text>
          <Text style={styles.sessionSubtitle}>with {doctorData?.name || 'Your Therapist'}</Text>
        </View>
        </View>

        <View style={styles.sessionDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.detailText}>
              {appointmentDate?.toLocaleDateString() || 'Today'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.detailText}>
              {appointmentTime || '50 minutes'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={20} color="#666" />
                      <Text style={styles.detailText}>
            {doctorData?.specialization || 'Clinical Psychology'}
          </Text>
          </View>
        </View>
      </View>

      {/* Session Status */}
      <View style={styles.statusCard}>
        {sessionType === 'video' ? (
          isGeneratingMeeting ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={24} color={Colors.primary} />
              <Text style={styles.loadingText}>Preparing your video session...</Text>
            </View>
          ) : meetingUrl ? (
            <View style={styles.readyContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.readyText}>Video session is ready!</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={copyMeetingLink}
              >
                <Ionicons name="copy" size={16} color={Colors.primary} />
                <Text style={styles.copyButtonText}>Copy Meeting Link</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color="#FF5722" />
              <Text style={styles.errorText}>Failed to create session</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={generateMeetingLink}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.readyContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.readyText}>Your audio session is ready to begin!</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!sessionStarted ? (
          <TouchableOpacity
            style={[
              styles.joinButton, 
              sessionType === 'video' && (!meetingUrl || isGeneratingMeeting) && styles.joinButtonDisabled
            ]}
            onPress={startSession}
            disabled={sessionType === 'video' && (!meetingUrl || isGeneratingMeeting)}
          >
            <Ionicons 
              name={sessionType === 'video' ? "videocam" : "call"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.joinButtonText}>
              {sessionType === 'video' ? 'Join Video Call' : 'Start Audio Session'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.endButton}
            onPress={endSession}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.rescheduleButton}
          onPress={() => navigation.navigate('Schedule', { doctor: doctorData })}
        >
          <Ionicons name="calendar" size={20} color={Colors.primary} />
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
      </View>

      {/* Session Guidelines */}
      <View style={styles.guidelinesCard}>
        <Text style={styles.guidelinesTitle}>Session Guidelines</Text>
        <View style={styles.guidelinesList}>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.guidelineText}>Find a quiet, private space for the session</Text>
          </View>
          {sessionType === 'video' && (
            <>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.guidelineText}>Ensure you have a stable internet connection</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.guidelineText}>Test your camera and microphone beforehand</Text>
              </View>
            </>
          )}
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.guidelineText}>Be open and honest about your feelings</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.guidelineText}>Keep the session confidential and professional</Text>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.emergencyCard}>
        <Ionicons name="warning" size={20} color="#FF5722" />
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
          <Text style={styles.emergencyText}>
            If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.
          </Text>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => Alert.alert('Emergency', 'Please call 911 for immediate assistance')}
          >
            <Text style={styles.emergencyButtonText}>Emergency: 911</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  sessionCard: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sessionInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: Spacing.sm,
  },
  statusCard: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: Spacing.sm,
  },
  readyContainer: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.sm,
  },
  copyButtonText: {
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: '#FF5722',
    borderRadius: BorderRadius.sm,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    margin: Spacing.md,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  joinButtonDisabled: {
    backgroundColor: '#ccc',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  endButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rescheduleButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  guidelinesCard: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: Spacing.md,
  },
  guidelinesList: {
    marginTop: Spacing.sm,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  guidelineText: {
    fontSize: 14,
    color: '#666',
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  emergencyCard: {
    backgroundColor: '#FFF3E0',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  emergencyInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: Spacing.xs,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  emergencyButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
};
