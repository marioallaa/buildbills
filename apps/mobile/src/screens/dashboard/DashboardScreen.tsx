import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Card, AmountDisplay, StatusBadge, EmptyState, Loading } from '../../components';
import { colors } from '../../theme';
import { formatDate } from '../../utils/formatters';
import { Invoice, Expense } from '@buildbills/shared-types';

type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useAuth();
  const { invoices, expenses, loadingInvoices, loadingExpenses } = useData();

  // Calculate financial summary
  const summary = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalPaid - totalExpenses;

    const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft').length;
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

    return {
      totalInvoiced,
      totalPaid,
      outstanding,
      totalExpenses,
      profit,
      pendingInvoices,
      overdueInvoices,
    };
  }, [invoices, expenses]);

  // Get recent activity (last 5 items)
  const recentActivity = useMemo(() => {
    const items: Array<{ type: 'invoice' | 'expense'; data: Invoice | Expense; date: Date }> = [];
    
    invoices.slice(0, 3).forEach(invoice => {
      items.push({ type: 'invoice', data: invoice, date: invoice.createdAt });
    });
    
    expenses.slice(0, 3).forEach(expense => {
      items.push({ type: 'expense', data: expense, date: expense.date });
    });
    
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [invoices, expenses]);

  if (loadingInvoices || loadingExpenses) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!</Text>
        </View>

        {/* Financial Summary */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total Invoiced</Text>
            <AmountDisplay amount={summary.totalInvoiced} size="large" />
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Revenue</Text>
            <AmountDisplay amount={summary.totalPaid} size="large" type="positive" />
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Outstanding</Text>
            <AmountDisplay amount={summary.outstanding} size="large" type="neutral" />
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Expenses</Text>
            <AmountDisplay amount={summary.totalExpenses} size="large" type="negative" />
          </Card>
        </View>

        <Card style={styles.profitCard}>
          <Text style={styles.statLabel}>Profit/Loss</Text>
          <AmountDisplay 
            amount={summary.profit} 
            size="large" 
            type={summary.profit >= 0 ? 'positive' : 'negative'} 
          />
        </Card>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <Card style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>{summary.pendingInvoices}</Text>
            <Text style={styles.quickStatLabel}>Pending Invoices</Text>
          </Card>
          <Card style={styles.quickStatCard}>
            <Text style={[styles.quickStatValue, styles.overdueValue]}>{summary.overdueInvoices}</Text>
            <Text style={styles.quickStatLabel}>Overdue</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Invoices', { screen: 'InvoiceCreate' })}>
            <Text style={styles.actionButtonText}>📄 Create Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Expenses', { screen: 'ExpenseCreate' })}>
            <Text style={styles.actionButtonText}>💰 Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📸 Scan Receipt (Coming Soon)</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.length === 0 ? (
            <Card>
              <EmptyState
                title="No activity yet"
                message="Start by creating an invoice or adding an expense"
              />
            </Card>
          ) : (
            recentActivity.map((item, index) => (
              <Card key={index} style={styles.activityCard}>
                {item.type === 'invoice' ? (
                  <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                      <Text style={styles.activityIcon}>📄</Text>
                      <View>
                        <Text style={styles.activityTitle}>
                          {(item.data as Invoice).invoiceNumber}
                        </Text>
                        <Text style={styles.activitySubtitle}>
                          {(item.data as Invoice).clientName}
                        </Text>
                        <Text style={styles.activityDate}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.activityRight}>
                      <AmountDisplay amount={(item.data as Invoice).amount} size="small" />
                      <StatusBadge status={(item.data as Invoice).status} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                      <Text style={styles.activityIcon}>💰</Text>
                      <View>
                        <Text style={styles.activityTitle}>
                          {(item.data as Expense).category}
                        </Text>
                        <Text style={styles.activitySubtitle}>
                          {(item.data as Expense).vendor || 'Expense'}
                        </Text>
                        <Text style={styles.activityDate}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.activityRight}>
                      <AmountDisplay amount={(item.data as Expense).amount} size="small" type="negative" />
                    </View>
                  </View>
                )}
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  profitCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickStatCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  overdueValue: {
    color: colors.error,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  recentActivity: {
    marginTop: 8,
  },
  activityCard: {
    marginBottom: 8,
    padding: 12,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
});

export default DashboardScreen;
