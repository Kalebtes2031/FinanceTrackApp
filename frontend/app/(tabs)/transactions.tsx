import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/Button';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';

export default function TransactionsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useTransactions();

  if (isLoading) {
    return (
      <Screen>
        <SectionHeader title="Transactions" subtitle="Track income, expenses, and transfers." />
        <Card>
          <Skeleton height={14} width="70%" />
          <View style={{ height: 8 }} />
          <Skeleton height={14} width="50%" />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <SectionHeader title="Transactions" subtitle="Track income, expenses, and transfers." />
      <Button label="Add transaction" onPress={() => router.push('/transactions/new')} />
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/transactions/${item.id}`)} style={{ marginBottom: 12 }}>
              <TransactionRow
                title={item.description || 'Transaction'}
                subtitle={item.type}
                amount={item.amount}
                type={item.type}
              />
            </Pressable>
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      ) : (
        <EmptyState title="No transactions" subtitle="Add your first transaction." />
      )}
    </Screen>
  );
}
