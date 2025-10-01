import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import { getCurrentUser } from '../../services/auth';
import ChatBubble from '../../components/ChatBubble';
import Button from '../../components/Button';

export default function ChatScreen({ route }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { channel } = route.params;
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.getGroupMessages(channel).then(setMsgs);
  }, [channel]);

  const send = async () => {
    if (!text.trim()) return;
    const msg = await api.sendGroupMessage(channel, { user: getCurrentUser(), text });
    setMsgs((m) => [...m, msg]);
    setText('');
  };

  return (
    <KeyboardAvoidingView style={g.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={msgs}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ChatBubble text={item.text} author={item.user.name} isSelf={item.user.id === 'u-self'} />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 8 }} />
        <TextInput value={text} onChangeText={setText} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12 }} placeholder="Type a message" />
        <View style={{ width: 8 }} />
        <Button title="Send" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}


