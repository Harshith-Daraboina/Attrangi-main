import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { Spacing, Colors, BorderRadius } from '../../styles/designSystem';

export default function PaymentScreen({ route, navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { doctor, therapist, appointmentDate, date, appointmentTime, time, sessionType = 'video' } = route.params || {};
  
  // Use therapist as doctor if doctor is not provided
  const doctorData = doctor || therapist;
  const appointmentDateData = appointmentDate || date;
  const appointmentTimeData = appointmentTime || time;
  
  // Debug logging to see what we received
  console.log('PaymentScreen received params:', {
    doctor: doctorData,
    appointmentDate: appointmentDateData,
    appointmentTime: appointmentTimeData,
    sessionType: sessionType,
    consultationFee: doctorData?.consultationFee
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('demo');
  const [isProcessing, setIsProcessing] = useState(false);

  // PhonePe functionality
  const openPhonePeApp = async () => {
    const phonepeUrl = 'phonepe://pay';
    const phonepePackage = 'com.phonepe.app';
    
    try {
      // Check if PhonePe app is installed
      const canOpen = await Linking.canOpenURL(phonepeUrl);
      
      if (canOpen) {
        // Open PhonePe app directly
        await Linking.openURL(phonepeUrl);
        Alert.alert(
          'PhonePe Opened',
          'PhonePe app has been opened. Please complete your payment.',
          [{ text: 'OK' }]
        );
      } else {
        // Fallback to Play Store/App Store
        const storeUrl = Platform.OS === 'ios' 
          ? 'https://apps.apple.com/app/phonepe/id1170055821'
          : 'https://play.google.com/store/apps/details?id=com.phonepe.app';
        
        Alert.alert(
          'PhonePe Not Installed',
          'PhonePe app is not installed. Would you like to download it?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Download', 
              onPress: () => Linking.openURL(storeUrl)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening PhonePe:', error);
      Alert.alert('Error', 'Unable to open PhonePe app. Please try again.');
    }
  };

  const generatePhonePeQRData = () => {
    const amount = doctorData?.fee || 2500;
    const merchantId = 'ATTARANGI001';
    const transactionId = `TXN_${Date.now()}`;
    
    // PhonePe QR code data format
    const qrData = {
      merchantId: merchantId,
      transactionId: transactionId,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      description: `Payment for ${doctorData?.name || 'Doctor'} consultation`,
      appId: 'com.phonepe.app'
    };
    
    return JSON.stringify(qrData);
  };

  const paymentMethods = [
    { id: 'demo', title: 'Demo Payment', icon: 'checkmark-circle', description: 'Instant demo payment for testing', color: '#28a745' },
    { id: 'phonepe-qr', title: 'PhonePe QR Code', icon: 'qr-code', description: 'Scan PhonePe QR code to pay', color: '#5F259F' },
    { id: 'phonepe-app', title: 'PhonePe App', icon: 'phone-portrait', description: 'Open PhonePe app directly', color: '#5F259F' },
    { id: 'card', title: 'Credit/Debit Card', icon: 'card', description: 'Pay with card', color: '#007AFF' },
    { id: 'upi', title: 'Other UPI Apps', icon: 'phone-portrait', description: 'Pay via other UPI apps', color: '#34C759' }
  ];

  const handlePayment = async () => {
    console.log('Payment button clicked!');
    console.log('Current state:', { doctor: doctorData, appointmentDate: appointmentDateData, appointmentTime: appointmentTimeData });
    
    if (!doctorData) {
      Alert.alert('Error', 'Doctor information not found. Please try again.');
      return;
    }
    
    // Handle Demo payment
    if (selectedPaymentMethod === 'demo') {
      setIsProcessing(true);
      
      try {
        // Simulate demo payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsProcessing(false);
        
        // Navigate to success screen
        const successParams = {
          doctor: doctorData,
          appointmentDate: appointmentDateData,
          appointmentTime: appointmentTimeData,
          amount: doctorData?.fee || 2500,
          paymentMethod: 'Demo Payment',
          sessionType: sessionType
        };
        
        console.log('PaymentScreen - Navigating to PaymentSuccess with params:', successParams);
        
        navigation.navigate('PaymentSuccess', successParams);
        
        return;
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Error', 'Demo payment failed. Please try again.');
        return;
      }
    }
    
    // Handle PhonePe app payment
    if (selectedPaymentMethod === 'phonepe-app') {
      await openPhonePeApp();
      return;
    }
    
    // Handle PhonePe QR code payment
    if (selectedPaymentMethod === 'phonepe-qr') {
      Alert.alert(
        'PhonePe QR Code',
        'Please scan the QR code with your PhonePe app to complete the payment.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('Starting payment processing...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the appointment after successful payment
      const appointmentData = {
        doctorId: doctorData?.id || 'unknown',
        dateISO: appointmentDateData?.toISOString() || new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'paid',
        amount: doctorData?.fee || 2500
      };
      
      console.log('Appointment data created:', appointmentData);
      
      // Here you would typically call the API to create the appointment
      // const appointment = await api.createAppointment(appointmentData);
      
      setIsProcessing(false);
      
      // Debug logging
      console.log('Payment successful, navigating to session with:', {
        doctor: doctorData?.name,
        appointmentDate: appointmentDateData?.toLocaleDateString(),
        appointmentTime: appointmentTimeData,
        sessionType: sessionType
      });
      
      // Auto-navigate to appropriate session after successful payment
      setTimeout(() => {
        console.log('Navigating to session...');
        if (sessionType === 'video') {
          navigation.navigate('VideoCall', {
            sessionData: {
              therapistName: doctorData?.name,
              therapist: doctorData?.name,
              type: 'video',
              sessionType: 'video',
              time: appointmentTimeData,
              date: appointmentDateData
            }
          });
        } else {
          navigation.navigate('VideoSession', { 
            doctor: doctorData, 
            appointmentDate: appointmentDateData, 
            appointmentTime: appointmentTimeData,
            sessionType: 'audio'
          });
        }
      }, 1000);
      
      Alert.alert(
        'Payment Successful!',
        `Your appointment with ${doctorData?.name || 'your therapist'} has been confirmed! Starting your ${sessionType} session...`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will happen automatically after timeout
            }
          }
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodHeader}>
        <Ionicons 
          name={method.icon} 
          size={24} 
          color={selectedPaymentMethod === method.id ? Colors.primary : '#666'} 
        />
        <View style={styles.paymentMethodInfo}>
          <Text style={[
            styles.paymentMethodTitle,
            selectedPaymentMethod === method.id && styles.selectedPaymentMethodTitle
          ]}>
            {method.title}
          </Text>
          <Text style={styles.paymentMethodDescription}>{method.description}</Text>
        </View>
        <View style={[
          styles.radioButton,
          selectedPaymentMethod === method.id && styles.selectedRadioButton
        ]}>
          {selectedPaymentMethod === method.id && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQRCode = () => (
    <View style={styles.qrContainer}>
      <View style={styles.qrCode}>
        <View style={styles.phonepeQRCode}>
          {/* PhonePe QR Code with logo */}
          <View style={styles.qrCodeBackground}>
            <Ionicons name="qr-code" size={100} color="#333" />
            <View style={styles.phonepeLogo}>
              <Text style={styles.phonepeText}>पे</Text>
            </View>
          </View>
          <Text style={styles.qrText}>PhonePe QR Code</Text>
        </View>
      </View>
      <Text style={styles.qrInstructions}>
        Open PhonePe app and scan this QR code to complete the payment
      </Text>
      <Text style={styles.qrAmount}>
        Amount: ₹{doctorData?.fee || 2500}
      </Text>
      <TouchableOpacity 
        style={styles.openPhonePeButton}
        onPress={openPhonePeApp}
      >
        <Ionicons name="phone-portrait" size={20} color="#fff" />
        <Text style={styles.openPhonePeButtonText}>Open PhonePe App</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreditCard = () => (
    <View style={styles.creditCardContainer}>
      <View style={styles.cardInputContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <View style={styles.cardInput}>
          <Text style={styles.cardInputText}>1234 5678 9012 3456</Text>
          <Ionicons name="card" size={20} color="#666" />
        </View>
      </View>
      
      <View style={styles.cardRow}>
        <View style={styles.cardInputContainer}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <View style={styles.cardInput}>
            <Text style={styles.cardInputText}>MM/YY</Text>
          </View>
        </View>
        <View style={styles.cardInputContainer}>
          <Text style={styles.inputLabel}>CVV</Text>
          <View style={styles.cardInput}>
            <Text style={styles.cardInputText}>123</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardInputContainer}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <View style={styles.cardInput}>
          <Text style={styles.cardInputText}>John Doe</Text>
        </View>
      </View>
    </View>
  );

  const renderUPI = () => (
    <View style={styles.upiContainer}>
      <View style={styles.upiInputContainer}>
        <Text style={styles.inputLabel}>UPI ID</Text>
        <View style={styles.upiInput}>
          <Text style={styles.upiInputText}>john.doe@upi</Text>
        </View>
      </View>
      <Text style={styles.upiInstructions}>
        Enter your UPI ID and complete the payment through your UPI app
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Doctor Summary */}
      <View style={styles.doctorSummary}>
        <Image source={doctor.image} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          <Text style={styles.consultationTime}>50 minutes consultation</Text>
        </View>
      </View>

      {/* Appointment Details */}
      {appointmentDate && (
        <View style={styles.appointmentContainer}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.appointmentInfo}>
            <View style={styles.appointmentRow}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.appointmentText}>
                {appointmentDate.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.appointmentRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.appointmentText}>
                {appointmentTime}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Payment Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>₹{doctorData?.consultationFee || '2000'}</Text>
        <Text style={styles.amountBreakdown}>
          Consultation Fee: ₹{doctorData?.consultationFee || '2000'}
        </Text>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {paymentMethods.map(renderPaymentMethod)}
      </View>

      {/* Payment Details */}
      <View style={styles.paymentDetailsContainer}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        
        {selectedPaymentMethod === 'demo' && (
          <View style={styles.demoContainer}>
            <View style={styles.demoInfo}>
              <Ionicons name="checkmark-circle" size={60} color="#28a745" />
              <Text style={styles.demoTitle}>Demo Payment</Text>
              <Text style={styles.demoDescription}>
                This is a demo payment for testing purposes. Click "Pay Now" to simulate a successful payment.
              </Text>
              <Text style={styles.demoAmount}>
                Amount: ₹{doctorData?.fee || 2500}
              </Text>
              <View style={styles.demoFeatures}>
                <Text style={styles.demoFeatureText}>✓ Instant payment processing</Text>
                <Text style={styles.demoFeatureText}>✓ No real money charged</Text>
                <Text style={styles.demoFeatureText}>✓ Perfect for testing</Text>
              </View>
            </View>
          </View>
        )}
        {selectedPaymentMethod === 'phonepe-qr' && renderQRCode()}
        {selectedPaymentMethod === 'phonepe-app' && (
          <View style={styles.phonepeAppContainer}>
            <View style={styles.phonepeAppInfo}>
              <Ionicons name="phone-portrait" size={60} color="#5F259F" />
              <Text style={styles.phonepeAppTitle}>PhonePe App</Text>
              <Text style={styles.phonepeAppDescription}>
                Click "Pay Now" to open PhonePe app directly and complete your payment
              </Text>
              <Text style={styles.phonepeAppAmount}>
                Amount: ₹{doctorData?.fee || 2500}
              </Text>
            </View>
          </View>
        )}
        {selectedPaymentMethod === 'card' && renderCreditCard()}
        {selectedPaymentMethod === 'upi' && renderUPI()}
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Ionicons 
              name="sync" 
              size={20} 
              color="white" 
              style={[styles.spinning, { transform: [{ rotate: '0deg' }] }]} 
            />
            <Text style={styles.payButtonText}>Processing...</Text>
          </View>
        ) : (
          <Text style={styles.payButtonText}>
            {selectedPaymentMethod === 'demo' ? 'Pay Now (Demo)' :
             selectedPaymentMethod === 'phonepe-app' ? 'Open PhonePe App' : 
             selectedPaymentMethod === 'phonepe-qr' ? 'Show QR Code' : 
             `Pay ₹${doctorData?.fee || 2500}`}
          </Text>
        )}
      </TouchableOpacity>

      {/* Direct Video Session Button (for testing) */}
      <TouchableOpacity
        style={styles.videoTestButton}
        onPress={() => {
          console.log('Direct navigation to VideoSession');
          navigation.navigate('VideoSession', { 
            doctor: doctorData, 
            appointmentDate: appointmentDateData, 
            appointmentTime: appointmentTimeData,
            sessionType: sessionType
          });
        }}
      >
        <Ionicons name="videocam" size={20} color={Colors.primary} />
        <Text style={styles.videoTestButtonText}>Start Video Session (Test)</Text>
      </TouchableOpacity>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
        <Text style={styles.securityText}>
          Your payment information is secure and encrypted
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  doctorSummary: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  appointmentContainer: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  appointmentInfo: {
    marginTop: Spacing.sm,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: Spacing.sm,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consultationTime: {
    fontSize: 12,
    color: '#999',
  },
  amountContainer: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: Spacing.sm,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  amountBreakdown: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodsContainer: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: Spacing.md,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  selectedPaymentMethodTitle: {
    color: Colors.primary,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  paymentDetailsContainer: {
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  qrContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  qrCode: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  qrText: {
    fontSize: 16,
    color: '#666',
    marginTop: Spacing.sm,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  creditCardContainer: {
    padding: Spacing.md,
  },
  cardInputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: Spacing.xs,
  },
  cardInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#f9f9f9',
  },
  cardInputText: {
    fontSize: 16,
    color: '#333',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upiContainer: {
    padding: Spacing.md,
  },
  upiInputContainer: {
    marginBottom: Spacing.md,
  },
  upiInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#f9f9f9',
  },
  upiInputText: {
    fontSize: 16,
    color: '#333',
  },
  upiInstructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  videoTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  videoTestButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    marginRight: Spacing.sm,
    transform: [{ rotate: '0deg' }],
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: Spacing.xs,
  },
  // PhonePe specific styles
  phonepeQRCode: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: '#5F259F',
  },
  qrCodeBackground: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  phonepeLogo: {
    position: 'absolute',
    backgroundColor: '#5F259F',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    right: 10,
  },
  phonepeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F259F',
    marginTop: Spacing.md,
  },
  openPhonePeButton: {
    backgroundColor: '#5F259F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  openPhonePeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  phonepeAppContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  phonepeAppInfo: {
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: '#5F259F',
  },
  phonepeAppTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5F259F',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  phonepeAppDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  phonepeAppAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5F259F',
  },
  // Demo payment styles
  demoContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  demoInfo: {
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: '#28a745',
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  demoDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  demoAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: Spacing.md,
  },
  demoFeatures: {
    alignItems: 'flex-start',
    width: '100%',
  },
  demoFeatureText: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
};
