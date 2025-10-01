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

export default function ActivityAssistantScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTab, setSelectedTab] = useState('Activities');

  const activities = [
    {
      id: 1,
      title: 'Morning Breathing Exercise',
      description: '5-minute guided breathing session',
      duration: '5 min',
      completed: true,
      time: '9:00 AM',
      category: 'Mindfulness',
      icon: 'leaf-outline',
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
    },
  ];

  const categories = ['All', 'Mindfulness', 'Physical', 'Reflection', 'Social'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources = [
    {
      id: 1,
      title: 'The Anxiety and Phobia Workbook',
      author: 'Edmund J. Bourne',
      type: 'Book',
      description: 'A comprehensive guide to overcoming anxiety and phobias through cognitive-behavioral techniques.',
      rating: 4.8,
      category: 'Anxiety',
      icon: 'book-outline',
    },
    {
      id: 2,
      title: 'Mindfulness-Based Stress Reduction',
      author: 'Jon Kabat-Zinn',
      type: 'Article',
      description: 'Learn evidence-based mindfulness techniques to reduce stress and improve mental well-being.',
      rating: 4.9,
      category: 'Mindfulness',
      icon: 'document-text-outline',
    },
    {
      id: 3,
      title: 'Cognitive Behavioral Therapy Basics',
      author: 'Dr. Aaron Beck',
      type: 'Guide',
      description: 'Understanding the fundamentals of CBT and how to apply them in daily life.',
      rating: 4.7,
      category: 'CBT',
      icon: 'bulb-outline',
    },
    {
      id: 4,
      title: 'Breathing Exercises for Anxiety Relief',
      author: 'Dr. Sarah Johnson',
      type: 'Article',
      description: 'Simple breathing techniques to calm anxiety and promote relaxation.',
      rating: 4.6,
      category: 'Breathing',
      icon: 'leaf-outline',
    },
    {
      id: 5,
      title: 'Building Resilience: A Complete Guide',
      author: 'Dr. Michael Chen',
      type: 'Book',
      description: 'Strategies for building mental resilience and bouncing back from setbacks.',
      rating: 4.8,
      category: 'Resilience',
      icon: 'shield-outline',
    },
  ];

  const resourceCategories = ['All', 'Anxiety', 'Mindfulness', 'CBT', 'Breathing', 'Resilience'];

  const filteredActivities = selectedCategory === 'All' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const completedCount = activities.filter(activity => activity.completed).length;
  const totalCount = activities.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Activity Assistant</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Activities' && styles.tabActive]}
          onPress={() => setSelectedTab('Activities')}
        >
          <Text style={[styles.tabText, selectedTab === 'Activities' && styles.tabTextActive]}>
            Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Resources' && styles.tabActive]}
          onPress={() => setSelectedTab('Resources')}
        >
          <Text style={[styles.tabText, selectedTab === 'Resources' && styles.tabTextActive]}>
            Resources
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Activities' ? (
        <>
          {/* Progress Overview */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Great job!</Text>
                <Text style={styles.progressDescription}>
                  You've completed {completedCount} out of {totalCount} activities today.
                  {completedCount === totalCount ? ' All done! 🎉' : ' Keep it up!'}
                </Text>
              </View>
            </View>
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
          <Text style={styles.cardTitle}>Activities for {selectedDate}</Text>
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
                  name={activity.completed ? "checkmark" : "play"} 
                  size={16} 
                  color={activity.completed ? Colors.surface : Colors.primary} 
                />
                <Text style={[
                  styles.actionButtonText,
                  activity.completed ? styles.actionButtonTextCompleted : styles.actionButtonTextPending
                ]}>
                  {activity.completed ? 'Completed' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

          {/* Quick Actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="add-outline" size={24} color={Colors.primary} />
                <Text style={styles.quickActionText}>Add Custom Activity</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
                <Text style={styles.quickActionText}>View Progress</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="settings-outline" size={24} color={Colors.primary} />
                <Text style={styles.quickActionText}>Activity Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        /* Resources Tab */
        <>
          {/* Resource Categories */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {resourceCategories.map((category) => (
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

          {/* Resources List */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recommended Resources</Text>
            {filteredResources.map((resource) => (
              <View key={resource.id} style={styles.resourceItem}>
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceIcon}>
                    <Ionicons name={resource.icon} size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceAuthor}>by {resource.author}</Text>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                    <View style={styles.resourceMeta}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{resource.rating}</Text>
                      </View>
                      <View style={styles.resourceCategory}>
                        <Text style={styles.categoryTag}>{resource.category}</Text>
                      </View>
                      <View style={styles.resourceType}>
                        <Text style={styles.typeTag}>{resource.type}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.resourceActions}>
                  <TouchableOpacity style={styles.resourceButton}>
                    <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                    <Text style={styles.resourceButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.heading2,
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
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
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
  resourceItem: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  resourceHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  resourceAuthor: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  resourceCategory: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.md,
  },
  resourceType: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  typeTag: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  resourceActions: {
    alignItems: 'flex-end',
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  resourceButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
