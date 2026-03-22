import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface TransactionRowProps {
  title: string;
  subtitle?: string;
  amount: string;
  type: 'income' | 'expense' | 'transfer';
}

export function TransactionRow({ title, subtitle, amount, type }: TransactionRowProps) {
  const isPositive = type === 'income';
  const isTransfer = type === 'transfer';
  const amountColor = isTransfer ? theme.colors.text : isPositive ? theme.colors.success : theme.colors.danger;

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {/* {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>} */}
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {isPositive ? '+' : isTransfer ? '' : '-'}
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 12,
  },
  amount: {
    fontFamily: theme.fonts.heading,
    fontSize: 14,
  },
});
