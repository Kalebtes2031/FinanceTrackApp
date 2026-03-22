import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { Card } from './Card';

interface AccountCardProps {
  name: string;
  type: string;
  balance: string;
  currency: string;
}

export function AccountCard({ name, type, balance, currency }: AccountCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.type}>{type.replace('_', ' ')}</Text>
      </View>
      <Text style={styles.balance}>{currency} {balance}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    fontSize: 16,
  },
  type: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    textTransform: 'capitalize',
  },
  balance: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.primaryDark,
    fontSize: 20,
  },
});