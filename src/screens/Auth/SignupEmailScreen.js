import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Modal, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import Button from '../../components/Button';

export default function SignupEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleContinue = () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }
    
    // Navigate to next screen with email and role
    navigation.navigate('SignupDetails', { email, role: selectedRole });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Create account to explore more</Text>
          
          <View style={styles.topImageWrapper}>
            <Image source={require('../../../assets/signup1.png')} style={styles.image} resizeMode="contain" />
          </View>
      
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
          </View>

          {/* Role Selection Button */}
          <TouchableOpacity 
            style={[styles.roleButton, selectedRole && styles.roleButtonSelected]} 
            onPress={() => setShowRoleModal(true)}
          >
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={selectedRole ? Colors.primary : Colors.textSecondary} 
              style={styles.inputIcon} 
            />
            <Text style={[styles.roleButtonText, selectedRole && styles.roleButtonTextSelected]}>
              {selectedRole ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Select Your Role'}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={selectedRole ? Colors.primary : Colors.textSecondary} 
            />
          </TouchableOpacity>

          <Button 
            title="Continue" 
            onPress={handleContinue} 
            style={styles.button}
            disabled={!email.trim() || !selectedRole}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRoleModal}
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <Text style={styles.modalSubtitle}>Choose how you'll be using the app</Text>
            
            <View style={styles.roleOptions}>
              <Pressable 
                style={styles.roleOption}
                onPress={() => handleRoleSelect('patient')}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons name="person" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.roleText}>Patient</Text>
              </Pressable>

              <Pressable 
                style={styles.roleOption}
                onPress={() => handleRoleSelect('doctor')}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons name="medkit" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.roleText}>Doctor</Text>
              </Pressable>

              <Pressable 
                style={styles.roleOption}
                onPress={() => handleRoleSelect('caregiver')}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons name="heart" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.roleText}>Caregiver</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1,
    paddingHorizontal: Spacing.lg, 
    alignItems: 'center', 
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  topImageWrapper: { marginTop: Spacing.md, marginBottom: Spacing.lg, width: '100%', height: 220 },
  image: { width: '100%', height: '100%' },
  title: { ...Typography.heading1, textAlign: 'center', marginBottom: Spacing.xs },
  subtitle: { ...Typography.caption, textAlign: 'center', marginBottom: Spacing.md },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.md, 
    paddingHorizontal: Spacing.md, 
    height: 52, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: Spacing.md,
    ...Shadows.sm 
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: 16, color: Colors.textPrimary },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.sm
  },
  roleButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F4FF'
  },
  roleButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm
  },
  roleButtonTextSelected: {
    color: Colors.primary,
    fontWeight: '600'
  },
  button: { width: '100%', marginTop: Spacing.lg },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '85%',
    alignItems: 'center',
    ...Shadows.lg,
  },
  modalTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.caption,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.md,
  },
  roleOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    minWidth: 90,
    ...Shadows.sm,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  roleText: {
    fontWeight: '600',
    color: Colors.textPrimary,
    fontSize: 14,
  },
});
