import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

export default function WaitingScreen({ navigation, route }) {
  const { sessionData, preSessionData } = route.params || {};
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canJoin, setCanJoin] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Start pulse animation
    startPulseAnimation();
    
    // Check session time and update countdown
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const updateCountdown = () => {
    // For demo purposes, simulate session starting in 2 minutes
    // In real app, this would calculate based on actual session time
    const now = new Date();
    const sessionTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
    
    const timeDiff = sessionTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      setTimeRemaining('Session is ready!');
      setCanJoin(true);
    } else {
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setCanJoin(false);
    }
  };

  const handleJoinSession = () => {
    if (!canJoin) {
      Alert.alert(
        'Session Not Ready',
        'Please wait until the session time to join.'
      );
      return;
    }

    // Navigate based on session type
    if (sessionData?.type === 'video' || sessionData?.sessionType === 'video') {
      navigation.navigate('VideoCall', { sessionData, preSessionData });
    } else {
      navigation.navigate('VideoSession', { sessionData, preSessionData, sessionType: 'audio' });
    }
  };

  const handleCancelSession = () => {
    Alert.alert(
      'Cancel Session',
      'Are you sure you want to cancel this session? You may be charged a cancellation fee.',
      [
        { text: 'Keep Session', style: 'cancel' },
        {
          text: 'Cancel Session',
          style: 'destructive',
          onPress: () => {
            // Handle session cancellation
            navigation.navigate('Dashboard');
          },
        },
      ]
    );
  };

  const getSessionStatus = () => {
    if (canJoin) {
      return {
        status: 'Ready to Join',
        color: Colors.success,
        icon: 'checkmark-circle',
      };
    } else {
      return {
        status: 'Waiting for Session',
        color: Colors.warning,
        icon: 'time',
      };
    }
  };

  const sessionStatus = getSessionStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Waiting Room</Text>
        <TouchableOpacity onPress={handleCancelSession} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Session Info */}
        <View style={styles.sessionInfoCard}>
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={40} color={Colors.primary} />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{sessionData?.therapist || 'Dr Sarah Johnson'}</Text>
              <Text style={styles.sessionType}>
                {sessionData?.type === 'video' || sessionData?.sessionType === 'video' ? 'Video Session' : 'Audio Session'}
              </Text>
              <Text style={styles.sessionTime}>{sessionData?.time || 'Today, 2:00 PM'}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: sessionStatus.color + '20' }]}>
            <Ionicons name={sessionStatus.icon} size={16} color={sessionStatus.color} />
            <Text style={[styles.statusText, { color: sessionStatus.color }]}>
              {sessionStatus.status}
            </Text>
          </View>
        </View>

        {/* Countdown Timer */}
        <Animated.View 
          style={[
            styles.timerCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="timer" size={48} color={Colors.primary} />
          <Text style={styles.timerText}>{timeRemaining}</Text>
          <Text style={styles.timerLabel}>
            {canJoin ? 'Session is ready!' : 'until session starts'}
          </Text>
        </Animated.View>

        {/* Pre-Session Summary */}
        {preSessionData && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Pre-Session Summary</Text>
            
            {preSessionData.moodLevel && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Current Mood:</Text>
                <Text style={styles.summaryValue}>
                  {preSessionData.moodLevel}/7 - {
                    preSessionData.moodLevel >= 6 ? 'Good' :
                    preSessionData.moodLevel >= 4 ? 'Okay' : 'Low'
                  }
                </Text>
              </View>
            )}
            
            {preSessionData.symptoms && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Symptoms:</Text>
                <Text style={styles.summaryValue}>{preSessionData.symptoms}</Text>
              </View>
            )}
            
            {preSessionData.concerns && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Concerns:</Text>
                <Text style={styles.summaryValue}>{preSessionData.concerns}</Text>
              </View>
            )}
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Pre-Session Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Find a quiet, private space</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Test your internet connection</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Have a glass of water nearby</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Prepare any questions you have</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            { backgroundColor: canJoin ? Colors.primary : Colors.textTertiary }
          ]}
          onPress={handleJoinSession}
          disabled={!canJoin}
        >
          <Ionicons 
            name={canJoin ? (sessionData?.type === 'video' || sessionData?.sessionType === 'video' ? "videocam" : "call") : "lock-closed"} 
            size={24} 
            color={Colors.surface} 
          />
          <Text style={styles.joinButtonText}>
            {canJoin ? 'Join Session' : 'Session Not Ready'}
          </Text>
        </TouchableOpacity>
        
        {!canJoin && (
          <Text style={styles.helpText}>
            You can join the session when the timer reaches 0:00
          </Text>
        )}
      </View>
    </View>
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
  cancelButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  sessionInfoCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
  },
  sessionType: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  timerCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  timerText: {
    ...Typography.heading1,
    color: Colors.primary,
    marginVertical: Spacing.md,
    fontFamily: 'monospace',
  },
  timerLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  summaryTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  tipsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  tipsTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    ...Shadows.lg,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  joinButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  helpText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
