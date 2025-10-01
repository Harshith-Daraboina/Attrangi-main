import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';

export default function DebugScreen({ navigation }) {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog(`User: ${user?.email || 'None'}`);
    addLog(`Authenticated: ${isAuthenticated}`);
    addLog(`Role: ${user?.role || 'None'}`);
  }, [user, isAuthenticated]);

  const handleSetRole = async (role) => {
    try {
      addLog(`Setting role to: ${role}`);
      await updateProfile({ role });
      addLog(`✅ Role set successfully`);
    } catch (error) {
      addLog(`❌ Error setting role: ${error.message}`);
    }
  };

  const handleNavigate = (screenName) => {
    try {
      addLog(`Navigating to: ${screenName}`);
      navigation.navigate(screenName);
      addLog(`✅ Navigation successful`);
    } catch (error) {
      addLog(`❌ Navigation error: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Debug Screen</Text>
        <TouchableOpacity onPress={clearLogs} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Current State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current State</Text>
        <Text style={styles.info}>Email: {user?.email || 'None'}</Text>
        <Text style={styles.info}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text style={styles.info}>Role: {user?.role || 'None'}</Text>
        <Text style={styles.info}>User ID: {user?.id || 'None'}</Text>
      </View>

      {/* Role Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Role</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.roleButton, styles.patientButton]} 
            onPress={() => handleSetRole('patient')}
          >
            <Text style={styles.roleButtonText}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, styles.caregiverButton]} 
            onPress={() => handleSetRole('caregiver')}
          >
            <Text style={styles.roleButtonText}>Caregiver</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, styles.therapistButton]} 
            onPress={() => handleSetRole('therapist')}
          >
            <Text style={styles.roleButtonText}>Therapist</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigate</Text>
        <TouchableOpacity 
          style={[styles.navButton, styles.patientButton]} 
          onPress={() => handleNavigate('MainPatient')}
        >
          <Text style={styles.navButtonText}>→ Patient Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.caregiverButton]} 
          onPress={() => handleNavigate('MainCaregiver')}
        >
          <Text style={styles.navButtonText}>→ Caregiver Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.therapistButton]} 
          onPress={() => handleNavigate('MainTherapist')}
        >
          <Text style={styles.navButtonText}>→ Therapist Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.primaryButton]} 
          onPress={() => handleNavigate('RoleSelect')}
        >
          <Text style={styles.navButtonText}>→ Role Selection</Text>
        </TouchableOpacity>
      </View>

      {/* Logs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Log</Text>
        <View style={styles.logContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
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
    color: Colors.primary,
  },
  clearButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  clearButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  info: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  patientButton: {
    backgroundColor: '#6c63ff',
  },
  caregiverButton: {
    backgroundColor: '#5267df',
  },
  therapistButton: {
    backgroundColor: '#2a7f62',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  navButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  navButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  logContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    maxHeight: 200,
  },
  logText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
});
