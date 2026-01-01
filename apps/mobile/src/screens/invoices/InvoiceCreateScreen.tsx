import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvoiceStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../hooks/useData';
import { Button, Input } from '../../components';
import { colors } from '../../theme';
import { validateRequired, validateEmail, validateAmount } from '../../utils/validators';

type InvoiceCreateScreenNavigationProp = NativeStackNavigationProp<
  InvoiceStackParamList,
  'InvoiceCreate'
>;

interface Props {
  navigation: InvoiceCreateScreenNavigationProp;
}

const InvoiceCreateScreen: React.FC<Props> = ({ navigation }) => {
  const { createInvoice } = useData();
  const [loading, setLoading] = useState(false);
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [clientNameError, setClientNameError] = useState('');
  const [clientEmailError, setClientEmailError] = useState('');
  const [amountError, setAmountError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setClientNameError('');
    setClientEmailError('');
    setAmountError('');

    // Client name validation
    const nameError = validateRequired(clientName, 'Client name');
    if (nameError) {
      setClientNameError(nameError);
      isValid = false;
    }

    // Email validation (optional but must be valid if provided)
    if (clientEmail && !validateEmail(clientEmail)) {
      setClientEmailError('Please enter a valid email');
      isValid = false;
    }

    // Amount validation
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
      await createInvoice({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || undefined,
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        issueDate: new Date(),
      });
      
      Alert.alert('Success', 'Invoice created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        
        <Input
          label="Client Name *"
          placeholder="Enter client name"
          value={clientName}
          onChangeText={setClientName}
          error={clientNameError}
          editable={!loading}
        />

        <Input
          label="Client Email"
          placeholder="client@example.com"
          value={clientEmail}
          onChangeText={setClientEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={clientEmailError}
          editable={!loading}
        />

        <Text style={styles.sectionTitle}>Invoice Details</Text>

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
          placeholder="Invoice description or notes"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
          editable={!loading}
        />

        <Button
          title="Create Invoice"
          onPress={handleCreate}
          disabled={loading}
          loading={loading}
          fullWidth
          style={styles.createButton}
        />

        <Button
          title="Scan Invoice (Coming Soon)"
          onPress={() => Alert.alert('Info', 'Camera integration coming soon')}
          variant="outline"
          fullWidth
          style={styles.scanButton}
          disabled={loading}
        />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  createButton: {
    marginTop: 24,
  },
  scanButton: {
    marginTop: 12,
  },
});

export default InvoiceCreateScreen;
