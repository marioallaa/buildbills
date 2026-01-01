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
import { ExpenseStackParamList } from '../../navigation/AppNavigator';

type ExpenseCreateScreenNavigationProp = NativeStackNavigationProp<
  ExpenseStackParamList,
  'ExpenseCreate'
>;

interface Props {
  navigation: ExpenseCreateScreenNavigationProp;
}

const ExpenseCreateScreen: React.FC<Props> = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Firebase expense creation
      console.log('Create expense:', { category, amount, description });
      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Materials, Labor, Travel"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
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
          placeholder="Expense description"
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
            {loading ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => Alert.alert('Info', 'Camera integration coming soon')}>
          <Text style={styles.scanButtonText}>Scan Receipt</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Tip: Use the "Scan Receipt" feature to automatically extract expense details from photos.
          </Text>
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
  infoBox: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ExpenseCreateScreen;
