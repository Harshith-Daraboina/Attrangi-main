import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';

export default function ReportScreen() {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getReports('caregiver').then(setData);
  }, []);

  if (!data) return <View style={g.screen}><Text>Loading...</Text></View>;

  return (
    <View style={g.screen}>
      <Text style={g.heading}>Patient Progress</Text>
      <Text style={g.paragraph}>Weekly: {data.weekly.join(', ')}</Text>
      <Text style={g.paragraph}>Monthly: {data.monthly.join(', ')}</Text>
    </View>
  );
}


