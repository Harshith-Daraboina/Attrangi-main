import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function CaregiverActivityScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Today');

  const patientActivities = [
    {
      id: 1,
      title: 'Morning Breathing Exercise',
      description: '5-minute guided breathing session',
      duration: '5 min',
      completed: true,
      time: '9:00 AM',
      category: 'Mindfulness',
      icon: 'leaf-outline',
      patient: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for',
      duration: '10 min',
      completed: false,
      time: '2:00 PM',
      category: 'Reflection',
      icon: 'book-outline',
      patient: 'Sarah Johnson',
    },
    {
      id: 3,
      title: 'Physical Activity',
      description: 'Take a 15-minute walk or do light stretching',
      duration: '15 min',
      completed: false,
      time: '4:00 PM',
      category: 'Physical',
      icon: 'fitness-outline',
      patient: 'Sarah Johnson',
    },
    {
      id: 4,
      title: 'Evening Reflection',
      description: 'Reflect on your day and set intentions for tomorrow',
      duration: '8 min',
      completed: false,
      time: '8:00 PM',
      category: 'Reflection',
      icon: 'moon-outline',
      patient: 'Sarah Johnson',
    },
  ];

  const tabs = ['Today', 'This Week', 'All Activities'];
  const categories = ['All', 'Mindfulness', 'Physical', 'Reflection', 'Social'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredActivities = selectedCategory === 'All' 
    ? patientActivities 
    : patientActivities.filter(activity => activity.category === selectedCategory);

  const completedCount = patientActivities.filter(activity => activity.completed).length;
  const totalCount = patientActivities.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Patient Activities</Text>
        <TouchableOpacity>
          <Ionicons name="add-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Patient Progress</Text>
            <Text style={styles.progressDescription}>
              {completedCount === totalCount 
                ? 'All activities completed! 🎉' 
                : `${completedCount} out of ${totalCount} activities completed today.`
              }
            </Text>
          </View>
        </View>
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
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Activities for {selectedTab}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View History</Text>
          </TouchableOpacity>
        </View>
        
        {filteredActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityIcon}>
                <Ionicons name={activity.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.patientName}>Patient: {activity.patient}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityDuration}>{activity.duration}</Text>
                  <View style={styles.activityCategory}>
                    <Text style={styles.categoryTag}>{activity.category}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.activityActions}>
              <TouchableOpacity style={[
                styles.actionButton,
                activity.completed ? styles.actionButtonCompleted : styles.actionButtonPending
              ]}>
                <Ionicons 
                  name={activity.completed ? "checkmark" : "eye"} 
                  size={16} 
                  color={activity.completed ? Colors.surface : Colors.primary} 
                />
                <Text style={[
                  styles.actionButtonText,
                  activity.completed ? styles.actionButtonTextCompleted : styles.actionButtonTextPending
                ]}>
                  {activity.completed ? 'Completed' : 'View Details'}
                </Text>
              </TouchableOpacity>
              
              {!activity.completed && (
                <TouchableOpacity style={styles.remindButton}>
                  <Ionicons name="notifications-outline" size={16} color={Colors.warning} />
                  <Text style={styles.remindButtonText}>Remind</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Activity Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>{Math.round((completedCount / totalCount) * 100)}%</Text>
            <Text style={styles.insightLabel}>Completion Rate</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>7</Text>
            <Text style={styles.insightLabel}>Day Streak</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>4.2</Text>
            <Text style={styles.insightLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Add Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Progress Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Activity Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Set Reminders</Text>
          </TouchableOpacity>
        </View>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  progressText: {
    ...Typography.heading2,
    color: Colors.surface,
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.surface,
    fontSize: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  progressDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
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
    marginBottom: Spacing.xs,
  },
  patientName: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginRight: Spacing.md,
  },
  activityDuration: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginRight: Spacing.md,
  },
  activityCategory: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryTag: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  activityActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  actionButtonPending: {
    backgroundColor: Colors.primaryLight + '20',
  },
  actionButtonCompleted: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  actionButtonTextPending: {
    color: Colors.primary,
  },
  actionButtonTextCompleted: {
    color: Colors.surface,
  },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.warning + '20',
  },
  remindButtonText: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightValue: {
    ...Typography.heading2,
    color: Colors.primary,
  },
  insightLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - Spacing.lg * 4) / 2,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
