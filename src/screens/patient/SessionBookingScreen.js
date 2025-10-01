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

export default function SessionBookingScreen({ navigation }) {
  const { palette } = useThemeSettings();
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('video');

  const therapists = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialization: 'Clinical Psychology',
      experience: '8 years',
      rating: 4.9,
      reviews: 127,
      fee: 2500,
      image: require('../../../assets/doc1.png'),
      languages: ['English', 'Hindi'],
      availability: ['Monday', 'Wednesday', 'Friday'],
      location: 'Mumbai, Maharashtra',
      nextAvailable: 'Tomorrow, 10:00 AM',
    },
    {
      id: 2,
      name: 'Dr. Arjun Patel',
      specialization: 'Cognitive Behavioral Therapy',
      experience: '12 years',
      rating: 4.8,
      reviews: 89,
      fee: 3000,
      image: require('../../../assets/doc2.png'),
      languages: ['English', 'Gujarati'],
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      location: 'Ahmedabad, Gujarat',
      nextAvailable: 'Today, 2:00 PM',
    },
    {
      id: 3,
      name: 'Dr. Ananya Reddy',
      specialization: 'Family Therapy',
      experience: '6 years',
      rating: 4.9,
      reviews: 156,
      fee: 2200,
      image: require('../../../assets/doc3.png'),
      languages: ['English', 'Telugu', 'Tamil'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      location: 'Hyderabad, Telangana',
      nextAvailable: 'Today, 4:00 PM',
    },
    {
      id: 4,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Anxiety & Depression',
      experience: '10 years',
      rating: 4.7,
      reviews: 203,
      fee: 2800,
      image: require('../../../assets/doc4.png'),
      languages: ['English', 'Hindi', 'Punjabi'],
      availability: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      location: 'Delhi, NCR',
      nextAvailable: 'Tomorrow, 11:00 AM',
    },
    {
      id: 5,
      name: 'Dr. Meera Singh',
      specialization: 'Child Psychology',
      experience: '7 years',
      rating: 4.8,
      reviews: 94,
      fee: 2400,
      image: require('../../../assets/doc5.png'),
      languages: ['English', 'Hindi', 'Bengali'],
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      location: 'Kolkata, West Bengal',
      nextAvailable: 'Today, 3:00 PM',
    },
  ];

  const availableDates = [
    { date: '2024-01-15', day: 'Monday', available: true },
    { date: '2024-01-16', day: 'Tuesday', available: true },
    { date: '2024-01-17', day: 'Wednesday', available: true },
    { date: '2024-01-18', day: 'Thursday', available: true },
    { date: '2024-01-19', day: 'Friday', available: true },
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
  ];

  const handleBookSession = () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a therapist, date, and time slot.');
      return;
    }

    console.log('SessionBookingScreen - Booking session with sessionType:', sessionType);

    Alert.alert(
      'Confirm Booking',
      `Book ${sessionType} session with ${selectedTherapist.name} on ${selectedDate.day} at ${selectedTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Payment',
          onPress: () => {
            const paymentParams = {
              therapist: selectedTherapist,
              date: selectedDate,
              time: selectedTime,
              sessionType,
            };
            
            console.log('SessionBookingScreen - Navigating to PaymentScreen with params:', paymentParams);
            
            navigation.navigate('PaymentScreen', paymentParams);
          },
        },
      ]
    );
  };

  const renderTherapistCard = (therapist) => (
    <TouchableOpacity
      key={therapist.id}
      style={[
        styles.therapistCard,
        {
          borderColor: selectedTherapist?.id === therapist.id ? palette.primary : Colors.border,
          backgroundColor: selectedTherapist?.id === therapist.id ? palette.primary + '08' : Colors.surface,
        },
      ]}
      onPress={() => setSelectedTherapist(therapist)}
      activeOpacity={0.8}
    >
      {/* Selection Indicator */}
      {selectedTherapist?.id === therapist.id && (
        <View style={[styles.selectedIndicator, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      )}

      {/* Therapist Header */}
      <View style={styles.therapistHeader}>
        <Image source={therapist.image} style={styles.therapistImage} />
        <View style={styles.therapistBasicInfo}>
          <Text style={[Typography.heading3, { color: palette.text, marginBottom: 2 }]}>
            {therapist.name}
          </Text>
          <Text style={[Typography.caption, { color: palette.textSecondary }]}>
            {therapist.location}
          </Text>
        </View>
      </View>

      {/* Specialization & Experience */}
      <View style={styles.specializationContainer}>
        <Text style={[Typography.body, { color: palette.text, fontWeight: '600' }]}>
          {therapist.specialization}
        </Text>
        <Text style={[Typography.caption, { color: palette.textSecondary }]}>
          {therapist.experience} experience
        </Text>
      </View>

      {/* Rating & Reviews */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingStars}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[Typography.caption, { color: palette.text, marginLeft: 4, fontWeight: '600' }]}>
            {therapist.rating}
          </Text>
        </View>
        <Text style={[Typography.caption, { color: palette.textSecondary }]}>
          ({therapist.reviews} reviews)
        </Text>
      </View>

      {/* Languages */}
      <View style={styles.languagesContainer}>
        <Text style={[Typography.caption, { color: palette.textSecondary, marginBottom: 4 }]}>
          Languages:
        </Text>
        <View style={styles.languageTags}>
          {therapist.languages.map((lang, index) => (
            <View key={index} style={[styles.languageTag, { backgroundColor: palette.primary + '15' }]}>
              <Text style={[Typography.caption, { color: palette.primary, fontWeight: '500' }]}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Next Available */}
      <View style={styles.nextAvailableContainer}>
        <Ionicons name="time-outline" size={14} color={Colors.success} />
        <Text style={[Typography.caption, { color: Colors.success, marginLeft: 4, fontWeight: '500' }]}>
          Next: {therapist.nextAvailable}
        </Text>
      </View>

      {/* Price */}
      <View style={styles.priceContainer}>
        <Text style={[Typography.heading3, { color: palette.primary, fontWeight: '700' }]}>
          ₹{therapist.fee}
        </Text>
        <Text style={[Typography.caption, { color: palette.textSecondary }]}>
          per session
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDateCard = (dateInfo) => (
    <TouchableOpacity
      key={dateInfo.date}
      style={[
        styles.dateCard,
        {
          borderColor: selectedDate?.date === dateInfo.date ? palette.primary : Colors.border,
          backgroundColor: selectedDate?.date === dateInfo.date ? palette.primary + '08' : Colors.surface,
        },
      ]}
      onPress={() => setSelectedDate(dateInfo)}
      disabled={!dateInfo.available}
      activeOpacity={0.7}
    >
      <View style={styles.dateCardContent}>
        <Text style={[
          Typography.caption, 
          { 
            color: selectedDate?.date === dateInfo.date ? palette.primary : palette.textSecondary,
            fontWeight: '500',
            marginBottom: 2,
          }
        ]}>
          {dateInfo.day.slice(0, 3)}
        </Text>
        <Text style={[
          Typography.heading3, 
          { 
            color: selectedDate?.date === dateInfo.date ? palette.primary : palette.text,
            fontWeight: '700',
          }
        ]}>
          {new Date(dateInfo.date).getDate()}
        </Text>
        <Text style={[
          Typography.caption, 
          { 
            color: palette.textSecondary,
            fontSize: 10,
          }
        ]}>
          {new Date(dateInfo.date).toLocaleDateString('en-IN', { month: 'short' })}
        </Text>
      </View>
      {!dateInfo.available && (
        <View style={styles.unavailableOverlay}>
          <Ionicons name="close-circle" size={16} color={Colors.error} />
        </View>
      )}
      {selectedDate?.date === dateInfo.date && (
        <View style={[styles.dateSelectedIndicator, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTimeSlot = (time) => (
    <TouchableOpacity
      key={time}
      style={[
        styles.timeSlot,
        {
          borderColor: selectedTime === time ? palette.primary : Colors.border,
          backgroundColor: selectedTime === time ? palette.primary + '08' : Colors.surface,
        },
      ]}
      onPress={() => setSelectedTime(time)}
      activeOpacity={0.7}
    >
      <View style={styles.timeSlotContent}>
        <Ionicons 
          name="time-outline" 
          size={16} 
          color={selectedTime === time ? palette.primary : palette.textSecondary} 
        />
        <Text style={[
          Typography.body, 
          { 
            color: selectedTime === time ? palette.primary : palette.text,
            fontWeight: selectedTime === time ? '600' : '500',
            marginLeft: 6,
          }
        ]}>
          {time}
        </Text>
      </View>
      {selectedTime === time && (
        <View style={[styles.timeSelectedIndicator, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: palette.text }]}>
          Book Session
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Type */}
        <View style={styles.section}>
          <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.md }]}>
            📞 Session Type
          </Text>
          <View style={styles.sessionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.sessionTypeButton,
                {
                  backgroundColor: sessionType === 'video' ? palette.primary : '#fff',
                  borderColor: sessionType === 'video' ? palette.primary : Colors.border,
                },
              ]}
              onPress={() => setSessionType('video')}
            >
              <Ionicons
                name="videocam"
                size={24}
                color={sessionType === 'video' ? '#fff' : palette.text}
              />
              <Text
                style={[
                  styles.sessionTypeText,
                  { color: sessionType === 'video' ? '#fff' : palette.text },
                ]}
              >
                Video Call
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sessionTypeButton,
                {
                  backgroundColor: sessionType === 'audio' ? palette.primary : '#fff',
                  borderColor: sessionType === 'audio' ? palette.primary : Colors.border,
                },
              ]}
              onPress={() => setSessionType('audio')}
            >
              <Ionicons
                name="call"
                size={24}
                color={sessionType === 'audio' ? '#fff' : palette.text}
              />
              <Text
                style={[
                  styles.sessionTypeText,
                  { color: sessionType === 'audio' ? '#fff' : palette.text },
                ]}
              >
                Audio Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Select Therapist */}
        <View style={styles.section}>
          <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.md }]}>
            👨‍⚕️ Choose Your Therapist
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.therapistsContainer}>
              {therapists.map(renderTherapistCard)}
            </View>
          </ScrollView>
        </View>

        {/* Select Date */}
        {selectedTherapist && (
          <View style={styles.section}>
            <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.md }]}>
              📅 Select Date
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.datesContainer}>
                {availableDates.map(renderDateCard)}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Select Time */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.md }]}>
              ⏰ Select Time Slot
            </Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map(renderTimeSlot)}
            </View>
          </View>
        )}

        {/* Session Summary */}
        {selectedTherapist && selectedDate && selectedTime && (
          <View style={styles.section}>
            <Text style={[Typography.heading2, { color: palette.text, marginBottom: Spacing.md }]}>
              📋 Session Summary
            </Text>
            <View style={[styles.summaryCard, { backgroundColor: Colors.surface }]}>
              <View style={styles.summaryHeader}>
                <Text style={[Typography.body, { color: palette.primary, fontWeight: '600' }]}>
                  Booking Details
                </Text>
                <Ionicons name="calendar-outline" size={20} color={palette.primary} />
              </View>
              
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Ionicons name="person-outline" size={16} color={palette.textSecondary} />
                    <Text style={[Typography.caption, { color: palette.textSecondary, marginLeft: 6 }]}>Therapist</Text>
                  </View>
                  <Text style={[Typography.body, { color: palette.text, fontWeight: '600' }]}>
                    {selectedTherapist.name}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Ionicons name="calendar-outline" size={16} color={palette.textSecondary} />
                    <Text style={[Typography.caption, { color: palette.textSecondary, marginLeft: 6 }]}>Date</Text>
                  </View>
                  <Text style={[Typography.body, { color: palette.text, fontWeight: '600' }]}>
                    {selectedDate.day}, {new Date(selectedDate.date).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Ionicons name="time-outline" size={16} color={palette.textSecondary} />
                    <Text style={[Typography.caption, { color: palette.textSecondary, marginLeft: 6 }]}>Time</Text>
                  </View>
                  <Text style={[Typography.body, { color: palette.text, fontWeight: '600' }]}>
                    {selectedTime}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Ionicons name={sessionType === 'video' ? 'videocam-outline' : 'call-outline'} size={16} color={palette.textSecondary} />
                    <Text style={[Typography.caption, { color: palette.textSecondary, marginLeft: 6 }]}>Type</Text>
                  </View>
                  <Text style={[Typography.body, { color: palette.text, fontWeight: '600' }]}>
                    {sessionType === 'video' ? 'Video Call' : 'Audio Call'}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.totalRow, { backgroundColor: palette.primary + '08', borderRadius: BorderRadius.md, padding: Spacing.md }]}>
                <View style={styles.totalLabelContainer}>
                  <Ionicons name="wallet-outline" size={18} color={palette.primary} />
                  <Text style={[Typography.heading3, { color: palette.primary, marginLeft: 6 }]}>Total Amount</Text>
                </View>
                <Text style={[Typography.heading2, { color: palette.primary, fontWeight: '700' }]}>
                  ₹{selectedTherapist.fee}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {selectedTherapist && selectedDate && selectedTime && (
        <View style={[styles.footer, { backgroundColor: Colors.surface }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.primary }]}
            onPress={handleBookSession}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                Book Session
              </Text>
              <Text style={[styles.buttonPrice, { color: '#fff' }]}>
                ₹{selectedTherapist.fee}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sessionTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  sessionTypeText: {
    marginLeft: Spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  therapistsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  therapistCard: {
    width: width * 0.75,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    ...Shadows.lg,
    position: 'relative',
    minHeight: 280,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  therapistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  therapistBasicInfo: {
    flex: 1,
  },
  specializationContainer: {
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languagesContainer: {
    marginBottom: Spacing.sm,
  },
  languageTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  languageTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  nextAvailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  datesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  dateCard: {
    width: 70,
    height: 90,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.md,
  },
  dateCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelectedIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    position: 'relative',
    ...Shadows.sm,
    minWidth: 120,
  },
  timeSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSelectedIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryContent: {
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  totalLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    ...Shadows.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
  },
  buttonPrice: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
});
