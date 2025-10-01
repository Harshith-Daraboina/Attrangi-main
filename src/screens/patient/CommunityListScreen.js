import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { Colors, Spacing } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityListScreen({ navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  
  const communities = [
    {
      id: 'patients',
      title: 'Patients\' Lounge',
      description: 'Connect with other patients in a supportive environment + AI Therapist',
      icon: 'people',
      color: Colors.primary,
      hasAI: true,
    },
    {
      id: 'caregivers',
      title: 'Caregivers Support',
      description: 'Share experiences and get support from fellow caregivers',
      icon: 'heart',
      color: '#5267df',
    },
    {
      id: 'general',
      title: 'General Discussion',
      description: 'General health and wellness discussions',
      icon: 'chatbubbles',
      color: '#2a7f62',
    },
  ];

  return (
    <ScrollView style={g.screen}>
      <Text style={g.heading}>Community Connect</Text>
      <Text style={[g.paragraph, { marginBottom: Spacing.lg }]}>
        Join conversations and connect with others who understand your journey
      </Text>

      {communities.map((community) => (
        <TouchableOpacity
          key={community.id}
          style={[g.card, { 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: Spacing.md
          }]}
          onPress={() => navigation.navigate('ChatPatient', { channel: community.id })}
        >
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: community.color + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md
          }}>
            <Ionicons name={community.icon} size={24} color={community.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[g.paragraph, { fontWeight: '600', marginBottom: Spacing.xs }]}>
              {community.title}
            </Text>
            <Text style={g.caption}>
              {community.description}
            </Text>
            {community.hasAI && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color={Colors.primary} />
                <Text style={styles.aiBadgeText}>AI Therapist Available</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = {
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  aiBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  }
};