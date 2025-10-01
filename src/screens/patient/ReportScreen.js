import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import { Spacing, Colors } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getReports('patient').then(setData);
  }, []);

  if (!data) return <View style={g.screen}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={g.screen}>
      <Text style={g.heading}>Your Progress</Text>
      
      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.primaryLight + '40',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.sm
          }}>
            <Ionicons name="flame" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={g.subheading}>{data.streak} day streak! 🎉</Text>
            <Text style={g.caption}>You've been consistent with your check-ins</Text>
          </View>
        </View>
      </View>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Mood Trend</Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: Spacing.sm
        }}>
          {data.moodTrend.map((mood, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: Colors.primaryLight + '40',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing.xs
              }}>
                <Text style={{ color: Colors.primary, fontWeight: '600' }}>{mood}</Text>
              </View>
              <Text style={[g.caption, { fontSize: 12 }]}>Day {index + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={g.card}>
        <Text style={g.subheading}>Activities Completed</Text>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: Spacing.sm
        }}>
          <View style={{ alignItems: 'center', marginHorizontal: Spacing.lg }}>
            <Text style={[g.heading, { color: Colors.primary, marginBottom: 0 }]}>
              {data.completedActivities}
            </Text>
            <Text style={g.caption}>Completed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}