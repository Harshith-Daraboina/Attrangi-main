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

export default function ActivityAssignmentScreen({ navigation }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const patients = [
    { id: 1, name: 'Sarah Johnson', condition: 'Anxiety' },
    { id: 2, name: 'Michael Chen', condition: 'Depression' },
    { id: 3, name: 'Lisa Wang', condition: 'PTSD' },
  ];

  const activities = [
    {
      id: 1,
      title: 'Breathing Exercise',
      description: '5-minute guided breathing session',
      duration: '5 min',
      category: 'Mindfulness',
      icon: 'leaf-outline',
      difficulty: 'Easy',
    },
    {
      id: 2,
      title: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for',
      duration: '10 min',
      category: 'Reflection',
      icon: 'book-outline',
      difficulty: 'Easy',
    },
    {
      id: 3,
      title: 'Physical Activity',
      description: 'Take a 15-minute walk or do light stretching',
      duration: '15 min',
      category: 'Physical',
      icon: 'fitness-outline',
      difficulty: 'Medium',
    },
    {
      id: 4,
      title: 'Mindfulness Meditation',
      description: '10-minute guided meditation session',
      duration: '10 min',
      category: 'Mindfulness',
      icon: 'flower-outline',
      difficulty: 'Medium',
    },
  ];

  const categories = ['All', 'Mindfulness', 'Physical', 'Reflection', 'Social'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredActivities = selectedCategory === 'All' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Activity Assignment</Text>
        <TouchableOpacity>
          <Ionicons name="add-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Patient Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Patient</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.patientContainer}>
            {patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={[
                  styles.patientButton,
                  selectedPatient?.id === patient.id && styles.patientButtonSelected
                ]}
                onPress={() => setSelectedPatient(patient)}
              >
                <Text style={[
                  styles.patientName,
                  selectedPatient?.id === patient.id && styles.patientNameSelected
                ]}>
                  {patient.name}
                </Text>
                <Text style={[
                  styles.patientCondition,
                  selectedPatient?.id === patient.id && styles.patientConditionSelected
                ]}>
                  {patient.condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Activities List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Activities</Text>
        {filteredActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityIcon}>
                <Ionicons name={activity.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityDuration}>{activity.duration}</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{activity.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.activityActions}>
              <TouchableOpacity style={styles.assignButton}>
                <Ionicons name="add" size={16} color={Colors.surface} />
                <Text style={styles.assignButtonText}>Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewButton}>
                <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                <Text style={styles.previewButtonText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Assigned Activities */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Assigned Activities</Text>
        <View style={styles.assignedContainer}>
          <Text style={styles.assignedText}>
            {selectedPatient 
              ? `Activities assigned to ${selectedPatient.name}` 
              : 'Select a patient to view assigned activities'
            }
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Create Activity</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Progress Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="settings-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Activity Library</Text>
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
  patientContainer: {
    flexDirection: 'row',
  },
  patientButton: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 120,
    alignItems: 'center',
  },
  patientButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  patientName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  patientNameSelected: {
    color: Colors.primary,
  },
  patientCondition: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  patientConditionSelected: {
    color: Colors.primary,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: Colors.surface,
  },
  activityItem: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDuration: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginRight: Spacing.md,
  },
  difficultyBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  difficultyText: {
    ...Typography.caption,
    color: Colors.warning,
    fontSize: 12,
    fontWeight: '600',
  },
  activityActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  assignButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  previewButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  previewButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  assignedContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  assignedText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
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
