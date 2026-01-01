import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExpenseStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../hooks/useData';
import { Button, Input } from '../../components';
import { colors } from '../../theme';
import { validateRequired, validateAmount } from '../../utils/validators';
import { EXPENSE_CATEGORIES } from '../../constants';
import { ExpenseCategory } from '@buildbills/shared-types';

type ExpenseCreateScreenNavigationProp = NativeStackNavigationProp<
  ExpenseStackParamList,
  'ExpenseCreate'
>;

interface Props {
  navigation: ExpenseCreateScreenNavigationProp;
}

const ExpenseCreateScreen: React.FC<Props> = ({ navigation }) => {
  const { createExpense } = useData();
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [taxDeductible, setTaxDeductible] = useState(false);
  
  const [vendorError, setVendorError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [amountError, setAmountError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    
    setVendorError('');
    setCategoryError('');
    setAmountError('');

    const vendorErr = validateRequired(vendor, 'Vendor/Merchant');
    if (vendorErr) {
      setVendorError(vendorErr);
      isValid = false;
    }

    if (!category) {
      setCategoryError('Category is required');
      isValid = false;
    }

    const amtError = validateAmount(amount);
    if (amtError) {
      setAmountError(amtError);
      isValid = false;
    } else if (parseFloat(amount) === 0) {
      setAmountError('Amount must be greater than 0');
      isValid = false;
    }

    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createExpense({
        vendor: vendor.trim(),
        category: category as ExpenseCategory,
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        date: new Date(),
        taxDeductible,
      });
      
      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (cat: ExpenseCategory) => {
    setCategory(cat);
    setShowCategoryPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Expense Information</Text>
        
        <Input
          label="Vendor/Merchant *"
          placeholder="Enter vendor name"
          value={vendor}
          onChangeText={setVendor}
          error={vendorError}
          editable={!loading}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={[styles.categorySelector, categoryError && styles.categoryError]}
            onPress={() => setShowCategoryPicker(true)}
            disabled={loading}>
            <Text style={[styles.categorySelectorText, !category && styles.placeholder]}>
              {category || 'Select a category'}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          {categoryError && <Text style={styles.errorText}>{categoryError}</Text>}
        </View>

        <Input
          label="Amount *"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          error={amountError}
          editable={!loading}
        />

        <Input
          label="Description"
          placeholder="Add notes or description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.taxToggle}
          onPress={() => setTaxDeductible(!taxDeductible)}
          disabled={loading}>
          <View style={[styles.checkbox, taxDeductible && styles.checkboxChecked]}>
            {taxDeductible && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.taxLabel}>Tax Deductible</Text>
        </TouchableOpacity>

        <Button
          title="Add Expense"
          onPress={handleCreate}
          disabled={loading}
          loading={loading}
          fullWidth
          style={styles.createButton}
        />

        <Button
          title="Scan Receipt (Coming Soon)"
          onPress={() => Alert.alert('Info', 'Receipt scanning coming soon')}
          variant="outline"
          fullWidth
          style={styles.scanButton}
          disabled={loading}
        />
      </ScrollView>

      <Modal
        visible={showCategoryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryPicker(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={EXPENSE_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => selectCategory(item)}>
                  <Text style={styles.categoryItemText}>{item}</Text>
                  {category === item && (
                    <Text style={styles.selectedIndicator}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundTertiary,
  },
  categoryError: {
    borderColor: colors.error,
  },
  categorySelectorText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.gray400,
  },
  arrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  taxToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  taxLabel: {
    fontSize: 16,
    color: colors.text,
  },
  createButton: {
    marginTop: 8,
  },
  scanButton: {
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedIndicator: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default ExpenseCreateScreen;
