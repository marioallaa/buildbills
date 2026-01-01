import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExpenseStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../hooks/useData';
import { Card, EmptyState, Loading, AmountDisplay, Button } from '../../components';
import { colors } from '../../theme';
import { formatDate } from '../../utils/formatters';
import { Expense } from '@buildbills/shared-types';

type ExpenseListScreenNavigationProp = NativeStackNavigationProp<
  ExpenseStackParamList,
  'ExpenseList'
>;

interface Props {
  navigation: ExpenseListScreenNavigationProp;
}

const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const { expenses, loadingExpenses, refreshExpenses } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshExpenses();
    setRefreshing(false);
  };

  const renderExpenseCard = ({ item }: { item: Expense }) => (
    <Card style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{item.category}</Text>
          {item.taxDeductible && (
            <View style={styles.taxBadge}>
              <Text style={styles.taxBadgeText}>Tax Deductible</Text>
            </View>
          )}
        </View>
        <AmountDisplay amount={item.amount} type="negative" size="medium" />
      </View>
      
      {item.vendor && <Text style={styles.vendor}>{item.vendor}</Text>}
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      
      <View style={styles.expenseFooter}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        {item.receiptUrl && (
          <Text style={styles.receiptIndicator}>📎 Receipt</Text>
        )}
      </View>
    </Card>
  );

  if (loadingExpenses && expenses.length === 0) {
    return <Loading fullScreen message="Loading expenses..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="+ Add Expense"
          onPress={() => navigation.navigate('ExpenseCreate')}
          size="medium"
        />
      </View>

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          message="Add your first expense to start tracking"
          action={
            <Button
              title="Add Expense"
              onPress={() => navigation.navigate('ExpenseCreate')}
            />
          }
        />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    padding: 16,
  },
  expenseCard: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryContainer: {
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  taxBadge: {
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  taxBadgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '600',
  },
  vendor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  receiptIndicator: {
    fontSize: 12,
    color: colors.primary,
  },
});

export default ExpenseListScreen;
