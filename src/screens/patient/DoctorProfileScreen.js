import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function DoctorProfileScreen({ navigation, route }) {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('video');

  const availableDates = [
    { date: '2024-01-15', day: 'Today', available: true },
    { date: '2024-01-16', day: 'Tomorrow', available: true },
    { date: '2024-01-17', day: 'Wednesday', available: true },
    { date: '2024-01-18', day: 'Thursday', available: true },
    { date: '2024-01-19', day: 'Friday', available: true },
  ];

  const timeSlots = [
    { time: '9:00 AM - 10:00 AM', available: true },
    { time: '10:00 AM - 11:00 AM', available: false },
    { time: '11:00 AM - 12:00 PM', available: true },
    { time: '2:00 PM - 3:00 PM', available: true },
    { time: '3:00 PM - 4:00 PM', available: false },
    { time: '4:00 PM - 5:00 PM', available: true },
    { time: '5:00 PM - 6:00 PM', available: true },
    { time: '6:00 PM - 7:00 PM', available: true },
  ];

  const reviews = [
    {
      id: 1,
      patient: 'Anonymous',
      rating: 5,
      comment: 'Dr Sarah is very understanding and helpful. She helped me work through my anxiety issues.',
      date: '2 days ago',
    },
    {
      id: 2,
      patient: 'Anonymous',
      rating: 5,
      comment: 'Excellent therapist! Very professional and caring approach.',
      date: '1 week ago',
    },
    {
      id: 3,
      patient: 'Anonymous',
      rating: 4,
      comment: 'Good session, very insightful. Would recommend to others.',
      date: '2 weeks ago',
    },
  ];

  const handleBookSession = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a date and time slot.');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book session with ${doctor.name} on ${selectedDate.day} at ${selectedTime.time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Payment',
          onPress: () => navigation.navigate('PaymentScreen', {
            doctor,
            date: selectedDate,
            time: selectedTime,
            sessionType,
          }),
        },
      ]
    );
  };

  const renderDateCard = (dateInfo) => (
    <TouchableOpacity
      key={dateInfo.date}
      style={[
        styles.dateCard,
        {
          borderColor: selectedDate?.date === dateInfo.date ? Colors.primary : Colors.border,
          backgroundColor: selectedDate?.date === dateInfo.date ? Colors.primary + '10' : Colors.surface,
        },
      ]}
      onPress={() => setSelectedDate(dateInfo)}
      disabled={!dateInfo.available}
    >
      <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
        {dateInfo.day}
      </Text>
      <Text style={[Typography.body, { color: Colors.textPrimary, fontWeight: '600' }]}>
        {new Date(dateInfo.date).getDate()}
      </Text>
      {!dateInfo.available && (
        <View style={styles.unavailableOverlay}>
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>
            Unavailable
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTimeSlot = (timeSlot) => (
    <TouchableOpacity
      key={timeSlot.time}
      style={[
        styles.timeSlot,
        {
          borderColor: selectedTime?.time === timeSlot.time ? Colors.primary : Colors.border,
          backgroundColor: selectedTime?.time === timeSlot.time ? Colors.primary + '10' : Colors.surface,
        },
      ]}
      onPress={() => setSelectedTime(timeSlot)}
      disabled={!timeSlot.available}
    >
      <Text style={[Typography.body, { color: Colors.textPrimary }]}>{timeSlot.time}</Text>
      {!timeSlot.available && (
        <View style={styles.unavailableOverlay}>
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>
            Booked
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Doctor Profile</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorInfoCard}>
        <Image source={doctor.image} style={styles.doctorImage} />
        
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <Text style={styles.experience}>{doctor.experience} experience</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(Math.floor(doctor.rating))}
            </View>
            <Text style={styles.ratingText}>{doctor.rating}</Text>
            <Text style={styles.reviewsText}>({doctor.reviews} reviews)</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Session Fee:</Text>
            <Text style={styles.priceText}>₹{doctor.fee}</Text>
          </View>
        </View>
      </View>

      {/* Session Type Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Type</Text>
        <View style={styles.sessionTypeContainer}>
          <TouchableOpacity
            style={[
              styles.sessionTypeButton,
              {
                backgroundColor: sessionType === 'video' ? Colors.primary : Colors.surface,
                borderColor: sessionType === 'video' ? Colors.primary : Colors.border,
              },
            ]}
            onPress={() => setSessionType('video')}
          >
            <Ionicons
              name="videocam"
              size={24}
              color={sessionType === 'video' ? Colors.surface : Colors.textPrimary}
            />
            <Text
              style={[
                styles.sessionTypeText,
                { color: sessionType === 'video' ? Colors.surface : Colors.textPrimary },
              ]}
            >
              Video Call
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sessionTypeButton,
              {
                backgroundColor: sessionType === 'audio' ? Colors.primary : Colors.surface,
                borderColor: sessionType === 'audio' ? Colors.primary : Colors.border,
              },
            ]}
            onPress={() => setSessionType('audio')}
          >
            <Ionicons
              name="call"
              size={24}
              color={sessionType === 'audio' ? Colors.surface : Colors.textPrimary}
            />
            <Text
              style={[
                styles.sessionTypeText,
                { color: sessionType === 'audio' ? Colors.surface : Colors.textPrimary },
              ]}
            >
              Audio Call
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Available Dates */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.datesContainer}>
            {availableDates.map(renderDateCard)}
          </View>
        </ScrollView>
      </View>

      {/* Available Time Slots */}
      {selectedDate && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Time Slot</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map(renderTimeSlot)}
          </View>
        </View>
      )}

      {/* Session Summary */}
      {selectedDate && selectedTime && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Doctor:</Text>
              <Text style={styles.summaryValue}>{doctor.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {selectedDate.day}, {new Date(selectedDate.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{selectedTime.time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>
                {sessionType === 'video' ? 'Video Call' : 'Audio Call'}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₹{doctor.fee}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Doctor Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About Dr {doctor.name.split(' ')[1]}</Text>
        <Text style={styles.description}>
          Dr {doctor.name.split(' ')[1]} is a highly experienced {doctor.specialization.toLowerCase()} with {doctor.experience} of practice. 
          Specializing in {doctor.specialties.join(', ').toLowerCase()}, they provide compassionate and evidence-based therapy.
        </Text>
        
        <View style={styles.specialtiesContainer}>
          <Text style={styles.specialtiesTitle}>Specialties:</Text>
          <View style={styles.specialtiesList}>
            {doctor.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyTagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.languagesContainer}>
          <Text style={styles.languagesTitle}>Languages:</Text>
          <Text style={styles.languagesText}>{doctor.languages.join(', ')}</Text>
        </View>
      </View>

      {/* Reviews */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Reviews</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewPatient}>{review.patient}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </View>

      {/* Book Session Button */}
      {selectedDate && selectedTime && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookSession}
          >
            <Text style={styles.bookButtonText}>
              Book Session - ₹{doctor.fee}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
          </TouchableOpacity>
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
  doctorInfoCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    ...Shadows.sm,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: Spacing.lg,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    ...Typography.heading3,
    marginBottom: Spacing.xs,
  },
  specialization: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  experience: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  ratingText: {
    ...Typography.body,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  reviewsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  priceText: {
    ...Typography.heading3,
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  cardTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
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
  datesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateCard: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    position: 'relative',
    ...Shadows.sm,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    ...Typography.heading3,
  },
  totalValue: {
    ...Typography.heading3,
    color: Colors.primary,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  specialtiesContainer: {
    marginBottom: Spacing.lg,
  },
  specialtiesTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  specialtyTagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  languagesContainer: {
    marginBottom: Spacing.lg,
  },
  languagesTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  languagesText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  reviewItem: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewPatient: {
    ...Typography.body,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  reviewDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    ...Shadows.lg,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
});
