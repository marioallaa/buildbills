import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../theme';

interface AmountDisplayProps {
  amount: number;
  currency?: string;
  type?: 'positive' | 'negative' | 'neutral';
  style?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  currency = '$',
  type = 'neutral',
  style,
  size = 'medium',
}) => {
  const formattedAmount = Math.abs(amount).toFixed(2);
  const displayAmount = `${currency}${formattedAmount}`;
  
  return (
    <Text
      style={[
        styles.amount,
        styles[`amount_${size}`],
        type === 'positive' && styles.positive,
        type === 'negative' && styles.negative,
        style,
      ]}>
      {displayAmount}
    </Text>
  );
};

const styles = StyleSheet.create({
  amount: {
    fontWeight: '600',
    color: colors.text,
  },
  amount_small: {
    fontSize: 14,
  },
  amount_medium: {
    fontSize: 16,
  },
  amount_large: {
    fontSize: 24,
  },
  positive: {
    color: colors.income,
  },
  negative: {
    color: colors.expense,
  },
});
