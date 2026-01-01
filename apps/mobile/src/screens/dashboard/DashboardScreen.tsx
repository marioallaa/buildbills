import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to BuildBills</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Invoices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Total Cost</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Create Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Scan Receipt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  recentActivity: {
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});

export default DashboardScreen;
