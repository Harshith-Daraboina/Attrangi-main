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

export default function CaregiverCommunityScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Groups');
  const [searchQuery, setSearchQuery] = useState('');

  const groups = [
    {
      id: 1,
      name: 'Caregiver Support Group',
      members: 156,
      lastMessage: 'Thank you for sharing your experience',
      lastMessageTime: '1 hour ago',
      unreadCount: 2,
      isOnline: true,
      category: 'Support',
    },
    {
      id: 2,
      name: 'Mental Health Caregivers',
      members: 89,
      lastMessage: 'How do you handle difficult days?',
      lastMessageTime: '3 hours ago',
      unreadCount: 0,
      isOnline: true,
      category: 'Mental Health',
    },
    {
      id: 3,
      name: 'Family Caregivers Network',
      members: 234,
      lastMessage: 'Resources for self-care',
      lastMessageTime: '1 day ago',
      unreadCount: 1,
      isOnline: false,
      category: 'Family',
    },
    {
      id: 4,
      name: 'Therapy Session Support',
      members: 67,
      lastMessage: 'Pre-session preparation tips',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      isOnline: true,
      category: 'Therapy',
    },
  ];

  const recentMessages = [
    {
      id: 1,
      sender: 'Maria L.',
      message: 'I found this breathing exercise really helpful for my patient',
      time: '15 min ago',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'Thanks for the recommendation!',
      time: '12 min ago',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'John R.',
      message: 'How do you handle patient resistance to activities?',
      time: '30 min ago',
      isOwn: false,
    },
    {
      id: 4,
      sender: 'Sarah K.',
      message: 'I use positive reinforcement and break tasks into smaller steps',
      time: '25 min ago',
      isOwn: false,
    },
  ];

  const categories = ['All', 'Support', 'Mental Health', 'Family', 'Therapy', 'Resources'];

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Caregiver Community</Text>
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
            placeholder="Search groups or messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Groups' && styles.tabActive]}
          onPress={() => setSelectedTab('Groups')}
        >
          <Text style={[styles.tabText, selectedTab === 'Groups' && styles.tabTextActive]}>
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Messages' && styles.tabActive]}
          onPress={() => setSelectedTab('Messages')}
        >
          <Text style={[styles.tabText, selectedTab === 'Messages' && styles.tabTextActive]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Groups' ? (
        <>
          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    category === 'All' && styles.categoryButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    category === 'All' && styles.categoryTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Groups List */}
          <View style={styles.groupsContainer}>
            {filteredGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupItem}
                onPress={() => navigation.navigate('ChatCaregiver', { groupId: group.id })}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <View style={styles.groupNameContainer}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      {group.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <Text style={styles.groupMembers}>{group.members} members</Text>
                  </View>
                  <View style={styles.groupMeta}>
                    <Text style={styles.lastMessageTime}>{group.lastMessageTime}</Text>
                    {group.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{group.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.lastMessage}>{group.lastMessage}</Text>
                <View style={styles.groupCategory}>
                  <Text style={styles.categoryTag}>{group.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        /* Messages Tab */
        <View style={styles.messagesContainer}>
          {recentMessages.map((message) => (
            <View key={message.id} style={styles.messageItem}>
              <View style={[
                styles.messageBubble,
                message.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
              ]}>
                <Text style={[
                  styles.messageText,
                  message.isOwn ? styles.messageTextOwn : styles.messageTextOther
                ]}>
                  {message.message}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.isOwn ? styles.messageTimeOwn : styles.messageTimeOther
                ]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textTertiary}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="people-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Find Groups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Create Group</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Events</Text>
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
  categoryScroll: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
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
  groupsContainer: {
    padding: Spacing.lg,
  },
  groupItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  groupInfo: {
    flex: 1,
  },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  groupName: {
    ...Typography.body,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  groupMembers: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  groupMeta: {
    alignItems: 'flex-end',
  },
  lastMessageTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    ...Typography.caption,
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  lastMessage: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  groupCategory: {
    alignSelf: 'flex-start',
  },
  categoryTag: {
    ...Typography.caption,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    fontSize: 12,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  messageItem: {
    marginBottom: Spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  messageBubbleOwn: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  messageBubbleOther: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    ...Shadows.sm,
  },
  messageText: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  messageTextOwn: {
    color: Colors.surface,
  },
  messageTextOther: {
    color: Colors.textPrimary,
  },
  messageTime: {
    ...Typography.caption,
    fontSize: 12,
  },
  messageTimeOwn: {
    color: Colors.surface + '80',
  },
  messageTimeOther: {
    color: Colors.textTertiary,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  messageInput: {
    flex: 1,
    ...Typography.body,
    paddingHorizontal: Spacing.md,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
