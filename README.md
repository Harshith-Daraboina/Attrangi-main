# Attrangi - Mental Health App

A comprehensive React Native app for mental health support with three distinct user roles: Patient, Caregiver, and Therapist.

## 🏗️ Project Structure

### Frontend-Only Architecture
This project has been cleaned up to focus purely on the frontend experience. All backend files have been removed, and the app now contains only the React Native frontend code.

### User Roles

#### 👤 Patient
- **Dashboard**: Quick mood check, upcoming sessions, daily activities
- **Mood Journal**: Track daily mood with detailed logging
- **Activity Assistant**: Complete assigned therapeutic activities
- **Community**: Connect with other patients in support groups
- **Sessions**: Manage therapy sessions and video calls
- **Payments**: Handle session payments and billing

#### 👥 Caregiver
- **Dashboard**: Patient overview, upcoming sessions, alerts
- **Pre-Session Form**: Submit detailed patient information before sessions
- **Activities**: Monitor and track patient activity completion
- **Community**: Connect with other caregivers
- **Sessions**: Join therapy sessions as observer/participant
- **Payments**: Manage payment for patient sessions

#### 👨‍⚕️ Therapist
- **Dashboard**: Today's sessions, new patient requests, recent notes
- **Patient Management**: Manage patient list, view progress, access notes
- **Sessions**: Conduct therapy sessions with detailed note-taking
- **Activity Assignment**: Assign therapeutic activities to patients
- **Community**: Professional network and resource sharing
- **Earnings**: Track income, manage payments, tax documents

### 🎨 Design System

The app uses a consistent design system with:
- **Colors**: Role-specific color schemes (Patient: Purple, Caregiver: Blue, Therapist: Green)
- **Typography**: Clear hierarchy with headings, body text, and captions
- **Components**: Reusable UI components with consistent styling
- **Navigation**: Bottom tab navigation for each role with stack navigation for deeper screens

### 📱 Navigation Structure

```
AppNavigator
├── Onboarding (1-4)
├── Authentication (Sign In/Up)
├── Role Selection
└── Role-Based Main Apps
    ├── PatientTabs
    │   ├── Dashboard
    │   ├── Journal
    │   ├── Activities
    │   ├── Community
    │   ├── Payments
    │   └── Profile
    ├── CaregiverTabs
    │   ├── Dashboard
    │   ├── Pre-Session
    │   ├── Activities
    │   ├── Community
    │   ├── Payments
    │   └── Profile
    └── TherapistTabs
        ├── Dashboard
        ├── Patients
        ├── Assignments
        ├── Community
        ├── Earnings
        └── Profile
```

### 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   ```bash
   npm run ios     # iOS
   npm run android # Android
   ```

### 📁 Key Directories

- `src/screens/` - All screen components organized by role
- `src/navigation/` - Navigation configuration
- `src/styles/` - Design system and theming
- `src/components/` - Reusable UI components
- `assets/` - Images, fonts, and other static assets

### 🔧 Features Implemented

✅ **Complete UI/UX Design**
- Modern, clean interface with role-specific theming
- Consistent navigation patterns
- Responsive design for different screen sizes

✅ **Role-Based Navigation**
- Separate tab navigators for each user role
- Stack navigation for deeper screen flows
- Intuitive user experience

✅ **Comprehensive Screen Set**
- 20+ screens covering all major app functionality
- Placeholder content and dummy data for development
- Interactive UI elements and navigation

✅ **Shared Components**
- Profile management
- Notifications system
- Help & support
- Consistent design patterns

### 🎯 Next Steps for Backend Integration

When the backend team is ready to integrate:

1. **API Integration**: Connect screens to real backend endpoints
2. **Authentication**: Implement real user authentication flow
3. **Data Management**: Replace dummy data with real data fetching
4. **Real-time Features**: Add live chat, notifications, and session management
5. **Payment Processing**: Integrate real payment systems
6. **File Management**: Add image upload and document handling

### 📱 Screen List

#### Shared Screens
- ProfileScreen
- NotificationsScreen  
- HelpSupportScreen

#### Patient Screens
- PatientDashboard
- MoodJournalScreen
- ActivityAssistantScreen
- PatientCommunityScreen
- PatientSessionScreen
- PatientPaymentsScreen

#### Caregiver Screens
- CaregiverDashboard
- PreSessionTemplateScreen
- CaregiverSessionScreen
- CaregiverActivityScreen
- CaregiverCommunityScreen
- CaregiverPaymentsScreen

#### Therapist Screens
- TherapistDashboard
- PatientManagementScreen
- TherapistSessionScreen
- ActivityAssignmentScreen
- TherapistCommunityScreen
- EarningsScreen

### 🎨 Design Principles

- **Accessibility**: Large touch targets, clear typography, high contrast
- **Consistency**: Unified design language across all screens
- **Role Clarity**: Distinct visual identity for each user type
- **User-Centric**: Intuitive navigation and clear information hierarchy
- **Modern**: Clean, contemporary design with subtle animations

This frontend provides a complete foundation for a mental health app that can be easily extended with backend functionality when ready.
