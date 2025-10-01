import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Session Reminder',
      message: 'Your therapy session with Dr. Sarah Johnson starts in 30 minutes',
      time: '2 hours ago',
      read: false,
      type: 'session',
      action: 'reminder',
      sessionData: {
        therapist: 'Dr Sarah Johnson',
        time: 'Today, 2:00 PM',
        type: 'Video Session'
      }
    },
    {
      id: 2,
      title: 'Activity Completed',
      message: 'Great job! You completed your daily mood check-in',
      time: '1 day ago',
      read: true,
      type: 'activity',
      action: 'completed'
    },
    {
      id: 3,
      title: 'New Message',
      message: 'You have a new message from your caregiver',
      time: '2 days ago',
      read: true,
      type: 'message',
      action: 'new_message'
    },
    {
      id: 4,
      title: 'Payment Confirmed',
      message: 'Your payment for this month has been processed',
      time: '3 days ago',
      read: true,
      type: 'payment',
      action: 'confirmed'
    },
    {
      id: 5,
      title: 'Mood Check-in Reminder',
      message: 'How are you feeling today? Take a moment to check in',
      time: '4 days ago',
      read: false,
      type: 'mood_reminder',
      action: 'check_in'
    },
  ]);

  const [settings, setSettings] = useState({
    sessionReminders: true,
    activityUpdates: true,
    messages: true,
    payments: false,
    weeklyReports: true,
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session':
        return 'calendar-outline';
      case 'activity':
        return 'checkmark-circle-outline';
      case 'message':
        return 'chatbubble-outline';
      case 'payment':
        return 'card-outline';
      case 'mood_reminder':
        return 'heart-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'session':
        return Colors.primary;
      case 'activity':
        return Colors.success;
      case 'message':
        return '#3B82F6';
      case 'payment':
        return Colors.warning;
      case 'mood_reminder':
        return '#E91E63';
      default:
        return Colors.textSecondary;
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Handle deep-linking based on notification type and action
    switch (notification.type) {
      case 'session':
        if (notification.action === 'reminder') {
          navigation.navigate('Dashboard');
        } else if (notification.action === 'join') {
          navigation.navigate('PreSessionTemplate', { 
            sessionData: notification.sessionData 
          });
        }
        break;
      case 'activity':
        navigation.navigate('Activities');
        break;
      case 'message':
        navigation.navigate('Community');
        break;
      case 'payment':
        navigation.navigate('PatientPayments');
        break;
      case 'mood_reminder':
        navigation.navigate('MoodTracking');
        break;
      default:
        navigation.navigate('Dashboard');
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              !notification.read && styles.unreadNotification,
            ]}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.notificationIcon}>
              <Ionicons
                name={getNotificationIcon(notification.type)}
                size={24}
                color={getNotificationColor(notification.type)}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="calendar-outline" size={24} color={Colors.textSecondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Session Reminders</Text>
              <Text style={styles.settingDescription}>Get notified before therapy sessions</Text>
            </View>
          </View>
          <Switch
            value={settings.sessionReminders}
            onValueChange={() => toggleSetting('sessionReminders')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.sessionReminders ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.textSecondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Activity Updates</Text>
              <Text style={styles.settingDescription}>Notifications for completed activities</Text>
            </View>
          </View>
          <Switch
            value={settings.activityUpdates}
            onValueChange={() => toggleSetting('activityUpdates')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.activityUpdates ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.textSecondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Messages</Text>
              <Text style={styles.settingDescription}>New messages from your team</Text>
            </View>
          </View>
          <Switch
            value={settings.messages}
            onValueChange={() => toggleSetting('messages')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.messages ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="card-outline" size={24} color={Colors.textSecondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Payment Updates</Text>
              <Text style={styles.settingDescription}>Billing and payment notifications</Text>
            </View>
          </View>
          <Switch
            value={settings.payments}
            onValueChange={() => toggleSetting('payments')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.payments ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="document-text-outline" size={24} color={Colors.textSecondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Weekly Reports</Text>
              <Text style={styles.settingDescription}>Progress reports and insights</Text>
            </View>
          </View>
          <Switch
            value={settings.weeklyReports}
            onValueChange={() => toggleSetting('weeklyReports')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.weeklyReports ? Colors.primary : Colors.textTertiary}
          />
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
  markAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading3,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: Colors.primaryLight + '10',
  },
  notificationIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  notificationMessage: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notificationTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: Spacing.lg + 4,
    right: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
