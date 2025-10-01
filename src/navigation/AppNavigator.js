// src/navigation/AppNavigator.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeSettings } from '../styles/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import { Colors, Spacing } from '../styles/designSystem';

// Onboarding Screens
import Onboarding1 from '../screens/Onboarding/Onboarding1';
import Onboarding2 from '../screens/Onboarding/Onboarding2';
import Onboarding3 from '../screens/Onboarding/Onboarding3';
import Onboarding4 from '../screens/Onboarding/Onboarding4';

// Auth Screens
import SignInScreen from '../screens/Auth/SigninScreen';
import SignupEmailScreen from '../screens/Auth/SignupEmailScreen';
import SignupDetailsScreen from '../screens/Auth/SignupDetailsScreen';
import SignupOTPScreen from '../screens/Auth/SignupOTPScreen';
import LoginSuccessScreen from '../screens/Auth/LoginSuccessScreen';
import DoctorOnboardingScreen from '../screens/Auth/DoctorOnboardingScreen';
import PatientOnboardingScreen from '../screens/Auth/PatientOnboardingScreen';
import CaregiverOnboardingScreen from '../screens/Auth/CaregiverOnboardingScreen';

// Shared Screens
import ProfileScreen from '../screens/shared/ProfileScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';

// Patient Screens
import PatientDashboard from '../screens/patient/PatientDashboard';
import MoodJournalScreen from '../screens/patient/MoodJournalScreen';
import ActivityAssistantScreen from '../screens/patient/ActivityAssistantScreen';
import PatientCommunityScreen from '../screens/patient/PatientCommunityScreen';
import PatientSessionScreen from '../screens/patient/PatientSessionScreen';
import PatientPaymentsScreen from '../screens/patient/PatientPaymentsScreen';

// Caregiver Screens
import CaregiverDashboard from '../screens/caregiver/CaregiverDashboard';
import CaregiverPreSessionTemplateScreen from '../screens/caregiver/PreSessionTemplateScreen';
import CaregiverSessionScreen from '../screens/caregiver/CaregiverSessionScreen';
import CaregiverActivityScreen from '../screens/caregiver/CaregiverActivityScreen';
import CaregiverCommunityScreen from '../screens/caregiver/CaregiverCommunityScreen';
import CaregiverPaymentsScreen from '../screens/caregiver/CaregiverPaymentsScreen';

// Therapist Screens
import TherapistDashboard from '../screens/therapist/TherapistDashboard';
import PatientManagementScreen from '../screens/therapist/PatientManagementScreen';
import TherapistSessionScreen from '../screens/therapist/TherapistSessionScreen';
import ActivityAssignmentScreen from '../screens/therapist/ActivityAssignmentScreen';
import TherapistCommunityScreen from '../screens/therapist/TherapistCommunityScreen';
import EarningsScreen from '../screens/therapist/EarningsScreen';

// Doctor Screens
import SessionDashboardScreen from '../screens/doctor/SessionDashboardScreen';

// Patient Screens
import SessionBookingScreen from '../screens/patient/SessionBookingScreen';
import MoodTrackingScreen from '../screens/patient/MoodTrackingScreen';
import DoctorListScreen from '../screens/patient/DoctorListScreen';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';
import PaymentScreen from '../screens/patient/PaymentScreen';
import PaymentSuccessScreen from '../screens/patient/PaymentSuccessScreen';
import VideoSessionScreen from '../screens/patient/VideoSessionScreen';
import PatientPreSessionTemplateScreen from '../screens/patient/PreSessionTemplateScreen';
import WaitingScreen from '../screens/patient/WaitingScreen';
import FeedbackScreen from '../screens/patient/FeedbackScreen';

// Shared Screens
import VideoCallScreen from '../screens/shared/VideoCallScreen';
import ProfileSetupScreen from '../screens/shared/ProfileSetupScreen';

// Role Selection
import RoleSelectScreen from '../screens/RoleSelectScreen';

