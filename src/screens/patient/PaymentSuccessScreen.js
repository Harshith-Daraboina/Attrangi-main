import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function PaymentSuccessScreen({ navigation, route }) {
  const { doctor, appointmentDate, appointmentTime, amount, paymentMethod, sessionType = 'video' } = route.params || {};
  
  // Debug logging
  console.log('PaymentSuccessScreen - Received params:', route.params);
  console.log('PaymentSuccessScreen - SessionType:', sessionType);
  console.log('PaymentSuccessScreen - Doctor:', doctor);

  const handleContinueToSession = () => {
    console.log('PaymentSuccessScreen - handleContinueToSession called');
    console.log('Session type:', sessionType);
    console.log('Doctor:', doctor);
    
    if (sessionType === 'video') {
      // Navigate to VideoCall for live video sessions
      const sessionData = {
        therapistName: doctor?.name || 'Dr. Therapist',
        therapist: doctor?.name || 'Dr. Therapist',
        type: 'video',
        sessionType: 'video',
        time: appointmentTime || '2:00 PM',
        date: appointmentDate || new Date()
      };
      
      console.log('Navigating to VideoCall with sessionData:', sessionData);
      
      navigation.navigate('VideoCall', {
        sessionData: sessionData
      });
    } else {
      // Navigate to VideoSession for audio sessions
      console.log('Navigating to VideoSession for audio session');
      navigation.navigate('VideoSession', {
        doctor,
        appointmentDate,
        appointmentTime,
        sessionType: 'audio'
      });
    }
  };

  const handleGoToDashboard = () => {
    navigation.navigate('MainPatient');
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#28a745" />
        </View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your appointment has been confirmed
        </Text>
      </View>

      {/* Payment Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.doctorInfo}>
          <Image source={doctor.image} style={styles.doctorImage} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{appointmentDate?.day || 'Today'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{appointmentTime?.time || '2:00 PM'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="card" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₹{amount}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle" size={20} color="#28a745" />
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>You'll receive a confirmation email</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Click "Join Live {sessionType === 'video' ? 'Video' : 'Audio'} Session" to start your call
          </Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            Have your live {sessionType === 'video' ? 'video' : 'audio'} therapy session with {doctor?.name}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinueToSession}
        >
          <Ionicons 
            name={sessionType === 'video' ? "videocam" : "call"} 
            size={20} 
            color={Colors.surface} 
          />
          <Text style={styles.primaryButtonText}>
            Join Live {sessionType === 'video' ? 'Video' : 'Audio'} Session
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoToDashboard}
        >
          <Ionicons name="home" size={20} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Support Info */}
      <View style={styles.supportInfo}>
        <Ionicons name="help-circle" size={16} color={Colors.textSecondary} />
        <Text style={styles.supportText}>
          Need help? Contact support at support@attarangi.com
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.heading1,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
  },
  doctorSpecialization: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  appointmentDetails: {
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
    minWidth: 80,
  },
  detailValue: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  nextStepsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  nextStepsTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.lg,
    color: Colors.primary,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    ...Typography.body,
    flex: 1,
  },
  actionButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  supportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  supportText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
});
