import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, shadows } from '../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  shadow = true,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        shadow && shadows.base,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
});