// Debug Screen
import DebugScreen from '../screens/DebugScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Patient Tab Navigator
function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c63ff',
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Dashboard') icon = 'home';
          if (route.name === 'Activities') icon = 'list';
          if (route.name === 'Community') icon = 'chatbubble-ellipses';
          if (route.name === 'Profile') icon = 'person';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Activities" component={ActivityAssistantScreen} />
      <Tab.Screen name="Dashboard" component={PatientDashboard} />
      <Tab.Screen name="Community" component={PatientCommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Caregiver Tab Navigator
function CaregiverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5267df',
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Dashboard') icon = 'home';
          if (route.name === 'PreSession') icon = 'document-text';
          if (route.name === 'Activities') icon = 'list';
          if (route.name === 'Community') icon = 'chatbubble-ellipses';
          if (route.name === 'Payments') icon = 'card';
          if (route.name === 'Profile') icon = 'person';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={CaregiverDashboard} />
      <Tab.Screen name="PreSession" component={CaregiverPreSessionTemplateScreen} />
      <Tab.Screen name="Activities" component={CaregiverActivityScreen} />
      <Tab.Screen name="Community" component={CaregiverCommunityScreen} />
      <Tab.Screen name="Payments" component={CaregiverPaymentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Therapist Tab Navigator
function TherapistTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2a7f62',
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Dashboard') icon = 'home';
          if (route.name === 'Patients') icon = 'people';
          if (route.name === 'Assignments') icon = 'list';
          if (route.name === 'Community') icon = 'chatbubble-ellipses';
          if (route.name === 'Earnings') icon = 'cash';
          if (route.name === 'Profile') icon = 'person';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={TherapistDashboard} />
      <Tab.Screen name="Patients" component={PatientManagementScreen} />
      <Tab.Screen name="Assignments" component={ActivityAssignmentScreen} />
      <Tab.Screen name="Community" component={TherapistCommunityScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    );
  }

  // Determine initial route based on user role
  const getInitialRoute = () => {
    if (user?.role) {
      switch (user.role) {
        case 'patient':
          return 'MainPatient';
        case 'caregiver':
          return 'MainCaregiver';
        case 'therapist':
        case 'doctor':
          return 'MainTherapist';
        default:
          return 'RoleSelect';
      }
    }
    return 'RoleSelect';
  };

  // Show main app if authenticated
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      {/* Onboarding flow */}
      <Stack.Screen name="Onboarding1" component={Onboarding1} />
      <Stack.Screen name="Onboarding2" component={Onboarding2} />
      <Stack.Screen name="Onboarding3" component={Onboarding3} />
      <Stack.Screen name="Onboarding4" component={Onboarding4} />
      
      {/* Auth flow */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignupEmail" component={SignupEmailScreen} />
      <Stack.Screen name="SignupDetails" component={SignupDetailsScreen} />
      <Stack.Screen name="SignupOTP" component={SignupOTPScreen} />
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
      
      {/* Onboarding flows */}
      <Stack.Screen name="DoctorOnboarding" component={DoctorOnboardingScreen} />
      <Stack.Screen name="PatientOnboarding" component={PatientOnboardingScreen} />
      <Stack.Screen name="CaregiverOnboarding" component={CaregiverOnboardingScreen} />
      
      {/* Role Selection */}
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      
      {/* Debug Screen */}
      <Stack.Screen name="Debug" component={DebugScreen} />
      
      {/* Main app screens based on role */}
      <Stack.Screen name="MainPatient" component={PatientTabs} />
      <Stack.Screen name="MainCaregiver" component={CaregiverTabs} />
      <Stack.Screen name="MainTherapist" component={TherapistTabs} />
      
      {/* Individual screens accessible from anywhere */}
      <Stack.Screen name="PatientSession" component={PatientSessionScreen} />
      <Stack.Screen name="CaregiverSession" component={CaregiverSessionScreen} />
      <Stack.Screen name="TherapistSession" component={TherapistSessionScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      
      {/* New screens */}
      <Stack.Screen name="SessionBooking" component={SessionBookingScreen} />
      <Stack.Screen name="MoodTracking" component={MoodTrackingScreen} />
      <Stack.Screen name="SessionDashboard" component={SessionDashboardScreen} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="VideoSession" component={VideoSessionScreen} />
      <Stack.Screen name="PreSessionTemplate" component={PatientPreSessionTemplateScreen} />
      <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});