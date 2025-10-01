// src/screens/Auth/LoginSuccessScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../../styles/designSystem';

export default function LoginSuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top light gray bar */}
      <View style={styles.topBar} />

      {/* Success Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Yey! Login Successful</Text>
        <Text style={styles.subtitle}>
          You will be moved to home screen right now.{'\n'}Enjoy the features!
        </Text>
      </View>

      {/* Lets Explore Button */}
      <TouchableOpacity
        style={styles.exploreButton}
onPress={() => navigation.replace('Auth', { screen: 'RoleSelect' })}
      >
        <Text style={styles.exploreButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  topBar: {
    width: 50,
    height: 6,
    backgroundColor: '#DDE3ED',
    borderRadius: 3,
    position: 'absolute',
    top: 20
  },
  textContainer: { alignItems: 'center', marginBottom: 50, paddingHorizontal: 20 },
  title: { ...Typography.heading1, textAlign: 'center' },
  subtitle: { ...Typography.caption, textAlign: 'center', lineHeight: 20 },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: BorderRadius.md,
    bottom: -200,
  },
  exploreButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});
