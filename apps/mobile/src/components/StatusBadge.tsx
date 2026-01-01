import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

type StatusType = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  return (
    <View style={[styles.badge, styles[`badge_${status}`], style]}>
      <Text style={[styles.text, styles[`text_${status}`]]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Draft
  badge_draft: {
    backgroundColor: `${colors.draft}20`,
  },
  text_draft: {
    color: colors.draft,
  },
  
  // Sent
  badge_sent: {
    backgroundColor: `${colors.sent}20`,
  },
  text_sent: {
    color: colors.sent,
  },
  
  // Paid
  badge_paid: {
    backgroundColor: `${colors.paid}20`,
  },
  text_paid: {
    color: colors.paid,
  },
  
  // Overdue
  badge_overdue: {
    backgroundColor: `${colors.overdue}20`,
  },
  text_overdue: {
    color: colors.overdue,
  },
  
  // Cancelled
  badge_cancelled: {
    backgroundColor: `${colors.cancelled}20`,
  },
  text_cancelled: {
    color: colors.cancelled,
  },
  
  // Pending
  badge_pending: {
    backgroundColor: `${colors.warning}20`,
  },
  text_pending: {
    color: colors.warning,
  },
});
