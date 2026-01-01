import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvoiceStackParamList } from '../../navigation/AppNavigator';

type InvoiceCreateScreenNavigationProp = NativeStackNavigationProp<
  InvoiceStackParamList,
  'InvoiceCreate'
>;

interface Props {
  navigation: InvoiceCreateScreenNavigationProp;
}

const InvoiceCreateScreen: React.FC<Props> = ({ navigation }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!clientName || !amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Firebase invoice creation
      console.log('Create invoice:', { clientName, clientEmail, amount, description });
      Alert.alert('Success', 'Invoice created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Client Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client name"
          placeholderTextColor="#999"
          value={clientName}
          onChangeText={setClientName}
        />

        <Text style={styles.label}>Client Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client email"
          placeholderTextColor="#999"
          value={clientEmail}
          onChangeText={setClientEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="#999"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Invoice description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          disabled={loading}>
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => Alert.alert('Info', 'Camera integration coming soon')}>
          <Text style={styles.scanButtonText}>Scan Invoice</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  scanButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InvoiceCreateScreen;
