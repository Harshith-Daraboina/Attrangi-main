import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function DoctorListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const specialties = ['All', 'Anxiety', 'Depression', 'CBT', 'Family Therapy', 'Trauma'];

  const doctors = [
    {
      id: 1,
      name: 'Dr Parama',
      specialization: 'Clinical Psychology',
      experience: '8 years',
      rating: 4.9,
      reviews: 127,
      fee: 2500,
      image: require('../../../assets/doc1.png'),
      languages: ['English', 'Hindi'],
      availability: 'Available Today',
      specialties: ['Anxiety', 'CBT'],
      nextAvailable: '2:00 PM',
    },
    {
      id: 2,
      name: 'Dr Bharath',
      specialization: 'Cognitive Behavioral Therapy',
      experience: '12 years',
      rating: 4.8,
      reviews: 89,
      fee: 3000,
      image: require('../../../assets/doc2.png'),
      languages: ['English', 'Tamil'],
      availability: 'Available Tomorrow',
      specialties: ['Depression', 'CBT'],
      nextAvailable: '10:00 AM',
    },
    {
      id: 3,
      name: 'Dr Sowmya',
      specialization: 'Family Therapy',
      experience: '6 years',
      rating: 4.9,
      reviews: 156,
      fee: 2200,
      image: require('../../../assets/doc3.png'),
      languages: ['English', 'Hindi', 'Bengali'],
      availability: 'Available Today',
      specialties: ['Family Therapy', 'Trauma'],
      nextAvailable: '4:00 PM',
    },
    {
      id: 4,
      name: 'Dr Bharathi',
      specialization: 'Psychiatry',
      experience: '15 years',
      rating: 4.7,
      reviews: 203,
      fee: 3500,
      image: require('../../../assets/doc4.png'),
      languages: ['English', 'Hindi', 'Telugu'],
      availability: 'Available Tomorrow',
      specialties: ['Anxiety', 'Depression'],
      nextAvailable: '11:00 AM',
    },
    {
      id: 5,
      name: 'Dr Sandesh',
      specialization: 'Trauma Therapy',
      experience: '10 years',
      rating: 4.8,
      reviews: 94,
      fee: 2800,
      image: require('../../../assets/doc5.png'),
      languages: ['English', 'Hindi'],
      availability: 'Available Today',
      specialties: ['Trauma', 'CBT'],
      nextAvailable: '3:00 PM',
    },
    {
      id: 6,
      name: 'Dr Roja',
      specialization: 'Counseling Psychology',
      experience: '7 years',
      rating: 4.8,
      reviews: 112,
      fee: 2400,
      image: require('../../../assets/doc1.png'),
      languages: ['English', 'Tamil'],
      availability: 'Available Today',
      specialties: ['Counseling', 'Stress Management'],
      nextAvailable: '1:00 PM',
    },
    {
      id: 7,
      name: 'Dr Ram',
      specialization: 'Psychiatry',
      experience: '14 years',
      rating: 4.9,
      reviews: 189,
      fee: 3200,
      image: require('../../../assets/doc2.png'),
      languages: ['English', 'Hindi'],
      availability: 'Available Tomorrow',
      specialties: ['Psychiatry', 'Medication Management'],
      nextAvailable: '9:00 AM',
    },
    {
      id: 8,
      name: 'Dr Prasad',
      specialization: 'Behavioral Therapy',
      experience: '11 years',
      rating: 4.7,
      reviews: 145,
      fee: 2600,
      image: require('../../../assets/doc3.png'),
      languages: ['English', 'Telugu'],
      availability: 'Available Today',
      specialties: ['Behavioral Therapy', 'Addiction'],
      nextAvailable: '5:00 PM',
    },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.fee - b.fee;
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      default:
        return 0;
    }
  });

  const handleDoctorSelect = (doctor) => {
    navigation.navigate('DoctorProfile', { doctor });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Your Doctor</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Specialty Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtyScroll}>
          <View style={styles.specialtyContainer}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.specialtyButton,
                  selectedSpecialty === specialty && styles.specialtyButtonSelected
                ]}
                onPress={() => setSelectedSpecialty(specialty)}
              >
                <Text style={[
                  styles.specialtyText,
                  selectedSpecialty === specialty && styles.specialtyTextSelected
                ]}>
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            {[
              { key: 'rating', label: 'Rating' },
              { key: 'price', label: 'Price' },
              { key: 'experience', label: 'Experience' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  sortBy === option.key && styles.sortButtonSelected
                ]}
                onPress={() => setSortBy(option.key)}
              >
                <Text style={[
                  styles.sortButtonText,
                  sortBy === option.key && styles.sortButtonTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {sortedDoctors.length} doctor{sortedDoctors.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Doctors List */}
      <View style={styles.doctorsContainer}>
        {sortedDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.doctorCard}
            onPress={() => handleDoctorSelect(doctor)}
          >
            <View style={styles.accentLine} />
            <Image source={doctor.image} style={styles.doctorImage} />
            
            <View style={styles.doctorInfo}>
              <View style={styles.doctorHeader}>
                <Text style={styles.doctorName}>{doctor.name.replace('Dr ', 'Dr ')}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                  <Text style={styles.reviewsText}>({doctor.reviews})</Text>
                </View>
              </View>
              
              <Text style={styles.specialization}>{doctor.specialization}</Text>
              <Text style={styles.experience}>{doctor.experience} experience</Text>
              
              <View style={styles.specialtiesContainer}>
                {doctor.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyTagText}>{specialty}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.languagesContainer}>
                <Ionicons name="language" size={14} color={Colors.textSecondary} />
                <Text style={styles.languagesText}>
                  {doctor.languages.join(', ')}
                </Text>
              </View>
              
              <View style={styles.availabilityContainer}>
                <View style={[
                  styles.availabilityBadge,
                  doctor.availability.includes('Today') ? styles.availabilityBadgeGreen : styles.availabilityBadgeBlue
                ]}>
                  <Text style={styles.availabilityText}>{doctor.availability}</Text>
                </View>
                {doctor.availability.includes('Today') && (
                  <Text style={styles.nextAvailableText}>Next: {doctor.nextAvailable}</Text>
                )}
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Session Fee:</Text>
                <Text style={styles.priceText}>₹{doctor.fee}</Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => handleDoctorSelect(doctor)}
                activeOpacity={0.8}
              >
                <Text style={styles.selectButtonText}>Select</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="funnel-outline" size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Advanced Filters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="map-outline" size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Nearby Doctors</Text>
        </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.body,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.md,
  },
  specialtyScroll: {
    paddingVertical: Spacing.md,
  },
  specialtyContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  specialtyButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
  },
  specialtyButtonSelected: {
    backgroundColor: Colors.primary,
  },
  specialtyText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  specialtyTextSelected: {
    color: Colors.surface,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sortLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: Spacing.md,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  sortButtonSelected: {
    backgroundColor: Colors.primary,
  },
  sortButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  sortButtonTextSelected: {
    color: Colors.surface,
  },
  resultsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  resultsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  doctorsContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  doctorCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  doctorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: Spacing.lg,
    borderWidth: 3,
    borderColor: Colors.primaryLight + '30',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  doctorName: {
    ...Typography.heading3,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  reviewsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  specialization: {
    ...Typography.body,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    fontSize: 14,
    fontWeight: '600',
  },
  experience: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  specialtyTag: {
    backgroundColor: Colors.primaryLight + '25',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '40',
  },
  specialtyTagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  languagesText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  availabilityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  availabilityBadgeGreen: {
    backgroundColor: Colors.success + '15',
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  availabilityBadgeBlue: {
    backgroundColor: Colors.primaryLight + '15',
    borderWidth: 1,
    borderColor: Colors.primaryLight + '30',
  },
  availabilityText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  nextAvailableText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  priceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  priceText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  selectButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
    marginRight: Spacing.xs,
    fontSize: 14,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});