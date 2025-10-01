import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import { Colors, Spacing, BorderRadius } from '../../styles/designSystem';

export default function ActivityDashboard({ navigation }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [list, setList] = useState([]);

  useEffect(() => {
    api.listActivities().then(setList);
  }, []);

  const completed = useMemo(() => list.filter((a) => a.completed).length, [list]);

  const progressPercentage = list.length > 0 ? (completed / list.length) * 100 : 0;

  return (
    <View style={g.screen}>
      <Text style={g.heading}>Activity Coach</Text>
      
      {/* Progress Section */}
      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Weekly Progress</Text>
        <View style={{ height: 8, backgroundColor: Colors.border, borderRadius: 4, marginVertical: Spacing.sm }}>
          <View style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            backgroundColor: Colors.primary, 
            borderRadius: 4 
          }} />
        </View>
        <Text style={g.caption}>{completed} out of {list.length} activities completed</Text>
      </View>

      <Text style={g.subheading}>Your Activities</Text>
      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[g.card, { 
              borderLeftWidth: 4,
              borderLeftColor: item.completed ? Colors.success : Colors.warning 
            }]}
            onPress={() => navigation.navigate('ActivityDetail', { id: item.id })}
          >
            <Text style={[g.paragraph, { fontWeight: '600', marginBottom: Spacing.xs }]}>{item.title}</Text>
            <Text style={g.caption}>Assigned by {item.assignedBy}</Text>
            <View style={{ 
              alignSelf: 'flex-start',
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: BorderRadius.sm,
              backgroundColor: item.completed ? 'rgba(42, 127, 98, 0.1)' : 'rgba(217, 119, 6, 0.1)',
              marginTop: Spacing.xs
            }}>
              <Text style={{ 
                color: item.completed ? Colors.success : Colors.warning,
                fontSize: 12,
                fontWeight: '600'
              }}>
                {item.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </View>
  );
}