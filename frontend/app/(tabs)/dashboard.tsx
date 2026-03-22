import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useDashboard } from '@/hooks/useDashboard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { theme } from '@/constants/theme';

export default function DashboardScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();

  if (isLoading) {
    return (
      <Screen>
        <SectionHeader title="Overview" subtitle="Your total balance across accounts." />
        <Card>
          <Skeleton height={14} width="40%" />
          <View style={{ height: 10 }} />
          <Skeleton height={26} width="70%" />
        </Card>
        <SectionHeader title="Accounts" />
        <Card>
          <Skeleton height={16} width="60%" />
          <View style={{ height: 8 }} />
          <Skeleton height={20} width="40%" />
        </Card>
        <SectionHeader title="Recent transactions" />
        <Card>
          <Skeleton height={14} width="80%" />
          <View style={{ height: 8 }} />
          <Skeleton height={14} width="70%" />
        </Card>
      </Screen>
    );
  }

  if (error || !data) {
    return <Screen scroll={false}><ErrorState message="Unable to load dashboard." /></Screen>;
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
      <SectionHeader title="Overview" subtitle="Your total balance across accounts." />
      <Card>
        <Text style={styles.totalLabel}>Total balance</Text>
        <Text style={styles.totalValue}>{data.total_balance}</Text>
      </Card>

      <SectionHeader title="Accounts" />
      {data.balance_per_account.length === 0 ? (
        <EmptyState title="No accounts yet" subtitle="Create your first account to get started." />
      ) : (
        data.balance_per_account.map((account) => (
          <Card key={account.id}>
            <View style={styles.rowBetween}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>{account.currency} {account.balance}</Text>
            </View>
          </Card>
        ))
      )}

      <SectionHeader title="Recent transactions" />
      {data.recent_transactions.length === 0 ? (
        <EmptyState title="No transactions yet" subtitle="Add a transaction to see activity." />
      ) : (
        <Card>
          {data.recent_transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              title={tx.description || tx.category_name || 'Transaction'}
              subtitle={`${tx.account_name}${tx.to_account_name ? ` ? ${tx.to_account_name}` : ''}`}
              amount={`${tx.amount}`}
              type={tx.type}
            />
          ))}
        </Card>
      )}

      <SectionHeader title="Spending by category" />
      {data.spending_by_category.length === 0 ? (
        <EmptyState title="No spending data" subtitle="Expenses will show up here." />
      ) : (
        <Card>
          {(() => {
            const totals = data.spending_by_category.map((item) => Number(item.total));
            const max = Math.max(...totals, 1);
            return data.spending_by_category.map((item) => (
              <View key={item.category_name} style={{ marginBottom: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.categoryName}>{item.category_name}</Text>
                  <Text style={styles.categoryTotal}>{item.total}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(Number(item.total) / max) * 100}%` }]} />
                </View>
              </View>
            ));
          })()}
        </Card>
      )}

    </Screen>
  );
}

const styles = StyleSheet.create({
  totalLabel: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
  },
  totalValue: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.primaryDark,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountName: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
  },
  accountBalance: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  categoryName: {
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
  },
  categoryTotal: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.danger,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#EFE6D9',
    borderRadius: 6,
    marginTop: 6,
  },
  barFill: {
    height: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 6,
  },
});
