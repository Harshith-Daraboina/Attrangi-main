import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

export default function HelpSupportScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I schedule a therapy session?',
      answer: 'To schedule a therapy session, go to your dashboard and tap on "Schedule Session". You can then select your preferred therapist and available time slot.',
    },
    {
      id: 2,
      question: 'How do I track my mood?',
      answer: 'Navigate to the Mood Journal section from your dashboard. You can log your mood daily and view your mood history over time.',
    },
    {
      id: 3,
      question: 'Can I change my therapist?',
      answer: 'Yes, you can request a therapist change by going to your profile settings and selecting "Change Therapist". Your request will be reviewed within 24 hours.',
    },
    {
      id: 4,
      question: 'How do I access my session recordings?',
      answer: 'Session recordings are available in your dashboard under "Session History". You can download or view them for up to 30 days after the session.',
    },
    {
      id: 5,
      question: 'What if I miss a session?',
      answer: 'If you miss a session, you can reschedule it within 24 hours without any penalty. After 24 hours, you may be charged a cancellation fee.',
    },
    {
      id: 6,
      question: 'How do I update my payment information?',
      answer: 'Go to your profile settings and select "Payment Methods". You can add, edit, or remove your payment information there.',
    },
  ];

  const contactOptions = [
    {
      id: 1,
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: 'chatbubble-outline',
      color: Colors.primary,
    },
    {
      id: 2,
      title: 'Email Support',
      description: 'support@attrangi.com',
      icon: 'mail-outline',
      color: Colors.success,
    },
    {
      id: 3,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      icon: 'call-outline',
      color: '#3B82F6',
    },
    {
      id: 4,
      title: 'Emergency Contact',
      description: 'For urgent mental health crises',
      icon: 'warning-outline',
      color: '#EF4444',
    },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {filteredFAQs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() => toggleFAQ(faq.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            {expandedFAQ === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        {contactOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: option.color + '20' }]}>
              <Ionicons name={option.icon} size={24} color={option.color} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{option.title}</Text>
              <Text style={styles.contactDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="book-outline" size={24} color={Colors.textSecondary} />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>User Guide</Text>
            <Text style={styles.resourceDescription}>Complete guide to using Attrangi</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="videocam-outline" size={24} color={Colors.textSecondary} />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>Video Tutorials</Text>
            <Text style={styles.resourceDescription}>Step-by-step video guides</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="document-text-outline" size={24} color={Colors.textSecondary} />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>Terms & Privacy</Text>
            <Text style={styles.resourceDescription}>Legal information and privacy policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Need more help? Our support team is available 24/7 to assist you.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.heading2,
  },
  searchSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.body,
  },
  section: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading3,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  faqItem: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  faqAnswer: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  contactDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resourceInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  resourceTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
