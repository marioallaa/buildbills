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
import { InvoiceStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../hooks/useData';
import { Card, EmptyState, Loading, StatusBadge, AmountDisplay, Button } from '../../components';
import { colors } from '../../theme';
import { formatDate } from '../../utils/formatters';
import { Invoice } from '@buildbills/shared-types';

type InvoiceListScreenNavigationProp = NativeStackNavigationProp<
  InvoiceStackParamList,
  'InvoiceList'
>;

interface Props {
  navigation: InvoiceListScreenNavigationProp;
}

const InvoiceListScreen: React.FC<Props> = ({ navigation }) => {
  const { invoices, loadingInvoices, refreshInvoices } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshInvoices();
    setRefreshing(false);
  };

  const renderInvoiceCard = ({ item }: { item: Invoice }) => (
    <Card style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
        <StatusBadge status={item.status} />
      </View>
      
      <Text style={styles.clientName}>{item.clientName}</Text>
      
      <View style={styles.invoiceFooter}>
        <View>
          <Text style={styles.label}>Amount</Text>
          <AmountDisplay amount={item.amount} size="medium" />
        </View>
        {item.dueDate && (
          <View>
            <Text style={styles.label}>Due</Text>
            <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
          </View>
        )}
      </View>
    </Card>
  );

  if (loadingInvoices && invoices.length === 0) {
    return <Loading fullScreen message="Loading invoices..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="+ New Invoice"
          onPress={() => navigation.navigate('InvoiceCreate')}
          size="medium"
        />
      </View>

      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          message="Create your first invoice to get started"
          action={
            <Button
              title="Create Invoice"
              onPress={() => navigation.navigate('InvoiceCreate')}
            />
          }
        />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={renderInvoiceCard}
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
  invoiceCard: {
    marginBottom: 12,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  clientName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: colors.text,
  },
});

export default InvoiceListScreen;
