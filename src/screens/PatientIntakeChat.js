// src/screens/PatientIntakeChat.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../styles/designSystem';

export default function PatientIntakeChat({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help gather some information about your symptoms and concerns. How are you feeling today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Thank you for sharing that. Can you tell me more about how long you've been experiencing these symptoms?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleComplete = () => {
    navigation.navigate('MainPatient');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Intake</Text>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={styles.completeButton}>Complete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isBot ? styles.botMessage : styles.userMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botText : styles.userText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageBubble, styles.botMessage]}>
            <Text style={[styles.messageText, styles.botText]}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={Colors.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? Colors.white : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  completeButton: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  messageText: {
    fontSize: Typography.body,
    lineHeight: 20,
  },
  botText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: Colors.white,
  },
  timestamp: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
});