import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import createGlobalStyles from '../../styles/globalStyles';
import { useThemeSettings } from '../../styles/ThemeContext';
import { api } from '../../services/api';
import { getCurrentUser } from '../../services/auth';
import ChatBubble from '../../components/ChatBubble';
import Button from '../../components/Button';
import { Spacing, Colors, BorderRadius } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import aiChatbot from '../../services/aiChatbot';

export default function ChatScreen({ route }) {
  const theme = useThemeSettings();
  const g = createGlobalStyles(theme);
  const { channel } = route.params;
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [showAIBadge, setShowAIBadge] = useState(false);

  useEffect(() => {
    api.getGroupMessages(channel).then(setMsgs);
  }, [channel]);

  const send = async () => {
    if (!text.trim()) return;
    
    // Check if this is a crisis message
    if (aiChatbot.isCrisisMessage(text)) {
      const crisisResponse = aiChatbot.getCrisisResponse();
      Alert.alert(
        'Crisis Alert',
        crisisResponse.message,
        [
          { text: 'OK' },
          { text: 'Call 988', onPress: () => {} },
          { text: 'Call 911', onPress: () => {} }
        ]
      );
    }
    
    // Send user message
    const userMsg = await api.sendGroupMessage(channel, { user: getCurrentUser(), text });
    setMsgs((m) => [...m, userMsg]);
    setText('');
    
    // Show AI badge for patient lounge
    if (channel === 'patients') {
      setShowAIBadge(true);
    }
    
    // Get AI response for patient lounge
    if (channel === 'patients') {
      setIsAITyping(true);
      try {
        const aiResponse = await aiChatbot.getResponse(text, 'patient');
        const aiMsg = {
          id: Date.now().toString(),
          text: aiResponse,
          user: { id: 'ai-therapist', name: 'Attarangi AI 🤖', isAI: true },
          timestamp: new Date().toISOString()
        };
        setMsgs((m) => [...m, aiMsg]);
      } catch (error) {
        console.error('AI response error:', error);
      } finally {
        setIsAITyping(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={g.screen}>
        <FlatList
          data={msgs}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <ChatBubble 
              text={item.text} 
              author={item.user.name} 
              isSelf={item.user.id === 'u-self'} 
              isAI={item.user.isAI}
            />
          )}
          contentContainerStyle={{ paddingVertical: Spacing.sm }}
        />
        
        {/* AI Typing Indicator */}
        {isAITyping && (
          <View style={styles.aiTypingContainer}>
            <View style={styles.aiTypingBubble}>
              <Text style={styles.aiTypingText}>Attarangi AI is typing</Text>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </View>
        )}
        
        {/* AI Badge */}
        {showAIBadge && channel === 'patients' && (
          <View style={styles.aiBadgeContainer}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={16} color={Colors.primary} />
              <Text style={styles.aiBadgeText}>AI Therapist Available</Text>
            </View>
          </View>
        )}
        
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingVertical: Spacing.sm,
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.border
        }}>
          <TextInput 
            value={text} 
            onChangeText={setText} 
            style={{ 
              flex: 1, 
              backgroundColor: Colors.surface, 
              borderRadius: BorderRadius.lg, 
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              marginRight: Spacing.sm,
              borderWidth: 1,
              borderColor: Colors.border
            }} 
            placeholder="Type a message..." 
            placeholderTextColor={Colors.textTertiary}
          />
          <Button 
            title="Send" 
            onPress={send} 
            size="small"
            disabled={!text.trim()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  aiTypingContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  aiTypingBubble: {
    backgroundColor: Colors.primary + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiTypingText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  aiBadgeContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  aiBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
};