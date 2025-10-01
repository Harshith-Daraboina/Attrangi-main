// src/screens/Home.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppNavigator } from '../navigation';
import { useThemeSettings } from '../styles/ThemeContext';
import { setRole } from '../services/auth';

export default function Home() {
  const { role, setRole: setThemeRole } = useThemeSettings();

  useEffect(() => {
    if (!role) {
      setThemeRole('patient');
      setRole('patient');
    }
  }, [role, setThemeRole]);

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
