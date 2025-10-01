import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import Button from '../../components/Button';
import { Spacing, Colors, BorderRadius } from '../../styles/designSystem';

export default function ActivityDetail({ route, navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { id } = route.params;
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    api.getActivity(id).then(setActivity);
  }, [id]);

  if (!activity) return <View style={g.screen}><Text>Loading...</Text></View>;

  const toggle = async () => {
    const updated = await api.toggleActivityComplete(activity.id);
    setActivity(updated);
  };

  return (
    <ScrollView style={g.screen}>
      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.heading}>{activity.title}</Text>
        <View style={{ 
          alignSelf: 'flex-start',
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          borderRadius: BorderRadius.sm,
          backgroundColor: activity.completed ? 'rgba(42, 127, 98, 0.1)' : 'rgba(217, 119, 6, 0.1)',
          marginBottom: Spacing.md
        }}>
          <Text style={{ 
            color: activity.completed ? Colors.success : Colors.warning,
            fontSize: 12,
            fontWeight: '600'
          }}>
            {activity.completed ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Instructions</Text>
        {activity.instructions?.map((s, i) => (
          <View key={i} style={{ 
            flexDirection: 'row', 
            alignItems: 'flex-start',
            marginBottom: Spacing.sm 
          }}>
            <View style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              backgroundColor: Colors.primaryLight, 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: Spacing.sm,
              marginTop: 2
            }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>{i + 1}</Text>
            </View>
            <Text style={[g.paragraph, { flex: 1 }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Benefits</Text>
        {activity.benefits?.map((benefit, i) => (
          <View key={i} style={{ 
            flexDirection: 'row', 
            alignItems: 'flex-start',
            marginBottom: Spacing.sm 
          }}>
            <View style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 10, 
              backgroundColor: Colors.success, 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: Spacing.sm,
              marginTop: 2
            }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 10 }}>✓</Text>
            </View>
            <Text style={[g.paragraph, { flex: 1 }]}>{benefit}</Text>
          </View>
        ))}
      </View>

      <View style={g.card}>
        <Button 
          title={activity.completed ? 'Mark as Incomplete' : 'Mark as Complete'} 
          onPress={toggle} 
          variant={activity.completed ? 'secondary' : 'primary'}
          style={{ marginBottom: Spacing.sm }}
        />
        <Button 
          title="Caregiver Instructions" 
          variant="outline" 
          onPress={() => {}} 
        />
      </View>
    </ScrollView>
  );
}