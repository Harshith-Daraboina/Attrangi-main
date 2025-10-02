import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function VerificationRequirementsScreen({ navigation }) {
  const { user: authUser, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documents, setDocuments] = useState({
    licenseDocument: null,
    identityDocument: null,
    degreeCertificate: null
  });
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

  const user = {
    name: authUser?.name || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    role: authUser?.role ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1) : 'Patient',
    doctorProfile: authUser?.doctorProfile || null,
  };

  // Load existing documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.getDocuments();
      if (response.success) {
        setDocuments(response.documents || {
          licenseDocument: null,
          identityDocument: null,
          degreeCertificate: null
        });
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!user.doctorProfile || !user.doctorProfile.profileCompletion) return 0;
    
    const completion = user.doctorProfile.profileCompletion;
    const coreFields = [
      completion.personalInfo,
      completion.professionalDetails,
      completion.specialization,
      completion.availability,
      completion.paymentDetails
    ];
    
    const completedFields = coreFields.filter(field => field === true).length;
    return Math.round((completedFields / coreFields.length) * 100);
  };

  const getVerificationRequirements = () => {
    if (!user.doctorProfile || !user.doctorProfile.profileCompletion) return [];
    
    const completion = user.doctorProfile.profileCompletion;
    const hasDocuments = !!(documents.licenseDocument?.cloudinaryUrl || 
                           documents.identityDocument?.cloudinaryUrl || 
                           documents.degreeCertificate?.cloudinaryUrl);
    
    const requirements = [
      { 
        key: 'personalInfo', 
        title: 'Personal Information', 
        completed: completion.personalInfo,
        description: 'Name, email, phone number',
        action: 'Complete'
      },
      { 
        key: 'professionalDetails', 
        title: 'Professional Details', 
        completed: completion.professionalDetails,
        description: 'License number, experience, education',
        action: 'Complete'
      },
      { 
        key: 'specialization', 
        title: 'Specialization & Languages', 
        completed: completion.specialization,
        description: 'Medical specialty, languages spoken',
        action: 'Complete'
      },
      { 
        key: 'availability', 
        title: 'Availability Schedule', 
        completed: completion.availability,
        description: 'Working hours and time slots',
        action: 'Complete'
      },
      { 
        key: 'paymentDetails', 
        title: 'Payment Details', 
        completed: completion.paymentDetails,
        description: 'UPI, PhonePe, or bank account details',
        action: 'Edit'
      },
      { 
        key: 'documents', 
        title: 'Document Verification (Optional)', 
        completed: hasDocuments,
        optional: true,
        description: 'License, ID, or degree certificate upload',
        action: hasDocuments ? 'Manage' : 'Upload'
      }
    ];
    
    return requirements;
  };

  const updatePaymentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.updateDoctorPaymentDetails(paymentDetails);
      
      if (response.success) {
        await refreshUser();
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

  const pickDocument = async (documentType) => {
    try {
      console.log('Starting document picker for:', documentType);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file:', file);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append(documentType, {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });

        console.log('FormData created, uploading...');
        setIsLoading(true);
        const response = await api.uploadDocuments(formData);
        
        console.log('Upload response:', response);
        
        if (response.success) {
          setDocuments(response.documents);
          await refreshUser();
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Error', response.message || 'Upload failed');
        }
      } else {
        console.log('Document picker was canceled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', `Failed to upload document: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentType) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await api.deleteDocument(documentType);
              
              if (response.success) {
                setDocuments(response.documents);
                await refreshUser();
                Alert.alert('Success', 'Document deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', 'Failed to delete document. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRequirementAction = (requirement) => {
    switch (requirement.key) {
      case 'paymentDetails':
        setShowPaymentModal(true);
        break;
      case 'documents':
        setShowDocumentModal(true);
        break;
      case 'personalInfo':
      case 'professionalDetails':
      case 'specialization':
      case 'availability':
        Alert.alert(
          'Complete Onboarding',
          'Please complete the doctor onboarding process to fill these details.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Onboarding', onPress: () => navigation.navigate('DoctorOnboarding') }
          ]
        );
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Requirements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Progress Section */}
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
          <Text style={styles.progressSubtitle}>
            Complete all core requirements to get automatically verified
          </Text>
        </View>

        {/* Requirements List */}
        <View style={styles.requirementsSection}>
          <Text style={styles.requirementsTitle}>Requirements Checklist</Text>
          {getVerificationRequirements().map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.requirementContent}>
                <View style={styles.requirementHeader}>
                  <Ionicons 
                    name={requirement.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={requirement.completed ? Colors.success : Colors.textTertiary} 
                  />
                  <View style={styles.requirementTextContainer}>
                    <Text style={[
                      styles.requirementTitle,
                      { 
                        color: requirement.completed ? Colors.success : Colors.textPrimary,
                        fontStyle: requirement.optional ? 'italic' : 'normal'
                      }
                    ]}>
                      {requirement.title}
                    </Text>
                    <Text style={styles.requirementDescription}>
                      {requirement.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    { 
                      backgroundColor: requirement.completed ? Colors.success : Colors.primary,
                      opacity: requirement.optional && !requirement.completed ? 0.6 : 1
                    }
                  ]}
                  onPress={() => handleRequirementAction(requirement)}
                  disabled={requirement.optional && !requirement.completed && requirement.key !== 'documents'}
                >
                  <Text style={styles.actionButtonText}>
                    {requirement.completed ? 'Completed' : requirement.action}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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

      {/* Document Management Modal */}
      {showDocumentModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Management</Text>
              <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Upload Verification Documents</Text>
              <Text style={styles.modalDescription}>
                Upload your professional documents to enhance your profile verification. 
                All documents are optional but help build trust with patients.
              </Text>
              
              {/* License Document */}
              <View style={styles.documentSection}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentTitle}>Medical License</Text>
                  {documents.licenseDocument?.cloudinaryUrl && (
                    <TouchableOpacity 
                      onPress={() => deleteDocument('licenseDocument')}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
                {documents.licenseDocument?.cloudinaryUrl ? (
                  <View style={styles.documentInfo}>
                    <Ionicons name="document-text" size={20} color={Colors.success} />
                    <Text style={styles.documentName}>{documents.licenseDocument.fileName}</Text>
                    <Text style={styles.documentDate}>
                      Uploaded: {new Date(documents.licenseDocument.uploadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => pickDocument('licenseDocument')}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
                    <Text style={styles.uploadButtonText}>Upload License Document</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Identity Document */}
              <View style={styles.documentSection}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentTitle}>Identity Document</Text>
                  {documents.identityDocument?.cloudinaryUrl && (
                    <TouchableOpacity 
                      onPress={() => deleteDocument('identityDocument')}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
                {documents.identityDocument?.cloudinaryUrl ? (
                  <View style={styles.documentInfo}>
                    <Ionicons name="document-text" size={20} color={Colors.success} />
                    <Text style={styles.documentName}>{documents.identityDocument.fileName}</Text>
                    <Text style={styles.documentDate}>
                      Uploaded: {new Date(documents.identityDocument.uploadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => pickDocument('identityDocument')}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
                    <Text style={styles.uploadButtonText}>Upload ID Document</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Degree Certificate */}
              <View style={styles.documentSection}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentTitle}>Degree Certificate</Text>
                  {documents.degreeCertificate?.cloudinaryUrl && (
                    <TouchableOpacity 
                      onPress={() => deleteDocument('degreeCertificate')}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
                {documents.degreeCertificate?.cloudinaryUrl ? (
                  <View style={styles.documentInfo}>
                    <Ionicons name="document-text" size={20} color={Colors.success} />
                    <Text style={styles.documentName}>{documents.degreeCertificate.fileName}</Text>
                    <Text style={styles.documentDate}>
                      Uploaded: {new Date(documents.degreeCertificate.uploadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => pickDocument('degreeCertificate')}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
                    <Text style={styles.uploadButtonText}>Upload Degree Certificate</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.documentNote}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.documentNoteText}>
                  Supported formats: PDF, JPG, PNG (Max 20MB per file). Files are securely stored in the cloud.
                </Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowDocumentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.heading3,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  progressSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
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
  requirementsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  requirementsTitle: {
    ...Typography.heading3,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  requirementItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  requirementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requirementTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  requirementTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  requirementDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
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
  // Document Modal Styles
  modalDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  documentSection: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  documentTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
  },
  documentName: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  documentDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
  },
  uploadButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  documentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
  },
  documentNoteText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
});
