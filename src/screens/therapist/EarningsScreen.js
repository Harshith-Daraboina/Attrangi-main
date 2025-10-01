import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function EarningsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const earnings = {
    totalEarnings: 12500,
    thisMonth: 3200,
    lastMonth: 2800,
    pendingAmount: 800,
    availableBalance: 2400,
  };

  const recentTransactions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      sessionDate: 'Today, 2:00 PM',
      amount: 120,
      status: 'Completed',
      paymentDate: 'Today',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      sessionDate: 'Yesterday, 10:00 AM',
      amount: 100,
      status: 'Completed',
      paymentDate: 'Yesterday',
    },
    {
      id: 3,
      patient: 'Lisa Wang',
      sessionDate: '2 days ago, 4:00 PM',
      amount: 120,
      status: 'Pending',
      paymentDate: 'Pending',
    },
    {
      id: 4,
      patient: 'John Smith',
      sessionDate: '3 days ago, 2:00 PM',
      amount: 100,
      status: 'Completed',
      paymentDate: '3 days ago',
    },
  ];

  const periods = ['This Month', 'Last Month', 'This Year', 'All Time'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return Colors.success;
      case 'Pending':
        return Colors.warning;
      case 'Failed':
        return '#EF4444';
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return 'checkmark-circle';
      case 'Pending':
        return 'time';
      case 'Failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Earnings Overview */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Total Earnings</Text>
        <Text style={styles.earningsAmount}>${earnings.totalEarnings.toLocaleString()}</Text>
        <Text style={styles.earningsSubtitle}>All time earnings</Text>
      </View>

      {/* Period Selection */}
      <View style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.periodTabs}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodTab,
                  selectedPeriod === period && styles.periodTabActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Current Period Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.thisMonth.toLocaleString()}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.pendingAmount.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.availableBalance.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.patientName}>{transaction.patient}</Text>
              <Text style={styles.sessionDate}>{transaction.sessionDate}</Text>
              <Text style={styles.paymentDate}>
                {transaction.status === 'Pending' ? 'Payment pending' : `Paid ${transaction.paymentDate}`}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.amountText}>${transaction.amount}</Text>
              <View style={styles.transactionStatus}>
                <Ionicons
                  name={getStatusIcon(transaction.status)}
                  size={16}
                  color={getStatusColor(transaction.status)}
                />
                <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Withdrawal Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Withdraw Earnings</Text>
        <Text style={styles.cardDescription}>
          Transfer your available earnings to your bank account
        </Text>
        
        <View style={styles.withdrawalOptions}>
          <TouchableOpacity style={styles.withdrawalOption}>
            <Ionicons name="card-outline" size={24} color={Colors.primary} />
            <View style={styles.withdrawalInfo}>
              <Text style={styles.withdrawalTitle}>Bank Transfer</Text>
              <Text style={styles.withdrawalDescription}>Transfer to your bank account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.withdrawalOption}>
            <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
            <View style={styles.withdrawalInfo}>
              <Text style={styles.withdrawalTitle}>Digital Wallet</Text>
              <Text style={styles.withdrawalDescription}>Transfer to PayPal or similar</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw ${earnings.availableBalance}</Text>
        </TouchableOpacity>
      </View>

      {/* Tax Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Information</Text>
        <View style={styles.taxInfo}>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Tax ID</Text>
            <Text style={styles.taxValue}>12-3456789</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Business Name</Text>
            <Text style={styles.taxValue}>Dr. Smith Therapy Practice</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Tax Documents</Text>
            <TouchableOpacity style={styles.taxButton}>
              <Text style={styles.taxButtonText}>Download 1099</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="document-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="settings-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Settings</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.heading2,
  },
  earningsCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  earningsTitle: {
    ...Typography.caption,
    color: Colors.surface + '80',
    marginBottom: Spacing.xs,
  },
  earningsAmount: {
    ...Typography.heading1,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  earningsSubtitle: {
    ...Typography.caption,
    color: Colors.surface + '80',
  },
  periodContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  periodTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  periodTabActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  periodTextActive: {
    color: Colors.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statValue: {
    ...Typography.heading3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.heading3,
  },
  cardDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionInfo: {
    flex: 1,
  },
  patientName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  paymentDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...Typography.heading3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  transactionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  withdrawalOptions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  withdrawalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  withdrawalInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  withdrawalTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  withdrawalDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  withdrawButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  withdrawButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  taxInfo: {
    gap: Spacing.md,
  },
  taxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taxLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  taxValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  taxButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  taxButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
