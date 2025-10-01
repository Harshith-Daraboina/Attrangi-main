import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Button from '../../components/Button';
import MoodSlider from '../../components/MoodSlider';
import { useThemeSettings } from '../../styles/ThemeContext';
import createGlobalStyles from '../../styles/globalStyles';
import { Spacing, Colors } from '../../styles/designSystem';

export default function MoodCheckIn() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');

  const getMoodLabel = (value) => {
    if (value <= 3) return '😔 Not Great';
    if (value <= 7) return '😐 Okay';
    return '😊 Good';
  };

  return (
    <ScrollView style={g.screen}>
      <Text style={g.heading}>Mood Check-In</Text>
      <Text style={[g.paragraph, { marginBottom: Spacing.lg }]}>
        How are you feeling today? Share your current mood to track your emotional wellbeing.
      </Text>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Rate Your Mood</Text>
        <MoodSlider value={mood} onChange={setMood} />
        <Text style={[g.paragraph, { textAlign: 'center', marginVertical: Spacing.sm }]}>
          {getMoodLabel(mood)}
        </Text>
      </View>

      <View style={[g.card, { marginBottom: Spacing.md }]}>
        <Text style={g.subheading}>Quick Selection</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button 
            title="😊 Good" 
            onPress={() => setMood(8)} 
            variant={mood >= 8 ? 'primary' : 'outline'}
            size="small"
            style={{ flex: 1, marginHorizontal: Spacing.xs }}
          />
          <Button 
            title="😐 Okay" 
            onPress={() => setMood(5)} 
            variant={mood >= 4 && mood <= 7 ? 'primary' : 'outline'}
            size="small"
            style={{ flex: 1, marginHorizontal: Spacing.xs }}
          />
          <Button 
            title="😔 Not Great" 
            onPress={() => setMood(2)} 
            variant={mood <= 3 ? 'primary' : 'outline'}
            size="small"
            style={{ flex: 1, marginHorizontal: Spacing.xs }}
          />
        </View>
      </View>

      <View style={g.card}>
        <Text style={g.subheading}>Add a Note</Text>
        <Text style={[g.caption, { marginBottom: Spacing.sm }]}>
          Optional: Share what's contributing to your mood today
        </Text>
        <TextInput
          placeholder="Type your thoughts here..."
          value={note}
          onChangeText={setNote}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            minHeight: 100,
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: Colors.border
          }}
          multiline
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={{ marginTop: Spacing.md }}>
        <Button 
          title="Voice Input" 
          onPress={() => {}} 
          variant="outline"
          icon="mic"
          style={{ marginBottom: Spacing.sm }}
        />
        <Button 
          title="Save Check-In" 
          onPress={() => {}} 
        />
      </View>
    </ScrollView>
  );
}