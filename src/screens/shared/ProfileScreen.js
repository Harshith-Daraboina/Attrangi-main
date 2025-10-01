import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user: authUser, logout } = useAuth();
  
  const user = {
    name: authUser?.name || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    role: authUser?.role ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1) : 'Patient',
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'January 2024',
    avatar: null,
    isEmailVerified: authUser?.isEmailVerified || false,
    isProfileComplete: authUser?.isProfileComplete || false,
    lastLogin: authUser?.lastLogin ? new Date(authUser.lastLogin).toLocaleDateString() : 'Today',
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      'This will take you back to role selection. Your current progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => navigation.navigate('RoleSelect'),
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={Colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Ionicons 
                name={user.isEmailVerified ? "checkmark-circle" : "alert-circle"} 
                size={16} 
                color={user.isEmailVerified ? Colors.success : Colors.warning} 
              />
              <Text style={[styles.statusText, { color: user.isEmailVerified ? Colors.success : Colors.warning }]}>
                {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{user.joinDate}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>{user.lastLogin}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Profile Status</Text>
              <Text style={[styles.infoValue, { color: user.isProfileComplete ? Colors.success : Colors.warning }]}>
                {user.isProfileComplete ? 'Complete' : 'Incomplete'}
              </Text>
            </View>
          </View>
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleChangeRole}>
          <Ionicons name="swap-horizontal-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Change Role</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Dark Mode</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="language-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Language</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="accessibility-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Accessibility</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Terms & Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Prominent Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.surface} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...Typography.heading2,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
  },
  statusContainer: {
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading3,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    ...Typography.body,
    flex: 1,
    marginLeft: Spacing.md,
  },
  logoutSection: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  logoutButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});
