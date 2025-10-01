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

export default function PatientPaymentsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const upcomingPayments = [
    {
      id: 1,
      therapist: 'Dr. Sarah Johnson',
      sessionDate: 'Today, 2:00 PM',
      amount: 120,
      status: 'Pending',
      dueDate: 'Today',
    },
    {
      id: 2,
      therapist: 'Dr. Michael Chen',
      sessionDate: 'Tomorrow, 10:00 AM',
      amount: 100,
      status: 'Pending',
      dueDate: 'Tomorrow',
    },
  ];

  const paymentHistory = [
    {
      id: 3,
      therapist: 'Dr. Sarah Johnson',
      sessionDate: 'Yesterday, 2:00 PM',
      amount: 120,
      status: 'Paid',
      paymentDate: 'Yesterday',
      paymentMethod: 'Credit Card ****1234',
    },
    {
      id: 4,
      therapist: 'Dr. Michael Chen',
      sessionDate: '3 days ago, 10:00 AM',
      amount: 100,
      status: 'Paid',
      paymentDate: '3 days ago',
      paymentMethod: 'Credit Card ****1234',
    },
    {
      id: 5,
      therapist: 'Dr. Sarah Johnson',
      sessionDate: '1 week ago, 2:00 PM',
      amount: 120,
      status: 'Paid',
      paymentDate: '1 week ago',
      paymentMethod: 'Credit Card ****1234',
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      last4: '1234',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Debit Card',
      last4: '5678',
      expiry: '08/26',
      isDefault: false,
    },
  ];

  const tabs = ['Upcoming', 'History', 'Methods'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
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
      case 'Paid':
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
        <Text style={styles.title}>Payments</Text>
        <TouchableOpacity>
          <Ionicons name="add-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Balance Overview */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Account Balance</Text>
        <Text style={styles.balanceAmount}>$0.00</Text>
        <Text style={styles.balanceDescription}>
          No outstanding payments
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === 'Upcoming' && (
        <View style={styles.paymentsContainer}>
          {upcomingPayments.length > 0 ? (
            upcomingPayments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.therapistName}>{payment.therapist}</Text>
                    <Text style={styles.sessionDate}>{payment.sessionDate}</Text>
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text style={styles.amountText}>${payment.amount}</Text>
                    <View style={styles.paymentStatus}>
                      <Ionicons
                        name={getStatusIcon(payment.status)}
                        size={16}
                        color={getStatusColor(payment.status)}
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={styles.dueDate}>Due: {payment.dueDate}</Text>
                </View>

                <View style={styles.paymentActions}>
                  <TouchableOpacity style={styles.payButton}>
                    <Ionicons name="card" size={20} color={Colors.surface} />
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                    <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No Upcoming Payments</Text>
              <Text style={styles.emptyDescription}>
                You don't have any pending payments at the moment.
              </Text>
            </View>
          )}
        </View>
      )}

      {selectedTab === 'History' && (
        <View style={styles.paymentsContainer}>
          {paymentHistory.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.therapistName}>{payment.therapist}</Text>
                  <Text style={styles.sessionDate}>{payment.sessionDate}</Text>
                </View>
                <View style={styles.paymentAmount}>
                  <Text style={styles.amountText}>${payment.amount}</Text>
                  <View style={styles.paymentStatus}>
                    <Ionicons
                      name={getStatusIcon(payment.status)}
                      size={16}
                      color={getStatusColor(payment.status)}
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                      {payment.status}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentDate}>Paid: {payment.paymentDate}</Text>
                <Text style={styles.paymentMethod}>{payment.paymentMethod}</Text>
              </View>

              <View style={styles.paymentActions}>
                <TouchableOpacity style={styles.receiptButton}>
                  <Ionicons name="receipt-outline" size={16} color={Colors.primary} />
                  <Text style={styles.receiptButtonText}>View Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.refundButton}>
                  <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
                  <Text style={styles.refundButtonText}>Request Refund</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === 'Methods' && (
        <View style={styles.methodsContainer}>
          <View style={styles.methodsHeader}>
            <Text style={styles.methodsTitle}>Payment Methods</Text>
            <TouchableOpacity style={styles.addMethodButton}>
              <Ionicons name="add" size={20} color={Colors.surface} />
              <Text style={styles.addMethodText}>Add Method</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.methodCard}>
              <View style={styles.methodInfo}>
                <Ionicons name="card" size={24} color={Colors.primary} />
                <View style={styles.methodDetails}>
                  <Text style={styles.methodType}>{method.type}</Text>
                  <Text style={styles.methodNumber}>****{method.last4}</Text>
                  <Text style={styles.methodExpiry}>Expires {method.expiry}</Text>
                </View>
              </View>
              <View style={styles.methodActions}>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.billingInfo}>
            <Text style={styles.billingTitle}>Billing Information</Text>
            <View style={styles.billingItem}>
              <Text style={styles.billingLabel}>Billing Address</Text>
              <Text style={styles.billingValue}>123 Main St, City, State 12345</Text>
            </View>
            <View style={styles.billingItem}>
              <Text style={styles.billingLabel}>Tax ID</Text>
              <Text style={styles.billingValue}>12-3456789</Text>
            </View>
            <TouchableOpacity style={styles.editBillingButton}>
              <Text style={styles.editBillingText}>Edit Billing Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Spending Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Billing Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="document-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickActionText}>Tax Documents</Text>
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
  balanceCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  balanceTitle: {
    ...Typography.caption,
    color: Colors.surface + '80',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    ...Typography.heading1,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  balanceDescription: {
    ...Typography.caption,
    color: Colors.surface + '80',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  paymentsContainer: {
    padding: Spacing.lg,
  },
  paymentCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  therapistName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sessionDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...Typography.heading3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  paymentDetails: {
    marginBottom: Spacing.md,
  },
  dueDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  paymentDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  paymentMethod: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  payButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  rescheduleButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rescheduleButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  receiptButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  receiptButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  refundButton: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  refundButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  methodsContainer: {
    padding: Spacing.lg,
  },
  methodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  methodsTitle: {
    ...Typography.heading3,
  },
  addMethodButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addMethodText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  methodCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.sm,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodDetails: {
    marginLeft: Spacing.md,
  },
  methodType: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  methodNumber: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  methodExpiry: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  defaultText: {
    ...Typography.caption,
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: Spacing.sm,
    marginRight: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  billingInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  billingTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  billingItem: {
    marginBottom: Spacing.md,
  },
  billingLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  billingValue: {
    ...Typography.body,
  },
  editBillingButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  editBillingText: {
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
