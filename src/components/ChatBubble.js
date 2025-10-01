import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Spacing, BorderRadius, Typography } from '../styles/designSystem';

export default function ChatBubble({ text, isSelf, author, isAI }) {
  return (
    <View style={[styles.container, isSelf ? styles.right : styles.left]}>
      {!isSelf && (
        <Text style={[
          styles.author, 
          isAI && styles.aiAuthor
        ]}>
          {author}
        </Text>
      )}
      <View style={[
        styles.bubble, 
        isSelf ? styles.selfBubble : 
        isAI ? styles.aiBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.text, 
          isSelf ? styles.selfText : 
          isAI ? styles.aiText : styles.otherText
        ]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

ChatBubble.propTypes = {
  text: PropTypes.string.isRequired,
  isSelf: PropTypes.bool,
  author: PropTypes.string,
  isAI: PropTypes.bool,
};

ChatBubble.defaultProps = {
  isSelf: false,
  author: 'User',
  isAI: false,
};

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.xs },
  left: { alignSelf: 'flex-start', maxWidth: '80%' },
  right: { alignSelf: 'flex-end', maxWidth: '80%' },
  author: { ...Typography.caption, marginBottom: Spacing.xs },
  bubble: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.lg },
  selfBubble: { backgroundColor: Colors.primary },
  otherBubble: { backgroundColor: '#F1F3F7' },
  aiBubble: { 
    backgroundColor: Colors.primary + '20', 
    borderWidth: 1, 
    borderColor: Colors.primary + '40' 
  },
  selfText: { color: '#fff' },
  otherText: { color: Colors.textPrimary },
  aiText: { color: Colors.primary, fontWeight: '500' },
  text: { fontSize: 14 },
  aiAuthor: { 
    color: Colors.primary, 
    fontWeight: '600',
    fontStyle: 'italic'
  },
});


