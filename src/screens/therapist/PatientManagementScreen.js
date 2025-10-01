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

export default function PatientManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      condition: 'Anxiety',
      lastSession: '2 days ago',
      nextSession: 'Today, 2:00 PM',
      status: 'Active',
      progress: 75,
      mood: 'Good',
      moodColor: '#10B981',
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 34,
      condition: 'Depression',
      lastSession: '1 week ago',
      nextSession: 'Tomorrow, 10:00 AM',
      status: 'Active',
      progress: 60,
      mood: 'Okay',
      moodColor: '#F59E0B',
    },
    {
      id: 3,
      name: 'Lisa Wang',
      age: 25,
      condition: 'PTSD',
      lastSession: '3 days ago',
      nextSession: 'Next week',
      status: 'Active',
      progress: 40,
      mood: 'Poor',
      moodColor: '#EF4444',
    },
    {
      id: 4,
      name: 'John Smith',
      age: 45,
      condition: 'Bipolar',
      lastSession: '2 weeks ago',
      nextSession: 'Discharged',
      status: 'Discharged',
      progress: 90,
      mood: 'Great',
      moodColor: '#10B981',
    },
  ];

  const filters = ['All', 'Active', 'Discharged', 'New'];
  const conditions = ['All', 'Anxiety', 'Depression', 'PTSD', 'Bipolar'];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return Colors.success;
      case 'Discharged':
        return Colors.primary;
      case 'New':
        return Colors.warning;
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
        <Text style={styles.title}>Patient Management</Text>
        <TouchableOpacity>
          <Ionicons name="add-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Patients List */}
      <View style={styles.patientsContainer}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={styles.patientCard}
            onPress={() => navigation.navigate('PatientDetail', { patientId: patient.id })}
          >
            <View style={styles.patientHeader}>
              <View style={styles.patientInfo}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientInitial}>{patient.name.charAt(0)}</Text>
                </View>
                <View style={styles.patientDetails}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientAge}>Age {patient.age}</Text>
                  <Text style={styles.patientCondition}>{patient.condition}</Text>
                </View>
              </View>
              <View style={styles.patientStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(patient.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(patient.status) }
                  ]}>
                    {patient.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.patientStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Progress</Text>
                <Text style={styles.statValue}>{patient.progress}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current Mood</Text>
                <View style={styles.moodContainer}>
                  <View style={[styles.moodIndicator, { backgroundColor: patient.moodColor }]} />
                  <Text style={styles.moodText}>{patient.mood}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Last Session</Text>
                <Text style={styles.statValue}>{patient.lastSession}</Text>
              </View>
            </View>

            <View style={styles.patientActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                <Text style={styles.actionText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
                <Text style={styles.actionText}>Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                <Text style={styles.actionText}>Schedule</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nextSession}>
              <Text style={styles.nextSessionLabel}>Next Session:</Text>
              <Text style={styles.nextSessionValue}>{patient.nextSession}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Add Patient</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="document-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Reports</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.heading2,
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
  filterContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.surface,
  },
  patientsContainer: {
    padding: Spacing.lg,
  },
  patientCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  patientInitial: {
    ...Typography.heading3,
    color: Colors.surface,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  patientAge: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  patientCondition: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  patientStatus: {
    alignItems: 'flex-end',
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
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  moodText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  nextSession: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  nextSessionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  nextSessionValue: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
