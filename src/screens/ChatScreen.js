import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';
import ChatBubble from '../components/ChatBubble';

export default function ChatScreen({ route }) {
  const { group } = route.params || {};
  const [messages, setMessages] = useState([
    { id: '1', text: 'Welcome to the chat!', author: 'Moderator', isSelf: false, ts: '09:00' },
    { id: '2', text: 'Hi everyone 👋', author: 'You', isSelf: true, ts: '09:01' },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: String(prev.length + 1), text, author: 'You', isSelf: true, ts: 'now' }]);
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.screen}>
        <Text style={styles.title}>{group?.name || 'Chat'}</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble text={item.text} isSelf={item.isSelf} author={item.author} />}
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type a message"
          placeholderTextColor={Colors.textSecondary}
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  title: { ...Typography.heading2, marginBottom: Spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm },
  sendBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
});


