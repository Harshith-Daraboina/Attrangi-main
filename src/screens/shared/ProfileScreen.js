import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ProfileScreen({ navigation }) {
  const { user: authUser, logout, refreshUser } = useAuth();
  const [isActiveToday, setIsActiveToday] = useState(authUser?.doctorProfile?.isActiveToday || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    phonePeId: '',
    panNumber: '',
    gstNumber: '',
    bankAccount: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    }
  });
  
  // Debug: Log user data
  console.log('ProfileScreen - authUser:', authUser);
  console.log('ProfileScreen - doctorProfile:', authUser?.doctorProfile);

  // Update isActiveToday when user data changes
  useEffect(() => {
    if (authUser?.doctorProfile?.isActiveToday !== undefined) {
      setIsActiveToday(authUser.doctorProfile.isActiveToday);
    }
  }, [authUser?.doctorProfile?.isActiveToday]);
  
  const user = {
    name: authUser?.name || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    role: authUser?.role ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1) : 'Patient',
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'January 2024',
    avatar: null,
    isEmailVerified: authUser?.isEmailVerified || false,
    isProfileComplete: authUser?.isProfileComplete || false,
    lastLogin: authUser?.lastLogin ? new Date(authUser.lastLogin).toLocaleDateString() : 'Today',
    doctorProfile: authUser?.doctorProfile || null,
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

  const toggleActiveToday = async () => {
    try {
      setIsLoading(true);
      
      // Check if doctor has a profile first
      if (!authUser?.doctorProfile) {
        Alert.alert(
          'Profile Required',
          'Please complete your doctor profile first before setting availability.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Go to Profile Setup', 
              onPress: () => navigation.navigate('DoctorOnboarding')
            }
          ]
        );
        return;
      }
      
      const response = await api.toggleDoctorActiveToday();
      
      if (response.success) {
        setIsActiveToday(response.isActiveToday);
        Alert.alert(
          'Status Updated',
          response.message,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      Alert.alert('Error', 'Failed to update availability status');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.updateDoctorPaymentDetails(paymentDetails);
      
      if (response.success) {
        await refreshUser(); // Refresh user data
        setShowPaymentModal(false);
        Alert.alert(
          'Payment Details Updated',
          'Your payment information has been saved successfully.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(response.message || 'Failed to update payment details');
      }
    } catch (error) {
      console.error('Error updating payment details:', error);
      Alert.alert('Error', 'Failed to update payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!authUser) return 0;
    
    // For regular users (non-doctors), check basic profile completion
    if (authUser.role !== 'doctor') {
      const requiredFields = [
        authUser.profile?.firstName,
        authUser.profile?.lastName,
        authUser.profile?.dateOfBirth,
        authUser.profile?.gender,
        authUser.profile?.phone
      ];
      
      const completedFields = requiredFields.filter(field => field && field !== '').length;
      return Math.round((completedFields / requiredFields.length) * 100);
    }
    
    // For doctors, check doctor profile completion
    if (authUser.role === 'doctor') {
      if (authUser.doctorProfile && authUser.doctorProfile.profileCompletion) {
        const completion = authUser.doctorProfile.profileCompletion;
        // Only count core requirements (documents are optional)
        const coreFields = [
          completion.personalInfo,
          completion.professionalDetails,
          completion.specialization,
          completion.availability,
          completion.paymentDetails
        ];
        
        const completedFields = coreFields.filter(field => field === true).length;
        return Math.round((completedFields / coreFields.length) * 100);
      } else {
        // Doctor without profile - 0% completion
        return 0;
      }
    }
    
    return 0;
  };

  const getVerificationRequirements = () => {
    if (!user.doctorProfile || !user.doctorProfile.profileCompletion) return [];
    
    const completion = user.doctorProfile.profileCompletion;
    const requirements = [
      { key: 'personalInfo', title: 'Personal Information', completed: completion.personalInfo },
      { key: 'professionalDetails', title: 'Professional Details', completed: completion.professionalDetails },
      { key: 'specialization', title: 'Specialization & Languages', completed: completion.specialization },
      { key: 'availability', title: 'Availability Schedule', completed: completion.availability },
      { key: 'paymentDetails', title: 'Payment Details', completed: completion.paymentDetails },
      { key: 'documents', title: 'Document Verification (Optional)', completed: true, optional: true }
    ];
    
    return requirements;
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
                name={user.isEmailVerified ? "checkmark-circle" : "checkmark-circle"} 
                size={16} 
                color={Colors.success} 
              />
              <Text style={[styles.statusText, { color: Colors.success }]}>
                Email Verified
              </Text>
            </View>
            
            {/* Doctor Verification Status */}
            {(user.role === 'Doctor' || user.role === 'doctor') && user.doctorProfile && (
              <View style={[styles.statusBadge, { marginTop: Spacing.sm }]}>
                <Ionicons 
                  name={user.doctorProfile.isVerified ? "checkmark-circle" : "time-outline"} 
                  size={16} 
                  color={user.doctorProfile.isVerified ? Colors.success : Colors.warning} 
                />
                <Text style={[styles.statusText, { color: user.doctorProfile.isVerified ? Colors.success : Colors.warning }]}>
                  {user.doctorProfile.isVerified ? 'Profile Verified' : 'Pending Verification'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Profile Completion Progress - For all users */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Profile Completion</Text>
              <Text style={styles.progressPercentage}>{getProfileCompletionPercentage()}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProfileCompletionPercentage()}%` }
                ]} 
              />
            </View>
            {(user.role === 'Doctor' || user.role === 'doctor') && user.doctorProfile ? (
              <TouchableOpacity 
                style={styles.viewRequirementsButton}
                onPress={() => navigation.navigate('VerificationRequirements')}
              >
                <Text style={styles.viewRequirementsText}>View Requirements</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            ) : user.isProfileComplete ? (
              <View style={styles.profileCompleteContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.profileCompleteText}>Profile Complete</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.viewRequirementsButton}
                onPress={() => navigation.navigate('ProfileSetup')}
              >
                <Text style={styles.viewRequirementsText}>Complete Profile</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
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
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            // Navigate to appropriate edit screen based on role
            if (user.role === 'Doctor' || user.role === 'doctor') {
              navigation.navigate('DoctorOnboarding');
            } else {
              navigation.navigate('ProfileSetup');
            }
          }}
        >
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

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Terms & Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

      </View>

      {/* Active Today Toggle for Doctors */}
      {authUser?.role === 'doctor' && (
        <View style={styles.activeTodaySection}>
          <View style={styles.activeTodayContainer}>
            <View style={styles.activeTodayInfo}>
              <Ionicons 
                name={isActiveToday ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={isActiveToday ? Colors.success : Colors.textTertiary} 
              />
              <View style={styles.activeTodayTextContainer}>
                <Text style={styles.activeTodayTitle}>
                  {authUser?.doctorProfile ? 
                    (isActiveToday ? 'Active Today' : 'Not Active Today') : 
                    'Complete Profile First'
                  }
                </Text>
                <Text style={styles.activeTodaySubtitle}>
                  {authUser?.doctorProfile ? 
                    (isActiveToday ? 'Patients can book appointments with you' : 'You are not accepting appointments today') :
                    'Set up your doctor profile to manage availability'
                  }
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.activeTodayToggle, { backgroundColor: isActiveToday ? Colors.success : Colors.border }]}
              onPress={toggleActiveToday}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.surface} />
              ) : (
                <Ionicons 
                  name={isActiveToday ? "checkmark" : "close"} 
                  size={20} 
                  color={isActiveToday ? Colors.surface : Colors.textSecondary} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Prominent Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.surface} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      
      {/* Payment Details Modal */}
      {showPaymentModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI ID</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.upiId}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, upiId: text }))}
                  placeholder="yourname@upi"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PhonePe ID</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.phonePeId}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, phonePeId: text }))}
                  placeholder="yourname@phonepe"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PAN Number</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.panNumber}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, panNumber: text.toUpperCase() }))}
                  placeholder="ABCDE1234F"
                  placeholderTextColor={Colors.textTertiary}
                  maxLength={10}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>GST Number (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.gstNumber}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, gstNumber: text }))}
                  placeholder="22ABCDE1234F1Z5"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              
              <Text style={styles.sectionTitle}>Bank Account Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.bankAccount.accountNumber}
                  onChangeText={(text) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    bankAccount: { ...prev.bankAccount, accountNumber: text }
                  }))}
                  placeholder="1234567890"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>IFSC Code</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.bankAccount.ifscCode}
                  onChangeText={(text) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    bankAccount: { ...prev.bankAccount, ifscCode: text.toUpperCase() }
                  }))}
                  placeholder="SBIN0001234"
                  placeholderTextColor={Colors.textTertiary}
                  maxLength={11}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.bankAccount.bankName}
                  onChangeText={(text) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    bankAccount: { ...prev.bankAccount, bankName: text }
                  }))}
                  placeholder="State Bank of India"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Holder Name</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.bankAccount.accountHolderName}
                  onChangeText={(text) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    bankAccount: { ...prev.bankAccount, accountHolderName: text }
                  }))}
                  placeholder="Dr. John Doe"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={updatePaymentDetails}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.surface} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Details</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingHorizontal: Spacing.md,
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
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading3,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 60,
  },
  menuText: {
    ...Typography.body,
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.md,
    fontWeight: '500',
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
  activeTodaySection: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  activeTodayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeTodayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeTodayTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  activeTodayTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  activeTodaySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  activeTodayToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Progress Section Styles
  progressSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressPercentage: {
    ...Typography.heading3,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  viewRequirementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  viewRequirementsText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  profileCompleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  profileCompleteText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  // Requirements Section Styles
  requirementsSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  requirementsTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requirementText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxHeight: '80%',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.heading3,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalBody: {
    maxHeight: 400,
    padding: Spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginLeft: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  // Input Styles
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
});
